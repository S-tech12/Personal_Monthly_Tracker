import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { Table } from '../components/common/Table';
import type { Column } from '../components/common/Table';
import { Skeleton } from '../components/common/Skeleton';
import { Loader } from '../components/common/Loader';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { HeroSection } from '../components/dashboard/HeroSection';
import { VoiceInputModal } from '../components/dashboard/VoiceInputModal';
import { ConfirmTransactionModal } from '../components/dashboard/ConfirmTransactionModal';
import type { ExtractedTransaction } from '../components/dashboard/ConfirmTransactionModal';
import { Section } from '../components/layout/Section';
import { BackToTop } from '../components/layout/BackToTop';
import { MAIN_NAV_ITEMS } from '../constants/navigation';
import { ROUTES } from '../constants/routes';
import { useDashboard } from '../hooks/useDashboard';
import { useExpenseSummary } from '../hooks/useExpenseSummary';
import { useAuth } from '../hooks/useAuth';
import { useCategoryBreakdown } from '../hooks/useCategoryBreakdown';
import { useRecentExpenses } from '../hooks/useRecentExpenses';
import { useBudgetSummary } from '../hooks/useBudgetSummary';
import { useFamily } from '../hooks/useFamily';
import { expenseService } from '../services/expenseService';
import { getCurrencyIcon, formatAmountWithCurrency } from '../utils/formatCurrency';
import { getCategoryColor } from '../constants/categoryColors';
import type { Expense } from '../types/expense.types';
import toast from 'react-hot-toast';
import '../styles/pages/DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const {
    data,
    isLoading: isDashboardLoading,
    handleSendReport
  } = useDashboard();

  const { breakdown, isLoading: isBreakdownLoading, refetch: refetchBreakdown } = useCategoryBreakdown();
  const { expenses, isLoading: isExpensesLoading, refetch: refetchRecent } = useRecentExpenses();
  const { summary, isLoading: isSummaryLoading, refetch: refetchSummary } = useExpenseSummary();
  const { overallBudgets, isLoading: isBudgetLoading, refetch: refetchBudget } = useBudgetSummary();
  const { user } = useAuth();
  const { overview, isLoading: isConnectionsLoading } = useFamily();
  const hasFamily = overview?.hasFamily || false;

  // Voice Modals State
  const [isVoiceInputModalOpen, setIsVoiceInputModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedTransaction | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshAllData = () => {
    refetchRecent();
    if (refetchSummary) refetchSummary();
    if (refetchBudget) refetchBudget();
    if (refetchBreakdown) refetchBreakdown();
  };

  const handleOpenVoiceInput = (initialPrompt: string = '') => {
    if (initialPrompt) {
      setCurrentTranscript(initialPrompt);
    }
    setParseError(null);
    setIsVoiceInputModalOpen(true);
  };

  const handleDoneVoiceInput = async (transcriptText: string) => {
    setCurrentTranscript(transcriptText);
    setIsParsing(true);
    setParseError(null);

    try {
      const response = await expenseService.parseFromVoice({ transcript: transcriptText });
      const parsedTransactions = [
        ...(response.data?.expenses || []).map(expense => ({ ...expense, type: 'Debit' as const })),
        ...(response.data?.incomes || []).map(income => ({ ...income, type: 'Credit' as const }))
      ];
      if (parsedTransactions.length === 0) {
        throw new Error('Could not extract transaction details from this text.');
      }

      const transactions = parsedTransactions;
      setExtractedTransactions(transactions);
      setExtractedData(transactions[0]);

      // Smoothly transition from Modal 1 to Modal 2
      setIsVoiceInputModalOpen(false);
      setIsConfirmModalOpen(true);
    } catch (err: any) {
      setParseError(err.message || "Couldn't understand that expense. Please try again or edit the text.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveTransaction = async (finalData: ExtractedTransaction | ExtractedTransaction[]) => {
    setIsSaving(true);
    try {
      await expenseService.createBulk(Array.isArray(finalData) ? finalData : [finalData]);

      toast.success('Transaction saved successfully!');
      refreshAllData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save transaction';
      toast.error(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToInput = () => {
    setIsConfirmModalOpen(false);
    setIsVoiceInputModalOpen(true);
  };

  if (isDashboardLoading || isSummaryLoading || isConnectionsLoading || !data) {
    return (
      <div className="dashboard-page">
        <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />
        <Loader text="Loading your financial dashboard..." />
        <BottomNav navItems={MAIN_NAV_ITEMS} />
      </div>
    );
  }

  const expensesColumns: Column<Expense>[] = [
    {
      key: 'category',
      header: 'Category & Details',
      render: (expense) => {
        const iconMap: Record<string, string> = {
          'Food': 'restaurant',
          'Transport': 'commute',
          'Shopping': 'shopping_bag',
          'Entertainment': 'movie',
          'Bills': 'receipt_long',
          'Health': 'medical_services',
          'Rent': 'home'
        };
        const icon = iconMap[expense.category] || 'payments';
        const categoryColor = getCategoryColor(expense.category);
        
        const avatarName = expense.addedBy 
          ? (expense.addedBy.id === user?.id ? 'You' : expense.addedBy.name) 
          : undefined;
        
        return (
          <div className="category-cell">
            <div 
              className="category-icon-circle"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              <span className="material-symbols-outlined category-icon">
                {icon}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span className="category-name">{expense.title || expense.category}</span>
              {avatarName && (
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontSize: '11px', color: 'var(--color-on-surface-variant)' }}
                  title={avatarName === 'You' ? 'Added by You' : `Added by ${avatarName}`}
                >
                  {expense.addedBy?.profilePictureUrl ? (
                    <img src={expense.addedBy.profilePictureUrl} alt={avatarName} style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold' }}>
                      {avatarName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{avatarName}</span>
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (expense) => (
        <span className="amount-cell">
          {formatAmountWithCurrency(expense.amount, expense.currency)}
        </span>
      )
    },
    { 
      key: 'date', 
      header: 'Date',
      render: (expense) => expense.expenseDateTime ? new Date(expense.expenseDateTime).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'time', 
      header: 'Time',
      render: (expense) => expense.expenseDateTime ? new Date(expense.expenseDateTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : 'N/A'
    },
    { 
      key: 'currency', 
      header: 'Currency',
      render: (expense) => (
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          padding: '2px 8px', 
          borderRadius: '6px', 
          backgroundColor: 'var(--color-surface-container)',
          color: 'var(--color-on-surface-variant)' 
        }}>
          {expense.currency}
        </span>
      )
    }
  ];

  return (
    <div className="dashboard-page">
      <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />

      {/* SECTION 1: HERO (Gradient background, big headline, CTAs, interactive visual wave card) */}
      <Section variant="gradient" noPadding className="hero-section-container">
        <HeroSection
          onOpenVoiceModal={() => handleOpenVoiceInput()}
          onSendReport={handleSendReport}
          onQuickPrompt={handleOpenVoiceInput}
        />
      </Section>

      {/* SECTION 2: FINANCIAL OVERVIEW (Plain background, open stat metrics) */}
      <Section variant="plain" withDivider className="financial-overview-section">
        <div className="section-heading-wrapper">
          <div>
            <h2 className="section-display-title">Financial Pulse</h2>
            <p className="section-display-subtitle">Real-time daily and monthly expenditures across your accounts.</p>
          </div>
          {hasFamily && (
            <div className="family-status-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>group</span>
              <span>Family Sync Active</span>
            </div>
          )}
        </div>

        <div className="metrics-open-grid">
          <SummaryCard 
            title="Today's Spending" 
            totals={summary?.today || []} 
            defaultCurrency={user?.defaultCurrency || 'USD'} 
            subtitle={hasFamily ? "Combined family spend" : undefined}
            icon="today"
          />
          <SummaryCard 
            title="This Month" 
            totals={summary?.thisMonth || []} 
            defaultCurrency={user?.defaultCurrency || 'USD'} 
            subtitle={hasFamily ? "Combined family spend" : undefined}
            icon="calendar_month"
          />

          {/* Budget Limit Buffer (Open Metric presentation) */}
          <div className="summary-metric-block">
            <div className="metric-header-row">
              <div className="metric-title-group">
                <span className="material-symbols-outlined metric-icon">account_balance_wallet</span>
                <span className="metric-title">Budget Remaining</span>
              </div>
              {hasFamily && <span className="metric-subtitle-badge">Family limit</span>}
            </div>

            {isBudgetLoading ? (
              <div style={{ padding: '0.75rem 0' }}><Skeleton /></div>
            ) : overallBudgets.length === 0 ? (
              <div className="metric-empty-notice">
                <span>No spending limit set yet.</span>
                <Link to={ROUTES.BUDGETS} className="metric-action-link">Set a limit</Link>
              </div>
            ) : (
              overallBudgets.map((b) => (
                <div key={b.currency} className="budget-metric-entry">
                  <div className="metric-budget-top">
                    <span className="metric-currency-tag">{b.currency}</span>
                    {b.limit !== null && (
                      <span className="metric-budget-limit">
                        Limit: {formatAmountWithCurrency(b.limit, b.currency)}
                      </span>
                    )}
                  </div>

                  <div className="summary-value-wrapper">
                    {b.limit === null ? (
                      <span className="summary-amount-secondary" style={{ fontSize: '1.125rem' }}>
                        No limit set. <Link to={ROUTES.BUDGETS} className="metric-action-link">Configure</Link>
                      </span>
                    ) : b.remaining !== null && b.remaining >= 0 ? (
                      <span className="summary-amount" style={{ color: 'var(--color-secondary)' }}>
                        {formatAmountWithCurrency(b.remaining, b.currency)} <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>left</span>
                      </span>
                    ) : (
                      <span className="summary-amount" style={{ color: 'var(--color-error)' }}>
                        Over by {formatAmountWithCurrency(Math.abs(b.remaining || 0), b.currency)}
                      </span>
                    )}
                  </div>

                  {b.limit !== null && (
                    <div className="budget-bar-container">
                      <div 
                        className="budget-bar-fill" 
                        style={{ 
                          width: `${Math.min((b.currentSpent / b.limit) * 100, 100)}%`,
                          backgroundColor: b.isOverallOverLimit ? 'var(--color-error)' : 'var(--color-secondary)'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* SECTION 3: SPEND INTELLIGENCE & BUDGET HEALTH (Soft tint background, 2-column split) */}
      <Section variant="tint" withDivider className="analytics-section">
        <div className="section-heading-wrapper">
          <div>
            <h2 className="section-display-title">Spend Intelligence & Limits</h2>
            <p className="section-display-subtitle">Explore where your money goes and prevent budget overruns.</p>
          </div>
          <Link to={ROUTES.BUDGETS} className="section-inline-link">
            <span>Manage All Budgets</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        <div className="intelligence-split-grid">
          {/* Left: Category Breakdown Donut Chart */}
          <div className="intelligence-panel donut-panel">
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>pie_chart</span>
                <h3 className="panel-title">Category Distribution</h3>
              </div>
              {hasFamily && <span className="panel-pill">Shared with family</span>}
            </div>

            {isBreakdownLoading ? (
              <div style={{ padding: '3rem 1rem' }}><Skeleton /></div>
            ) : breakdown.length === 0 ? (
              <div className="panel-empty-state">
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)' }}>
                  donut_large
                </span>
                <p>No expenses recorded yet this month.</p>
                <button type="button" onClick={() => handleOpenVoiceInput()} className="panel-empty-action">
                  Record your first expense
                </button>
              </div>
            ) : (
              (() => {
                const breakdownByCurrency = breakdown.reduce((acc, item) => {
                  if (!acc[item.currency]) acc[item.currency] = [];
                  acc[item.currency].push(item);
                  return acc;
                }, {} as Record<string, typeof breakdown>);

                return Object.entries(breakdownByCurrency).map(([currency, items]) => {
                  const total = items.reduce((sum, it) => sum + it.total, 0);
                  let cumulativePercent = 0;

                  return (
                    <div key={currency} className="donut-currency-group">
                      {Object.keys(breakdownByCurrency).length > 1 && (
                        <h4 className="donut-currency-title">{currency} Portfolio</h4>
                      )}
                      
                      <div className="donut-interactive-row">
                        <div className="chart-donut-container">
                          <svg className="chart-donut-svg" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="68" fill="transparent" stroke="var(--color-surface-container)" strokeWidth="14" />
                            {items.map((item, idx) => {
                              const percent = item.total / total;
                              const segment = percent * 427;
                              const offset = 427 - segment;
                              const rotation = cumulativePercent * 360;
                              cumulativePercent += percent;
                              const strokeColor = getCategoryColor(item.category);

                              return (
                                <circle 
                                  key={idx} 
                                  cx="80" 
                                  cy="80" 
                                  r="68" 
                                  fill="transparent" 
                                  stroke={strokeColor} 
                                  strokeWidth="14" 
                                  strokeDasharray={427} 
                                  strokeDashoffset={offset} 
                                  style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
                                />
                              );
                            })}
                          </svg>
                          <div className="chart-donut-center">
                            <span className="chart-donut-total">
                              {getCurrencyIcon(currency)}{(total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total.toFixed(2))}
                            </span>
                            <span className="chart-donut-label">Total Spent</span>
                          </div>
                        </div>

                        <div className="chart-donut-legend">
                          {items.map((cat, idx) => {
                            const percentage = Math.round((cat.total / total) * 100);
                            const categoryColor = getCategoryColor(cat.category);
                            return (
                              <div key={idx} className="legend-item">
                                <div className="legend-label-wrapper">
                                  <span className="legend-dot" style={{ backgroundColor: categoryColor }}></span>
                                  <span className="legend-label">{cat.category}</span>
                                </div>
                                <span className="legend-value">
                                  {formatAmountWithCurrency(cat.total, currency)} 
                                  <span className="legend-percentage-pill">{percentage}%</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>

          {/* Right: Quick Budget Status & Threshold Tracker */}
          <div className="intelligence-panel budget-track-panel">
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>security</span>
                <h3 className="panel-title">Active Thresholds</h3>
              </div>
              <Link to={ROUTES.BUDGETS} className="panel-pill action-pill">
                + Set Budget
              </Link>
            </div>

            <div className="budget-track-body">
              {overallBudgets.length === 0 ? (
                <div className="panel-empty-state">
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)' }}>
                    notifications_paused
                  </span>
                  <p>Set a monthly budget to receive intelligent real-time alerts before you overspend.</p>
                  <Link to={ROUTES.BUDGETS} className="panel-empty-action">
                    Configure budget limit
                  </Link>
                </div>
              ) : (
                overallBudgets.map((b) => {
                  const percentage = b.limit ? Math.min((b.currentSpent / b.limit) * 100, 100) : 0;
                  const isOver = b.isOverallOverLimit;

                  return (
                    <div key={b.currency} className="budget-threshold-card">
                      <div className="threshold-card-top">
                        <div className="threshold-meta">
                          <span className="threshold-currency">{b.currency} Monthly Target</span>
                          <span className={`threshold-badge ${isOver ? 'over' : percentage >= 80 ? 'warn' : 'ok'}`}>
                            {isOver ? 'Over Limit' : percentage >= 80 ? 'Near Threshold' : 'On Track'}
                          </span>
                        </div>
                        <div className="threshold-numbers">
                          <span className="threshold-spent">
                            {formatAmountWithCurrency(b.currentSpent, b.currency)}
                          </span>
                          <span className="threshold-total">
                            / {b.limit ? formatAmountWithCurrency(b.limit, b.currency) : 'No Cap'}
                          </span>
                        </div>
                      </div>

                      {b.limit !== null && (
                        <div className="threshold-bar-wrapper">
                          <div className="threshold-bar-track">
                            <div 
                              className="threshold-bar-fill"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: isOver ? 'var(--color-error)' : percentage >= 80 ? 'var(--color-warning)' : 'var(--color-secondary)'
                              }}
                            />
                          </div>
                          <span className="threshold-percent-label">{percentage.toFixed(0)}% used</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Helpful financial tips card */}
              <div className="financial-tip-card">
                <span className="material-symbols-outlined tip-icon">lightbulb</span>
                <div className="tip-content">
                  <p className="tip-title">Smart Voice Tip</p>
                  <p className="tip-text">
                    Say "Show my spending report for last week" or specify amounts in different currencies anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4: RECENT TRANSACTIONS (Plain background, responsive table + mobile cards) */}
      <Section variant="plain" withDivider className="transactions-section">
        <div className="section-heading-wrapper">
          <div>
            <h2 className="section-display-title">Recent Transactions</h2>
            <p className="section-display-subtitle">Latest expenses logged into your cloud ledger.</p>
          </div>
          <Link to={ROUTES.HISTORY} className="section-inline-link">
            <span>View Complete History</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        {isExpensesLoading ? (
          <div style={{ padding: '2rem 0' }}><Skeleton /></div>
        ) : expenses.length === 0 ? (
          <div className="transactions-empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-outline)' }}>
              receipt_long
            </span>
            <p className="empty-title">No transactions recorded yet</p>
            <p className="empty-subtitle">Use your voice or the quick prompts to log your first expenditure.</p>
            <button type="button" onClick={() => handleOpenVoiceInput()} className="panel-empty-action">
              Log an Expense Now
            </button>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table (>= 640px) */}
            <div className="desktop-table-container">
              <Table 
                data={expenses} 
                columns={expensesColumns}
                keyExtractor={(item) => item._id}
              />
            </div>

            {/* Mobile Cards Stack (< 640px) to prevent awkward table overflow */}
            <div className="mobile-expenses-stack">
              {expenses.map((expense) => {
                const iconMap: Record<string, string> = {
                  'Food': 'restaurant',
                  'Transport': 'commute',
                  'Shopping': 'shopping_bag',
                  'Entertainment': 'movie',
                  'Bills': 'receipt_long',
                  'Health': 'medical_services',
                  'Rent': 'home'
                };
                const icon = iconMap[expense.category] || 'payments';
                const categoryColor = getCategoryColor(expense.category);
                const avatarName = expense.addedBy 
                  ? (expense.addedBy.id === user?.id ? 'You' : expense.addedBy.name) 
                  : undefined;
                
                return (
                  <div key={expense._id} className="mobile-expense-card">
                    <div className="mobile-card-top">
                      <div className="mobile-cat-group">
                        <div 
                          className="category-icon-circle mobile-cat-circle"
                          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                        >
                          <span className="material-symbols-outlined category-icon">
                            {icon}
                          </span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="mobile-expense-title">{expense.title || expense.category}</p>
                          <span className="mobile-expense-cat">{expense.category}</span>
                        </div>
                      </div>
                      <span className="mobile-expense-amount">
                        {formatAmountWithCurrency(expense.amount, expense.currency)}
                      </span>
                    </div>

                    <div className="mobile-card-bottom">
                      <div className="mobile-time-info">
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>schedule</span>
                        <span>
                          {expense.expenseDateTime ? new Date(expense.expenseDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'} • {expense.expenseDateTime ? new Date(expense.expenseDateTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : ''}
                        </span>
                      </div>

                      {avatarName && (
                        <div className="mobile-user-tag">
                          <span>{avatarName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Section>

      {/* SECTION 5: AUTOMATED REPORT CTA BANNER (Accent gradient band) */}
      <Section variant="accent" withDivider className="report-cta-section">
        <div className="report-banner-grid">
          <div className="report-banner-content">
            <div className="report-banner-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>forward_to_inbox</span>
            </div>
            <div>
              <h3 className="report-banner-title">Need a monthly spend summary?</h3>
              <p className="report-banner-desc">
                We will compile all your logged transactions, currency breakdowns, and category insights into a clean PDF/email report sent directly to your inbox.
              </p>
            </div>
          </div>
          <div className="report-banner-action">
            <button 
              type="button" 
              className="report-banner-btn" 
              onClick={handleSendReport}
            >
              <span className="material-symbols-outlined">send</span>
              <span>Email Current Monthly Report</span>
            </button>
          </div>
        </div>
      </Section>

      {/* Back To Top Floating Action */}
      <BackToTop />

      {/* Bottom Nav for mobile tab switching */}
      <BottomNav navItems={MAIN_NAV_ITEMS} />

      {/* Voice Modals Flow (Modal 1: Voice Input -> Modal 2: Confirm Transaction) */}
      <VoiceInputModal
        isOpen={isVoiceInputModalOpen}
        onClose={() => {
          setCurrentTranscript('');
          setIsVoiceInputModalOpen(false);
        }}
        onDone={handleDoneVoiceInput}
        isLoading={isParsing}
        errorMessage={parseError}
        onRetry={() => handleDoneVoiceInput(currentTranscript)}
        initialText={currentTranscript}
      />

      <ConfirmTransactionModal
        isOpen={isConfirmModalOpen}
        transaction={extractedData}
        transactions={extractedTransactions}
        onClose={() => setIsConfirmModalOpen(false)}
        onBack={handleBackToInput}
        onSave={handleSaveTransaction}
        isSaving={isSaving}
      />
    </div>
  );
};

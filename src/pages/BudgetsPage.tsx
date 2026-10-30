import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Select } from '../components/common/Select';
import { Section } from '../components/layout/Section';
import { BackToTop } from '../components/layout/BackToTop';
import { MAIN_NAV_ITEMS } from '../constants/navigation';
import { Loader } from '../components/common/Loader';
import { formatAmountWithCurrency } from '../utils/formatCurrency';
import '../styles/pages/BudgetsPage.css';

const CATEGORY_OPTIONS = [
  { label: 'Select a category...', value: '' },
  { label: 'Food', value: 'Food' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Rent', value: 'Rent' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Bills', value: 'Bills' },
  { label: 'Health', value: 'Health' },
  { label: 'Other', value: 'Other' },
];

export const BudgetsPage: React.FC = () => {
  const {
    overallBudgets,
    categoryBudgets,
    isLoading,
    isSaving,
    defaultCurrency,
    handleSetOverallLimit,
    handleUpsertCategoryBudget
  } = useBudget();
  const { user } = useAuth();
  const canEdit = user?.isHeadOfFamily ?? true;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryLimit, setCategoryLimit] = useState('');

  const [isOverallModalOpen, setIsOverallModalOpen] = useState(false);
  const [overallCurrency, setOverallCurrency] = useState('');
  const [overallLimit, setOverallLimit] = useState('');

  const overBudgetCount = categoryBudgets.filter(b => b.isOverLimit).length;

  const openCategoryModal = (budget?: any) => {
    if (budget) {
      setEditingCategory(budget.category);
      setCategoryName(budget.category);
      setCategoryLimit(budget.monthlyLimit.toString());
    } else {
      setEditingCategory('');
      setCategoryName('');
      setCategoryLimit('');
    }
    setIsCategoryModalOpen(true);
  };

  const openOverallModal = (currency: string, limit: number | null) => {
    setOverallCurrency(currency);
    setOverallLimit(limit ? limit.toString() : '');
    setIsOverallModalOpen(true);
  };

  const onSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !categoryLimit) return;
    try {
      const currencyToSave = editingCategory && categoryBudgets.find(b => b.category === editingCategory)?.currency 
        ? categoryBudgets.find(b => b.category === editingCategory)!.currency 
        : defaultCurrency;
        
      await handleUpsertCategoryBudget(categoryName, parseFloat(categoryLimit), currencyToSave);
      setIsCategoryModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  const onSaveOverall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overallLimit) return;
    try {
      await handleSetOverallLimit(overallCurrency, parseFloat(overallLimit));
      setIsOverallModalOpen(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="budgets-page">
        <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />
        <Loader text="Loading budget intelligence..." />
        <BottomNav navItems={MAIN_NAV_ITEMS} />
      </div>
    );
  }

  return (
    <div className="budgets-page">
      <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />

      {/* SECTION 1: HERO (Gradient background, big headline, alerts, status pills) */}
      <Section variant="gradient" className="budgets-hero-section">
        <div className="budgets-hero-header">
          <div>
            <div className="budgets-hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
              <span>Threshold Protection</span>
            </div>
            <h1 className="budgets-page-title">Spending Limits & Budgets</h1>
            <p className="budgets-page-subhead">
              Establish monthly ceilings for your entire household or drill down by expense category.
            </p>
          </div>

          {canEdit && (
            <button 
              type="button" 
              className="add-budget-btn primary-add-btn" 
              onClick={() => openCategoryModal()}
            >
              <span className="material-symbols-outlined">add</span>
              <span>New Category Budget</span>
            </button>
          )}
        </div>

        {/* Status Alerts */}
        {overBudgetCount > 0 && (
          <div className="mt-4">
            <Alert type="error" message={`${overBudgetCount} ${overBudgetCount === 1 ? 'Category has' : 'Categories have'} exceeded designated spending limits.`} />
          </div>
        )}

        {!canEdit && (
          <div className="mt-4">
            <Alert type="info" message="Only the head of your family group can modify active spending caps." />
          </div>
        )}
      </Section>

      {/* SECTION 2: OVERALL LIMITS (Plain background, fluid grid) */}
      <Section variant="plain" withDivider className="overall-limits-section">
        <div className="section-heading-wrapper">
          <div>
            <h2 className="section-display-title">Overall Monthly Limits</h2>
            <p className="section-display-subtitle">Macro-level expenditure ceiling across all synced transactions.</p>
          </div>
        </div>

        <div className="budget-cards-grid">
          {overallBudgets.map((ob) => {
            const percentage = ob.limit ? Math.min((ob.currentSpent / ob.limit) * 100, 100) : 0;
            let progressVariant: 'primary' | 'secondary' | 'error' | 'tertiary' = 'primary';
            if (ob.limit) {
              if (ob.isOverallOverLimit) progressVariant = 'error';
              else if (percentage >= 80) progressVariant = 'tertiary';
            }

            return (
              <div 
                key={ob.currency} 
                className={`budget-item-card ${ob.isOverallOverLimit ? 'is-over' : ''}`}
              >
                <div className="budget-card-header-row">
                  <div className="budget-card-meta">
                    <span className="budget-currency-pill">{ob.currency}</span>
                    <h3 className="budget-card-name">Overall Cap</h3>
                  </div>

                  {canEdit && (
                    <button 
                      type="button" 
                      className="budget-edit-btn" 
                      onClick={() => openOverallModal(ob.currency, ob.limit)}
                      title={`Edit limit for ${ob.currency}`}
                      aria-label={`Edit limit for ${ob.currency}`}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  )}
                </div>

                <div className="budget-card-metrics">
                  <div>
                    <span className="budget-stat-label">Current Spent</span>
                    <p className={`budget-spent-num ${ob.isOverallOverLimit ? 'text-error' : ''}`}>
                      {formatAmountWithCurrency(ob.currentSpent, ob.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="budget-stat-label">Monthly Target</span>
                    <p className="budget-limit-num">
                      {ob.limit ? formatAmountWithCurrency(ob.limit, ob.currency) : 'Not configured'}
                    </p>
                  </div>
                </div>

                {ob.limit !== null ? (
                  <div className="budget-progress-block">
                    <ProgressBar percentage={percentage} variant={progressVariant} />
                    <div className="budget-progress-labels">
                      <span className={ob.isOverallOverLimit ? 'text-error font-bold' : ''}>
                        {percentage.toFixed(0)}% utilized
                      </span>
                      <span>
                        {ob.remaining !== null && ob.remaining >= 0
                          ? `${formatAmountWithCurrency(ob.remaining, ob.currency)} remaining`
                          : `Over by ${formatAmountWithCurrency(Math.abs(ob.remaining || 0), ob.currency)}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  canEdit && (
                    <button 
                      type="button" 
                      className="budget-set-action-btn" 
                      onClick={() => openOverallModal(ob.currency, null)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                      <span>Configure Spending Limit</span>
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* SECTION 3: CATEGORY BUDGETS (Tint background, fluid grid) */}
      <Section variant="tint" withDivider className="category-limits-section">
        <div className="section-heading-wrapper">
          <div>
            <h2 className="section-display-title">Category Limits</h2>
            <p className="section-display-subtitle">Fine-grained category tracking for food, transit, bills, and entertainment.</p>
          </div>
          {canEdit && (
            <button 
              type="button" 
              className="add-budget-btn" 
              onClick={() => openCategoryModal()}
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Category</span>
            </button>
          )}
        </div>

        {categoryBudgets.length === 0 ? (
          <div className="budget-empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-outline)' }}>
              category
            </span>
            <p className="empty-title">No category budgets created</p>
            <p className="empty-subtitle">Set monthly allocations to get notified when dining out, shopping, or groceries get too high.</p>
            {canEdit && (
              <button type="button" className="add-budget-btn primary-add-btn" onClick={() => openCategoryModal()}>
                <span className="material-symbols-outlined">add</span>
                <span>Create First Category Limit</span>
              </button>
            )}
          </div>
        ) : (
          <div className="budget-cards-grid">
            {categoryBudgets.map((cb) => {
              const percentage = Math.min((cb.currentSpent / cb.monthlyLimit) * 100, 100);
              let badgeLabel = 'On Track';
              let progressVariant: 'primary' | 'secondary' | 'error' | 'tertiary' = 'primary';
              
              if (cb.isOverLimit) {
                badgeLabel = 'Over Limit';
                progressVariant = 'error';
              } else if (percentage >= 80) {
                badgeLabel = 'Near Threshold';
                progressVariant = 'tertiary';
              }

              return (
                <div 
                  key={`${cb.category}-${cb.currency}`} 
                  className={`budget-item-card ${cb.isOverLimit ? 'is-over' : ''}`}
                >
                  <div className="budget-card-header-row">
                    <div>
                      <h3 className="budget-card-name">{cb.category}</h3>
                      <Badge 
                        status={cb.isOverLimit ? 'over-budget' : (percentage >= 80 ? 'warning' : 'early-days')} 
                        label={badgeLabel} 
                        className="mt-1" 
                      />
                    </div>

                    {canEdit && (
                      <button 
                        type="button" 
                        className="budget-edit-btn" 
                        onClick={() => openCategoryModal(cb)}
                        title={`Edit budget for ${cb.category}`}
                        aria-label={`Edit budget for ${cb.category}`}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                  </div>

                  <div className="budget-card-metrics">
                    <div>
                      <span className="budget-stat-label">Spent</span>
                      <p className={`budget-spent-num ${cb.isOverLimit ? 'text-error' : ''}`}>
                        {formatAmountWithCurrency(cb.currentSpent, cb.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="budget-stat-label">Limit ({cb.currency})</span>
                      <p className="budget-limit-num">
                        {formatAmountWithCurrency(cb.monthlyLimit, cb.currency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="budget-progress-block">
                    <ProgressBar percentage={percentage} variant={progressVariant} />
                    <div className="budget-progress-labels">
                      <span className={cb.isOverLimit ? 'text-error font-bold' : ''}>
                        {percentage.toFixed(0)}% consumed
                      </span>
                      <span>
                        {formatAmountWithCurrency(Math.max(0, cb.monthlyLimit - cb.currentSpent), cb.currency)} left
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <BackToTop />
      <BottomNav navItems={MAIN_NAV_ITEMS} />

      {/* Floating Action Button (Mobile only) */}
      {canEdit && (
        <button 
          type="button" 
          className="fab-mobile" 
          onClick={() => openCategoryModal()}
          aria-label="Add new category budget"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      )}

      {/* Category Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={editingCategory ? "Edit Category Budget" : "Add Category Budget"}>
        <form className="modal-form" onSubmit={onSaveCategory}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <Select 
              options={CATEGORY_OPTIONS}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={!!editingCategory}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Monthly Limit ({editingCategory && categoryBudgets.find(b => b.category === editingCategory)?.currency ? categoryBudgets.find(b => b.category === editingCategory)!.currency : defaultCurrency})
            </label>
            <input 
              type="number" 
              step="any"
              className="form-input" 
              placeholder="0.00"
              value={categoryLimit}
              onChange={(e) => setCategoryLimit(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)} disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Budget'}</button>
          </div>
        </form>
      </Modal>

      {/* Overall Modal */}
      <Modal isOpen={isOverallModalOpen} onClose={() => setIsOverallModalOpen(false)} title={`Set Overall Limit (${overallCurrency})`}>
        <form className="modal-form" onSubmit={onSaveOverall}>
          <div className="form-group">
            <label className="form-label">Overall Monthly Ceiling ({overallCurrency})</label>
            <input 
              type="number" 
              step="any"
              className="form-input" 
              placeholder="0.00"
              value={overallLimit}
              onChange={(e) => setOverallLimit(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsOverallModalOpen(false)} disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Limit'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

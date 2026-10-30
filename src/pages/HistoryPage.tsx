import React, { useState } from 'react';
import { useExpenseHistory } from '../hooks/useExpenseHistory';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { SegmentedControl } from '../components/common/SegmentedControl';
import { ListItem } from '../components/common/ListItem';
import { Skeleton } from '../components/common/Skeleton';
import { Section } from '../components/layout/Section';
import { BackToTop } from '../components/layout/BackToTop';
import { MAIN_NAV_ITEMS } from '../constants/navigation';
import { useAuth } from '../hooks/useAuth';
import { VoiceCommandButton } from '../components/dashboard/VoiceCommandButton';
import { VoiceInputModal } from '../components/dashboard/VoiceInputModal';
import { ConfirmTransactionModal } from '../components/dashboard/ConfirmTransactionModal';
import type { ExtractedTransaction } from '../components/dashboard/ConfirmTransactionModal';
import { expenseService } from '../services/expenseService';
import { getCurrencyIcon } from '../utils/formatCurrency';
import { getCategoryColor } from '../constants/categoryColors';
import toast from 'react-hot-toast';
import '../styles/pages/HistoryPage.css';

export const HistoryPage: React.FC = () => {
  const {
    selectedDate,
    expenses,
    isLoading,
    error,
    handleDateChange,
    refetch
  } = useExpenseHistory();
  const { user } = useAuth();

  // Voice Modals State
  const [isVoiceInputModalOpen, setIsVoiceInputModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedTransaction | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

      // Transition smoothly from Modal 1 to Modal 2
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
      refetch();
      window.dispatchEvent(new Event('voicespend:refresh'));
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return 'restaurant';
      case 'transport': return 'directions_car';
      case 'rent': return 'home';
      case 'shopping': return 'shopping_bag';
      case 'entertainment': return 'movie';
      case 'bills': return 'receipt_long';
      case 'health': return 'medical_services';
      default: return 'attach_money';
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (error) {
    toast.error(error);
  }

  if (isLoading) {
    return (
      <div className="history-page">
        <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />
        <Section variant="plain">
          <Skeleton />
        </Section>
        <BottomNav navItems={MAIN_NAV_ITEMS} />
      </div>
    );
  }

  return (
    <div className="history-page">
      <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />

      {/* Hero Section */}
      <Section variant="gradient" className="history-hero-section">
        <div className="history-hero-grid">
          <div>
            <div className="history-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>history</span>
              <span>Transaction Ledger</span>
            </div>
            <h1 className="history-page-title">Expense History</h1>
            <p className="history-page-subhead">
              Browse, filter, and audit past expenditures recorded via voice commands or manual input.
            </p>
          </div>

          <div className="history-hero-mic">
            <VoiceCommandButton
              variant="compact"
              onClick={() => handleOpenVoiceInput()}
              label="Voice Command"
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
              Speak or type to log
            </span>
          </div>
        </div>
      </Section>

      {/* Filter and Timeline Section */}
      <Section variant="plain" withDivider className="history-content-section">
        <div className="history-controls-row">
          <div className="date-picker-wrapper">
            <span className="material-symbols-outlined date-picker-icon">calendar_today</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="date-picker-input"
              aria-label="Filter by date"
            />
          </div>

          <SegmentedControl
            options={['Daily', 'Monthly']}
            value={'Daily'}
            onChange={() => {}}
          />
        </div>

        {/* Expenses List */}
        <div className="history-list-wrapper">
          {expenses.length > 0 ? (
            <div className="history-day-card">
              <div className="daily-group-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined text-primary">event</span>
                  <h2 className="daily-group-title">
                    {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                </div>
                <span className="daily-group-total">
                  Total Spent: {getCurrencyIcon(user?.defaultCurrency || 'USD')}{totalAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="daily-group-list">
                {expenses.map((expense) => {
                  const dateObj = new Date(expense.expenseDateTime);
                  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  const avatarName = expense.addedBy 
                    ? (expense.addedBy.id === user?.id ? 'You' : expense.addedBy.name) 
                    : undefined;
                    
                  return (
                    <ListItem
                      key={expense._id}
                      icon={getCategoryIcon(expense.category)}
                      iconColor={getCategoryColor(expense.category)}
                      title={expense.title || expense.category}
                      subtitle={`${expense.category} • ${timeString}`}
                      avatarUrl={expense.addedBy?.profilePictureUrl}
                      avatarName={avatarName}
                      trailing={
                        <span style={{ fontWeight: '800', fontFamily: 'var(--font-family-display)', fontSize: '15px', color: 'var(--color-on-surface)' }}>
                          {getCurrencyIcon(expense.currency)}{expense.amount.toFixed(2)}
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="history-empty">
              <span className="material-symbols-outlined history-empty-icon">calendar_today</span>
              <p className="history-empty-text">No spending recorded on this day</p>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-muted)', margin: 0 }}>
                Select a different date or tap the button below to add an entry.
              </p>
              <button
                type="button"
                className="panel-empty-action"
                onClick={() => handleOpenVoiceInput()}
                style={{ marginTop: '0.5rem' }}
              >
                Log an Expense Now
              </button>
            </div>
          )}
        </div>
      </Section>

      <BackToTop />
      <BottomNav navItems={MAIN_NAV_ITEMS} />

      {/* Reusable Voice Modals Flow */}
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

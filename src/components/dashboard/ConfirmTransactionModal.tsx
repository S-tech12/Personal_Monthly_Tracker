import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAmountWithCurrency, getCurrencyIcon } from '../../utils/formatCurrency';
import { getCategoryColor } from '../../constants/categoryColors';
import '../../styles/components/VoiceModals.css';

export interface ExtractedTransaction {
  title: string;
  category: string;
  amount: number;
  currency: string;
  type?: 'Debit' | 'Credit';
  person?: string | null;
  date?: string;
}

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  transaction: ExtractedTransaction | null;
  transactions?: ExtractedTransaction[];
  onClose: () => void;
  onBack: () => void;
  onSave: (finalTransaction: ExtractedTransaction | ExtractedTransaction[]) => Promise<void>;
  isSaving?: boolean;
}

const ALLOWED_CATEGORIES = [
  'Food', 'Transport', 'Rent', 'Shopping',
  'Entertainment', 'Bills', 'Health', 'Other'
];

export const ConfirmTransactionModal: React.FC<ConfirmTransactionModalProps> = ({
  isOpen,
  transaction,
  transactions = [],
  onClose,
  onBack,
  onSave,
  isSaving = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCategory, setEditedCategory] = useState('Food');
  const [editedAmount, setEditedAmount] = useState<string>('');
  const [editedType, setEditedType] = useState<'Debit' | 'Credit'>('Debit');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const isMultiple = transactions.length > 1;
  const [editedTransactions, setEditedTransactions] = useState<ExtractedTransaction[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever transaction changes or modal opens
  useEffect(() => {
    if (transaction) {
      setEditedTitle(transaction.title || 'Expense');
      setEditedCategory(transaction.category || 'Food');
      setEditedAmount(transaction.amount ? String(transaction.amount) : '');
      setEditedType(transaction.type || 'Debit');
      setIsEditing(false);
      setValidationError(null);
      setShowSuccessCheck(false);
    }
    if (transactions.length) {
      setEditedTransactions(transactions);
      setSelectedIndex(0);
    }
  }, [transaction, transactions, isOpen]);

  useEffect(() => {
    const selected = editedTransactions[selectedIndex];
    if (!selected) return;
    setEditedTitle(selected.title || 'Expense');
    setEditedCategory(selected.category || 'Food');
    setEditedAmount(selected.amount ? String(selected.amount) : '');
    setEditedType(selected.type || 'Debit');
  }, [selectedIndex, editedTransactions]);

  // Handle ESC and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving && !showSuccessCheck) {
        onClose();
      }
      if (e.key === 'Tab' && modalContainerRef.current) {
        const focusables = modalContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isSaving, showSuccessCheck, onClose]);

  // Focus title field on entering edit mode
  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  if (!isOpen || !transaction) return null;

  const currentCurrency = transaction.currency || 'USD';

  const handleToggleEdit = () => {
    if (isEditing) {
      // Revert edits
      setEditedTitle(transaction.title || 'Expense');
      setEditedCategory(transaction.category || 'Food');
      setEditedAmount(transaction.amount ? String(transaction.amount) : '');
      setEditedType(transaction.type || 'Debit');
      setValidationError(null);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveClick = async () => {
    const numAmount = parseFloat(editedAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!editedTitle.trim()) {
      setValidationError('Please enter a description for the transaction.');
      return;
    }

    setValidationError(null);
    if (isMultiple && isEditing) {
      setEditedTransactions(current => current.map((item, index) => index === selectedIndex ? {
        title: editedTitle.trim(), category: editedCategory, amount: numAmount, currency: item.currency, type: editedType
      } : item));
      setIsEditing(false);
      return;
    }
    try {
      const finalTransaction = isMultiple ? editedTransactions : {
        title: editedTitle.trim(),
        category: editedCategory,
        amount: numAmount,
        currency: currentCurrency,
        type: editedType
      };
      await onSave(finalTransaction);
      // Trigger short success checkmark before closing
      setShowSuccessCheck(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      // Error handled by parent toast/error state
    }
  };

  return createPortal(
    <AnimatePresence>
      <div
        className="voice-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSaving && !showSuccessCheck) {
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <motion.div
          ref={modalContainerRef}
          className="voice-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Sheet Bar */}
          <div className="voice-modal-drag-bar" />

          {/* Header */}
          <div className="voice-modal-header">
            <div className="voice-modal-title-group">
              <h2 id="confirm-modal-title" className="voice-modal-title">Confirm Transaction</h2>
              <p className="voice-modal-subtitle">Review extracted details or make edits before saving</p>
            </div>
            <button
              type="button"
              className="voice-modal-close-btn"
              onClick={onClose}
              disabled={isSaving || showSuccessCheck}
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="voice-modal-body">
            {showSuccessCheck ? (
              <motion.div
                className="modal-success-state"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="success-check-circle">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Saved Successfully!</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>
                  Your ledger and budgets have been updated.
                </p>
              </motion.div>
            ) : (
              <>
                {validationError && (
                  <div className="voice-modal-notice error" role="alert">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Read-Only View vs Editable Form */}
                {!isEditing ? (
                  isMultiple ? (
                    <div className="confirm-details-card" style={{ overflowX: 'auto' }}>
                      <p style={{ margin: '0 0 10px', color: 'var(--color-on-surface-variant)', fontSize: '0.8rem' }}>Select a row to edit it.</p>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={{ textAlign: 'left' }}>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
                        <tbody>{editedTransactions.map((item, index) => <tr key={`${item.title}-${index}`} onClick={() => setSelectedIndex(index)} style={{ cursor: 'pointer', background: selectedIndex === index ? 'var(--color-surface-container)' : undefined }}>
                          <td style={{ padding: '10px 4px' }}>{item.title}</td><td style={{ textAlign: 'center' }}>{item.category}</td><td style={{ textAlign: 'center', color: item.type === 'Credit' ? 'var(--color-secondary)' : 'var(--color-error)' }}>{item.type || 'Debit'}</td><td style={{ textAlign: 'right' }}>{formatAmountWithCurrency(item.amount, item.currency)}</td>
                        </tr>)}</tbody>
                      </table>
                    </div>
                  ) : (
                  <div className="confirm-details-card">
                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Amount</span>
                      <span className="confirm-detail-value confirm-amount-large">
                        {formatAmountWithCurrency(parseFloat(editedAmount) || transaction.amount, currentCurrency)}
                      </span>
                    </div>

                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Type</span>
                      <span className={`type-badge ${editedType.toLowerCase()}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          {editedType === 'Debit' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                        {editedType}
                      </span>
                    </div>

                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Category</span>
                      <span className="confirm-detail-value">
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: getCategoryColor(editedCategory)
                          }}
                        />
                        {editedCategory}
                      </span>
                    </div>

                    <div className="confirm-detail-row">
                      <span className="confirm-detail-label">Description</span>
                      <span className="confirm-detail-value" style={{ fontWeight: 600 }}>
                        {editedTitle}
                      </span>
                    </div>
                  </div>
                  )
                ) : (
                  <div className="confirm-edit-form">
                    {/* Amount Input */}
                    <div className="form-group-field">
                      <label htmlFor="confirm-edit-amount" className="form-field-label">
                        Amount ({getCurrencyIcon(currentCurrency)}) *
                      </label>
                      <input
                        id="confirm-edit-amount"
                        type="number"
                        step="any"
                        min="0.01"
                        className="form-field-input"
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Credit / Debit Toggle */}
                    <div className="form-group-field">
                      <label className="form-field-label">Transaction Type</label>
                      <div className="type-toggle-switch" role="group" aria-label="Transaction type toggle">
                        <button
                          type="button"
                          className={`type-toggle-btn ${editedType === 'Debit' ? 'active debit' : ''}`}
                          onClick={() => setEditedType('Debit')}
                        >
                          Debit (Expense)
                        </button>
                        <button
                          type="button"
                          className={`type-toggle-btn ${editedType === 'Credit' ? 'active credit' : ''}`}
                          onClick={() => setEditedType('Credit')}
                        >
                          Credit (Income)
                        </button>
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="form-group-field">
                      <label htmlFor="confirm-edit-category" className="form-field-label">
                        Category *
                      </label>
                      <select
                        id="confirm-edit-category"
                        className="form-field-select"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                      >
                        {ALLOWED_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description Text Input */}
                    <div className="form-group-field">
                      <label htmlFor="confirm-edit-title" className="form-field-label">
                        Description *
                      </label>
                      <input
                        id="confirm-edit-title"
                        ref={titleInputRef}
                        type="text"
                        className="form-field-input"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="e.g. Lunch with coworkers"
                        maxLength={100}
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!showSuccessCheck && (
            <div className="voice-modal-footer">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="voice-modal-btn secondary"
                  onClick={onBack}
                  disabled={isSaving}
                  title="Return to voice/text input"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  className="voice-modal-btn secondary"
                  onClick={handleToggleEdit}
                  disabled={isSaving}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {isEditing ? 'close' : 'edit'}
                  </span>
                  <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
                </button>
              </div>

              <button
                type="button"
                className="voice-modal-btn primary"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined spin-icon" style={{ fontSize: '18px' }}>
                      progress_activity
                    </span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                    <span>{isMultiple && isEditing ? 'Done Editing' : 'Save Transaction'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

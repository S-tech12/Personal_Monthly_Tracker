import React from 'react';
import type { CurrencyTotal } from '../../types/expense.types';
import { formatAmountWithCurrency } from '../../utils/formatCurrency';

interface SummaryCardProps {
  title: string;
  totals: CurrencyTotal[];
  defaultCurrency: string;
  subtitle?: string;
  icon?: string;
  variant?: 'card' | 'open';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  totals, 
  defaultCurrency, 
  subtitle,
  icon,
  variant = 'open'
}) => {
  return (
    <div className={`summary-metric-block ${variant === 'card' ? 'card-style' : ''}`}>
      <div className="metric-header-row">
        <div className="metric-title-group">
          {icon && (
            <span className="material-symbols-outlined metric-icon">
              {icon}
            </span>
          )}
          <span className="metric-title">{title}</span>
        </div>
        {subtitle && <span className="metric-subtitle-badge">{subtitle}</span>}
      </div>

      <div className="summary-value-wrapper summary-totals-stacked">
        {totals.length === 0 ? (
          <span className="summary-amount">{formatAmountWithCurrency(0, defaultCurrency)}</span>
        ) : (
          totals.map((item, index) => (
            <div key={item.currency} className="metric-currency-line">
              <span className={index === 0 ? "summary-amount" : "summary-amount-secondary"}>
                {formatAmountWithCurrency(item.total, item.currency)}
              </span>
              {totals.length > 1 && (
                <span className="metric-currency-tag">{item.currency}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

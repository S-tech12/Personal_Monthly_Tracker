import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VoiceCommandButton } from './VoiceCommandButton';
import { ROUTES } from '../../constants/routes';

interface HeroSectionProps {
  onOpenVoiceModal: () => void;
  onSendReport: () => void;
  onQuickPrompt?: (promptText: string) => void;
}

const QUICK_EXAMPLES = [
  { text: 'Spent 200 on lunch', icon: 'restaurant', category: 'Food' },
  { text: 'Paid 50 for fuel', icon: 'directions_car', category: 'Transport' },
  { text: 'Bought groceries for 150', icon: 'shopping_bag', category: 'Shopping' }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVoiceModal,
  onSendReport,
  onQuickPrompt
}) => {
  return (
    <div className="dashboard-hero-wrapper">
      {/* Background ambient light aura */}
      <div className="dashboard-hero-glow" />

      <div className="dashboard-hero-grid">
        {/* Left Column: Headline, Value Proposition & Actions */}
        <div className="dashboard-hero-content">
          <div className="dashboard-hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="hero-badge-text">AI Voice Expense Tracking</span>
          </div>

          <h1 className="dashboard-hero-headline">
            Master your spending with{' '}
            <span className="gradient-text">effortless voice commands</span>
          </h1>

          <p className="dashboard-hero-subhead">
            No more tedious manual forms. Simply tap Voice Command, speak your transaction in everyday language, and VoiceSpend automatically categorizes, tracks, and protects your budget in real time.
          </p>

          <div className="dashboard-hero-actions">
            <VoiceCommandButton
              variant="hero"
              onClick={onOpenVoiceModal}
              label="Voice Command"
            />

            <Link to={ROUTES.BUDGETS} className="hero-secondary-btn">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span>View Budgets</span>
            </Link>

            <button 
              type="button" 
              onClick={onSendReport} 
              className="hero-ghost-btn"
              title="Email this month's expense report"
            >
              <span className="material-symbols-outlined">mail</span>
              <span>Email Report</span>
            </button>
          </div>
        </div>

        {/* Right Column: Clean Visual Showcase Card with Quick Prompts & CTA (No inline mic box) */}
        <div className="dashboard-hero-visual">
          <div className="hero-feature-card">
            <div className="hero-feature-header">
              <div className="hero-feature-tag">
                <span className="hero-pulse-dot" />
                <span>Smart Voice Assistant</span>
              </div>
              <span className="hero-feature-lang">AI Powered</span>
            </div>

            <div className="hero-feature-icon-group">
              <div className="hero-feature-icon-circle">
                <span className="material-symbols-outlined hero-feature-main-icon">graphic_eq</span>
              </div>
              <div className="hero-feature-icon-text">
                <h3 className="hero-feature-title">Speak or Type Anytime</h3>
                <p className="hero-feature-sub">Tap below to open the modal, speak or type your expenses</p>
              </div>
            </div>

            <div className="hero-feature-chips-block">
              <span className="hero-feature-chips-label">Try quick prompts:</span>
              <div className="hero-feature-chips-list">
                {QUICK_EXAMPLES.map((item, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    className="hero-feature-chip"
                    onClick={() => {
                      if (onQuickPrompt) onQuickPrompt(item.text);
                      else onOpenVoiceModal();
                    }}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                      {item.icon}
                    </span>
                    <span>"{item.text}"</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="hero-feature-action-btn"
              onClick={onOpenVoiceModal}
            >
              <span className="material-symbols-outlined">mic</span>
              <span>Open Voice Command</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

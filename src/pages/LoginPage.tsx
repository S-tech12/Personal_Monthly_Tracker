import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '../constants/routes';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ThemeToggle } from '../components/common/ThemeToggle';
import '../styles/pages/LoginPage.css';

export const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isLoggingIn,
    errors,
    handleLogin,
    isForgotModalOpen,
    forgotEmail,
    setForgotEmail,
    forgotStep,
    forgotOtp,
    setForgotOtp,
    isForgotLoading,
    openForgotModal,
    closeForgotModal,
    handleSendOtp,
    handleVerifyOtp,
  } = useLogin();

  const forgotPasswordLink = (
    <button 
      type="button" 
      onClick={openForgotModal} 
      className="forgot-password-link"
    >
      Forgot Password?
    </button>
  );

  return (
    <div className="login-page">
      <div className="auth-top-bar">
        <Link to={ROUTES.LOGIN} className="auth-brand-logo">
          <div className="auth-brand-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
          </div>
          <span className="auth-brand-name">VoiceSpend</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="login-split-wrapper">
        {/* Left Side: Brand Value Proposition (Desktop) */}
        <div className="login-brand-side">
          <div className="brand-side-badge">
            <span className="brand-side-badge-dot"></span>
            <span>AI Voice Financial Assistant</span>
          </div>

          <h1 className="brand-side-title">
            Take command of your wealth with <span className="gradient-text">pure voice simplicity</span>.
          </h1>

          <p className="brand-side-subhead">
            No endless manual spreadsheets or complex bookkeeping. Speak naturally, stay disciplined, and track household spending in seconds.
          </p>

          <div className="brand-features-list">
            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">mic</span>
              </div>
              <div>
                <p className="feature-title">Natural Language Logging</p>
                <p className="feature-desc">Say "Groceries $65" or "Metro fare 150 INR"—auto-categorized instantly.</p>
              </div>
            </div>

            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">pie_chart</span>
              </div>
              <div>
                <p className="feature-title">Real-Time Category Intelligence</p>
                <p className="feature-desc">Dynamic visual breakdowns and instant alerts before threshold exceedance.</p>
              </div>
            </div>

            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="feature-title">Family Spending Sync</p>
                <p className="feature-desc">Keep household budgets aligned across all family members seamlessly.</p>
              </div>
            </div>
          </div>

          <div className="brand-side-trust">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
              verified_user
            </span>
            <span>Bank-grade encryption & private speech processing.</span>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="login-form-side">
          <main className="login-container">
            <div className="login-header">
              <h2 className="login-card-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to your VoiceSpend account to continue.</p>
            </div>

            {/* Login Card */}
            <div className="login-card">
              <form className="login-form" onSubmit={handleLogin}>
                {/* Email Field */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    leftIcon="mail"
                  />
                  {errors.email && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    leftIcon="lock"
                    rightIcon={showPassword ? 'visibility_off' : 'visibility'}
                    onRightIconClick={togglePasswordVisibility}
                    rightActionNode={forgotPasswordLink}
                  />
                  {errors.password && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Login Action */}
                <Button 
                  type="submit" 
                  disabled={isLoggingIn} 
                  icon="arrow_forward"
                  style={{ minHeight: '48px', width: '100%' }}
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>

            {/* Secondary Actions */}
            <div className="login-secondary-actions">
              <p className="login-secondary-text">
                Don't have an account?{' '}
                <Link to={ROUTES.SIGNUP} className="login-signup-link">
                  Create Account
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal 
        isOpen={isForgotModalOpen} 
        onClose={closeForgotModal} 
        title="Reset Password"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {forgotStep === 1 ? (
            <>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                Enter your registered email address and we'll send a 6-digit verification code to reset your password.
              </p>
              <Input
                label="Registered Email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                required
                leftIcon="mail"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="text" onClick={closeForgotModal} type="button">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendOtp} 
                  disabled={isForgotLoading || !forgotEmail}
                  type="button"
                >
                  {isForgotLoading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                We've sent a 6-digit code to <strong>{forgotEmail}</strong>. Please enter it below.
              </p>
              <Input
                label="6-Digit Code"
                type="text"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="123456"
                required
                leftIcon="pin"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <Button 
                  variant="text" 
                  onClick={handleSendOtp} 
                  disabled={isForgotLoading}
                  type="button"
                >
                  Resend Code
                </Button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="outline" onClick={closeForgotModal} type="button">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleVerifyOtp} 
                    disabled={isForgotLoading || !forgotOtp}
                    type="button"
                  >
                    {isForgotLoading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

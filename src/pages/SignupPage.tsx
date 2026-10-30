import React from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import { useOtpVerification } from '../hooks/useOtpVerification';
import { ROUTES } from '../constants/routes';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { OtpModal } from '../components/auth/OtpModal';
import { ThemeToggle } from '../components/common/ThemeToggle';
import '../styles/pages/SignupPage.css';

export const SignupPage: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    otpModalOpen,
    setOtpModalOpen,
    handleSignup,
  } = useSignup();

  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    otp,
    setOtp,
    isLoading: isOtpLoading,
    error: otpError,
    handleVerify
  } = useOtpVerification(email, () => setOtpModalOpen(false));

  return (
    <div className="signup-page">
      <div className="auth-top-bar">
        <Link to={ROUTES.LOGIN} className="auth-brand-logo">
          <div className="auth-brand-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
          </div>
          <span className="auth-brand-name">VoiceSpend</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="signup-split-wrapper">
        {/* Left Side: Brand Value Proposition (Desktop) */}
        <div className="signup-brand-side">
          <div className="brand-side-badge">
            <span className="brand-side-badge-dot"></span>
            <span>Intelligent Personal Finance</span>
          </div>

          <h1 className="brand-side-title">
            Join thousands of smart spenders using <span className="gradient-text">voice intelligence</span>.
          </h1>

          <p className="brand-side-subhead">
            Set up your account in 30 seconds. Start recording daily expenses by speaking naturally and stay effortlessly ahead of your monthly targets.
          </p>

          <div className="brand-features-list">
            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                <p className="feature-title">Instant Setup</p>
                <p className="feature-desc">No bank linking or complex configuration required to begin.</p>
              </div>
            </div>

            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">currency_exchange</span>
              </div>
              <div>
                <p className="feature-title">Multi-Currency Native</p>
                <p className="feature-desc">Track INR, USD, EUR, GBP, and more without messy conversions.</p>
              </div>
            </div>

            <div className="brand-feature-item">
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div>
                <p className="feature-title">Privacy by Design</p>
                <p className="feature-desc">Your expense history is strictly confidential and encrypted.</p>
              </div>
            </div>
          </div>

          <div className="brand-side-trust">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
              shield
            </span>
            <span>Zero ad tracking. Your data is yours forever.</span>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="signup-form-side">
          <main className="signup-container">
            <div className="signup-header">
              <h2 className="signup-card-title">Create Account</h2>
              <p className="signup-card-subtitle">Get started with VoiceSpend for free.</p>
            </div>

            <div className="signup-card">
              <form className="signup-form" onSubmit={(e) => handleSignup(e)}>
                {errors.api && (
                  <div style={{ color: 'var(--color-error)', marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-error-light)', borderRadius: '0.5rem', fontSize: '13px' }}>
                    {errors.api}
                  </div>
                )}
                
                {/* Full Name Field */}
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    leftIcon="person"
                  />
                  {errors.name && (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

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
                  />
                  {errors.password ? (
                    <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                      {errors.password}
                    </p>
                  ) : (
                    <p className="signup-password-hint">
                      Must be at least 6 characters with one number.
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  icon="arrow_forward"
                  style={{ minHeight: '48px', width: '100%' }}
                >
                  {isLoading ? 'Creating Account...' : 'Get Started'}
                </Button>
              </form>
            </div>

            <p className="signup-footer-link">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="signup-login-link">
                Sign in
              </Link>
            </p>
          </main>
        </div>
      </div>

      <OtpModal 
        isOpen={otpModalOpen}
        email={email}
        isLoading={isOtpLoading}
        error={otpError}
        otp={otp}
        setOtp={setOtp}
        onVerify={handleVerify}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  );
};

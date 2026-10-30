import React from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  isLoading: boolean;
  error: string;
  otp: string;
  setOtp: (val: string) => void;
  onVerify: () => void;
  onClose: () => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  email,
  isLoading,
  error,
  otp,
  setOtp,
  onVerify,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify your email">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
          We've sent a 6-digit verification code to <strong>{email}</strong>.
          Please enter it below to verify your account.
        </p>
        
        <Input
          label="Verification Code"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          leftIcon="password"
          autoFocus
        />
        
        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>}
        
        <Button 
          onClick={onVerify} 
          disabled={otp.length !== 6 || isLoading}
          style={{ marginTop: '1rem' }}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </Modal>
  );
};

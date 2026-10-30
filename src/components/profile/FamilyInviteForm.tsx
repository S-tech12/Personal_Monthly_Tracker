import React, { useState } from 'react';
import { Input, Button } from '../common';

interface FamilyInviteFormProps {
  onSendInvite: (email: string) => Promise<void>;
  isSendingInvite: boolean;
}

export const FamilyInviteForm: React.FC<FamilyInviteFormProps> = ({ onSendInvite, isSendingInvite }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    await onSendInvite(email);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="profile-form-group">
        <Input
          type="email"
          label="Invite Family Member"
          placeholder="Enter their email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
        />
        {error && (
          <p style={{ color: 'var(--color-error, #ef4444)', fontSize: '14px', margin: '4px 0 0 0' }}>
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        className="profile-submit-button"
        disabled={isSendingInvite}
      >
        {isSendingInvite ? (
          <><span className="material-symbols-outlined spin-icon">progress_activity</span> Sending...</>
        ) : (
          <><span className="material-symbols-outlined">send</span> Send Invite</>
        )}
      </Button>
    </form>
  );
};

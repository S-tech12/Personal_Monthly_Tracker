import React from 'react';
import { Input, Button, Avatar, Skeleton } from '../../components/common';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';
import { Section } from '../../components/layout/Section';
import { BackToTop } from '../../components/layout/BackToTop';
import { MAIN_NAV_ITEMS } from '../../constants/navigation';
import { useProfile } from '../../hooks/profile/useProfile';
import { useFamily } from '../../hooks/useFamily';
import { formatMemberSince } from '../../utils/formatDate';
import { FamilyInviteForm } from '../../components/profile/FamilyInviteForm';
import { FamilyConnectionsList } from '../../components/profile/FamilyConnectionsList';
import '../../styles/pages/ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const {
    email,
    name,
    memberSince,
    imageUrl,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    toggleShowNewPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    handleImageSelect,
    handleSubmit,
    isSaving,
    isLoading,
    passwordError,
    logout,
    handleDeleteAccount
  } = useProfile();

  const {
    overview,
    pendingInvites,
    sentInvites,
    isLoading: isConnectionsLoading,
    isSendingInvite,
    respondingToId,
    handleSendInvite,
    handleRespond
  } = useFamily();

  return (
    <div className="profile-page">
      <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />

      {/* Hero Header */}
      <Section variant="gradient" className="profile-hero-section">
        <div className="profile-hero-header">
          <div>
            <div className="profile-hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>person</span>
              <span>Identity & Sharing</span>
            </div>
            <h1 className="profile-page-title">Personal & Family Profile</h1>
            <p className="profile-page-subhead">
              Manage your credentials, avatar, and shared family expense sync permissions.
            </p>
          </div>
        </div>
      </Section>

      {/* Main Profile & Family Grid */}
      <Section variant="plain" withDivider className="profile-content-section">
        {isLoading ? (
          <div style={{ padding: '2rem 0' }}>
            <Skeleton variant="circular" width={100} height={100} />
            <div style={{ marginTop: '1.5rem' }}>
              <Skeleton variant="text" width="100%" height={44} />
            </div>
          </div>
        ) : (
          <div className="profile-layout-grid">
            {/* Left Column: User Profile Card */}
            <div className="profile-card-panel">
              <div className="profile-avatar-center">
                <Avatar 
                  size="xl" 
                  imageUrl={imageUrl} 
                  editable 
                  onImageSelect={handleImageSelect} 
                />
                <span className="profile-since-pill">
                  {formatMemberSince(memberSince)}
                </span>
              </div>

              <form className="profile-edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <Input 
                    label="Full Name"
                    type="text"
                    value={name}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <Input 
                    label="Email Address"
                    type="email"
                    value={email}
                    disabled
                  />
                  <p className="profile-field-hint">
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>lock</span>
                    Primary email is tied to authentication
                  </p>
                </div>

                <div className="form-group">
                  <Input 
                    id="new_password"
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    rightIcon={showNewPassword ? "visibility_off" : "visibility"}
                    onRightIconClick={toggleShowNewPassword}
                  />
                </div>

                <div className="form-group">
                  <Input 
                    id="confirm_password"
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    rightIcon={showConfirmPassword ? "visibility_off" : "visibility"}
                    onRightIconClick={toggleShowConfirmPassword}
                  />
                  {passwordError && (
                    <p style={{ color: 'var(--color-error)', fontSize: '13px', margin: '4px 0 0 0' }}>
                      {passwordError}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSaving}
                  style={{ width: '100%', minHeight: '48px', marginTop: '8px' }}
                >
                  <span className="material-symbols-outlined">save</span>
                  <span>{isSaving ? 'Updating...' : 'Save Profile Changes'}</span>
                </Button>
              </form>
            </div>

            {/* Right Column: Family Sharing & Account Operations */}
            <div className="profile-secondary-col">
              {/* Family Sharing */}
              <div className="profile-card-panel">
                <div className="panel-header-simple">
                  <span className="material-symbols-outlined text-primary">family_restroom</span>
                  <h3 className="panel-title">Family Spending Group</h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 }}>
                  Collaborate on joint budgets. Members can record expenses together in real time.
                </p>

                {overview?.isHead && (
                  <div className="family-invite-box">
                    <FamilyInviteForm 
                      onSendInvite={handleSendInvite} 
                      isSendingInvite={isSendingInvite} 
                    />
                  </div>
                )}

                <div style={{ marginTop: '1rem' }}>
                  <FamilyConnectionsList 
                    overview={overview}
                    pendingInvites={pendingInvites}
                    sentInvites={sentInvites}
                    isLoading={isConnectionsLoading}
                    onRespond={handleRespond}
                    respondingToId={respondingToId}
                  />
                </div>
              </div>

              {/* Account Security & Actions */}
              <div className="profile-card-panel">
                <div className="panel-header-simple">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <h3 className="panel-title">Account Actions</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Button 
                    onClick={logout}
                    variant="outline"
                    style={{ width: '100%', justifyContent: 'center', minHeight: '44px' }}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out of All Sessions
                  </Button>
                  
                  <Button 
                    onClick={handleDeleteAccount}
                    variant="text"
                    style={{ width: '100%', justifyContent: 'center', minHeight: '44px', color: 'var(--color-error)' }}
                  >
                    <span className="material-symbols-outlined">delete_forever</span>
                    Permanently Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>

      <BackToTop />
      <BottomNav navItems={MAIN_NAV_ITEMS} />
    </div>
  );
};

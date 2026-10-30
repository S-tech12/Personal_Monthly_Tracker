import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { NotificationCard } from '../components/common/NotificationCard';
import { Button } from '../components/common/Button';
import { MAIN_NAV_ITEMS } from '../constants/navigation';
import { Loader } from '../components/common/Loader';
import { Section } from '../components/layout/Section';
import { BackToTop } from '../components/layout/BackToTop';
import '../styles/pages/NotificationsPage.css';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    isLoading,
    unreadCount,
    isMarkingAllRead,
    markAllReadSuccess,
    handleMarkAllAsRead,
    handleMarkAsRead
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="notifications-page">
        <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />
        <Loader text="Loading notifications..." />
        <BottomNav navItems={MAIN_NAV_ITEMS} />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />

      {/* Hero Header */}
      <Section variant="gradient" className="notifications-hero-section">
        <div className="notifications-hero-header">
          <div>
            <div className="notifications-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>notifications</span>
              <span>Activity & Alerts</span>
            </div>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">
              Stay ahead with real-time budget threshold warnings and weekly summaries.
            </p>
          </div>
          
          <Button 
            variant={markAllReadSuccess ? 'primary' : 'outline'}
            icon={markAllReadSuccess ? 'done' : 'done_all'}
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead || unreadCount === 0}
            style={{ minHeight: '44px' }}
          >
            {markAllReadSuccess ? 'All Marked as Read' : 'Mark all as read'}
          </Button>
        </div>
      </Section>

      {/* Notifications List */}
      <Section variant="plain" withDivider className="notifications-content-section">
        {!isLoading && unreadCount > 0 ? (
          <div className="notifications-list-wrapper">
            {notifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                type={notif.type}
                title={notif.title}
                message={notif.message}
                timestamp={notif.timestamp}
                isRead={notif.isRead}
                onClick={() => handleMarkAsRead(notif.id)}
              />
            ))}
          </div>
        ) : (
          <div className="notifications-empty">
            <div className="empty-icon-container">
              <span className="material-symbols-outlined empty-icon">
                notifications_off
              </span>
            </div>
            <h2 className="empty-title">All caught up!</h2>
            <p className="empty-subtitle">
              You've cleared all your notifications. We'll alert you the moment any budget approaches its threshold.
            </p>
          </div>
        )}
      </Section>

      <BackToTop />
      <BottomNav navItems={MAIN_NAV_ITEMS} />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import '../../styles/components/Header.css';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

interface HeaderProps {
  title?: string;
  navItems: NavItem[];
  userAvatarUrl?: string;
  onNotificationClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'VoiceSpend', 
  navItems,
  userAvatarUrl
}) => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll detection for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo / Brand */}
          <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="header-brand" aria-label="VoiceSpend Home">
            <div className="header-brand-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mic</span>
            </div>
            <span className="header-title">{title}</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="header-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`header-nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="material-symbols-outlined header-nav-icon" style={{ fontSize: '18px' }}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Header Actions (Desktop & Mobile) */}
          <div className="header-actions">
            <ThemeToggle />

            {/* User Profile Avatar (Desktop) */}
            {isAuthenticated && user && (
              <div className="header-user-wrapper">
                <Link to={ROUTES.PROFILE} className="header-avatar-link" title={`Profile: ${user.name || user.email}`}>
                  {user.profilePictureUrl || userAvatarUrl ? (
                    <img 
                      src={user.profilePictureUrl || userAvatarUrl} 
                      alt={user.name || 'User Avatar'} 
                      className="header-avatar-img"
                    />
                  ) : (
                    <div className="header-avatar-placeholder">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="header-logout-btn"
                  title="Logout"
                  aria-label="Logout"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="header-hamburger-btn"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="mobile-drawer-wrapper">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-drawer-backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="mobile-drawer-panel"
            >
              <div className="mobile-drawer-header">
                <div className="header-brand">
                  <div className="header-brand-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
                  </div>
                  <span className="header-title">{title}</span>
                </div>
                <button
                  type="button"
                  className="mobile-drawer-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* User info if logged in */}
              {isAuthenticated && user && (
                <div className="mobile-drawer-user">
                  <div className="mobile-user-avatar">
                    {user.profilePictureUrl || userAvatarUrl ? (
                      <img src={user.profilePictureUrl || userAvatarUrl} alt={user.name || 'User'} />
                    ) : (
                      <span>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="mobile-user-meta">
                    <p className="mobile-user-name">{user.name || 'Account'}</p>
                    <p className="mobile-user-email">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="mobile-drawer-nav">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && (
                        <span className="material-symbols-outlined mobile-nav-icon">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="mobile-nav-indicator" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer Actions */}
              <div className="mobile-drawer-footer">
                <div className="mobile-drawer-theme-row">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Appearance</span>
                  <ThemeToggle />
                </div>
                
                {isAuthenticated && (
                  <button 
                    onClick={handleLogout}
                    className="mobile-logout-button"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

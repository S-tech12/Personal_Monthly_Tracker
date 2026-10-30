import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavItem } from './Header';
import '../../styles/components/BottomNav.css';

interface BottomNavProps {
  navItems: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`bottom-nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon && (
              <span className="material-symbols-outlined bottom-nav-icon">
                {item.icon}
              </span>
            )}
            <span className="bottom-nav-text">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

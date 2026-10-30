import React from 'react';
import { Header } from '../common/Header';
import { MAIN_NAV_ITEMS } from '../../constants/navigation';

export const Navbar: React.FC = () => {
  return <Header title="VoiceSpend" navItems={MAIN_NAV_ITEMS} />;
};

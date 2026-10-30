import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ROUTES } from './constants/routes';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { FloatingVoiceButton } from './components/layout/FloatingVoiceButton';
import { PageTransition } from './components/layout/PageTransition';
import { useAuth } from './hooks/useAuth';

import './styles/global.css';

const GlobalVoiceButton = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <FloatingVoiceButton />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.LOGIN} element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path={ROUTES.SIGNUP} element={<PageTransition><SignupPage /></PageTransition>} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <PageTransition><DashboardPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.BUDGETS}
          element={
            <ProtectedRoute>
              <PageTransition><BudgetsPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <ProtectedRoute>
              <PageTransition><NotificationsPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <PageTransition><SettingsPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HISTORY}
          element={
            <ProtectedRoute>
              <PageTransition><HistoryPage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <PageTransition><ProfilePage /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0 10px 32px -4px rgba(0,0,0,0.15)',
              },
              success: {
                iconTheme: { primary: '#059669', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#DC2626', secondary: '#fff' },
              },
            }}
          />
          <AnimatedRoutes />
          <GlobalVoiceButton />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

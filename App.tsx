
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { SignupPage } from './components/auth/SignupPage';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { FeedbackFormPage } from './components/public/FeedbackFormPage';
import { DataProvider, useData } from './components/context/DataContext';
import { logoutUser } from './services/auth';

type View = 'landing' | 'signup' | 'login' | 'dashboard' | 'feedback_form';

function AppContent() {
  const { isAuthenticated, isLoading } = useData();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [feedbackAppId, setFeedbackAppId] = useState<string | null>(null);

  // Check for URL parameters for feedback form routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const appIdParam = params.get('appId');

    if (viewParam === 'feedback' && appIdParam) {
      setFeedbackAppId(appIdParam);
      setCurrentView('feedback_form');
    }
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentView !== 'dashboard' && currentView !== 'feedback_form') {
        // User is logged in but not on dashboard - redirect to dashboard
        setCurrentView('dashboard');
      } else if (!isAuthenticated && currentView === 'dashboard') {
        // User is not logged in but trying to access dashboard - redirect to landing
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleLoginSuccess = (isFirstLogin: boolean) => {
    if (isFirstLogin) {
      setShowOnboarding(true);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView('landing');
    setShowOnboarding(false);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // Clear URL params when navigating internally
    if (view !== 'feedback_form') {
      try {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.pushState({}, '', url.toString());
      } catch (e) {
        console.warn("Navigation state update failed:", e);
      }
    }
  };

  // Show loading screen ONLY for dashboard (not for feedback forms!)
  if (isLoading && currentView === 'dashboard') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentView === 'signup' && (
        <SignupPage onNavigate={handleNavigate} />
      )}

      {currentView === 'login' && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentView === 'dashboard' && isAuthenticated && (
        <DashboardLayout
          showOnboarding={showOnboarding}
          onLogout={handleLogout}
          onCompleteOnboarding={() => setShowOnboarding(false)}
          onRestartOnboarding={() => setShowOnboarding(true)}
        />
      )}

      {currentView === 'feedback_form' && (
        <FeedbackFormPage
          appId={feedbackAppId}
          onGoHome={() => handleNavigate('landing')}
        />
      )}
    </>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;

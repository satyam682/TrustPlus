
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  ShieldCheck, Home, Grid, MessageSquare, BarChart2, User,
  CreditCard, HelpCircle, Bell, Search, Plus, Menu, X, LogOut, ShieldAlert
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DashboardHome } from './DashboardHome';
import { OnboardingTour } from './OnboardingTour';
import { NewAppModal } from './NewAppModal';

// Import Pages
import { MyAppsPage } from './pages/MyAppsPage';
import { AllFeedbackPage } from './pages/AllFeedbackPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FlaggedReviewsPage } from './pages/FlaggedReviewsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { BillingPage } from './pages/BillingPage';
import { HelpPage } from './pages/HelpPage';

interface DashboardLayoutProps {
  user?: any; // We'll rely on context mostly, but keep prop for initial compatibility
  showOnboarding: boolean;
  onLogout: () => void;
  onCompleteOnboarding: () => void;
  onRestartOnboarding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  showOnboarding,
  onLogout,
  onCompleteOnboarding,
  onRestartOnboarding
}) => {
  const { user } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'apps', label: 'My Apps', icon: <Grid className="w-5 h-5" /> },
    { id: 'feedback', label: 'All Feedback', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'flagged', label: 'Flagged Reviews', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  const settingsItems = [
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsSidebarOpen(false); // Close sidebar on mobile on navigate
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardHome />;
      case 'apps': return <MyAppsPage onAddApp={() => setIsNewAppModalOpen(true)} />;
      case 'feedback': return <AllFeedbackPage />;
      case 'flagged': return <FlaggedReviewsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'profile': return <ProfileSettingsPage />;
      case 'billing': return <BillingPage />;
      case 'help': return <HelpPage onRestartOnboarding={onRestartOnboarding} />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 flex-shrink-0">
          <ShieldCheck className="w-8 h-8 text-blue-500 mr-2" />
          <span className="font-bold text-xl tracking-tight">TrustPlus</span>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Content */}
        <div className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${activePage === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <span className={`mr-3 transition-transform duration-200 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Settings</h3>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${activePage === item.id
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <span className={`mr-3 transition-transform duration-200 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex-shrink-0">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="flex items-center min-w-0" onClick={() => handleNavClick('profile')}>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-md overflow-hidden">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0] || 'U'
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate group-hover:text-slate-300">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-red-400 p-2 rounded-md hover:bg-slate-900/50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm transition-colors">
          <div className="flex items-center">
            <button
              className="mr-4 lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize hidden sm:block">
              {activePage === 'apps' ? 'My Apps' : activePage.replace(/-/g, ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Search (Desktop) */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white w-64 transition-all dark:bg-gray-700 dark:text-white dark:focus:bg-gray-600"
              />
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>

            {/* Actions */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
            </button>

            <Button
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              className="hidden sm:flex shadow-blue-500/20 shadow-lg"
              onClick={() => setIsNewAppModalOpen(true)}
            >
              New App
            </Button>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Overlays */}
      {showOnboarding && <OnboardingTour onComplete={onCompleteOnboarding} />}
      <NewAppModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onSuccess={() => {
          setActivePage('apps');
        }}
      />
    </div>
  );
};

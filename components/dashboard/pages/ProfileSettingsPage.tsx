
import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { User, Lock, Bell, Moon, Trash2, Smartphone, Globe, Monitor, Upload } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser, theme, toggleTheme } = useData();
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateUser({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Password & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Moon className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete Account', icon: <Trash2 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">

      {/* Sidebar Menu */}
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Settings</h2>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Panel */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8 min-h-[500px]">

        {activeTab === 'personal' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">Personal Information</h3>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center overflow-hidden">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="mb-2"
                  onClick={() => fileInputRef.current?.click()}
                  icon={<Upload className="w-4 h-4" />}
                >
                  Change Photo
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Full Name" value={user.name} onChange={async (e) => await updateUser({ name: e.target.value })} />
              <Input label="Job Title" value={user.jobTitle} onChange={async (e) => await updateUser({ jobTitle: e.target.value })} />
              <div className="md:col-span-2">
                <Input label="Email Address" value={user.email} disabled />
                <p className="text-xs text-orange-600 mt-1">Changing email requires verification</p>
              </div>
              <div className="md:col-span-2">
                <Input label="Company Name" value={user.company} onChange={async (e) => await updateUser({ company: e.target.value })} />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => alert('Changes saved!')}>Save Changes</Button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">Interface Settings</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                onClick={() => toggleTheme('light')}
                className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${theme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
              >
                <div className="h-20 bg-white rounded-lg border border-gray-200 shadow-sm mb-3"></div>
                <p className={`text-center text-sm font-medium ${theme === 'light' ? 'text-blue-800 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>Light Mode</p>
              </div>
              <div
                onClick={() => toggleTheme('dark')}
                className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${theme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
              >
                <div className="h-20 bg-gray-800 rounded-lg shadow-sm mb-3 border border-gray-700"></div>
                <p className={`text-center text-sm font-medium ${theme === 'dark' ? 'text-blue-800 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>Dark Mode</p>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs remain static for now as placeholders, but structure allows expansion */}
        {activeTab !== 'personal' && activeTab !== 'preferences' && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p>This section is available in the full version.</p>
          </div>
        )}

      </div>
    </div>
  );
};

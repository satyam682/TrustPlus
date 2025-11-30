
import React from 'react';
import { useData } from '../../context/DataContext';
import { Search, MoreHorizontal, Globe, Smartphone, Monitor, CheckCircle, PauseCircle, Plus, Copy, ExternalLink, Puzzle, Cloud } from 'lucide-react';
import { Button } from '../../ui/Button';

interface MyAppsPageProps {
  onAddApp: () => void;
}

export const MyAppsPage: React.FC<MyAppsPageProps> = ({ onAddApp }) => {
  const { apps, feedbacks } = useData();

  // Helper to calculate stats per app
  const getAppStats = (appId: string) => {
    const appFeedbacks = feedbacks.filter(f => f.appId === appId);
    const count = appFeedbacks.length;
    const avgRating = count > 0 ? (appFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1) : '0.0';
    const positiveCount = appFeedbacks.filter(f => f.sentiment === 'positive').length;
    const positivePct = count > 0 ? Math.round((positiveCount / count) * 100) : 0;
    
    return { count, avgRating, positivePct };
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}?view=feedback&appId=${id}`;
    navigator.clipboard.writeText(link);
    alert('Feedback Link Copied!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Apps</h1>
          <p className="text-gray-500 mt-2">Manage all your apps and feedback widgets</p>
        </div>
        <Button onClick={onAddApp} icon={<Plus className="w-5 h-5" />}>New App</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search apps..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {apps.map((app) => {
          const stats = getAppStats(app.id);
          return (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                 <div className={`w-14 h-14 rounded-xl ${app.iconBg} flex items-center justify-center text-white text-2xl font-bold shadow-sm`}>
                   {app.name[0]}
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                   app.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                   {app.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                   {app.status === 'active' ? 'Active' : 'Paused'}
                 </span>
              </div>

              {/* App Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{app.name}</h3>
                <a href={app.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate block">
                  {app.url}
                </a>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {app.platform.includes('Web') ? <Globe className="w-4 h-4" /> : 
                   app.platform.includes('iOS') || app.platform.includes('Android') ? <Smartphone className="w-4 h-4" /> : 
                   app.platform.includes('Extension') ? <Puzzle className="w-4 h-4" /> :
                   app.platform.includes('SaaS') ? <Cloud className="w-4 h-4" /> :
                   <Monitor className="w-4 h-4" />}
                  {app.platform}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-gray-50 dark:border-gray-700 py-4">
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Feedback</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.avgRating} ⭐</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.positivePct}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Positive</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1 h-9 text-xs" 
                  onClick={() => copyLink(app.id)}
                  icon={<Copy className="w-3 h-3"/>}
                >
                  Link
                </Button>
                <Button 
                   variant="secondary"
                   className="flex-1 h-9 text-xs"
                   onClick={() => window.open(`${window.location.origin}?view=feedback&appId=${app.id}`, '_blank')}
                   icon={<ExternalLink className="w-3 h-3"/>}
                >
                  View Form
                </Button>
              </div>

            </div>
          );
        })}

        {/* Add New App Card */}
        <div 
          onClick={onAddApp}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all min-h-[300px] group"
        >
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New App</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Start collecting feedback for a new project</p>
        </div>
      </div>
    </div>
  );
};

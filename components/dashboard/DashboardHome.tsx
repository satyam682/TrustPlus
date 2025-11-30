
import React from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, Grid, Clock, Heart, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from 'recharts';

export const DashboardHome: React.FC = () => {
  const { user, apps, feedbacks } = useData();

  // Dynamic Stats
  const totalFeedback = feedbacks.length;
  const activeApps = apps.filter(a => a.status === 'active').length;
  
  const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
  const sentimentPct = totalFeedback > 0 ? Math.round((positive / totalFeedback) * 100) : 0;

  // Recent Feedback (limit 3)
  const recentFeedback = feedbacks.slice(0, 3);

  // Top Apps
  const topApps = apps.map(app => {
    const appFeedbacks = feedbacks.filter(f => f.appId === app.id);
    const count = appFeedbacks.length;
    const avgScore = count > 0 ? (appFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1) : "0.0";
    return { ...app, count, avgScore };
  }).sort((a, b) => b.count - a.count).slice(0, 3);

  const chartData = [
     { name: '1 May', value: 12 },
     { name: '5 May', value: 19 },
     { name: '10 May', value: 15 },
     { name: '15 May', value: 25 },
     { name: '20 May', value: 32 },
     { name: '25 May', value: 28 },
     { name: '30 May', value: 45 + totalFeedback }, // Hack to show movement on new feedback
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your apps today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Feedback", val: totalFeedback.toString(), icon: <MessageSquare className="w-6 h-6 text-blue-600"/>, color: "bg-blue-100 dark:bg-blue-900/30", change: "+12%", trend: "up" },
          { label: "Active Apps", val: activeApps.toString(), icon: <Grid className="w-6 h-6 text-green-600"/>, color: "bg-green-100 dark:bg-green-900/30", change: "+2", trend: "up" },
          { label: "Avg Response", val: "2.5h", icon: <Clock className="w-6 h-6 text-orange-600"/>, color: "bg-orange-100 dark:bg-orange-900/30", change: "-30%", trend: "up" },
          { label: "Sentiment", val: `${sentimentPct}%`, icon: <Heart className="w-6 h-6 text-pink-600"/>, color: "bg-pink-100 dark:bg-pink-900/30", change: "+5%", trend: "up" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.val}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feedback Trends</h3>
            <select className="text-sm border-gray-200 dark:border-gray-600 bg-transparent rounded-lg text-gray-500 dark:text-gray-400 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVal2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Apps */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Apps</h3>
          <div className="space-y-6">
            {topApps.map((app, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${app.iconBg} flex items-center justify-center text-white font-bold text-lg mr-4 shadow-sm`}>
                  {app.name[0]}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{app.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-yellow-400 mr-1">★</span> {app.avgScore} • {app.count} reviews
                  </div>
                </div>
              </div>
            ))}
            {topApps.length === 0 && <p className="text-gray-500 text-sm">No apps with feedback yet.</p>}
          </div>
          <button className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            View All Apps
          </button>
        </div>
      </div>

      {/* Recent Feedback Table Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Feedback</h3>
          <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentFeedback.map((item, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{item.appName}</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.user}</span>
                  {item.isVerified && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">"{item.content}"</p>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                  item.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {item.sentiment === 'positive' ? '😊 Positive' : item.sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
                </span>
                {item.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {recentFeedback.length === 0 && (
             <div className="p-8 text-center text-gray-500">No feedback yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

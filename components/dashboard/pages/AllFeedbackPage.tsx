
import React from 'react';
import { useData } from '../../context/DataContext';
import { Search, Download, Archive, Reply, MoreHorizontal } from 'lucide-react';
import { Button } from '../../ui/Button';

export const AllFeedbackPage: React.FC = () => {
  const { feedbacks } = useData();

  // Simple calculation for header stats
  const total = feedbacks.length;
  const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
  const positivePct = total > 0 ? Math.round((positive / total) * 100) : 0;

  // Just for demo, assuming "today" matches verify check
  const todayCount = feedbacks.filter(f => {
    const timestamp = new Date(f.timestamp);
    const diff = Date.now() - timestamp.getTime();
    return diff < 86400000;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Feedback</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{total} total feedback</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{positivePct}% positive</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{todayCount} today</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">

        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Apps</option>
          </select>

          <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Sentiments</option>
            <option>😊 Positive</option>
            <option>😐 Neutral</option>
            <option>😞 Negative</option>
          </select>

          <select className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>Last 30 days</option>
          </select>
        </div>

        <div className="flex gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search feedback..." className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No feedback yet</h3>
            <p className="text-gray-500 mt-2">Share your app link to get started!</p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {item.appName[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.appName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.user}</span>
                      {item.isVerified && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{item.time}</span>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      item.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {item.sentiment === 'positive' ? '😊 Positive' : item.sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
                  </span>
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-400 dark:hover:text-blue-400">
                    <Reply className="w-4 h-4" /> Reply
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:text-red-400">
                    <Archive className="w-4 h-4" /> Archive
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

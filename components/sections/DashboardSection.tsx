import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart as BarIcon, Search, Tag, GitMerge } from 'lucide-react';

const sentimentData = [
  { name: 'Jan', pos: 400, neg: 240 },
  { name: 'Feb', pos: 300, neg: 139 },
  { name: 'Mar', pos: 500, neg: 200 },
  { name: 'Apr', pos: 780, neg: 220 },
  { name: 'May', pos: 600, neg: 180 },
  { name: 'Jun', pos: 890, neg: 150 },
];

export const DashboardSection: React.FC = () => {
  return (
    <section className="bg-slate-900 py-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything in One Dashboard</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Track feedback, analyze sentiment, spot trends, and improve your product—all from a single, beautiful interface.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="bg-slate-800 rounded-3xl p-2 border border-slate-700 shadow-2xl">
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
            {/* Toolbar */}
            <div className="border-b border-slate-800 p-4 flex justify-between items-center">
              <div className="flex gap-4 text-sm font-medium text-slate-400">
                <span className="text-white bg-slate-800 px-3 py-1 rounded-md">Overview</span>
                <span className="hover:text-white cursor-pointer px-3 py-1">Feedback</span>
                <span className="hover:text-white cursor-pointer px-3 py-1">Analytics</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
            </div>

            {/* Dashboard Internal Grid */}
            <div className="p-6 grid lg:grid-cols-3 gap-6">
              
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-slate-200">Sentiment Trend</h3>
                  <div className="flex gap-2 text-xs">
                     <span className="flex items-center text-green-400"><div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div> Positive</span>
                     <span className="flex items-center text-red-400"><div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div> Negative</span>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sentimentData}>
                      <defs>
                        <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="pos" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" />
                      <Area type="monotone" dataKey="neg" stroke="#f87171" strokeWidth={2} fillOpacity={0.1} fill="#f87171" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Stats */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-slate-400 text-sm font-medium mb-1">Total Feedback</h4>
                  <div className="text-3xl font-bold text-white mb-2">12,845</div>
                  <div className="text-xs text-green-400 bg-green-400/10 inline-block px-2 py-1 rounded">+12% vs last month</div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                   <h4 className="text-slate-400 text-sm font-medium mb-4">Top Issues</h4>
                   <div className="space-y-3">
                     {[
                       {name: 'Login Bug', count: 42, color: 'bg-red-500'},
                       {name: 'Slow Load', count: 28, color: 'bg-yellow-500'},
                       {name: 'UI Glitch', count: 15, color: 'bg-blue-500'}
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center text-sm text-slate-300">
                           <div className={`w-2 h-2 rounded-full ${item.color} mr-2`}></div>
                           {item.name}
                         </div>
                         <span className="text-xs font-mono text-slate-500">{item.count}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Icons Below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
           {[
             {icon: <BarIcon className="w-6 h-6"/>, title: "Sentiment Analysis"},
             {icon: <Search className="w-6 h-6"/>, title: "Keyword Extraction"},
             {icon: <Tag className="w-6 h-6"/>, title: "Feature Requests"},
             {icon: <GitMerge className="w-6 h-6"/>, title: "Version Tracking"},
           ].map((f, i) => (
             <div key={i} className="flex flex-col items-center gap-3 text-slate-400 hover:text-white transition-colors">
               <div className="p-3 bg-slate-800 rounded-full">{f.icon}</div>
               <span className="font-medium">{f.title}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
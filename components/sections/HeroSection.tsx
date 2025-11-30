import React from 'react';
import { PlayCircle, CheckCircle, BarChart3, TrendingUp, Users, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', value: 20 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 80 },
  { name: 'Fri', value: 65 },
  { name: 'Sat', value: 95 },
  { name: 'Sun', value: 120 },
];

interface HeroSectionProps {
  onNavigate?: (view: 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Get <span className="text-blue-600">Real Feedback</span>. <br />
              Build Better Products. <br />
              <span className="text-red-500">Stop Fake Reviews.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The only feedback platform that verifies every review with device-level authentication. 
              No fake reviews. No spam. Just honest insights—delivered in minutes.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm font-medium text-gray-700">
              <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> No login required</span>
              <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> 1 Device = 1 Review</span>
              <span className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> AI Spam Detection</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('signup')}>
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg" icon={<PlayCircle className="w-5 h-5" />}>
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-gray-500 pt-2">
              Trusted by 500+ developers worldwide
            </p>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="lg:col-span-2 relative">
             {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 z-10 bg-white p-3 rounded-xl shadow-xl border border-gray-100 hidden sm:block animate-bounce duration-[3000ms]">
               <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-green-600" />
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Verification Status</p>
                   <p className="font-bold text-green-600 text-sm">100% Genuine</p>
                 </div>
               </div>
            </div>

            {/* Dashboard Mockup Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-transform hover:scale-[1.02] duration-500">
              {/* Fake Window Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 flex-1">
                  trustplus.app/dashboard
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" /> Feedback Sentiment
                  </h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Live</span>
                </div>

                {/* Chart Area */}
                <div className="h-40 w-full bg-gray-50 rounded-lg overflow-hidden relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#2563EB', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium uppercase mb-1">Total Verified</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900">1,248</span>
                      <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-medium uppercase mb-1">Active Users</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-gray-900">850</span>
                      <Users className="w-4 h-4 text-orange-500 mb-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
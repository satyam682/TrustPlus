import React from 'react';
import { 
  Bot, Frown, ClipboardList, Clock, MessageSquareX, TrendingDown,
  Shield, Check, Zap, Globe, BarChart2, MousePointerClick, 
  Smartphone, Code2, LineChart
} from 'lucide-react';
import { Button } from '../ui/Button';

// --- SECTION 4: PROBLEM ---
export const ProblemSection: React.FC = () => {
  const problems = [
    { icon: <Bot className="w-8 h-8 text-red-500" />, title: "Fake Reviews", text: "Bots and fake accounts artificially boost ratings. Users can't trust what they read." },
    { icon: <Frown className="w-8 h-8 text-red-500" />, title: "Competitor Attacks", text: "Negative reviews from competitors hurt your reputation. Hard to prove malice." },
    { icon: <ClipboardList className="w-8 h-8 text-red-500" />, title: "Painful Forms", text: "Users avoid feedback due to lengthy sign-ups. Play Store only works for Android." },
    { icon: <Clock className="w-8 h-8 text-red-500" />, title: "Slow Verification", text: "Platforms like G2 take days to verify. Critical issues remain unfixed." },
    { icon: <MessageSquareX className="w-8 h-8 text-red-500" />, title: "No Spam Control", text: "Abusive comments and spam flood your reviews. No intelligent filtering." },
    { icon: <TrendingDown className="w-8 h-8 text-red-500" />, title: "Zero Insights", text: "Raw reviews give no understanding. What features do users actually want?" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Most App Reviews Are <span className="text-red-500 decoration-red-200 underline decoration-4 underline-offset-4">Broken</span></h2>
          <p className="text-xl text-gray-600">And it's hurting both users and developers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4 p-3 bg-red-50 w-fit rounded-xl">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SECTION 5: SOLUTION ---
export const SolutionSection: React.FC = () => {
  const features = [
    { icon: <Check className="w-6 h-6 text-white" />, color: "bg-green-500", title: "No Login Required", text: "Zero friction. Users leave feedback in 30 seconds." },
    { icon: <Shield className="w-6 h-6 text-white" />, color: "bg-blue-500", title: "Device-Level Verification", text: "1 Device = 1 Review. Advanced fingerprinting stops bots." },
    { icon: <Bot className="w-6 h-6 text-white" />, color: "bg-indigo-500", title: "AI Spam Detection", text: "Algorithms filter abuse and patterns automatically." },
    { icon: <Zap className="w-6 h-6 text-white" />, color: "bg-yellow-500", title: "Real-Time Insights", text: "Fix critical bugs while they are still fresh." },
    { icon: <Globe className="w-6 h-6 text-white" />, color: "bg-purple-500", title: "Universal Platform", text: "Embed anywhere: Web, SaaS, Mobile, Extensions." },
    { icon: <BarChart2 className="w-6 h-6 text-white" />, color: "bg-orange-500", title: "Deep Analytics", text: "Sentiment analysis and trend tracking powered by AI." },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Introducing TrustPlus</h2>
          <p className="text-xl text-blue-600 font-medium">Device-verified. AI-powered. Lightning fast.</p>
        </div>

        {/* Central Visual / Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SECTION 6: HOW IT WORKS ---
interface HowItWorksSectionProps {
  onNavigate?: (view: 'signup') => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate }) => {
  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Get Started in 3 Simple Steps</h2>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10"></div>

          {/* Step 1 */}
          <div className="relative bg-white p-4">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
              <MousePointerClick className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="text-xl font-bold mb-3">Create Account</h3>
            <p className="text-gray-600">Sign up in 30 seconds. No credit card required to start.</p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white p-4">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
              <Code2 className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="text-xl font-bold mb-3">Integrate Widget</h3>
            <p className="text-gray-600">Copy-paste our lightweight snippet. Works with React, Vue, HTML.</p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white p-4">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
              <LineChart className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="text-xl font-bold mb-3">Get Insights</h3>
            <p className="text-gray-600">AI analyzes feedback instantly. Watch your product improve.</p>
          </div>
        </div>

        <div className="mt-16">
          <Button size="lg" onClick={() => onNavigate && onNavigate('signup')}>Start Free Trial</Button>
        </div>
      </div>
    </section>
  );
};

// --- SECTION 8: COMPARISON ---
export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose TrustPlus?</h2>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-6 text-gray-500 font-medium">Feature</th>
                  <th className="p-6 text-blue-600 font-bold text-lg bg-blue-50/50">TrustPlus</th>
                  <th className="p-6 text-gray-500 font-medium">Play Store / G2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: "Device Verification", trust: "Advanced (1:1)", other: "None / Email only", good: true },
                  { feature: "User Login Required", trust: "No (Zero friction)", other: "Yes (Account needed)", good: true },
                  { feature: "Verification Speed", trust: "Minutes", other: "2-3 Business Days", good: true },
                  { feature: "AI Spam Detection", trust: "Real-time AI", other: "Basic / Manual", good: true },
                  { feature: "Platform Support", trust: "Universal (Web/App)", other: "Limited", good: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-medium text-gray-800">{row.feature}</td>
                    <td className="p-6 bg-blue-50/30">
                      <div className="flex items-center text-gray-800 font-bold">
                         <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                           <Check className="w-4 h-4 text-green-600" />
                         </div>
                         {row.trust}
                      </div>
                    </td>
                    <td className="p-6 text-gray-500">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                           <div className="w-3 h-0.5 bg-red-500 rotate-45 absolute"></div>
                           <div className="w-3 h-0.5 bg-red-500 -rotate-45 absolute"></div>
                        </div>
                        {row.other}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SECTION 9: BADGES ---
export const BadgeSection: React.FC = () => {
  return (
    <section className="py-20 bg-green-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
             {/* Badge Mockup */}
             <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 flex flex-col items-center justify-center text-center">
                <Shield className="w-24 h-24 text-green-500 mb-4 fill-green-100" />
                <h3 className="text-2xl font-bold text-gray-900">TrustPlus Verified</h3>
                <p className="text-gray-500 mt-2">Certified Authentic Feedback</p>
                <div className="mt-4 flex gap-1">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-2xl">★</span>)}
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Earn Trust with Verified Badges</h2>
            <p className="text-lg text-gray-600">
              Apps with consistent, genuine positive feedback receive our Verified Badge. It's a signal to users that your product quality is backed by real people, not bots.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="bg-green-200 p-1 rounded mr-3"><Check className="w-4 h-4 text-green-700"/></div>
                <span className="text-gray-700 font-medium">Build instant credibility</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-200 p-1 rounded mr-3"><Check className="w-4 h-4 text-green-700"/></div>
                <span className="text-gray-700 font-medium">Increase download conversion by 40%</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-200 p-1 rounded mr-3"><Check className="w-4 h-4 text-green-700"/></div>
                <span className="text-gray-700 font-medium">Stand out from competitors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
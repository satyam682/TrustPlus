import React from 'react';
import { BookOpen, Video, MessageCircle, Mail, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface HelpPageProps {
  onRestartOnboarding: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onRestartOnboarding }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-500 mt-2">Resources, guides, and contact support</p>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <BookOpen className="w-6 h-6 text-blue-600" />, title: "Documentation", text: "Browse our complete docs", link: "View Docs →" },
          { icon: <Video className="w-6 h-6 text-purple-600" />, title: "Video Tutorials", text: "Watch step-by-step guides", link: "Watch Now →" },
          { icon: <MessageCircle className="w-6 h-6 text-green-600" />, title: "FAQ", text: "Common questions answered", link: "Read FAQ →" },
          { icon: <Mail className="w-6 h-6 text-orange-600" />, title: "Contact Support", text: "Get help from our team", link: "Contact →" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="mb-4 bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
               {item.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.text}</p>
            <span className="text-sm font-medium text-blue-600 group-hover:underline">{item.link}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Support</h2>
           <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <Input label="Your Name" defaultValue="John Doe" />
                 <Input label="Email Address" defaultValue="john@company.com" disabled />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                 <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>General Question</option>
                    <option>Technical Issue / Bug</option>
                    <option>Billing Question</option>
                    <option>Feature Request</option>
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                 <textarea 
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y"
                   placeholder="Describe your issue in detail..."
                 ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <p className="text-xs text-gray-500">⏱️ Average response time: 2 hours</p>
                 <Button>Send Message</Button>
              </div>
           </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           {/* Popular Articles */}
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Popular Articles</h3>
              <ul className="space-y-3">
                 {[
                    "How to install the feedback widget",
                    "Understanding sentiment analysis",
                    "Exporting your feedback data",
                    "Setting up webhooks",
                    "Managing team members"
                 ].map((a, i) => (
                    <li key={i}>
                       <a href="#" className="text-sm text-blue-600 hover:underline flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span> {a}
                       </a>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Restart Onboarding */}
           <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Need a refresher?</h3>
              <p className="text-sm text-gray-500 mb-4">Restart the onboarding tour to see the platform basics again.</p>
              <Button variant="outline" className="w-full" onClick={onRestartOnboarding} icon={<RotateCcw className="w-4 h-4"/>}>
                 Restart Onboarding
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '../ui/Button';

interface FinalCTAProps {
  onNavigate?: (view: 'signup') => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-center text-white relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to Get Real Feedback?</h2>
        <p className="text-xl text-blue-100 mb-10">
          Join 500+ developers who stopped wasting time on fake reviews and started building better products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="white" size="lg" onClick={() => onNavigate && onNavigate('signup')}>Start Free Trial</Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white">Schedule a Demo</Button>
        </div>
        <div className="mt-8 flex justify-center gap-6 text-sm text-blue-200 font-medium">
          <span>✓ No credit card required</span>
          <span>✓ Setup in 2 minutes</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center text-white font-bold text-xl mb-4">
              <ShieldCheck className="w-6 h-6 mr-2 text-blue-500" />
              TrustPlus
            </div>
            <p className="text-sm text-gray-400 mb-6">Real Feedback. Real Trust. Helping developers build better products with verified insights.</p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 TrustPlus. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400">English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
import React, { useState } from 'react';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  onNavigate?: (view: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleNav = (view: 'login' | 'signup') => {
    if (onNavigate) onNavigate(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <ShieldCheck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-bold text-2xl text-gray-900 tracking-tight">TrustPlus</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm lg:text-base"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="secondary" size="sm" className="hidden lg:inline-flex" onClick={() => handleNav('login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleNav('signup')}>
              Get Started Free
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="secondary" className="w-full justify-center" onClick={() => handleNav('login')}>Sign In</Button>
              <Button variant="primary" className="w-full justify-center" onClick={() => handleNav('signup')}>Get Started Free</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
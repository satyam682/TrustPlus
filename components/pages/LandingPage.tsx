import React from 'react';
import { Navbar } from '../layout/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { SocialProof, TestimonialsSection } from '../sections/SocialSections';
import { 
  ProblemSection, 
  SolutionSection, 
  HowItWorksSection, 
  ComparisonSection, 
  BadgeSection 
} from '../sections/FeatureSections';
import { DashboardSection } from '../sections/DashboardSection';
import { PricingSection, FaqSection } from '../sections/PricingFaq';
import { Footer, FinalCTA } from '../layout/Footer';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      <main>
        <HeroSection onNavigate={onNavigate} />
        <SocialProof />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection onNavigate={onNavigate} />
        <DashboardSection />
        <ComparisonSection />
        <BadgeSection />
        <PricingSection onNavigate={onNavigate} />
        <TestimonialsSection />
        <FaqSection />
        <FinalCTA onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
};
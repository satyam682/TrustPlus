import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, ArrowRight, BarChart2, Plus, LayoutGrid, HelpCircle, CheckCircle } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to TrustPlus! 🎉",
      text: "Let's take a quick tour to help you get started. You'll learn how to add your first app and start collecting real feedback in minutes!",
      icon: <div className="text-4xl">👋</div>,
      position: "center"
    },
    {
      title: "Dashboard Overview",
      text: "This is your command center. Track total feedback, active apps, response time, and sentiment scores all in one place.",
      icon: <BarChart2 className="w-12 h-12 text-blue-600" />,
      position: "top-center" // Conceptual position
    },
    {
      title: "Add Your First App",
      text: "Ready to start? Click the 'New App' button to get your unique integration snippet.",
      icon: <Plus className="w-12 h-12 text-blue-600" />,
      position: "top-right"
    },
    {
      title: "Sidebar Navigation",
      text: "Access your Apps, Feedback, Analytics, and Settings from the main sidebar menu.",
      icon: <LayoutGrid className="w-12 h-12 text-blue-600" />,
      position: "center-left"
    },
    {
      title: "We're Here to Help!",
      text: "Need assistance? Check our docs or contact support anytime. You can restart this tour from Settings.",
      icon: <HelpCircle className="w-12 h-12 text-blue-600" />,
      position: "bottom-left"
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all duration-300 scale-100">
        <button 
          onClick={onComplete} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            {currentStep.icon}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {currentStep.title}
          </h3>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {currentStep.text}
          </p>

          <div className="flex items-center justify-between w-full">
            <div className="text-sm font-medium text-gray-400">
              Step {step + 1} of {steps.length}
            </div>
            
            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button variant="primary" onClick={handleNext}>
                {isLastStep ? "Finish Tour" : "Next"}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
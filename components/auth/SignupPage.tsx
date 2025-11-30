import React, { useState } from 'react';
import { ShieldCheck, Check, Github, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { registerUser } from '../../services/auth';
import { initializeUserData } from '../../services/firestore';

interface SignupPageProps {
  onNavigate: (view: 'login' | 'dashboard' | 'landing') => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setFirebaseError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.length < 2) newErrors.name = "Please enter your full name";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.agree) newErrors.agree = "You must accept the terms to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setFirebaseError(null);

    try {
      // Register user with Firebase
      const result = await registerUser(formData.email, formData.password, formData.name);

      if (result.error) {
        setFirebaseError(result.error);
        setIsLoading(false);
        return;
      }

      // Initialize user data in Firestore
      if (result.user) {
        await initializeUserData(result.user.uid, {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          jobTitle: '',
          photoUrl: null
        });

        // Success - navigate to dashboard
        setIsLoading(false);
        onNavigate('dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFirebaseError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-20 w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
          <ShieldCheck className="h-8 w-8 text-blue-600 mr-2" />
          <span className="font-bold text-2xl text-gray-900 tracking-tight">TrustPlus</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600 mr-2">Already have an account?</span>
          <button onClick={() => onNavigate('login')} className="text-blue-600 font-medium hover:underline">Sign In</button>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Left Panel (Desktop) */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-center px-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 max-w-md">
            <ShieldCheck className="w-16 h-16 mb-8 text-blue-100" />
            <h2 className="text-4xl font-bold mb-6">Real Feedback.<br />Real Trust.</h2>
            <div className="space-y-4">
              {[
                "Get real feedback in minutes",
                "No fake reviews, ever",
                "AI-powered insights",
                "Works on any platform"
              ].map((item, i) => (
                <div key={i} className="flex items-center text-lg">
                  <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center mr-3">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600 mb-8">Start getting real feedback in 2 minutes</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Google
              </button>
              <button className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Firebase Error Alert */}
            {firebaseError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-medium">{firebaseError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name *"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Input
                label="Email Address *"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Company Name (optional)"
                name="company"
                placeholder="Your Company"
                value={formData.company}
                onChange={handleChange}
              />
              <Input
                label="Password *"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Input
                label="Confirm Password *"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agree" className="font-medium text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                  {errors.agree && <p className="text-red-600 mt-1">{errors.agree}</p>}
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">🔒 Your data is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
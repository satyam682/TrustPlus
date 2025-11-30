
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, Globe, Smartphone, Monitor, Puzzle, Cloud, Lock, Copy, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PlatformType = 'web' | 'android' | 'ios' | 'desktop' | 'extension' | 'saas';

export const NewAppModal: React.FC<NewAppModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addApp, apps } = useData();
  const [step, setStep] = useState<'form' | 'install'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    platform: '' as PlatformType,
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.length < 3) newErrors.name = "App name must be at least 3 characters";
    if (!formData.url) newErrors.url = "Please enter a valid URL";
    else if (!/^https?:\/\//.test(formData.url)) newErrors.url = "URL must start with https:// or http://";
    if (!formData.platform) newErrors.platform = "Please select a platform type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Generate the app ID upfront (matching the logic in DataContext)
      const newAppId = `app_${Date.now()}`;

      // Add App to Firebase (with timeout to prevent hanging)
      const addAppPromise = addApp({
        name: formData.name,
        url: formData.url,
        platform: formData.platform === 'extension' ? 'Extension' : formData.platform === 'ios' ? 'iOS App' : formData.platform === 'android' ? 'Android App' : formData.platform === 'desktop' ? 'Desktop App' : 'Web App',
        description: formData.description
      }, newAppId);

      // Timeout after 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      await Promise.race([addAppPromise, timeoutPromise]);

      // Store the created app ID for the feedback link
      setCreatedAppId(newAppId);
      setStep('install');
    } catch (error) {
      console.error('Error adding app:', error);
      alert('Error adding app. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use the stored app ID to generate the feedback link
  const feedbackLink = createdAppId ? `${window.location.origin}?view=feedback&appId=${createdAppId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(feedbackLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTestIntegration = () => {
    if (feedbackLink) {
      window.open(feedbackLink, '_blank');
    }
  };

  const handleClose = () => {
    onSuccess();
    onClose();
    setTimeout(() => {
      setStep('form');
      setFormData({ name: '', url: '', platform: '' as PlatformType, description: '' });
      setCreatedAppId(null);
    }, 300);
  };

  const platforms: { id: PlatformType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: 'web', label: 'Web App', desc: 'Website or web application', icon: <Globe className="w-8 h-8 text-blue-500" />, color: 'hover:border-blue-500 hover:bg-blue-50' },
    { id: 'android', label: 'Android App', desc: 'Native Android application', icon: <Smartphone className="w-8 h-8 text-green-500" />, color: 'hover:border-green-500 hover:bg-green-50' },
    { id: 'ios', label: 'iOS App', desc: 'Native iPhone/iPad app', icon: <Smartphone className="w-8 h-8 text-gray-800" />, color: 'hover:border-gray-500 hover:bg-gray-50' },
    { id: 'desktop', label: 'Desktop App', desc: 'Windows, Mac, or Linux', icon: <Monitor className="w-8 h-8 text-purple-500" />, color: 'hover:border-purple-500 hover:bg-purple-50' },
    { id: 'extension', label: 'Browser Ext', desc: 'Chrome, Firefox, etc.', icon: <Puzzle className="w-8 h-8 text-orange-500" />, color: 'hover:border-orange-500 hover:bg-orange-50' },
    { id: 'saas', label: 'SaaS Platform', desc: 'Cloud-based software', icon: <Cloud className="w-8 h-8 text-blue-400" />, color: 'hover:border-blue-400 hover:bg-blue-50' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4 animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              {step === 'form' ? <Cloud className="w-6 h-6 text-blue-600" /> : <CheckCircle className="w-6 h-6 text-green-600" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{step === 'form' ? 'Add New App' : 'App Created!'}</h2>
              <p className="text-sm text-gray-500">{step === 'form' ? 'Connect your app to start receiving feedback' : 'Share this link to get feedback'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {step === 'form' ? (
            <div className="space-y-6">
              <Input
                label="App Name *"
                name="name"
                placeholder="My Awesome App"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                helperText="This name will appear on your feedback form"
              />

              <Input
                label="App URL *"
                name="url"
                placeholder="https://myapp.com"
                value={formData.url}
                onChange={handleInputChange}
                error={errors.url}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Platform Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setFormData({ ...formData, platform: p.id });
                        if (errors.platform) setErrors({ ...errors, platform: '' });
                      }}
                      className={`
                        border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                        ${formData.platform === p.id
                          ? 'border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-600'
                          : `border-gray-200 bg-white ${p.color}`
                        }
                      `}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        {p.icon}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{p.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.platform && <p className="mt-2 text-sm text-red-600 font-medium">❌ {errors.platform}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Description (optional)</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 h-24 resize-y"
                  placeholder="Brief description of what your app does..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Unique Feedback Link</h3>
                <p className="text-sm text-gray-600 mb-4">Share this link with your users to start collecting feedback instantly. The form will feature your app name.</p>

                <div className="relative">
                  <pre className="bg-white border border-gray-200 text-gray-700 p-4 rounded-lg text-sm overflow-x-auto break-all pr-12">
                    {feedbackLink}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title="Copy Link"
                  >
                    {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Test Your Form</h3>
                <p className="text-sm text-gray-600 mb-4">Click below to open your new feedback form in a new tab.</p>
                <Button variant="outline" icon={<ExternalLink className="w-4 h-4" />} onClick={handleTestIntegration}>
                  Open Feedback Form
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Lock className="w-3 h-3 mr-1" />
            Your app data is secure
          </div>

          <div className="flex gap-3">
            {step === 'form' ? (
              <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Creating app...' : 'Add App'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={handleClose}>Done</Button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

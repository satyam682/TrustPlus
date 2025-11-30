
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, Send, CheckCircle, Smartphone, Globe, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { detectFakeReview, FakeReviewDetectionResult } from '../../services/cohere';
import { checkInappropriateContent } from '../../utils/profanityFilter';
import { loadPublicApp, savePublicFeedback, savePublicFlaggedFeedback } from '../../services/firestore';
import { AppData } from '../context/DataContext';

interface FeedbackFormPageProps {
   appId: string | null;
   onGoHome: () => void;
}

export const FeedbackFormPage: React.FC<FeedbackFormPageProps> = ({ appId, onGoHome }) => {
   const [app, setApp] = useState<AppData | null>(null);
   const [appLoading, setAppLoading] = useState(true);
   const [rating, setRating] = useState(0);
   const [content, setContent] = useState('');
   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isReviewing, setIsReviewing] = useState(false);
   const [detectionResult, setDetectionResult] = useState<FakeReviewDetectionResult | null>(null);
   const [contentWarning, setContentWarning] = useState<{ severity: 'none' | 'mild' | 'severe'; message: string }>({ severity: 'none', message: '' });

   // Load app from Firebase (PUBLIC - NO AUTH REQUIRED)
   useEffect(() => {
      async function fetchApp() {
         if (!appId) {
            setAppLoading(false);
            return;
         }

         const appData = await loadPublicApp(appId);
         setApp(appData);
         setAppLoading(false);
      }

      fetchApp();
   }, [appId]);

   // Show loading while fetching app
   if (appLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
               <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-600 font-medium">Loading feedback form...</p>
            </div>
         </div>
      );
   }

   if (!app) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-red-500" />
               </div>
               <h2 className="text-xl font-bold text-gray-900 mb-2">App Not Found</h2>
               <p className="text-gray-500 mb-6">The feedback form you are looking for does not exist or has been removed.</p>
               <Button onClick={onGoHome}>Go to Home</Button>
            </div>
         </div>
      );
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) return;

      setIsLoading(true);
      setIsReviewing(true);
      setDetectionResult(null);

      try {
         // Comprehensive AI Fake Review Detection
         const reviewCheck = await detectFakeReview(content, rating);
         setDetectionResult(reviewCheck);
         setIsReviewing(false);

         if (reviewCheck.isFake) {
            // Review is FAKE - Save to flagged collection (PUBLIC)
            await savePublicFlaggedFeedback(app.id, {
               id: Date.now(),
               appId: app.id,
               appName: app.name,
               user: email ? email.split('@')[0] : 'Anonymous User',
               email: email,
               content: content,
               rating: rating,
               detectionReason: reviewCheck.primaryReason,
               detectedIssues: reviewCheck.detectedIssues,
               confidence: reviewCheck.confidence,
               category: reviewCheck.category as 'suspicious' | 'fake',
               timestamp: new Date().toISOString(),
               time: "Just now",
               sentiment: 'negative',
               tags: ["Flagged", "AI-Detected"],
               isVerified: false
            });

            setIsLoading(false);
            return; // User will see detailed error message
         }

         // Review is CLEAN - Submit to Firebase (PUBLIC)
         const feedbackData = {
            id: Date.now(),
            appId: app.id,
            appName: app.name,
            user: email ? email.split('@')[0] : 'Anonymous User',
            email: email,
            content: content,
            rating: rating,
            timestamp: new Date().toISOString(),
            time: "Just now",
            sentiment: rating >= 4 ? 'positive' as const : rating <= 2 ? 'negative' as const : 'neutral' as const,
            tags: ["New"],
            isVerified: true
         };

         const success = await savePublicFeedback(app.id, feedbackData);

         if (!success) {
            setIsLoading(false);
            setDetectionResult({
               isFake: false,
               confidence: 0,
               detectedIssues: [],
               primaryReason: 'Error saving feedback',
               category: 'clean',
               details: 'Please try again'
            });
            return;
         }

         setIsLoading(false);
         setSubmitted(true);
      } catch (error) {
         console.error('Error submitting feedback:', error);
         setIsLoading(false);
         setIsReviewing(false);
         setDetectionResult({
            isFake: false,
            confidence: 0,
            detectedIssues: [],
            primaryReason: 'System error, feedback accepted',
            category: 'clean',
            details: 'An error occurred but your feedback was accepted'
         });
      }
   };

   // Real-time profanity check as user types
   useEffect(() => {
      if (!content || content.trim().length === 0) {
         setContentWarning({ severity: 'none', message: '' });
         return;
      }

      const check = checkInappropriateContent(content);
      if (check.hasInappropriate) {
         setContentWarning({ severity: check.severity, message: check.warning });
      } else {
         setContentWarning({ severity: 'none', message: '' });
      }
   }, [content]);

   if (submitted) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-in zoom-in-95 duration-300">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-green-100">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
               <p className="text-gray-600 mb-6">Your feedback for <span className="font-semibold text-gray-900">{app.name}</span> has been securely recorded.</p>
               <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Verified & Protected
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4 sm:p-6">

         <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl ${app.iconBg} flex items-center justify-center text-2xl font-bold shadow-lg mb-4 text-white`}>
                     {app.name[0]}
                  </div>
                  <h1 className="text-2xl font-bold">{app.name}</h1>
                  <p className="text-slate-400 text-sm mt-1">We value your honest feedback</p>
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">

               {/* Under Review Loading State */}
               {isReviewing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                     <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                     <div>
                        <h4 className="font-semibold text-blue-900 mb-1">🔍 Your feedback is under review...</h4>
                        <p className="text-sm text-blue-700">Our AI is checking for spam, fake reviews, and inappropriate content.</p>
                     </div>
                  </div>
               )}

               {/* Fake Review Detection Result */}
               {detectionResult && detectionResult.isFake && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-200">
                     <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                     <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-1">❌ Feedback Flagged - Cannot Submit</h4>
                        <p className="text-sm text-red-700 mb-2">{detectionResult.primaryReason}</p>
                        {detectionResult.detectedIssues.length > 0 && (
                           <div className="mt-2">
                              <p className="text-xs font-medium text-red-800 mb-1">Detected issues:</p>
                              <div className="flex flex-wrap gap-1">
                                 {detectionResult.detectedIssues.map((issue, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                       {issue}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}
                        <p className="text-xs text-red-600 mt-2">💡 Please revise your feedback and try again.</p>
                     </div>
                  </div>
               )}

               {/* Success Message for Clean Reviews */}
               {detectionResult && !detectionResult.isFake && !submitted && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-200">
                     <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                     <div>
                        <h4 className="font-semibold text-green-900 mb-1">✅ Feedback Verified & Submitted!</h4>
                        <p className="text-sm text-green-700">Thank you for your genuine feedback!</p>
                     </div>
                  </div>
               )}

               {/* Real-time Content Warning */}
               {contentWarning.severity !== 'none' && (
                  <div className={`rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-200 ${contentWarning.severity === 'severe'
                     ? 'bg-red-50 border border-red-200'
                     : 'bg-yellow-50 border border-yellow-200'
                     }`}>
                     {contentWarning.severity === 'severe' ? (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                     ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                     )}
                     <div>
                        <h4 className={`font-semibold mb-1 ${contentWarning.severity === 'severe' ? 'text-red-900' : 'text-yellow-900'
                           }`}>
                           {contentWarning.severity === 'severe' ? 'Inappropriate Language Detected' : 'Content Warning'}
                        </h4>
                        <p className={`text-sm ${contentWarning.severity === 'severe' ? 'text-red-700' : 'text-yellow-700'
                           }`}>
                           {contentWarning.message}
                        </p>
                     </div>
                  </div>
               )}

               {/* Rating */}
               <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">How would you rate your experience?</label>
                  <div className="flex justify-center gap-2">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <button
                           key={star}
                           type="button"
                           onClick={() => setRating(star)}
                           className={`transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                        >
                           <Star className="w-8 h-8 fill-current" />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Text Area */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more (optional)</label>
                  <textarea
                     className={`w-full px-4 py-3 rounded-xl border ${contentWarning.severity === 'severe'
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : contentWarning.severity === 'mild'
                           ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500'
                           : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                        } min-h-[120px] resize-y bg-gray-50 transition-colors`}
                     placeholder="What did you like? What can we improve?"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                  {contentWarning.severity !== 'none' && (
                     <p className={`text-xs mt-1 ${contentWarning.severity === 'severe' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                        💡 Please use respectful language for better feedback quality
                     </p>
                  )}
               </div>

               {/* Email */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                  <input
                     type="email"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>

               <div className="pt-2">
                  <Button
                     type="submit"
                     className="w-full h-12 text-lg shadow-blue-500/25"
                     disabled={rating === 0 || isLoading || isReviewing || contentWarning.severity === 'severe' || (detectionResult?.isFake)}
                     icon={isReviewing ? <Loader2 className="w-5 h-5 animate-spin" /> : !isLoading ? <Send className="w-5 h-5" /> : undefined}
                  >
                     {isReviewing ? 'Checking Review...' : isLoading ? 'Submitting...' : contentWarning.severity === 'severe' ? 'Cannot Submit - Please Edit' : detectionResult?.isFake ? 'Review Flagged - Edit Required' : 'Submit Feedback'}
                  </Button>
                  {contentWarning.severity === 'severe' && (
                     <p className="text-xs text-center text-red-600 mt-2">
                        Remove inappropriate content to submit your feedback
                     </p>
                  )}
                  {detectionResult?.isFake && (
                     <p className="text-xs text-center text-red-600 mt-2">
                        Your feedback was flagged. Please make changes and try again.
                     </p>
                  )}
               </div>

               <div className="text-center">
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                     Powered by <span className="font-bold text-gray-600">TrustPlus</span> <ShieldCheck className="w-3 h-3" />
                  </p>
               </div>
            </form>
         </div>
      </div>
   );
};

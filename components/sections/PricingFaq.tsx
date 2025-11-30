import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Check, Plus, Minus } from 'lucide-react';

// --- PRICING ---
interface PricingSectionProps {
  onNavigate?: (view: 'signup') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-lg">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 transition-colors">
            <h3 className="text-xl font-bold text-gray-900">Free</h3>
            <div className="my-4">
              <span className="text-4xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Perfect for getting started.</p>
            <Button variant="outline" className="w-full mb-8" onClick={() => onNavigate && onNavigate('signup')}>Start Free</Button>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> 100 feedbacks/mo</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Device verification</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Basic AI filtering</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Single app</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="p-8 bg-white border-2 border-blue-600 rounded-2xl relative shadow-xl transform md:-translate-y-4">
            <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-2">Pro</h3>
            <div className="my-4">
              <span className="text-4xl font-extrabold text-gray-900">$19</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For growing products.</p>
            <Button variant="primary" className="w-full mb-8" onClick={() => onNavigate && onNavigate('signup')}>Start Free Trial</Button>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> 2,000 feedbacks/mo</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Advanced AI insights</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Sentiment analysis</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Up to 5 apps</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> CSV Data Export</li>
            </ul>
          </div>

          {/* Business Tier */}
          <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 transition-colors">
            <h3 className="text-xl font-bold text-gray-900">Business</h3>
            <div className="my-4">
              <span className="text-4xl font-extrabold text-gray-900">$49</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For serious teams.</p>
            <Button variant="outline" className="w-full mb-8">Contact Sales</Button>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Unlimited feedbacks</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Unlimited apps</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> Team collaboration</li>
              <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> API & Webhooks</li>
            </ul>
          </div>
        </div>
        
        <p className="text-center text-sm text-blue-600 font-medium mt-8 bg-blue-50 py-2 px-4 rounded-full w-fit mx-auto">
          🎉 Special Launch Offer: First 6 months at 50% off for early adopters!
        </p>
      </div>
    </section>
  );
};

// --- FAQ ---
export const FaqSection: React.FC = () => {
  const faqs = [
    { q: "How does device verification work?", a: "We use advanced browser fingerprinting technology to create a unique identifier for each device without collecting personal data. This ensures one device = one review." },
    { q: "Do users need to create an account?", a: "No! Users can leave feedback in 30 seconds without any login, email, or signup. This dramatically increases response rates." },
    { q: "How long does verification take?", a: "Verification is real-time. Unlike competitors that take days, our AI validates feedback instantly so you can act immediately." },
    { q: "What platforms does TrustPlus work with?", a: "Everything. Android, iOS, React, Vue, HTML, Chrome Extensions, and desktop apps. Just embed our snippet." },
    { q: "Can I export my data?", a: "Yes, Pro and Business plans include full CSV export capabilities so you can analyze data in your own tools." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                {openIndex === i ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-gray-400" />}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Quote } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Trusted by developers at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Placeholder Logos using simple text for cleanliness */}
            <span className="text-xl font-bold text-gray-800">ACME Corp</span>
            <span className="text-xl font-bold text-gray-800">TechFlow</span>
            <span className="text-xl font-bold text-gray-800">DevScale</span>
            <span className="text-xl font-bold text-gray-800">NextGen</span>
            <span className="text-xl font-bold text-gray-800">CloudSystems</span>
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Raj Patel",
      role: "Founder, TaskFlow",
      quote: "TrustPlus helped us identify and fix a critical bug within 2 hours of launch. The real-time feedback is a game-changer.",
      img: "https://picsum.photos/100/100?random=1"
    },
    {
      name: "Sarah Chen",
      role: "Product Manager, CloudSync",
      quote: "No more fake reviews destroying our rating. Device verification actually works. Our users trust us more now.",
      img: "https://picsum.photos/100/100?random=2"
    },
    {
      name: "Mike Johnson",
      role: "Solo Dev, CodeHelper",
      quote: "Finally, a review platform that doesn't require my users to create accounts. Response rates went up 300%!",
      img: "https://picsum.photos/100/100?random=3"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Loved by Developers Worldwide</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl relative hover:shadow-lg transition-shadow">
              <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6" />
              <p className="text-gray-700 italic mb-6 relative z-10">"{t.quote}"</p>
              <div className="flex items-center">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
              <div className="flex mt-4 text-yellow-400 text-sm">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
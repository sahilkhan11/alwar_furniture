'use client';

import { FadeInReveal } from '@/components/ui/FadeInReveal';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, MH",
      text: "The teak dining table we ordered is absolutely stunning. You can feel the quality in the weight of the wood. The delivery was seamless and the team assembled it perfectly.",
      rating: 5
    },
    {
      name: "Rahul Desai",
      location: "Delhi, NCR",
      text: "I was hesitant to buy furniture online without seeing it, but Alwar Furniture exceeded my expectations. The craftsmanship on the wardrobe is flawless. True artisans.",
      rating: 5
    },
    {
      name: "Anita Menon",
      location: "Bangalore, KA",
      text: "Beautiful design that perfectly balances traditional Indian woodwork with modern sensibilities. The bed frame is sturdy and doesn't creak at all. Worth every rupee.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      location: "Jaipur, RJ",
      text: "As someone from Rajasthan, I know good woodwork when I see it. They have maintained the authentic Alwar style while providing excellent customer service.",
      rating: 4
    }
  ];

  return (
    <div className="py-20 bg-brand-dark min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4">
        <FadeInReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-light mb-6">What Our Customers Say</h1>
            <div className="w-24 h-1 bg-brand-accent mx-auto mb-8"></div>
          </div>
        </FadeInReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <FadeInReveal key={idx} delay={idx * 0.1} direction="up">
              <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                <div className="flex text-brand-accent mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-brand-light/90 text-lg italic mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-white font-bold">{t.name}</p>
                  <p className="text-brand-light/60 text-sm">{t.location}</p>
                </div>
              </div>
            </FadeInReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

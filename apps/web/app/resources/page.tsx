'use client';

import { FadeInReveal } from '@/components/ui/FadeInReveal';
import { Button } from '@/components/ui/Button';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Wood Care Guide',
      description: 'Learn how to maintain the natural beauty of your teak and rosewood furniture across different seasons.',
      icon: '🌿'
    },
    {
      title: 'Assembly Instructions',
      description: 'Download PDF guides for assembling our modular pieces safely and securely.',
      icon: '🔧'
    },
    {
      title: 'Warranty Information',
      description: 'Everything you need to know about our 5-year structural warranty and claims process.',
      icon: '🛡️'
    },
    {
      title: 'Sustainability Report',
      description: 'Read about our commitment to ethical sourcing and reducing our carbon footprint.',
      icon: '♻️'
    }
  ];

  return (
    <div className="py-20 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4">
        <FadeInReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Customer Resources</h1>
            <p className="text-lg text-slate-600">
              Everything you need to care for your furniture and understand our processes.
            </p>
          </div>
        </FadeInReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((resource, idx) => (
            <FadeInReveal key={idx} delay={idx * 0.1} direction="up">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className="text-4xl bg-brand-accent/10 w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                  {resource.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{resource.title}</h3>
                  <p className="text-slate-600 mb-4">{resource.description}</p>
                  <Button variant="outline">View Guide</Button>
                </div>
              </div>
            </FadeInReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

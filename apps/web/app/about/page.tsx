'use client';

import { FadeInReveal } from '@/components/ui/FadeInReveal';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <FadeInReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Our Story</h1>
            <div className="w-24 h-1 bg-brand-accent mx-auto mb-8"></div>
            <p className="text-lg text-slate-600">
              Rooted in the royal city of Alwar, we bring generations of woodworking heritage into modern homes. 
              Our mission is to create furniture that isn't just used, but loved and passed down.
            </p>
          </div>
        </FadeInReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <FadeInReveal direction="right">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1601229712079-cdb33703c737?auto=format&fit=crop&q=80" 
                alt="Craftsman working" 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
          </FadeInReveal>
          
          <FadeInReveal direction="left" delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-brand-dark">The Heritage of Handcrafted</h2>
              <p className="text-slate-600 leading-relaxed">
                In an era of mass-produced, flat-pack furniture, we chose a different path. Every piece of Alwar Furniture is built by master artisans who have spent their lives perfecting the art of joinery, carving, and finishing.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We source only the finest, ethically harvested Indian rosewood (Sheesham), Teak, and Mango wood. By overseeing the entire process from timber selection to final polish, we ensure unmatched quality.
              </p>
            </div>
          </FadeInReveal>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { ProductCard, Product } from '../components/ui/ProductCard';
import { FadeInReveal } from '../components/ui/FadeInReveal';
import { HeroSlider } from '../components/ui/HeroSlider';
import { CategorySlider } from '../components/ui/CategorySlider';
import { ResourceSlider } from '../components/ui/ResourceSlider';
import { Truck, ShieldCheck, CreditCard, Clock, Hammer, Leaf } from 'lucide-react';
import { Metadata } from 'next';
import { isCategoryHidden } from '@/lib/hidden-categories';

export const metadata: Metadata = {
  title: 'Buy Furniture in Alwar | Premium Wooden Furniture | Alwar Furniture',
  description: 'Shop the best premium wooden furniture in Alwar. Find top-quality sofas, beds, dining tables, wardrobes, and office furniture at Alwar Furniture store. Free local delivery.',
  keywords: 'Alwar furniture, best furniture in Alwar, wooden furniture Alwar, furniture store Alwar, premium furniture, sofa set Alwar, dining table Alwar, wooden almirah',
};

export default async function Home() {
  const [categories, bestSellersData, newArrivalsData, recentProducts, sliders, resources, settings] = await Promise.all([
    fetch('https://alwarfurniture.in/api/categories', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/products?isBestSeller=true&limit=8', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/products?isNewLaunch=true&limit=8', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/products?limit=8', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/sliders', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/resources?limit=10', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
    fetch('https://alwarfurniture.in/api/settings', { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : {}) as Promise<any>
  ]);

  const mapProducts = (data: any[]) => Array.isArray(data) ? data.map(product => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    images: Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? JSON.parse(product.images) : [])
  })) : [];

  // Fallbacks if flags aren't used much yet
  const bestSellers = bestSellersData.length > 0 ? mapProducts(bestSellersData).slice(0, 8) : mapProducts(recentProducts.slice(0, 4));
  const newArrivals = newArrivalsData.length > 0 ? mapProducts(newArrivalsData).slice(0, 8) : mapProducts(recentProducts.slice(4, 8));

  const businessPhone = settings.phone || '+91-9999999999';
  const businessAddress = settings.address || 'Alwar, Rajasthan';


  return (
    <main className="min-h-screen">
      <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <HeroSlider sliders={sliders} />

      {/* Trust / Offer Strip */}
      <section className="bg-brand-dark text-white py-4 w-full overflow-hidden border-b-4 border-brand-accent">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm md:text-base font-medium">
          {settings.trustStripText || 'Free Delivery on Orders Rs 50,000+ | 1 Year Warranty | No Cost EMI Available'}
        </div>
      </section>

      {/* SEO Introduction */}
      <section className="pt-12 px-4 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Welcome to Alwar Furniture</h1>
        <p className="text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          Looking to buy premium furniture in Alwar? We are the leading manufacturer and retailer of high-quality wooden furniture, specializing in luxury <strong>sofa sets, wooden double beds, elegant dining tables, spacious wardrobes (almirahs), and modern office furniture</strong>. Whether you need bespoke furniture for your new home or commercial office setup, Alwar Furniture offers the best prices, unmatched durability, and free local delivery across Alwar and nearby cities like Bhiwadi, Rajgarh, and Kishangarh Bas.
        </p>
      </section>

      {/* Shop By Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <CategorySlider categories={Array.isArray(categories) ? categories.filter((c: any) => !isCategoryHidden(c.name)) : []} />
      </section>

      {/* Horizontal Rail: New Arrivals */}
      <section className="py-12 px-4 w-full bg-slate-50">
        <div className="max-w-7xl mx-auto w-full">
          <FadeInReveal direction="up">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-1">New Arrivals</h2>
                <p className="text-gray-500 text-sm">Discover our latest premium additions.</p>
              </div>
              <Link href="/products?new=true" className="text-brand-dark font-medium hover:text-brand-accent transition-colors text-sm underline-offset-4 hover:underline">
                View All
              </Link>
            </div>
          </FadeInReveal>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-6 snap-x -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
            {newArrivals.map((product, idx) => (
              <FadeInReveal key={product.id + '-new'} delay={0.05 * idx} className="min-w-[280px] lg:min-w-0 snap-start flex-shrink-0">
                <ProductCard product={product} />
              </FadeInReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Rail: Best Sellers */}
      <section className="py-16 px-4 w-full bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <FadeInReveal direction="up">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-1">Best Sellers</h2>
                <p className="text-gray-500 text-sm">Our most loved furniture pieces.</p>
              </div>
              <Link href="/products?bestseller=true" className="text-brand-dark font-medium hover:text-brand-accent transition-colors text-sm underline-offset-4 hover:underline">
                View All
              </Link>
            </div>
          </FadeInReveal>

          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-6 snap-x -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
            {bestSellers.map((product, idx) => (
              <FadeInReveal key={product.id + '-bs'} delay={0.05 * idx} className="min-w-[280px] lg:min-w-0 snap-start flex-shrink-0">
                <ProductCard product={product} />
              </FadeInReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-50 text-neutral-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeInReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-brand-dark">Why Choose Alwar Furniture?</h2>
          </FadeInReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeInReveal delay={0.2} direction="left">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 text-brand-accent">
                <Hammer size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-dark">Master Craftsmanship</h3>
              <p className="text-neutral-600">Every piece is hand-carved by artisans with decades of experience working with premium woods.</p>
            </FadeInReveal>
            <FadeInReveal delay={0.4} direction="up">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 text-brand-accent">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-dark">Sustainably Sourced</h3>
              <p className="text-neutral-600">We use only ethically harvested Teak, Rosewood, and Mango wood to protect our environment.</p>
            </FadeInReveal>
            <FadeInReveal delay={0.6} direction="right">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 text-brand-accent">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-dark">Free Nationwide Delivery</h3>
              <p className="text-neutral-600">Enjoy complimentary white-glove delivery and assembly across India on all major orders.</p>
            </FadeInReveal>
          </div>
        </div>
      </section>

      {/* Resources Slider */}
      <ResourceSlider resources={resources || []} />

      {/* About Section */}
      <section className="py-20 px-4 w-full bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <FadeInReveal direction="left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">
                {settings.aboutUsTitle || 'About Alwar Furniture'}
              </h2>
              <div className="text-neutral-600 mb-8 leading-relaxed whitespace-pre-wrap">
                {settings.aboutUsContent || 'Welcome to Alwar Furniture, where craftsmanship meets elegance. For over two decades, we have been dedicated to providing our customers with premium, handcrafted wooden furniture that stands the test of time.\n\nLocated in the heart of Alwar, our master artisans use sustainably sourced Teak, Rosewood, and Mango wood to create pieces that bring warmth and character to your home. Whether you are looking for a modern design or a classic heirloom, we have something perfect for every space.'}
              </div>
              <Link href="/about">
                <Button variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-colors">
                  Read Our Story
                </Button>
              </Link>
            </FadeInReveal>
          </div>
          <div className="md:w-1/2 w-full">
            <FadeInReveal direction="right">
              <div className="relative h-80 md:h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80" 
                  alt="Alwar Furniture Workshop" 
                  fill 
                  className="object-cover"
                />
              </div>
            </FadeInReveal>
          </div>
        </div>
      </section>
    </div>
    </main>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { ProductCard, Product } from '../components/ui/ProductCard';
import { FadeInReveal } from '../components/ui/FadeInReveal';

import { prisma } from '@alwarfurniture/db';

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 4,
    include: {
      category: {
        select: { name: true }
      }
    }
  });

  const featuredProducts = products.map(product => ({
    ...product,
    price: Number(product.price),
    images: product.images ? JSON.parse(product.images as string) : []
  }));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Premium Furniture"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <FadeInReveal direction="down" delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Handcrafted Perfection for Your Home
            </h1>
          </FadeInReveal>
          
          <FadeInReveal direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow">
              Discover premium, sustainably sourced wooden furniture made by master artisans in Alwar. Built to last generations.
            </p>
          </FadeInReveal>

          <FadeInReveal direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">Shop Now</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-brand-dark">
                  Our Story
                </Button>
              </Link>
            </div>
          </FadeInReveal>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <FadeInReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Featured Collections</h2>
            <div className="w-24 h-1 bg-brand-accent mx-auto"></div>
          </div>
        </FadeInReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, idx) => (
            <FadeInReveal key={product.id} delay={0.1 * idx}>
              <ProductCard product={product} />
            </FadeInReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="secondary" size="lg">View All Products</Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-dark text-brand-light py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeInReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16">Why Choose Alwar Furniture?</h2>
          </FadeInReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeInReveal delay={0.2} direction="left">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🪓</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-accent">Master Craftsmanship</h3>
              <p className="text-brand-light/80">Every piece is hand-carved by artisans with decades of experience working with premium woods.</p>
            </FadeInReveal>
            <FadeInReveal delay={0.4} direction="up">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🌲</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-accent">Sustainably Sourced</h3>
              <p className="text-brand-light/80">We use only ethically harvested Teak, Rosewood, and Mango wood to protect our environment.</p>
            </FadeInReveal>
            <FadeInReveal delay={0.6} direction="right">
              <div className="bg-brand-accent/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-brand-accent">Free Nationwide Delivery</h3>
              <p className="text-brand-light/80">Enjoy complimentary white-glove delivery and assembly across India on all major orders.</p>
            </FadeInReveal>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FadeInReveal } from '@/components/ui/FadeInReveal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const addToCart = useStore((state) => state.addToCart);
  
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80'];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: images[0]
    });
    alert('Added to cart!');
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Image Gallery */}
        <FadeInReveal direction="right">
          <div className="space-y-4">
            <div className="relative h-[400px] md:h-[600px] bg-slate-100 rounded-lg overflow-hidden group">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx+1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeInReveal>

        {/* Product Details */}
        <FadeInReveal direction="left" delay={0.2}>
          <div className="flex flex-col h-full">
            <p className="text-sm text-brand-accent font-semibold tracking-wider uppercase mb-2">
              {product.category?.name || 'Furniture'}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">{product.name}</h1>
            <p className="text-2xl font-medium text-slate-800 mb-8">₹{product.price}</p>
            
            <div className="space-y-6 mb-12">
              {/* Description Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button 
                  onClick={() => toggleAccordion('description')} 
                  className="w-full flex justify-between items-center text-left py-2"
                >
                  <h3 className="text-lg font-bold text-brand-dark font-serif">Description</h3>
                  {openAccordion === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openAccordion === 'description' && (
                  <div className="mt-4 prose prose-slate text-slate-600">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* Materials Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button 
                  onClick={() => toggleAccordion('materials')} 
                  className="w-full flex justify-between items-center text-left py-2"
                >
                  <h3 className="text-lg font-bold text-brand-dark font-serif">Materials & Care</h3>
                  {openAccordion === 'materials' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openAccordion === 'materials' && (
                  <div className="mt-4 text-slate-600 space-y-2">
                    <p>• Handcrafted from 100% solid, sustainably sourced wood.</p>
                    <p>• Natural oil and wax finish.</p>
                    <p>• Wipe clean with a soft, dry cloth. Avoid chemical cleaners.</p>
                  </div>
                )}
              </div>

              {/* Shipping Accordion */}
              <div className="border-b border-slate-200 pb-4">
                <button 
                  onClick={() => toggleAccordion('shipping')} 
                  className="w-full flex justify-between items-center text-left py-2"
                >
                  <h3 className="text-lg font-bold text-brand-dark font-serif">Shipping & Returns</h3>
                  {openAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="mt-4 text-slate-600 space-y-2">
                    <p>• Free white-glove delivery across major Indian cities.</p>
                    <p>• Estimated dispatch in 2-3 weeks.</p>
                    <p>• 7-day hassle-free returns on damaged items.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-sm text-slate-500 mb-4">
                {product.stock > 0 ? (
                  <span className="flex items-center text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> {product.stock} in stock - Ready to ship</span>
                ) : (
                  <span className="flex items-center text-rose-600"><span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span> Out of stock</span>
                )}
              </p>
              <Button 
                size="lg" 
                className="w-full md:w-auto px-12 h-14 text-lg shadow-xl shadow-brand-dark/10" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </FadeInReveal>
      </div>
    </div>
  );
}

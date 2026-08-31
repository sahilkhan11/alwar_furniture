import './globals.css';
import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import Providers from './providers';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alwar Furniture',
  description: 'Premium Wooden Furniture in Alwar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow bg-brand-bg">
              {children}
            </main>

            <footer className="bg-brand-dark text-brand-light py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-accent mb-4">Alwar Furniture</h3>
                  <p className="text-brand-light/80">
                    Crafting premium, handcrafted wooden furniture that lasts generations. Made with love in Alwar.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4 text-brand-accent">Quick Links</h4>
                  <ul className="space-y-2 text-brand-light/80">
                    <li><Link href="/products" className="hover:text-brand-accent">Shop All</Link></li>
                    <li><Link href="/categories" className="hover:text-brand-accent">Categories</Link></li>
                    <li><Link href="/about" className="hover:text-brand-accent">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-brand-accent">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4 text-brand-accent">Contact Us</h4>
                  <ul className="space-y-2 text-brand-light/80">
                    <li>📍 123 Timber Lane, Alwar, RJ</li>
                    <li>📞 +91 98765 43210</li>
                    <li>✉️ hello@alwarfurniture.com</li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-brand-light/20 text-center text-sm text-brand-light/60">
                &copy; {new Date().getFullYear()} Alwar Furniture. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

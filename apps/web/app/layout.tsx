import './globals.css';
import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';

import Providers from './providers';
import { WhatsAppCTA } from '../components/ui/WhatsAppCTA';
import { EmailPopup } from '../components/ui/EmailPopup';
import { CookieConsent } from '../components/ui/CookieConsent';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://alwarfurniture.in'),
  title: 'Best Furniture in Alwar | Premium Wooden Furniture | Alwar Furniture',
  description: 'Shop the best premium wooden furniture in Alwar. Find top-quality home furniture, office furniture, mattresses, and more at Alwar\'s top rated furniture store.',
  keywords: 'Alwar furniture, best furniture in Alwar, wooden furniture Alwar, furniture store Alwar, buy furniture online Alwar, Alwar furniture shop, premium furniture Alwar, office furniture Alwar, home furniture Alwar, sofa set Alwar, dining table Alwar',
  alternates: {
    canonical: 'https://alwarfurniture.in',
  },
  openGraph: {
    title: 'Alwar Furniture | Best Furniture Store in Alwar',
    description: 'Shop the best premium wooden furniture in Alwar. Top-quality home & office furniture.',
    url: 'https://alwarfurniture.in',
    siteName: 'Alwar Furniture',
    images: [
      {
        url: 'https://alwarfurniture.in/icon.jpg',
        width: 800,
        height: 600,
        alt: 'Alwar Furniture Storefront',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoriesRes, productsRes, settingsRes] = await Promise.all([
    fetch('https://alwarfurniture.in/api/categories', { next: { revalidate: 3600 } }).catch(() => null),
    fetch('https://alwarfurniture.in/api/products', { next: { revalidate: 3600 } }).catch(() => null),
    fetch('https://alwarfurniture.in/api/settings', { next: { revalidate: 3600 } }).catch(() => null),
  ]);

  const rawCategories = categoriesRes && categoriesRes.ok ? await categoriesRes.json() : [];
  const products = productsRes && productsRes.ok ? await productsRes.json() : [];
  const settings = settingsRes && settingsRes.ok ? await settingsRes.json() : {};

  // Compute product counts and filter
  const categoryCounts = products.reduce((acc: any, p: any) => {
    acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
    return acc;
  }, {});

  const categories = rawCategories.filter((c: any) => categoryCounts[c.id] > 0);

  const businessPhone = settings['businessPhone'] || '8696112233';
  const businessEmail = settings['businessEmail'] || 'hello@alwarfurniture.in';
  const businessAddress = settings['businessAddress'] || 'mev bolding Road number 2 Aaya nager shop number 16 saniya traders';

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FurnitureStore",
              "name": "Alwar Furniture",
              "image": "https://alwarfurniture.in/icon.jpg",
              "@id": "",
              "url": "https://alwarfurniture.in",
              "telephone": "+918696112233",
              "priceRange": "Rs Rs ",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mev Bolding Road number 2, Aaya Nager, Shop number 16, Saniya Traders",
                "addressLocality": "Alwar",
                "addressRegion": "RJ",
                "postalCode": "301001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 27.552990,
                "longitude": 76.634575
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar dbCategories={categories} />

            <main className="flex-grow bg-brand-bg">
              {children}
            </main>

            <footer className="bg-neutral-50 text-neutral-600 py-16 border-t border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-sm font-bold mb-4 text-neutral-900">Furniture</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="font-semibold text-neutral-900 border-b border-brand-accent pb-0.5">Home Furniture</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Office Furniture</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Mattress</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-4 text-neutral-900">About Us</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">About Alwar Furniture</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Social Impact</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Contact Us</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">FAQ's</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Feedback</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Blogs</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-4 text-neutral-900">Help</h4>
                  <ul className="space-y-3 text-sm">
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Shipping & Delivery</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/franchise" className="hover:text-brand-accent transition-colors">Franchise Enquiry</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Purchase & Returns</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Warranty Policy</Link></li>
                    <li><Link href="/warranty" className="hover:text-brand-accent transition-colors">Warranty Registration</Link></li>
                  <li><Link href="/track-order" className="hover:text-brand-accent transition-colors">Track your order</Link></li>
                    <li><Link href="/warranty" className="hover:text-brand-accent transition-colors">Warranty Registration Mattress</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Furniture Care</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Downloads</Link></li>
                    <li><Link href="#" className="hover:text-brand-accent transition-colors">Sitemap</Link></li>
                  </ul>
                </div>
                <div className="space-y-6 text-sm">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl pt-1">📞</span>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-900">{businessPhone}</h4>
                      <p className="mt-2 text-neutral-500 leading-relaxed">
                        You can reach us 7 days a week. Chat with us or call our toll-free number between 9.00 am to 6.00 pm.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">✉️</span>
                    <a href={`mailto:${businessEmail}`} className="font-medium text-neutral-900 hover:text-brand-accent transition-colors">
                      {businessEmail}
                    </a>
                  </div>
                  <div className="text-neutral-500 leading-relaxed pl-10 whitespace-pre-line">
                    {businessAddress}
                  </div>
                </div>
              </div>

              {/* Copyright & Credits */}
              <div className="border-t border-neutral-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500 gap-4">
                <p>&copy; {new Date().getFullYear()} Alwar Furniture. All rights reserved.</p>
                <p>
                  Designed and developed by{" "}
                  <a href="https://kasinfotech.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-700 hover:text-brand-accent transition-colors">
                    KAS INFO TECH PVT LTD
                  </a>
                </p>
              </div>
            </footer>
          </div>

          <WhatsAppCTA />
          <EmailPopup />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

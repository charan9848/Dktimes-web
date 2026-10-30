import { getMarketplaceListings } from '@/lib/news-service';
import { MarketplaceListing } from '@/types';
import { ShoppingBag, MessageCircle, MapPin } from 'lucide-react';

const defaultListings: Partial<MarketplaceListing>[] = [
  {
    id: '1',
    title: '3 BHK Luxury Apartment in Gachibowli',
    category: 'Real Estate',
    price: '₹1.2 Cr',
    location: 'Hyderabad',
    whatsappNumber: '919876543210',
    description: 'East facing, 1950 sft with 2 covered car parkings in gated society.',
    images: [],
  },
  {
    id: '2',
    title: 'Honda City ZX 2024 — Single Owner',
    category: 'Vehicles',
    price: '₹11.5 Lakh',
    location: 'Visakhapatnam',
    whatsappNumber: '919876543211',
    description: 'Petrol automatic, only 12,000 km driven with complete showroom track.',
    images: [],
  },
  {
    id: '3',
    title: 'Commercial Office Space 2,400 sq.ft',
    category: 'Commercial',
    price: '₹85,000 / mo',
    location: 'Vijayawada',
    whatsappNumber: '919876543212',
    description: 'Prime MG Road location, plug-and-play setup ready for IT/finance.',
    images: [],
  },
];

export default async function MarketplacePage() {
  const listingsData = await getMarketplaceListings(20);
  const listings: Partial<MarketplaceListing>[] = listingsData.length > 0 ? listingsData : defaultListings;

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-4 mb-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
          Local Classifieds
        </span>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white flex items-center gap-3 mt-1">
          <ShoppingBag size={32} className="text-amber-600 dark:text-amber-400" /> DK Times Marketplace
        </h1>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-1">
          Buy, sell, and discover verified properties, vehicles, electronics, and local services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-amber-400 dark:hover:border-amber-500 transition flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 flex items-center justify-center relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ShoppingBag size={32} className="text-amber-300 dark:text-amber-500/50 mx-auto" />
                    <span className="text-[10px] text-amber-700/60 dark:text-amber-300/60 font-semibold mt-1 block">
                      {item.category || 'Classified'}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-[#1C3D5A] dark:text-sky-300">
                  {item.category}
                </div>
              </div>

              <div className="p-4">
                <span className="text-base font-black text-amber-700 dark:text-amber-400 block mb-1">{item.price}</span>
                <h2 className="font-serif font-bold text-sm text-[#211D18] dark:text-white line-clamp-2 leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#6F675C] dark:text-slate-400 mt-3">
                  <MapPin size={12} /> {item.location}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <a
                href={`https://wa.me/${item.whatsappNumber}?text=Hi,%20I%20am%20inquiring%20about%20your%20listing%20"${encodeURIComponent(item.title || '')}"%20on%20DK%20Times`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

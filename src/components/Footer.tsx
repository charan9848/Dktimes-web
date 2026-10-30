import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1C3D5A] dark:bg-[#0B0F17] text-white/70 mt-16 border-t-4 border-[#F5F1E8] dark:border-white/10 transition-colors">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serif font-black text-2xl text-white mb-2 tracking-tight">DK TIMES</h4>
            <p className="text-[12px] leading-relaxed text-white/60">
              The Voice of Telangana & Andhra Pradesh. Delivering unbiased, verified news across politics,
              governance, technology, local classifieds, and community developments.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Sections</p>
            <ul className="space-y-2 text-[12px] font-medium">
              <li><Link href="/news/telangana" className="hover:text-white transition">Telangana & Hyderabad</Link></li>
              <li><Link href="/news/andhra_pradesh" className="hover:text-white transition">Andhra Pradesh</Link></li>
              <li><Link href="/news/politics" className="hover:text-white transition">State & National Politics</Link></li>
              <li><Link href="/news/technology" className="hover:text-white transition">Tech & IT News</Link></li>
              <li><Link href="/news/sports" className="hover:text-white transition">Sports & Cricket</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Features</p>
            <ul className="space-y-2 text-[12px] font-medium">
              <li><Link href="/shorts" className="hover:text-white transition">DK Shorts Video</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition">Employment & Careers</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition">Local Classifieds</Link></li>
              <li><Link href="https://www.dktimesnews.com" className="hover:text-white transition" target="_blank">Editorial Admin Desk</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Download Mobile App</p>
            <p className="text-[12px] text-white/60 mb-3">
              Receive breaking news alerts and personalized feeds directly on your phone.
            </p>
            <div className="flex gap-2">
              <div className="bg-white/10 hover:bg-white/15 transition cursor-pointer rounded-lg px-3 py-2 text-[10px] font-bold text-white">
                ▶ Google Play
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition cursor-pointer rounded-lg px-3 py-2 text-[10px] font-bold text-white">
                 App Store
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <p>© 2026 DK Times Network. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Contact Newsroom</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

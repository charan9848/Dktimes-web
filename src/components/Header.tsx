'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { Search, Bookmark, Globe, Sun, Moon, Menu, User, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import SavedArticlesDrawer from './SavedArticlesDrawer';
import AppMenuDrawer from './AppMenuDrawer';
import PhoneAuthModal from './PhoneAuthModal';
import { getTodayMastheadDate } from '@/lib/date-utils';

export default function Header() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { bookmarks, setDrawerOpen } = useBookmarks();
  const [lang, setLang] = useState<'EN' | 'TE'>('EN');
  const [todayDate, setTodayDate] = useState('');
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [phoneAuthOpen, setPhoneAuthOpen] = useState(false);

  useEffect(() => {
    setTodayDate(getTodayMastheadDate());
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'EN' ? 'TE' : 'EN';
    setLang(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dk_lang', next);
      window.dispatchEvent(new Event('languageChange'));
    }
  };

  return (
    <>
      <SavedArticlesDrawer />

      {/* App Slide-Out Menu Drawer */}
      <AppMenuDrawer
        isOpen={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        onOpenPhoneAuth={() => setPhoneAuthOpen(true)}
        onOpenSavedDrawer={() => setDrawerOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLanguage={toggleLanguage}
      />

      {/* Firebase Phone Auth OTP Modal */}
      <PhoneAuthModal
        isOpen={phoneAuthOpen}
        onClose={() => setPhoneAuthOpen(false)}
      />

      {/* Top Utility Bar */}
      <div className="bg-[#1C3D5A] dark:bg-[#0F172A] text-white/90 border-b border-white/10 transition-colors">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-2 flex items-center justify-between text-[11px] font-semibold tracking-wide uppercase">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-white/80">Hyderabad &amp; Amaravati</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="hidden sm:inline text-white/95 font-bold tracking-normal">
              {todayDate || 'Friday, 30 October 2026'}
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline text-white/60 text-[10px]">Edition: Telangana &amp; AP</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Bilingual toggle pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition rounded-full px-2.5 sm:px-3 py-0.5 text-[10px] cursor-pointer"
              title="Switch between English and Telugu"
            >
              <Globe size={12} className="text-white/80" />
              <span className={lang === 'EN' ? 'text-white font-extrabold' : 'text-white/60'}>
                EN
              </span>
              <span className="text-white/30">|</span>
              <span className={lang === 'TE' ? 'text-white font-extrabold' : 'text-white/60'}>
                తెలుగు
              </span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white transition rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={12} className="text-amber-300" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon size={12} className="text-sky-300" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Replaced Sign In / Register with Unified App Menu & Account Button */}
            <button
              onClick={() => setMenuDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white transition rounded-full px-3 py-1 text-[11px] font-bold shadow-xs cursor-pointer"
              title="Open Account, Preferences & Info Menu"
            >
              {user ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center text-[9px] font-black">
                    {(user.phoneNumber || profile?.name || 'U')[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline normal-case">
                    {user.phoneNumber ? user.phoneNumber.slice(-4) : 'Account'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <User size={13} />
                  <span>Account</span>
                </div>
              )}
              <Menu size={13} className="text-white/70 ml-0.5" />
            </button>

            {/* Quick action icons (Search & Bookmark Drawer) */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-white/70 border-l border-white/15 pl-2 sm:pl-3">
              <Link href="/search" aria-label="Search" className="hover:text-white transition">
                <Search size={14} />
              </Link>
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative hover:text-white transition flex items-center cursor-pointer"
                title="View Saved Stories"
              >
                <Bookmark size={14} className={bookmarks.length > 0 ? 'fill-current text-amber-300' : ''} />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Masthead Logo with Official Emblem */}
      <header className="bg-[#FFFDF7] dark:bg-[#121212] border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-4 md:py-5 flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="DK Times Official Logo"
              className="w-9 h-9 md:w-12 md:h-12 rounded-xl shadow-sm group-hover:scale-105 transition"
            />
            <div className="text-left">
              <h1 className="font-serif font-black text-2xl md:text-4xl tracking-[-0.03em] text-[#1C3D5A] dark:text-sky-400 group-hover:opacity-90 transition leading-none">
                DK TIMES
              </h1>
              <p className="text-[#6F675C] dark:text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mt-1">
                The Voice of Telangana &amp; Andhra Pradesh
              </p>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}

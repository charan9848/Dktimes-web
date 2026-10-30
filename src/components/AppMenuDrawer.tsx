'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  User,
  Phone,
  Moon,
  Sun,
  Globe,
  Bell,
  BellOff,
  Bookmark,
  ShieldCheck,
  Info,
  FileText,
  Mail,
  ExternalLink,
  MessageCircle,
  Video,
  Camera,
  Download,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhoneAuth: () => void;
  onOpenSavedDrawer: () => void;
  theme: string;
  toggleTheme: () => void;
  lang: string;
  toggleLanguage: () => void;
}

export default function AppMenuDrawer({
  isOpen,
  onClose,
  onOpenPhoneAuth,
  onOpenSavedDrawer,
  theme,
  toggleTheme,
  lang,
  toggleLanguage,
}: Props) {
  const { user, profile, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF7] dark:bg-[#121212] border-l border-[rgba(33,29,24,0.15)] dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10 flex items-center justify-between sticky top-0 bg-[#FFFDF7]/95 dark:bg-[#121212]/95 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="DK Times Emblem"
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <div>
                <h2 className="font-serif font-black text-base text-[#1C3D5A] dark:text-sky-400 leading-tight">
                  DK TIMES
                </h2>
                <p className="text-[10px] text-[#6F675C] dark:text-slate-400 font-bold uppercase tracking-wider">
                  The Voice of Telangana &amp; AP
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-[#6F675C] dark:text-slate-400 hover:text-[#211D18] dark:hover:text-white transition cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-5 space-y-6 flex-1">
            {/* ================= 1. ACCOUNTS SECTION ================= */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6F675C] dark:text-slate-400 mb-2.5 block">
                Account
              </span>

              {user ? (
                /* Logged In State */
                <div className="bg-[#F5F1E8] dark:bg-white/5 border border-[rgba(33,29,24,0.1)] dark:border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1C3D5A] dark:bg-sky-600 text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0">
                      {(user.phoneNumber || profile?.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-[#211D18] dark:text-white truncate">
                          {user.phoneNumber || profile?.name || user.email?.split('@')[0] || 'DK Reader'}
                        </p>
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-[#6F675C] dark:text-slate-400 mt-0.5">
                        Verified Reader Member
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSavedDrawer();
                      }}
                      className="font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Bookmark size={13} /> View Saved Stories
                    </button>
                    <button
                      onClick={() => logout()}
                      className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                /* Not Logged In State */
                <div className="bg-gradient-to-br from-[#1C3D5A] to-[#0F172A] text-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="p-2 rounded-xl bg-white/10">
                      <Phone size={18} className="text-sky-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Sign in to DK Times</h3>
                      <p className="text-[11px] text-white/70">Phone OTP Authentication</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/80 my-3 leading-relaxed">
                    Bookmark articles, personalize your regional edition, participate in audience discussion, and receive breaking alerts.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPhoneAuth();
                    }}
                    className="w-full bg-white text-[#1C3D5A] font-extrabold text-xs py-2.5 rounded-xl hover:bg-slate-100 transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone size={13} /> Sign In with Phone (OTP) →
                  </button>
                </div>
              )}
            </div>

            {/* ================= 2. PREFERENCES SECTION ================= */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6F675C] dark:text-slate-400 mb-2.5 block">
                Preferences
              </span>

              <div className="bg-[#F5F1E8] dark:bg-white/5 border border-[rgba(33,29,24,0.1)] dark:border-white/10 rounded-2xl divide-y divide-[rgba(33,29,24,0.06)] dark:divide-white/10">
                {/* Theme Mode Toggle */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? (
                      <Moon size={16} className="text-sky-400" />
                    ) : (
                      <Sun size={16} className="text-amber-600" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#211D18] dark:text-white">Appearance</p>
                      <p className="text-[10px] text-[#6F675C] dark:text-slate-400">
                        {theme === 'dark' ? 'Dark Broadsheet Mode' : 'Warm Newsprint (Light)'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleTheme}
                    className="bg-white dark:bg-neutral-800 border border-[rgba(33,29,24,0.15)] dark:border-white/15 px-3 py-1 rounded-full text-xs font-bold text-[#211D18] dark:text-white shadow-xs hover:border-[#1C3D5A] transition cursor-pointer"
                  >
                    {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>

                {/* Language Switcher */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe size={16} className="text-[#1C3D5A] dark:text-sky-400" />
                    <div>
                      <p className="text-xs font-bold text-[#211D18] dark:text-white">Language / భాష</p>
                      <p className="text-[10px] text-[#6F675C] dark:text-slate-400">
                        {lang === 'EN' ? 'English Edition Active' : 'తెలుగు ఎడిషన్ యాక్టివ్'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 bg-[#1C3D5A] dark:bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <span>{lang === 'EN' ? 'తెలుగులోకి మార్చు' : 'Switch to EN'}</span>
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {notificationsEnabled ? (
                      <Bell size={16} className="text-red-500" />
                    ) : (
                      <BellOff size={16} className="text-[#6F675C]" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#211D18] dark:text-white">Breaking Alerts</p>
                      <p className="text-[10px] text-[#6F675C] dark:text-slate-400">
                        {notificationsEnabled ? 'Instant verified news updates enabled' : 'Notifications muted'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                      notificationsEnabled ? 'bg-emerald-600 justify-end' : 'bg-neutral-300 dark:bg-neutral-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
                  </button>
                </div>
              </div>
            </div>

            {/* ================= 3. SUPPORT & INFO SECTION ================= */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6F675C] dark:text-slate-400 mb-2.5 block">
                Support &amp; Info
              </span>

              <div className="bg-[#F5F1E8] dark:bg-white/5 border border-[rgba(33,29,24,0.1)] dark:border-white/10 rounded-2xl divide-y divide-[rgba(33,29,24,0.06)] dark:divide-white/10 text-xs font-medium text-[#211D18] dark:text-slate-200">
                <button
                  onClick={() => setActiveModal('about')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-100/50 dark:hover:bg-white/5 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Info size={15} className="text-[#1C3D5A] dark:text-sky-400" />
                    About DK Times
                  </span>
                  <ChevronRight size={14} className="text-[#6F675C]" />
                </button>

                <button
                  onClick={() => setActiveModal('editorial')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-100/50 dark:hover:bg-white/5 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText size={15} className="text-[#1C3D5A] dark:text-sky-400" />
                    Editorial &amp; Fact-Checking Policy
                  </span>
                  <ChevronRight size={14} className="text-[#6F675C]" />
                </button>

                <button
                  onClick={() => setActiveModal('privacy')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-100/50 dark:hover:bg-white/5 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck size={15} className="text-[#1C3D5A] dark:text-sky-400" />
                    Privacy Policy &amp; Terms
                  </span>
                  <ChevronRight size={14} className="text-[#6F675C]" />
                </button>

                <a
                  href="mailto:editorial@dktimesnews.com"
                  className="p-3.5 flex items-center justify-between hover:bg-neutral-100/50 dark:hover:bg-white/5 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Mail size={15} className="text-[#1C3D5A] dark:text-sky-400" />
                    Contact Newsroom
                  </span>
                  <ExternalLink size={13} className="text-[#6F675C]" />
                </a>
              </div>
            </div>

            {/* ================= 4. CONNECT WITH US SECTION ================= */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6F675C] dark:text-slate-400 mb-2.5 block">
                Connect With Us
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp Channel */}
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <ExternalLink size={12} className="text-emerald-700/60 dark:text-emerald-400/60" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-emerald-950 dark:text-emerald-200">WhatsApp</p>
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-400">50K+ Subscribers</p>
                  </div>
                </a>

                {/* YouTube Channel */}
                <a
                  href="https://youtube.com/@dktimestelugu"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/60 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Video size={18} className="text-red-600 dark:text-red-400" />
                    <ExternalLink size={12} className="text-red-700/60 dark:text-red-400/60" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-red-950 dark:text-red-200">YouTube</p>
                    <p className="text-[10px] text-red-800 dark:text-red-400">@dktimestelugu</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/dktimesapp"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Camera size={18} className="text-purple-600 dark:text-purple-400" />
                    <ExternalLink size={12} className="text-purple-700/60 dark:text-purple-400/60" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-purple-950 dark:text-purple-200">Instagram</p>
                    <p className="text-[10px] text-purple-800 dark:text-purple-400">@dktimesapp</p>
                  </div>
                </a>

                {/* Download Google Play App */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.dktimes.app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Download size={18} className="text-sky-600 dark:text-sky-400" />
                    <ExternalLink size={12} className="text-sky-700/60 dark:text-sky-400/60" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-sky-950 dark:text-sky-200">Google Play</p>
                    <p className="text-[10px] text-sky-800 dark:text-sky-400">Get Android App</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 bg-[#F5F1E8]/50 dark:bg-black/20 text-center">
            <p className="text-[10px] font-bold text-[#6F675C] dark:text-slate-400">
              DK Times Digital News Portal • Edition 4.064
            </p>
            <p className="text-[9px] text-[#6F675C]/70 dark:text-slate-500 mt-0.5">
              Serving Telangana, Andhra Pradesh &amp; National Dispatches
            </p>
          </div>
        </div>
      </div>

      {/* Info Dialog Popup for About / Editorial / Privacy */}
      {activeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-[#6F675C]"
            >
              <X size={16} />
            </button>

            {activeModal === 'about' && (
              <div>
                <h3 className="font-serif font-black text-xl text-[#1C3D5A] dark:text-sky-400 mb-2">
                  About DK Times
                </h3>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed mb-3">
                  DK Times is a leading Telugu &amp; English digital news platform delivering real-time, verified dispatches across Telangana, Andhra Pradesh, National Politics, and Global affairs.
                </p>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed">
                  Headquartered in Hyderabad with correspondents in Amaravati and all 33 districts of Telangana and 26 districts of Andhra Pradesh, we focus on unvarnished regional reporting, community jobs, and classifieds.
                </p>
              </div>
            )}

            {activeModal === 'editorial' && (
              <div>
                <h3 className="font-serif font-black text-xl text-[#1C3D5A] dark:text-sky-400 mb-2">
                  Editorial &amp; Fact-Checking Policy
                </h3>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed mb-3">
                  Every story published by DK Times undergoes multi-tier journalistic verification. We adhere to the highest standards of journalistic integrity, truthfulness, and impartiality.
                </p>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed">
                  Citizen submissions and community reports are independently fact-checked before editorial approval and distribution across web, mobile, and WhatsApp channels.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="font-serif font-black text-xl text-[#1C3D5A] dark:text-sky-400 mb-2">
                  Privacy Policy &amp; Terms
                </h3>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed mb-3">
                  DK Times respects your privacy. We do not sell personal reader information to third parties. Phone numbers provided for OTP verification are strictly utilized for account authentication and user security.
                </p>
                <p className="text-xs text-[#211D18] dark:text-slate-300 leading-relaxed">
                  Cookies and local storage are utilized only to remember your language preferences, theme settings, and saved reading lists.
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full bg-[#1C3D5A] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#142A3E] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BookmarkProvider } from '@/context/BookmarkContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DK Times — The Voice of Telangana & Andhra Pradesh',
  description:
    'Real-time verified news from Telangana, Andhra Pradesh, National Politics, Technology, Jobs, and Classifieds.',
  metadataBase: new URL('https://dktimesnews.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.setProperty('--paper', '#0A0A0A');
                  document.documentElement.style.setProperty('--paper-card', '#141414');
                  document.documentElement.style.setProperty('--ink', '#F8FAFC');
                  document.documentElement.style.setProperty('--muted', '#94A3B8');
                  document.documentElement.style.setProperty('--line', 'rgba(255, 255, 255, 0.12)');
                  document.documentElement.style.setProperty('--brand-header', '#0F172A');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F5F1E8] dark:bg-[#0A0A0A] text-[#211D18] dark:text-[#F8FAFC] transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <BookmarkProvider>
              <Header />
              <BreakingTicker />
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </BookmarkProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

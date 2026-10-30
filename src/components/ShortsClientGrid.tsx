'use client';

import { useState } from 'react';
import { ShortVideo } from '@/types';
import { Play, Share2, X, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  shorts: Partial<ShortVideo>[];
}

export default function ShortsClientGrid({ shorts }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);

  const activeShort = activeIdx !== null ? shorts[activeIdx] : null;

  const handleNext = () => {
    if (activeIdx !== null && activeIdx < shorts.length - 1) {
      setActiveIdx(activeIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx !== null && activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  return (
    <>
      {/* Modal Video Player */}
      {activeShort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white rounded-full bg-white/10 transition z-50"
          >
            <X size={20} />
          </button>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between">
            {/* Video element or YouTube Embed */}
            {activeShort.videoUrl ? (
              <video
                src={activeShort.videoUrl}
                autoPlay
                loop
                muted={muted}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : activeShort.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeShort.videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <Play size={48} className="text-white/40" />
              </div>
            )}

            {/* Top Bar Controls */}
            <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                DK Shorts
              </span>
              <button
                onClick={() => setMuted(!muted)}
                className="p-1.5 text-white bg-white/20 rounded-full hover:bg-white/30 transition"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Bottom Info and Controls */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3">
              <h3 className="text-white text-sm font-bold leading-snug">
                {activeShort.title}
              </h3>
              <div className="flex items-center justify-end text-white/70 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={activeIdx === 0}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={activeIdx === shorts.length - 1}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Shorts Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {shorts.map((short, idx) => (
          <div
            key={short.id || idx}
            onClick={() => setActiveIdx(idx)}
            className="bg-black rounded-2xl overflow-hidden shadow-md aspect-[9/16] relative group cursor-pointer border border-[rgba(33,29,24,0.1)] hover:scale-[1.02] transition duration-300"
          >
            {short.thumbnailUrl && (
              <img
                src={short.thumbnailUrl}
                alt={short.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center group-hover:bg-black/40 transition">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-red-600 transition shadow-lg">
                <Play size={20} className="text-white fill-current ml-0.5" />
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
              <h2 className="text-white text-xs md:text-sm font-bold leading-snug line-clamp-2">
                {short.title}
              </h2>
              <div className="flex items-center justify-end text-white/70 text-[10px] mt-2 font-medium">
                <Share2 size={12} className="hover:text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

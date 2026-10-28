import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import { MADISONS_UNIT } from '../data/unitData';
import { ChevronLeft, ChevronRight, X, Maximize2, Camera } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const photos = MADISONS_UNIT.photos;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  return (
    <section id="photos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Photo Bento Grid */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#e2dbcc] bg-[#eee8d9]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[420px] sm:h-[500px] lg:h-[560px]">
          {/* Main Large Photo */}
          <div
            onClick={() => setLightboxIndex(0)}
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden bg-[#e0d8c3]"
          >
            <img
              src={photos[0].url}
              alt={photos[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://stay-at-madisons-cebu.vercel.app${photos[0].url}`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
              <span className="text-white text-sm font-medium tracking-wide">
                {photos[0].caption}
              </span>
            </div>
          </div>

          {/* 4 Supporting Photos */}
          {photos.slice(1, 5).map((photo, idx) => (
            <div
              key={photo.url}
              onClick={() => setLightboxIndex(idx + 1)}
              className="hidden md:block relative group cursor-pointer overflow-hidden bg-[#e0d8c3]"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://stay-at-madisons-cebu.vercel.app${photo.url}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-medium truncate">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-[#2a241c] text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-102 cursor-pointer border border-[#ded5c2]"
        >
          <Camera className="w-4 h-4 text-[#0f766e]" />
          <span>Show all {photos.length} photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#ccfbf1] bg-[#0f766e]/40 px-3 py-1 rounded-full border border-[#0f766e]">
                Madison's Horizons 101
              </span>
              <span className="text-sm text-neutral-300">
                {lightboxIndex + 1} / {photos.length}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              aria-label="Close photo gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0))
              }
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-5xl max-h-[75vh] flex flex-col items-center">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].alt}
                className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://stay-at-madisons-cebu.vercel.app${photos[lightboxIndex].url}`;
                }}
              />
              <p className="mt-3 text-center text-sm sm:text-base font-serif-heading text-neutral-200">
                {photos[lightboxIndex].caption}
              </p>
            </div>

            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0))
              }
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="max-w-4xl mx-auto w-full overflow-x-auto pb-2 flex gap-2 justify-center">
            {photos.map((p, idx) => (
              <button
                key={p.url}
                onClick={() => setLightboxIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  idx === lightboxIndex ? 'border-[#0f766e] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={p.url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://stay-at-madisons-cebu.vercel.app${p.url}`;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

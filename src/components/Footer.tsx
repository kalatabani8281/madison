import React from 'react';
import { HOST_CONTACT } from '../data/unitData';
import { MessageCircle, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ede7d8] border-t border-[#ded5c2] pt-12 pb-16 text-[#5c5446]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <img
              src="/assets/branding/madisons-wordmark-v2-450.png"
              alt="Stay at Madison's Cebu"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://stay-at-madisons-cebu.vercel.app/assets/branding/madisons-wordmark-v2-450.png';
              }}
            />
            <p className="text-xs text-[#736a5c]">
              Cozy condos and homes for short stays and monthly rentals in Cebu City.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#423a2f]">
              <MapPin className="w-3.5 h-3.5 text-[#0f766e]" />
              Horizons 101 · Cebu City, Philippines
            </span>

            <a
              href={HOST_CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f766e] text-white hover:bg-[#115e59] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Find us on Facebook ↗
            </a>
          </div>
        </div>

        <div className="border-t border-[#dfd6c3] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7a7264]">
          <p>© 2026 Stay at Madison’s Cebu. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Carefully hosted with personal hospitality in Cebu City.
          </p>
        </div>
      </div>
    </footer>
  );
};

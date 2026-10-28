import React, { useState } from 'react';
import { MADISONS_UNIT } from '../data/unitData';
import {
  Sparkles,
  Users,
  Tv,
  UtensilsCrossed,
  Wifi,
  Wind,
  Waves,
  ShieldCheck,
  Building,
  Coffee,
  Check,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'City skyline views': <Building className="w-5 h-5 text-[#0f766e]" />,
  'Kitchenette with induction & cookware': <UtensilsCrossed className="w-5 h-5 text-[#0f766e]" />,
  'In-room Smart Television': <Tv className="w-5 h-5 text-[#0f766e]" />,
  'Seating corner & dining nook': <Coffee className="w-5 h-5 text-[#0f766e]" />,
  'Refrigerator & freezer': <UtensilsCrossed className="w-5 h-5 text-[#0f766e]" />,
  'Microwave oven & electric kettle': <Coffee className="w-5 h-5 text-[#0f766e]" />,
  'Split-type air conditioning': <Wind className="w-5 h-5 text-[#0f766e]" />,
  'High-speed fiber Wi-Fi': <Wifi className="w-5 h-5 text-[#0f766e]" />,
  'Horizons 101 swimming pool access': <Waves className="w-5 h-5 text-[#0f766e]" />,
  'Hot & cold shower with bath towels': <Sparkles className="w-5 h-5 text-[#0f766e]" />,
  '24/7 lobby security & reception': <ShieldCheck className="w-5 h-5 text-[#0f766e]" />,
  'Wardrobe and dressing vanity': <Compass className="w-5 h-5 text-[#0f766e]" />
};

export const UnitDetails: React.FC = () => {
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Highlights & Description */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1c1917]">
              {MADISONS_UNIT.overviewTitle}
            </h2>
            <div className="w-12 h-1 bg-[#0f766e] rounded-full mt-2"></div>
          </div>

          {/* 3 Core Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MADISONS_UNIT.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-white/80 p-5 rounded-xl border border-[#e4dcce] hover:border-[#0f766e]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#efe8d8] flex items-center justify-center text-[#0f766e] mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#1c1917] mb-1 font-serif-heading">
                  {h.title}
                </h3>
                <p className="text-xs text-[#665e52] leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>

          {/* Full Property Story */}
          <div className="prose prose-neutral max-w-none text-[#463f35] leading-relaxed space-y-4">
            <p className="text-lg font-serif-heading text-[#231e18] italic border-l-2 border-[#0f766e] pl-4">
              "{MADISONS_UNIT.description[0]}"
            </p>
            <p className="text-[15px]">{MADISONS_UNIT.description[1]}</p>
          </div>

          {/* Group & Guests Note */}
          <div className="bg-[#f2ecdd] border border-[#dcd3bf] rounded-xl p-5 flex items-start gap-3.5">
            <Users className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#241f18] mb-0.5">
                A stay for your kind of company
              </h4>
              <p className="text-xs text-[#5c5344] leading-relaxed">
                {MADISONS_UNIT.guestNote}
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          <div id="amenities" className="pt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif-heading text-[#1c1917]">
                  The Home Comforts
                </h3>
                <p className="text-xs text-[#665e52]">
                  Every essential prepared for your peace of mind
                </p>
              </div>
              <button
                onClick={() => setShowAmenitiesModal(true)}
                className="text-xs font-semibold text-[#0f766e] hover:text-[#115e59] underline underline-offset-4 cursor-pointer"
              >
                View all inclusions →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {MADISONS_UNIT.amenities.slice(0, 6).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white border border-[#e4dcce]"
                >
                  {AMENITY_ICONS[amenity] || <Check className="w-4 h-4 text-[#0f766e]" />}
                  <span className="text-xs font-medium text-[#2d2720]">{amenity}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAmenitiesModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#ded5c3] bg-white hover:bg-[#faf7f0] text-xs font-semibold text-[#2c261e] transition-colors cursor-pointer"
            >
              Show all {MADISONS_UNIT.amenities.length} amenities
            </button>
          </div>
        </div>

        {/* Right Column: Featured Bedroom & Host Personal Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2dbcc] p-6 shadow-sm space-y-5">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-[#ebe4d5]">
              <img
                src={MADISONS_UNIT.photos[6].url} // Styled bedroom photo
                alt={MADISONS_UNIT.photos[6].alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://stay-at-madisons-cebu.vercel.app${MADISONS_UNIT.photos[6].url}`;
                }}
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded text-[11px] text-white font-medium">
                Bedroom at Madison's
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-[#0f766e] font-semibold">
                Feature Corner
              </span>
              <h3 className="text-lg font-bold font-serif-heading text-[#1c1917] mt-0.5">
                A cozy place to unwind
              </h3>
              <p className="text-xs text-[#5e564a] mt-1.5 leading-relaxed">
                Crisp hotel-grade linens, plush pillows, cozy teal cushions, and gentle warm lighting designed for restful nights and slow Cebu mornings.
              </p>
            </div>

            <div className="pt-4 border-t border-[#ede6d6] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#4d453a]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#0f766e]" /> Swimming Pool
                </span>
                <span className="text-emerald-700 font-semibold">Complimentary passes</span>
              </div>
              <div className="flex items-center justify-between text-[#4d453a]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#0f766e]" /> Wi-Fi Speed
                </span>
                <span className="font-semibold text-[#1c1917]">High-speed Fiber</span>
              </div>
              <div className="flex items-center justify-between text-[#4d453a]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#0f766e]" /> City View
                </span>
                <span className="font-semibold text-[#1c1917]">High floor skyline</span>
              </div>
            </div>

            <a
              href="#calendar-booking"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Select Dates & Reserve Now
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Amenities Modal Dialog */}
      {showAmenitiesModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#f7f4ec] rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#ded5c2] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e2dbcc] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0f766e]">
                  The Home Comforts
                </span>
                <h3 className="text-xl font-bold font-serif-heading text-[#1c1917]">
                  A closer look at the space
                </h3>
              </div>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="p-2 rounded-full hover:bg-[#eae3d1] text-[#4d453b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5e564a]">
              Features shown in the photos. Each item is thoroughly sanitized and checked prior to every guest arrival.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {MADISONS_UNIT.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-[#e5ded0]"
                >
                  {AMENITY_ICONS[amenity] || <Check className="w-4 h-4 text-[#0f766e]" />}
                  <span className="text-xs font-medium text-[#2d2821]">{amenity}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAmenitiesModal(false)}
              className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-xs font-semibold hover:bg-[#115e59] transition-colors cursor-pointer"
            >
              Back to the listing
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

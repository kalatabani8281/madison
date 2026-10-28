import React from 'react';
import { MADISONS_UNIT, HOST_CONTACT } from '../data/unitData';
import { MapPin, Users, Calendar, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenChat }) => {
  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eee7d6] text-[#6b6254] text-xs font-semibold tracking-wider uppercase border border-[#ded5c2]">
            <Sparkles className="w-3.5 h-3.5 text-[#0f766e]" />
            {MADISONS_UNIT.eyebrow}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1c1917] font-serif-heading leading-[1.12]">
            {MADISONS_UNIT.name}
          </h1>

          <p className="text-xl sm:text-2xl font-serif-heading text-[#0f766e] italic">
            "{MADISONS_UNIT.headline}"
          </p>

          <p className="text-base sm:text-lg text-[#554e43] leading-relaxed max-w-xl">
            {MADISONS_UNIT.description[0]} {MADISONS_UNIT.description[1]}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-[#463f35]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1ebdc] border border-[#ded6c3]">
              <MapPin className="w-4 h-4 text-[#0f766e]" />
              {MADISONS_UNIT.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1ebdc] border border-[#ded6c3]">
              <Users className="w-4 h-4 text-[#0f766e]" />
              Up to {MADISONS_UNIT.pricing.maxGuests} guests
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Owner Booking
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-medium text-base shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Check Availability & Rates
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#fcfbf9] text-[#2c261e] border border-[#d9d0bd] font-medium text-base shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0f766e]" />
              Ask Host in Chat
            </button>
          </div>
        </div>

        {/* Quick Rate & Host Reassurance Card */}
        <div className="w-full lg:w-80 bg-white/95 rounded-2xl border border-[#e2dbcc] p-6 shadow-sm space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#ece5d4] pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#797162] font-semibold">
                Short Stays
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#1c1917] font-serif-heading">
                  ₱{MADISONS_UNIT.pricing.baseRate.toLocaleString('en-PH')}
                </span>
                <span className="text-xs text-[#797162]">/ night</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#f0ebd9] text-[#4a4235]">
              2 Guests Included
            </span>
          </div>

          <div className="space-y-2 text-xs text-[#5c5448]">
            <div className="flex items-center justify-between">
              <span>Extra guest fee:</span>
              <span className="font-semibold text-[#1c1917]">₱500 / night</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Monthly discount:</span>
              <span className="font-semibold text-[#0f766e]">Custom Host Quote</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Check-in:</span>
              <span className="font-medium text-[#1c1917]">{HOST_CONTACT.checkInTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Check-out:</span>
              <span className="font-medium text-[#1c1917]">{HOST_CONTACT.checkOutTime}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#ece5d4]">
            <a
              href="#calendar-booking"
              className="block w-full text-center py-2.5 rounded-lg bg-[#f0ebd9] hover:bg-[#e6deca] text-[#2c261e] font-semibold text-xs tracking-wide transition-colors"
            >
              View Booking Calendar ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

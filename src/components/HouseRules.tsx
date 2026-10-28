import React from 'react';
import { Clock, Ban, Volume2, Waves, Sparkles, KeyRound } from 'lucide-react';
import { HOST_CONTACT } from '../data/unitData';

export const HouseRules: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#f0ebd9]/60 rounded-2xl border border-[#ded5c2] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#0f766e]">
            Stay Guidelines
          </span>
          <h2 className="text-2xl font-bold font-serif-heading text-[#1c1917] mt-0.5">
            Things to Know for Your Stay
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#524b3f]">
          <div className="bg-white p-5 rounded-xl border border-[#ded5c2] space-y-2">
            <div className="flex items-center gap-2 text-[#0f766e] font-semibold">
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-bold text-[#1c1917]">Arrival & Departure</h3>
            </div>
            <p><strong>Check-in:</strong> {HOST_CONTACT.checkInTime} onwards</p>
            <p><strong>Check-out:</strong> {HOST_CONTACT.checkOutTime}</p>
            <p className="text-[11px] text-[#787061]">
              Self check-in or assisted check-in with building security reception.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#ded5c2] space-y-2">
            <div className="flex items-center gap-2 text-[#0f766e] font-semibold">
              <Waves className="w-4 h-4" />
              <h3 className="text-sm font-bold text-[#1c1917]">Pool & Building Amenities</h3>
            </div>
            <p>Complimentary guest passes for Horizons 101 lap pool & kiddie pool.</p>
            <p>Open 6:00 AM to 8:00 PM (Tue–Sun, Mondays routine maintenance).</p>
            <p className="text-[11px] text-[#787061]">Appropriate swimwear required.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#ded5c2] space-y-2">
            <div className="flex items-center gap-2 text-[#0f766e] font-semibold">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold text-[#1c1917]">House Policies</h3>
            </div>
            <p>Strictly non-smoking inside the condo.</p>
            <p>Quiet hours observed from 10:00 PM to 8:00 AM.</p>
            <p className="text-[11px] text-[#787061]">
              Treat the little sanctuary with care so the next guest feels just as welcome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

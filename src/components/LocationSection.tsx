import React from 'react';
import { MADISONS_UNIT, HOST_CONTACT } from '../data/unitData';
import { MapPin, Navigation, Compass, ExternalLink, ShieldCheck, Bus, Car } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Horizons 101, General Maxilom Ave, Cebu City'
  )}`;

  return (
    <section id="location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-[#e2dbcc] p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#eee7d8] pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#0f766e]">
              Neighborhood & Accessibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1c1917]">
              {MADISONS_UNIT.locationLabel}
            </h2>
            <p className="text-sm text-[#635c4e] max-w-xl">
              {MADISONS_UNIT.locationBlurb}
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f0ebd9] hover:bg-[#e6deca] text-[#2c261e] text-xs font-semibold tracking-wide transition-colors cursor-pointer self-start md:self-auto"
          >
            <Navigation className="w-4 h-4 text-[#0f766e]" />
            <span>Open in Google Maps ↗</span>
          </a>
        </div>

        {/* Location Grid & Distances */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Nearby hotspots */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold font-serif-heading text-[#1c1917]">
              Minutes from everything in Cebu
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Mango Square (Dining & Cafes)</span>
                <span className="font-semibold text-[#0f766e]">2 min walk</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Robinsons Fuente & Cybergate</span>
                <span className="font-semibold text-[#0f766e]">5 min walk</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Cebu Doctors' University Hospital</span>
                <span className="font-semibold text-[#0f766e]">7 min walk</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Ayala Center Cebu (Business Park)</span>
                <span className="font-semibold text-[#0f766e]">5–10 mins drive</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Cebu IT Park</span>
                <span className="font-semibold text-[#0f766e]">15 mins drive</span>
              </div>
              <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e5ded0] flex items-center justify-between">
                <span className="font-medium text-[#2d2821]">Mactan-Cebu International Airport (MCIA)</span>
                <span className="font-semibold text-[#0f766e]">35–45 mins</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Taxis and GrabCars:</strong> Readily available 24/7 right at the Horizons 101 main lobby entrance.
              </span>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 h-[340px] rounded-xl overflow-hidden border border-[#ded5c2] shadow-xs relative bg-[#eee8d9]">
            <iframe
              title="Horizons 101 Cebu Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Horizons%20101%20General%20Maxilom%20Ave%20Cebu%20City&t=&z=15&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

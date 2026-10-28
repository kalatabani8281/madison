import React, { useState } from 'react';
import { HOST_CONTACT } from '../data/unitData';
import { Calendar, Mail, CheckCircle2, LogIn, LogOut, MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  hasGoogleToken: boolean;
  onOpenGoogleSync: () => void;
  onOpenChat: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  hasGoogleToken,
  onOpenGoogleSync,
  onOpenChat,
  onSignIn,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f7f4ec]/90 backdrop-blur-md border-b border-[#e5decb] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark Logo */}
        <a href="#top" className="flex items-center gap-3 group">
          <img
            src="/assets/branding/madisons-wordmark-v2-450.png"
            alt="Stay at Madison's Cebu"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            onError={(e) => {
              // fallback if local image is loading
              (e.target as HTMLImageElement).src =
                'https://stay-at-madisons-cebu.vercel.app/assets/branding/madisons-wordmark-v2-450.png';
            }}
          />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#443e35]">
          <a href="#about" className="hover:text-[#0f766e] transition-colors">
            The Space
          </a>
          <a href="#photos" className="hover:text-[#0f766e] transition-colors">
            Photos
          </a>
          <a href="#amenities" className="hover:text-[#0f766e] transition-colors">
            Amenities
          </a>
          <a href="#location" className="hover:text-[#0f766e] transition-colors">
            Location
          </a>
          <a href="#calendar-booking" className="hover:text-[#0f766e] transition-colors font-semibold text-[#0f766e]">
            Book Stay
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Google Sync Status Pill */}
          <button
            onClick={onOpenGoogleSync}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              hasGoogleToken
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
            title="Google Calendar & Gmail synchronization status"
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0f766e]" />
              <Mail className="w-3.5 h-3.5 text-[#0f766e]" />
            </div>
            {hasGoogleToken ? (
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Calendar & Gmail Synced
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>Google Sync</span>
              </span>
            )}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#efe8d8] rounded-full pl-2 pr-3 py-1 text-xs">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <span className="font-medium max-w-[100px] truncate text-[#2d2822]">
                {user.displayName?.split(' ')[0] || 'Connected'}
              </span>
              <button
                onClick={onSignOut}
                className="text-[#7a7164] hover:text-red-700 ml-1"
                title="Disconnect Google account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#f0ebd9] text-[#3d362d] hover:bg-[#e7e0cc] border border-[#d9d0be] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#0f766e]" />
              Connect Google
            </button>
          )}

          {/* Facebook Host Link */}
          <a
            href={HOST_CONTACT.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#0f766e] text-white hover:bg-[#115e59] shadow-sm transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Message Owner ↗
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#3d362d] hover:bg-[#eae3d2]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f7f4ec] border-b border-[#e2dbcc] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-[16px] font-medium text-[#3b342a]">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 px-2 rounded hover:bg-[#ece5d4]"
            >
              The Space
            </a>
            <a
              href="#photos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 px-2 rounded hover:bg-[#ece5d4]"
            >
              Photos
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 px-2 rounded hover:bg-[#ece5d4]"
            >
              Amenities
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 px-2 rounded hover:bg-[#ece5d4]"
            >
              Location & Map
            </a>
            <a
              href="#calendar-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 px-2 rounded bg-[#0f766e]/10 text-[#0f766e] font-semibold"
            >
              Check Dates & Reserve
            </a>
          </div>

          <div className="pt-3 border-t border-[#e2dbcc] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGoogleSync();
              }}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0f766e]" />
                Google Calendar & Gmail Sync
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                {hasGoogleToken ? 'Active' : 'Configure'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-white border border-[#d8d0be] text-sm font-medium text-[#2d2822]"
            >
              <Sparkles className="w-4 h-4 text-[#0f766e]" />
              Open Live Chat Support
            </button>

            <a
              href={HOST_CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#0f766e] text-white text-sm font-semibold shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Message Host on Facebook ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

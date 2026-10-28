import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PhotoGallery } from './components/PhotoGallery';
import { UnitDetails } from './components/UnitDetails';
import { BookingCalendar } from './components/BookingCalendar';
import { ChatSupport } from './components/ChatSupport';
import { GoogleSyncPanel } from './components/GoogleSyncPanel';
import { LocationSection } from './components/LocationSection';
import { HouseRules } from './components/HouseRules';
import { Footer } from './components/Footer';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setAccessToken
} from './services/firebaseAuth';
import { fetchGoogleCalendarEvents, CalendarEventItem } from './services/calendarService';
import { BookingDetails } from './types';
import { MADISONS_UNIT, HOST_CONTACT } from './data/unitData';
import { ArrowRight, MessageCircle, Calendar } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [googleAccessToken, setGoogleAccessTokenState] = useState<string | null>(null);
  const [syncedCalendarEvents, setSyncedCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isGoogleSyncOpen, setIsGoogleSyncOpen] = useState<boolean>(false);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingDetails[]>([]);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setGoogleAccessTokenState(token);
        loadCalendarEvents(token);
      },
      () => {
        setUser(null);
        setGoogleAccessTokenState(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadCalendarEvents = async (token: string) => {
    const events = await fetchGoogleCalendarEvents(token);
    setSyncedCalendarEvents(events);
  };

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setGoogleAccessTokenState(res.accessToken);
        loadCalendarEvents(res.accessToken);
      }
    } catch (err) {
      console.error('Failed to sign in:', err);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setGoogleAccessTokenState(null);
    setSyncedCalendarEvents([]);
  };

  const handleRefreshEvents = async () => {
    if (googleAccessToken) {
      await loadCalendarEvents(googleAccessToken);
    }
  };

  const handleScrollToBooking = () => {
    const el = document.getElementById('calendar-booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingConfirmed = (booking: BookingDetails) => {
    setConfirmedBookings((prev) => [booking, ...prev]);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#f7f4ec] text-[#1c1917] selection:bg-[#ccfbf1] selection:text-[#0f766e]">
      {/* Header */}
      <Header
        user={user}
        hasGoogleToken={!!googleAccessToken}
        onOpenGoogleSync={() => setIsGoogleSyncOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={handleScrollToBooking}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* Photo Gallery & Lightbox */}
        <PhotoGallery />

        {/* Unit Details, Narrative, and Amenities */}
        <UnitDetails />

        {/* Live Booking Calendar, Google Calendar Sync & Automated Confirmation */}
        <BookingCalendar
          googleAccessToken={googleAccessToken}
          syncedCalendarEvents={syncedCalendarEvents}
          onOpenGoogleSync={() => setIsGoogleSyncOpen(true)}
          onBookingConfirmed={handleBookingConfirmed}
        />

        {/* Location & Neighborhood Guide */}
        <LocationSection />

        {/* House Guidelines & Rules */}
        <HouseRules />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Host Chat Support */}
      <ChatSupport
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onOpenBooking={handleScrollToBooking}
      />

      {/* Google Workspace Sync Configuration Modal */}
      <GoogleSyncPanel
        isOpen={isGoogleSyncOpen}
        onClose={() => setIsGoogleSyncOpen(false)}
        user={user}
        googleAccessToken={googleAccessToken}
        syncedEvents={syncedCalendarEvents}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onRefreshEvents={handleRefreshEvents}
      />

      {/* Mobile Sticky Booking Bar (matches Madison's mobile experience) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ded5c2] px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <div className="flex items-baseline gap-1">
            <strong className="text-base font-bold font-serif-heading text-[#1c1917]">
              ₱{MADISONS_UNIT.pricing.baseRate.toLocaleString('en-PH')}
            </strong>
            <span className="text-xs text-[#706859]">/ night</span>
          </div>
          <p className="text-[10px] text-[#787061]">2 guests included · Horizons 101</p>
        </div>

        <button
          onClick={handleScrollToBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <span>Check dates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

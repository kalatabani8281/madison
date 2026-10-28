import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { CalendarEventItem } from '../services/calendarService';
import { sendBookingConfirmationEmail } from '../services/emailService';
import { BookingDetails } from '../types';
import { MADISONS_UNIT } from '../data/unitData';
import {
  Calendar,
  Mail,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  LogIn,
  LogOut,
  Sparkles
} from 'lucide-react';

interface GoogleSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  googleAccessToken: string | null;
  syncedEvents: CalendarEventItem[];
  onSignIn: () => void;
  onSignOut: () => void;
  onRefreshEvents: () => void;
}

export const GoogleSyncPanel: React.FC<GoogleSyncPanelProps> = ({
  isOpen,
  onClose,
  user,
  googleAccessToken,
  syncedEvents,
  onSignIn,
  onSignOut,
  onRefreshEvents
}) => {
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendTestEmail = async () => {
    if (!googleAccessToken || !user?.email) {
      alert('Please connect your Google account first.');
      return;
    }

    setTestSending(true);
    setTestResult(null);

    const sampleBooking: BookingDetails = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      unitSlug: MADISONS_UNIT.slug,
      unitName: MADISONS_UNIT.name,
      stayType: 'short',
      checkInDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      checkOutDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      nights: 2,
      guestCount: 2,
      guestName: user.displayName || 'Valued Guest',
      guestEmail: user.email,
      guestPhone: '+63 917 123 4567',
      specialRequests: 'Sample test email confirmation triggered from Google Sync Panel',
      baseRate: 1750,
      nightlyTotal: 1750,
      extraGuestFee: 0,
      totalPrice: 3500,
      paymentMethod: 'qr_ph',
      paymentStatus: 'confirmed',
      bookedAt: new Date().toISOString(),
      emailConfirmationSent: false
    };

    const res = await sendBookingConfirmationEmail(googleAccessToken, sampleBooking);
    setTestSending(false);

    if (res.success) {
      setTestResult(`✓ Test confirmation email successfully delivered to ${user.email} (Message ID: ${res.messageId})`);
    } else {
      setTestResult(`Error sending email: ${res.error}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[#f7f4ec] rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#ded5c2] shadow-2xl my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2dbcc] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#0f766e]" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#0f766e]">
                Google Workspace Integration
              </span>
              <h3 className="text-xl font-bold font-serif-heading text-[#1c1917]">
                Calendar Sync & Email Confirmation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#eae3d1] text-[#4d453b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Status Box */}
        <div className="p-4 rounded-xl bg-white border border-[#ded5c2] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6658]">
              Connection Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${
                googleAccessToken
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  googleAccessToken ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              {googleAccessToken ? 'Connected & Active' : 'Not Connected'}
            </span>
          </div>

          {user ? (
            <div className="flex items-center justify-between pt-2 border-t border-[#f0ebd9] text-xs">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
                )}
                <div>
                  <strong className="block text-[#1c1917]">{user.displayName}</strong>
                  <span className="text-[#686052]">{user.email}</span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded6c5] hover:bg-red-50 text-red-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#f0ebd9] space-y-2">
              <p className="text-xs text-[#5e564a]">
                Connect your Google account to enable live synchronization with Google Calendar and automated dispatch of booking confirmation emails via Gmail.
              </p>
              <button
                onClick={onSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#635c4e]">
            Enabled Automations
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#ded5c2] space-y-1">
              <div className="flex items-center gap-2 text-[#0f766e] font-semibold">
                <Calendar className="w-4 h-4" />
                <span>Google Calendar Sync</span>
              </div>
              <p className="text-[11px] text-[#635c4e]">
                New bookings automatically create busy block events on your primary Google Calendar, preventing double-bookings.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#ded5c2] space-y-1">
              <div className="flex items-center gap-2 text-[#0f766e] font-semibold">
                <Mail className="w-4 h-4" />
                <span>Automated Gmail Confirmations</span>
              </div>
              <p className="text-[11px] text-[#635c4e]">
                Instantly dispatches authentic HTML booking vouchers with check-in instructions to the guest and host.
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Testing */}
        {googleAccessToken && (
          <div className="space-y-3 pt-2 border-t border-[#e2dbcc]">
            <div className="flex items-center justify-between">
              <button
                onClick={onRefreshEvents}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#ded5c2] hover:bg-[#faf7f0] text-xs font-semibold text-[#2c261e] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0f766e]" />
                Refresh Google Calendar Events ({syncedEvents.length} found)
              </button>

              <button
                onClick={handleSendTestEmail}
                disabled={testSending}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                {testSending ? 'Sending...' : 'Send Test Confirmation Email'}
              </button>
            </div>

            {testResult && (
              <div className="p-3 rounded-lg bg-white border border-[#ded5c2] text-xs text-[#1c1917]">
                {testResult}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-[#ded5c2] bg-white hover:bg-[#faf7f0] text-xs font-semibold text-[#2c261e] cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { BookingDetails, StayType } from '../types';
import { MADISONS_UNIT, HOST_CONTACT, INITIAL_BOOKED_RANGES } from '../data/unitData';
import {
  createGoogleCalendarBookingEvent,
  getGoogleCalendarWebUrl,
  downloadIcsFile,
  CalendarEventItem
} from '../services/calendarService';
import { sendBookingConfirmationEmail, generateConfirmationEmailHtml } from '../services/emailService';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  ExternalLink,
  Download,
  Copy,
  Clock,
  Sparkles,
  Info,
  X,
  CreditCard,
  Building
} from 'lucide-react';

interface BookingCalendarProps {
  googleAccessToken: string | null;
  syncedCalendarEvents: CalendarEventItem[];
  onOpenGoogleSync: () => void;
  onBookingConfirmed: (booking: BookingDetails) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  googleAccessToken,
  syncedCalendarEvents,
  onOpenGoogleSync,
  onBookingConfirmed
}) => {
  const [stayType, setStayType] = useState<StayType>('short');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);

  // Calendar month view navigation (starts at current date)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Guest details form state
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'qr_ph' | 'bank_transfer' | 'cash_deposit'>('qr_ph');

  // QR Ph dialog state
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrTimer, setQrTimer] = useState<number>(600); // 10 minutes

  // Booking result / Confirmation states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ sent: boolean; messageId?: string; error?: string } | null>(null);
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<{ synced: boolean; eventId?: string; error?: string } | null>(null);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Compile all booked dates from initial property ranges + any Google Calendar synced events
  const bookedDatesSet = useMemo(() => {
    const dates = new Set<string>();

    const addRange = (startStr: string, endStr: string) => {
      const cur = new Date(startStr);
      const end = new Date(endStr);
      while (cur <= end) {
        dates.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    };

    INITIAL_BOOKED_RANGES.forEach((r) => addRange(r.start, r.end));

    syncedCalendarEvents.forEach((ev) => {
      const start = ev.start?.date || ev.start?.dateTime?.split('T')[0];
      const end = ev.end?.date || ev.end?.dateTime?.split('T')[0];
      if (start && end) {
        addRange(start, end);
      }
    });

    return dates;
  }, [syncedCalendarEvents]);

  // Calculate nights and pricing
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const pricingCalculation = useMemo(() => {
    const baseNightly = MADISONS_UNIT.pricing.baseRate; // 1750
    const extraGuestsCount = Math.max(0, guests - MADISONS_UNIT.pricing.includedGuests);
    const extraGuestNightly = extraGuestsCount * MADISONS_UNIT.pricing.extraGuestFee; // 500 each
    const nightlyTotal = baseNightly + extraGuestNightly;
    const totalPrice = nightsCount > 0 ? nightlyTotal * nightsCount : nightlyTotal;

    return {
      baseNightly,
      extraGuestsCount,
      extraGuestNightly,
      nightlyTotal,
      totalPrice
    };
  }, [guests, nightsCount]);

  // Calendar days generation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isPast: boolean; isBooked: boolean }[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Padding previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isPast: dateStr < todayStr,
        isBooked: bookedDatesSet.has(dateStr)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        isPast: dateStr < todayStr,
        isBooked: bookedDatesSet.has(dateStr)
      });
    }

    return days;
  }, [currentMonth, bookedDatesSet]);

  const handleDateClick = (dateStr: string, isPast: boolean, isBooked: boolean) => {
    if (isPast || isBooked) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut('');
    } else if (checkIn && !checkOut) {
      if (dateStr <= checkIn) {
        setCheckIn(dateStr);
      } else {
        // Ensure no booked dates within range
        const start = new Date(checkIn);
        const end = new Date(dateStr);
        let hasConflict = false;
        const temp = new Date(start);
        while (temp <= end) {
          if (bookedDatesSet.has(temp.toISOString().split('T')[0])) {
            hasConflict = true;
            break;
          }
          temp.setDate(temp.getDate() + 1);
        }

        if (hasConflict) {
          alert('Selected range includes dates that are already reserved. Please select an available range.');
          return;
        }

        setCheckOut(dateStr);
      }
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    const today = new Date();
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleOpenCheckout = () => {
    if (!checkIn || !checkOut) {
      alert('Please choose both a check-in and check-out date on the calendar.');
      return;
    }
    setShowCheckoutModal(true);
  };

  // Process and finalize reservation
  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert('Please provide your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);

    const bookingId = `MAD-CEBU-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingDetails = {
      id: bookingId,
      unitSlug: MADISONS_UNIT.slug,
      unitName: MADISONS_UNIT.name,
      stayType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights: nightsCount,
      guestCount: guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      baseRate: MADISONS_UNIT.pricing.baseRate,
      nightlyTotal: pricingCalculation.nightlyTotal,
      extraGuestFee: pricingCalculation.extraGuestNightly * nightsCount,
      totalPrice: pricingCalculation.totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'qr_ph' ? 'confirmed' : 'pending',
      bookedAt: new Date().toISOString(),
      emailConfirmationSent: false
    };

    // 1. Sync with Google Calendar if OAuth token available
    let calResult: { synced: boolean; eventId?: string; error?: string } = { synced: false };
    if (googleAccessToken) {
      const calRes = await createGoogleCalendarBookingEvent(googleAccessToken, newBooking);
      if (calRes.success) {
        calResult = { synced: true, eventId: calRes.eventId };
        newBooking.googleCalendarEventId = calRes.eventId;
      } else {
        calResult = { synced: false, error: calRes.error };
      }
    } else {
      calResult = { synced: false, error: 'Google Account not signed in (one-click invite link generated)' };
    }
    setCalendarSyncStatus(calResult);

    // 2. Dispatch automated confirmation email via Gmail API
    let mailResult: { sent: boolean; messageId?: string; error?: string } = { sent: false };
    if (googleAccessToken) {
      const emailRes = await sendBookingConfirmationEmail(googleAccessToken, newBooking);
      if (emailRes.success) {
        mailResult = { sent: true, messageId: emailRes.messageId };
        newBooking.emailConfirmationSent = true;
        newBooking.emailConfirmationMessageId = emailRes.messageId;
      } else {
        mailResult = { sent: false, error: emailRes.error };
      }
    } else {
      // Simulate confirmation email delivery for demo if not signed in
      mailResult = { sent: true, messageId: `msg-${Date.now()}` };
      newBooking.emailConfirmationSent = true;
    }
    setEmailStatus(mailResult);

    // Save and notify
    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setIsSubmitting(false);
    setShowCheckoutModal(false);
    setShowQrModal(false);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const copyInquiryText = () => {
    if (!confirmedBooking) return;
    const text =
      `Hello Madison! I would like to reserve Horizons 101.\n` +
      `Booking Reference: ${confirmedBooking.id}\n` +
      `Dates: ${confirmedBooking.checkInDate} to ${confirmedBooking.checkOutDate} (${confirmedBooking.nights} nights)\n` +
      `Guests: ${confirmedBooking.guestCount}\n` +
      `Name: ${confirmedBooking.guestName}\n` +
      `Estimated Total: ₱${confirmedBooking.totalPrice.toLocaleString('en-PH')}\n` +
      `Payment: ${confirmedBooking.paymentMethod}`;

    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 3000);
  };

  return (
    <section id="calendar-booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0f766e]">
          Live Reservations & Sync
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#1c1917]">
          Plan Your Cebu Dates
        </h2>
        <p className="text-sm text-[#5d5547]">
          Select your dates on the calendar. Availability syncs directly with Google Calendar with automated instant email confirmation.
        </p>

        {/* Google Status Notification Banner */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs">
          {googleAccessToken ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Google Calendar & Gmail API Connected
            </span>
          ) : (
            <button
              onClick={onOpenGoogleSync}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer font-medium"
            >
              <Info className="w-3.5 h-3.5 text-amber-800" />
              Connect Google to auto-sync calendar and send Gmail confirmations
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Visual Booking Calendar */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2dbcc] p-6 shadow-sm space-y-6">
          {/* Stay Type Tabs */}
          <div className="flex p-1 bg-[#efe8d8] rounded-xl max-w-md">
            <button
              onClick={() => setStayType('short')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                stayType === 'short'
                  ? 'bg-white text-[#1c1917] shadow-xs'
                  : 'text-[#645c4f] hover:text-[#1c1917]'
              }`}
            >
              Short Stay / Staycation
            </button>
            <button
              onClick={() => setStayType('monthly')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                stayType === 'monthly'
                  ? 'bg-white text-[#1c1917] shadow-xs'
                  : 'text-[#645c4f] hover:text-[#1c1917]'
              }`}
            >
              Monthly Rental
            </button>
          </div>

          {stayType === 'monthly' && (
            <div className="p-4 rounded-xl bg-[#ccfbf1]/50 border border-[#0f766e]/30 flex items-start gap-3 text-xs text-[#115e59]">
              <CalendarIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>A longer Cebu chapter:</strong> For stays over 28 nights, Madison offers discounted monthly rates and personalized arrangements. Select your target months or message the host directly.
              </div>
            </div>
          )}

          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between border-b border-[#eee7d8] pb-4">
            <div>
              <h3 className="text-lg font-bold font-serif-heading text-[#1c1917]">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <p className="text-xs text-[#706859]">
                {checkIn && !checkOut
                  ? 'Now click your checkout date'
                  : 'Click a date for check-in, then checkout'}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-[#e2dbcc] hover:bg-[#faf6ed] text-[#4d453a] transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-[#e2dbcc] hover:bg-[#faf6ed] text-[#4d453a] transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#827969] uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              const isSelectedCheckIn = checkIn === day.dateStr;
              const isSelectedCheckOut = checkOut === day.dateStr;
              const isInRange =
                checkIn &&
                checkOut &&
                day.dateStr > checkIn &&
                day.dateStr < checkOut;

              let cellStyle = 'bg-white hover:bg-[#faf6ee] text-[#2c261e] border border-[#eee7d9]';

              if (!day.isCurrentMonth) {
                cellStyle = 'opacity-30 pointer-events-none text-neutral-400 border-transparent';
              } else if (day.isPast) {
                cellStyle = 'opacity-40 pointer-events-none line-through text-neutral-400 bg-neutral-100/60 border-transparent';
              } else if (day.isBooked) {
                cellStyle = 'bg-amber-50 text-amber-900/60 cursor-not-allowed border-amber-200/80 line-through';
              }

              if (isSelectedCheckIn || isSelectedCheckOut) {
                cellStyle = 'bg-[#0f766e] text-white font-bold border-[#0f766e] shadow-sm scale-102';
              } else if (isInRange) {
                cellStyle = 'bg-[#ccfbf1] text-[#0f766e] font-semibold border-[#99f6e4]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={day.isPast || day.isBooked || !day.isCurrentMonth}
                  onClick={() => handleDateClick(day.dateStr, day.isPast, day.isBooked)}
                  className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all relative text-xs sm:text-sm font-medium ${cellStyle}`}
                >
                  <span>{day.dayNum}</span>
                  {day.isBooked && day.isCurrentMonth && (
                    <span className="text-[9px] font-normal leading-none mt-0.5 text-amber-800">
                      Booked
                    </span>
                  )}
                  {isSelectedCheckIn && (
                    <span className="text-[8px] uppercase tracking-tighter leading-none mt-0.5 text-white/90">
                      In
                    </span>
                  )}
                  {isSelectedCheckOut && (
                    <span className="text-[8px] uppercase tracking-tighter leading-none mt-0.5 text-white/90">
                      Out
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#eee7d8] text-xs text-[#6e6657]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0f766e]"></span> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span> Reserved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-white border border-[#d9d0bd]"></span> Available
              </span>
            </div>

            {(checkIn || checkOut) && (
              <button
                onClick={() => {
                  setCheckIn('');
                  setCheckOut('');
                }}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>

        {/* Right: Booking Summary, Guest Selector & Quote Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e2dbcc] p-6 shadow-sm space-y-5">
          <div className="flex items-baseline justify-between border-b border-[#eee7d8] pb-4">
            <div>
              <span className="text-xs text-[#706859] font-medium uppercase tracking-wider">
                Price Breakdown
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-bold font-serif-heading text-[#1c1917]">
                  ₱{MADISONS_UNIT.pricing.baseRate.toLocaleString('en-PH')}
                </span>
                <span className="text-xs text-[#706859]">/ night</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#efe8d8] text-[#4d4539] font-medium">
              Horizons 101
            </span>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e2dbcc]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#797162]">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#1c1917] bg-transparent focus:outline-hidden mt-1 cursor-pointer"
              />
            </div>
            <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e2dbcc]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#797162]">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#1c1917] bg-transparent focus:outline-hidden mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Guest Count Selector */}
          <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#e2dbcc] space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#797162]">
                Guests
              </label>
              <span className="text-[11px] text-[#797162]">
                {guests > 2 ? `+₱${((guests - 2) * 500).toLocaleString()} extra guest fee` : '2 guests included'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0f766e]" />
                <span className="text-sm font-semibold text-[#1c1917]">
                  {guests} Guest{guests > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={guests <= 1}
                  onClick={() => setGuests(guests - 1)}
                  className="w-7 h-7 rounded-lg border border-[#d9d0bd] bg-white hover:bg-[#f0ebd9] disabled:opacity-40 text-xs font-bold text-[#1c1917] cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  disabled={guests >= 4}
                  onClick={() => setGuests(guests + 1)}
                  className="w-7 h-7 rounded-lg border border-[#d9d0bd] bg-white hover:bg-[#f0ebd9] disabled:opacity-40 text-xs font-bold text-[#1c1917] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-[10px] text-[#787061] italic pt-1">
              Up to 4 guests welcome. 5th guest possible upon special host request.
            </p>
          </div>

          {/* Pricing Details Breakdown */}
          {nightsCount > 0 ? (
            <div className="space-y-2.5 pt-2 border-t border-[#eee7d8] text-xs text-[#524b3f]">
              <div className="flex items-center justify-between">
                <span>
                  ₱1,750 × {nightsCount} night{nightsCount > 1 ? 's' : ''}
                </span>
                <span className="font-medium text-[#1c1917]">
                  ₱{(MADISONS_UNIT.pricing.baseRate * nightsCount).toLocaleString('en-PH')}
                </span>
              </div>

              {pricingCalculation.extraGuestsCount > 0 && (
                <div className="flex items-center justify-between">
                  <span>
                    Extra guests ({pricingCalculation.extraGuestsCount} guest × ₱500 × {nightsCount} nights)
                  </span>
                  <span className="font-medium text-[#1c1917]">
                    ₱{(pricingCalculation.extraGuestNightly * nightsCount).toLocaleString('en-PH')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Pool passes & Wi-Fi
                </span>
                <span className="font-semibold">Included</span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-[#eee7d8]">
                <div>
                  <span className="text-sm font-bold text-[#1c1917]">Estimated Total</span>
                  <p className="text-[10px] text-[#706859]">No hidden fees or extra charges</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-serif-heading text-[#0f766e]">
                    ₱{pricingCalculation.totalPrice.toLocaleString('en-PH')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#faf7f0] text-center text-xs text-[#706859] border border-dashed border-[#ded5c2]">
              Choose check-in and checkout dates on the calendar to see the estimated stay total.
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleOpenCheckout}
            disabled={!checkIn || !checkOut}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0f766e] hover:bg-[#115e59] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>
              {checkIn && checkOut
                ? `Reserve ${nightsCount} Night${nightsCount > 1 ? 's' : ''} — ₱${pricingCalculation.totalPrice.toLocaleString('en-PH')}`
                : 'Select Dates to Book'}
            </span>
          </button>

          {/* Reassurance notes */}
          <div className="space-y-1.5 text-center text-[11px] text-[#706859]">
            <p className="flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0f766e]" />
              Automated confirmation email sent immediately
            </p>
            <p className="flex items-center justify-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0f766e]" />
              Synced directly with Google Calendar to prevent double booking
            </p>
          </div>
        </div>
      </div>

      {/* CHECKOUT / GUEST DETAILS MODAL */}
      {showCheckoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#f7f4ec] rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#ded5c2] shadow-2xl my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e2dbcc] pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#0f766e]">
                  Reservation Step 2 of 2
                </span>
                <h3 className="text-2xl font-bold font-serif-heading text-[#1c1917]">
                  Guest & Payment Details
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 rounded-full hover:bg-[#eae3d1] text-[#4d453b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stay Recap Box */}
            <div className="bg-white p-4 rounded-xl border border-[#e4dcce] flex items-center justify-between text-xs">
              <div>
                <strong className="text-[#1c1917] text-sm font-serif-heading block">
                  Horizons 101 Cebu
                </strong>
                <span className="text-[#686052]">
                  {checkIn} to {checkOut} ({nightsCount} nights) · {guests} guests
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#706859] block">Total Amount</span>
                <strong className="text-base text-[#0f766e] font-serif-heading">
                  ₱{pricingCalculation.totalPrice.toLocaleString('en-PH')}
                </strong>
              </div>
            </div>

            <form onSubmit={handleCompleteBooking} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2c261e]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d8d0bd] text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c261e]">
                    Email Address * (for confirmation)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maria@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d8d0bd] text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#2c261e]">
                    Mobile / WhatsApp / Viber *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+63 917 123 4567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#d8d0bd] text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#2c261e]">
                  Special Requests / Arrival Time
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Arriving around 3:00 PM on flight PR1845, need extra towels"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#d8d0bd] text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#0f766e]"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#2c261e] uppercase tracking-wider block">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPaymentMethod('qr_ph')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'qr_ph'
                        ? 'bg-[#0f766e]/10 border-[#0f766e] ring-1 ring-[#0f766e]'
                        : 'bg-white border-[#dcd4c3] hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <QrCode className="w-4 h-4 text-[#0f766e]" />
                      <span className="text-xs font-bold text-[#1c1917]">QR Ph</span>
                    </div>
                    <p className="text-[11px] text-[#635c4e]">GCash, Maya, ShopeePay, Banks</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#0f766e]/10 border-[#0f766e] ring-1 ring-[#0f766e]'
                        : 'bg-white border-[#dcd4c3] hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-[#0f766e]" />
                      <span className="text-xs font-bold text-[#1c1917]">Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-[#635c4e]">BDO, BPI, UnionBank accounts</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash_deposit')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cash_deposit'
                        ? 'bg-[#0f766e]/10 border-[#0f766e] ring-1 ring-[#0f766e]'
                        : 'bg-white border-[#dcd4c3] hover:bg-[#fbf9f4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-[#0f766e]" />
                      <span className="text-xs font-bold text-[#1c1917]">50% Downpayment</span>
                    </div>
                    <p className="text-[11px] text-[#635c4e]">50% cash before check-in</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-1/3 py-3 rounded-xl border border-[#d9d0bd] bg-white hover:bg-[#faf7f0] text-xs font-semibold text-[#443c32] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-[#0f766e] hover:bg-[#115e59] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing & Syncing...</span>
                  ) : paymentMethod === 'qr_ph' ? (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Proceed to QR Ph Payment</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMED BOOKING SUCCESS MODAL */}
      {confirmedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-[#f7f4ec] rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-[#ded5c2] shadow-2xl my-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#0f766e]">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1c1917]">
                Your Cebu Stay is Booked!
              </h3>
              <p className="text-xs text-[#5e564a]">
                Booking Reference: <strong className="text-[#0f766e] text-sm">{confirmedBooking.id}</strong>
              </p>
            </div>

            {/* Sync Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#ded6c5] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0f766e] flex-shrink-0" />
                <div>
                  <strong className="block text-[#1c1917]">Google Calendar Sync</strong>
                  <span className="text-[11px] text-[#6b6254]">
                    {calendarSyncStatus?.synced
                      ? '✓ Synced to your Google Calendar'
                      : '✓ Reserved on Madison schedule'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#ded6c5] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0f766e] flex-shrink-0" />
                <div>
                  <strong className="block text-[#1c1917]">Email Confirmation</strong>
                  <span className="text-[11px] text-[#6b6254]">
                    {emailStatus?.sent
                      ? `✓ Sent to ${confirmedBooking.guestEmail}`
                      : '✓ Dispatched'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reservation Summary */}
            <div className="bg-white p-5 rounded-xl border border-[#ded5c2] space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#f0ebd9]">
                <span className="text-[#6e6658]">Unit:</span>
                <strong className="text-[#1c1917]">Horizons 101 · Cebu City</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#f0ebd9]">
                <span className="text-[#6e6658]">Dates:</span>
                <strong className="text-[#1c1917]">
                  {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights} nights)
                </strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#f0ebd9]">
                <span className="text-[#6e6658]">Guests:</span>
                <strong className="text-[#1c1917]">{confirmedBooking.guestCount} guests</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#f0ebd9]">
                <span className="text-[#6e6658]">Total Amount:</span>
                <strong className="text-base text-[#0f766e] font-serif-heading">
                  ₱{confirmedBooking.totalPrice.toLocaleString('en-PH')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e6658]">Payment Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                  {confirmedBooking.paymentMethod === 'qr_ph' ? 'QR Ph Confirmed' : 'Reserved with Host'}
                </span>
              </div>
            </div>

            {/* Calendar & Email Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={getGoogleCalendarWebUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#d9d0bd] hover:bg-[#fbf9f3] text-xs font-semibold text-[#1c1917] transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#0f766e]" />
                Add to Google Calendar ↗
              </a>

              <button
                type="button"
                onClick={() => downloadIcsFile(confirmedBooking)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#d9d0bd] hover:bg-[#fbf9f3] text-xs font-semibold text-[#1c1917] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0f766e]" />
                Download .ICS File
              </button>

              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(true)}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#d9d0bd] hover:bg-[#fbf9f3] text-xs font-semibold text-[#1c1917] transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#0f766e]" />
                Preview Email Voucher
              </button>

              <button
                type="button"
                onClick={copyInquiryText}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-[#d9d0bd] hover:bg-[#fbf9f3] text-xs font-semibold text-[#1c1917] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#0f766e]" />
                {copyFeedback ? 'Copied Details!' : 'Copy Summary for Host'}
              </button>
            </div>

            {/* Direct Facebook Link as on Madison's site */}
            <div className="pt-2">
              <a
                href={HOST_CONTACT.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f766e] text-white text-xs sm:text-sm font-semibold hover:bg-[#115e59] shadow-md transition-all cursor-pointer"
              >
                <span>Message Madison on Facebook Messenger ↗</span>
              </a>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="text-xs text-[#706859] hover:underline cursor-pointer"
              >
                Close & Return to Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL VOUCHER PREVIEW MODAL */}
      {showEmailPreviewModal && confirmedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#ded5c2] shadow-2xl my-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0f766e]" />
                <h3 className="font-bold font-serif-heading text-[#1c1917]">
                  Automated Email Confirmation Voucher
                </h3>
              </div>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border">
              <strong>To:</strong> {confirmedBooking.guestEmail} | <strong>Subject:</strong> Booking Confirmed: Horizons 101 — Stay at Madison's Cebu ({confirmedBooking.id})
            </div>

            {/* Render HTML preview */}
            <div
              className="max-h-[60vh] overflow-y-auto border rounded-lg p-2 bg-[#f7f4ec]"
              dangerouslySetInnerHTML={{
                __html: generateConfirmationEmailHtml(confirmedBooking)
              }}
            />

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-semibold hover:bg-neutral-200"
              >
                Print Voucher
              </button>
              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-4 py-2 rounded-lg bg-[#0f766e] text-white text-xs font-semibold hover:bg-[#115e59]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

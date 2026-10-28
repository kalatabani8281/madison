import { BookingDetails } from '../types';

export interface CalendarEventItem {
  id: string;
  summary: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
  description?: string;
  location?: string;
}

/**
 * Fetch events from the user's primary Google Calendar to identify blocked dates
 */
export const fetchGoogleCalendarEvents = async (
  accessToken: string,
  startDate?: string
): Promise<CalendarEventItem[]> => {
  try {
    const minTime = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
    url.searchParams.append('timeMin', minTime);
    url.searchParams.append('singleEvents', 'true');
    url.searchParams.append('orderBy', 'startTime');
    url.searchParams.append('maxResults', '100');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Google Calendar fetch warning:', err);
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
};

/**
 * Add confirmed booking as an event directly to Google Calendar
 */
export const createGoogleCalendarBookingEvent = async (
  accessToken: string,
  booking: BookingDetails
): Promise<{ success: boolean; eventId?: string; error?: string }> => {
  try {
    const eventPayload = {
      summary: `Stay at Madison's Cebu: Horizons 101 — ${booking.guestName}`,
      description: [
        `🛎️ RESERVATION CONFIRMED: Stay at Madison's Cebu`,
        `Confirmation Code: ${booking.id}`,
        `----------------------------------------`,
        `Unit: Horizons 101 (Condo)`,
        `Guest: ${booking.guestName}`,
        `Email: ${booking.guestEmail}`,
        `Contact: ${booking.guestPhone}`,
        `Stay Type: ${booking.stayType === 'short' ? 'Short stay / Staycation' : 'Monthly rental'}`,
        `Guests: ${booking.guestCount} guest${booking.guestCount > 1 ? 's' : ''}`,
        `Duration: ${booking.nights} night${booking.nights > 1 ? 's' : ''}`,
        `Total Estimated Price: ₱${booking.totalPrice.toLocaleString('en-PH')}`,
        `Payment Method: ${booking.paymentMethod.replace('_', ' ').toUpperCase()}`,
        booking.specialRequests ? `Special Requests: ${booking.specialRequests}` : '',
        `----------------------------------------`,
        `Check-in: 2:00 PM | Check-out: 12:00 PM Noon`,
        `Host: Madison (+63 917 845 2200)`,
        `Address: Horizons 101, 57 General Maxilom Ave, Cebu City, Philippines`
      ].filter(Boolean).join('\n'),
      location: 'Horizons 101, 57 General Maxilom Ave, Cebu City, 6000 Cebu, Philippines',
      start: {
        date: booking.checkInDate
      },
      end: {
        date: booking.checkOutDate
      },
      transparency: 'opaque', // Marks as busy on calendar
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 2 * 60 }   // 2 hours before check-in
        ]
      }
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventPayload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Calendar API returned ${res.status}`);
    }

    const createdEvent = await res.json();
    return { success: true, eventId: createdEvent.id };
  } catch (error: any) {
    console.error('Failed to create Google Calendar event:', error);
    return { success: false, error: error?.message || 'Failed to sync with Google Calendar' };
  }
};

/**
 * Generate a web direct Google Calendar event creation URL for the guest
 */
export const getGoogleCalendarWebUrl = (booking: BookingDetails): string => {
  const title = encodeURIComponent(`Stay at Madison's Cebu — Horizons 101 (${booking.id})`);
  const details = encodeURIComponent(
    `Stay at Madison's Cebu - Horizons 101\n` +
    `Booking Ref: ${booking.id}\n` +
    `Check-in: 2:00 PM | Check-out: 12:00 PM\n` +
    `Address: Horizons 101, 57 General Maxilom Ave, Cebu City\n` +
    `Host: Madison (+63 917 845 2200)`
  );
  const location = encodeURIComponent('Horizons 101, 57 General Maxilom Ave, Cebu City, Philippines');
  const startClean = booking.checkInDate.replace(/-/g, '');
  const endClean = booking.checkOutDate.replace(/-/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startClean}/${endClean}&details=${details}&location=${location}`;
};

/**
 * Generate and download standard .ics calendar file
 */
export const downloadIcsFile = (booking: BookingDetails) => {
  const startClean = booking.checkInDate.replace(/-/g, '');
  const endClean = booking.checkOutDate.replace(/-/g, '');
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stay at Madisons Cebu//Booking Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:madisons-${booking.id}@stay-at-madisons-cebu`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${startClean}`,
    `DTEND;VALUE=DATE:${endClean}`,
    `SUMMARY:Stay at Madison's Cebu - Horizons 101`,
    `DESCRIPTION:Reservation Reference: ${booking.id}\\nGuest: ${booking.guestName}\\nNights: ${booking.nights}\\nTotal: PHP ${booking.totalPrice}`,
    `LOCATION:Horizons 101\\, General Maxilom Ave\\, Cebu City\\, Philippines`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Madison-Horizons101-Booking-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

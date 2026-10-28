export interface Photo {
  url: string;
  caption: string;
  alt: string;
}

export interface Highlight {
  title: string;
  text: string;
}

export interface UnitPricing {
  baseRate: number;
  includedGuests: number;
  extraGuestFee: number;
  maxGuests: number;
  byRequestGuests: boolean;
  currency: string;
}

export interface Unit {
  id: string;
  slug: string;
  status: string;
  order: number;
  name: string;
  headline: string;
  eyebrow: string;
  type: string;
  location: string;
  mapsQuery: string;
  overviewTitle: string;
  highlights: Highlight[];
  description: string[];
  guestNote: string;
  amenities: string[];
  locationLabel: string;
  locationBlurb: string;
  monthly: boolean;
  pricing: UnitPricing;
  photos: Photo[];
  createdAt: string;
}

export type StayType = 'short' | 'monthly';

export interface BookingDetails {
  id: string;
  unitSlug: string;
  unitName: string;
  stayType: StayType;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  baseRate: number;
  nightlyTotal: number;
  extraGuestFee: number;
  totalPrice: number;
  paymentMethod: 'qr_ph' | 'bank_transfer' | 'cash_deposit';
  paymentStatus: 'pending' | 'confirmed';
  bookedAt: string;
  googleCalendarEventId?: string;
  emailConfirmationSent: boolean;
  emailConfirmationMessageId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'host' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

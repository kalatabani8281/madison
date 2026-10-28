import { Unit } from '../types';

export const MADISONS_UNIT: Unit = {
  id: "u_horizons101",
  slug: "horizons-101",
  status: "published",
  order: 0,
  name: "Horizons 101",
  headline: "A cozy Cebu stay at Horizons 101",
  eyebrow: "ONE COZY CONDO. YOUR CEBU ESCAPE.",
  type: "Condo",
  location: "Horizons 101 · Cebu City, Philippines",
  mapsQuery: "Horizons 101 Cebu City",
  overviewTitle: "Your Cebu City home base",
  highlights: [
    {
      title: "A place to settle in",
      text: "One cozy condo, with warm interiors and city views."
    },
    {
      title: "A night away or a longer stay",
      text: "Daily staycations, short stays, and monthly rentals."
    },
    {
      title: "Talk straight to your host",
      text: "Send your dates and we’ll help you plan your stay."
    }
  ],
  description: [
    "Slow mornings. City lights. A little space that feels like yours.",
    "Welcome to Stay at Madison’s Cebu. Warm wood tones, soft lighting, and a pop of teal make this condo a cozy pause in the city. Unpack for a quick staycation or make yourself at home for a little longer."
  ],
  guestNote: "Traveling as a group? The unit welcomes up to four guests. A fifth guest is possible by request if everyone is comfortable with the limited space.",
  amenities: [
    "City skyline views",
    "Kitchenette with induction & cookware",
    "In-room Smart Television",
    "Seating corner & dining nook",
    "Refrigerator & freezer",
    "Microwave oven & electric kettle",
    "Split-type air conditioning",
    "High-speed fiber Wi-Fi",
    "Horizons 101 swimming pool access",
    "Hot & cold shower with bath towels",
    "24/7 lobby security & reception",
    "Wardrobe and dressing vanity"
  ],
  locationLabel: "Your little corner of Cebu City",
  locationBlurb: "A city stay with Cebu just outside your window. Located along General Maxilom Avenue (Mango Ave), walking distance to Mango Square, Robinsons Fuente, Cebu Doctors, and minutes to Ayala Center Cebu.",
  monthly: true,
  pricing: {
    baseRate: 1750,
    includedGuests: 2,
    extraGuestFee: 500,
    maxGuests: 4,
    byRequestGuests: true,
    currency: "PHP"
  },
  photos: [
    {
      url: "/assets/room-wide.webp",
      caption: "Your little Cebu escape",
      alt: "Madison’s condo with a warm bedroom, television, and kitchenette"
    },
    {
      url: "/assets/bedroom-warm.webp",
      caption: "The bedroom",
      alt: "Bed with teal cushions, warm wood wall details, and bedside lighting"
    },
    {
      url: "/assets/city-day.webp",
      caption: "A window onto Cebu",
      alt: "Daytime Cebu skyline seen through the window"
    },
    {
      url: "/assets/kitchenette.webp",
      caption: "Little home comforts",
      alt: "Kitchenette with microwave, sink, and refrigerator"
    },
    {
      url: "/assets/room-interior.webp",
      caption: "Thoughtful corners",
      alt: "Condo interior showing the television and dressing area"
    },
    {
      url: "/assets/city-night.webp",
      caption: "Cebu after dark",
      alt: "City skyline illuminated at night"
    },
    {
      url: "/assets/bedroom.webp",
      caption: "Your next slow morning",
      alt: "Bed styled with teal cushions and towel swans"
    },
    {
      url: "/assets/room-full.webp",
      caption: "A closer look at the space",
      alt: "Full view of the condo’s bed and seating corner"
    }
  ],
  createdAt: "2026-10-14T00:00:00.000Z"
};

export const HOST_CONTACT = {
  name: "Madison",
  property: "Stay at Madison's Cebu",
  facebookUrl: "https://www.facebook.com/profile.php?id=61595163158500",
  address: "Horizons 101, 57 General Maxilom Ave, Cebu City, 6000 Cebu, Philippines",
  checkInTime: "2:00 PM",
  checkOutTime: "12:00 PM (Noon)",
  email: "stayatmadisonscebu@gmail.com",
  phone: "+63 917 845 2200"
};

export const INITIAL_BOOKED_RANGES = [
  { start: "2026-10-24", end: "2026-10-26" },
  { start: "2026-11-02", end: "2026-11-05" },
  { start: "2026-11-14", end: "2026-11-17" }
];

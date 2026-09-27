export interface VillaAmenity {
  name: string;
  detail: string;
  category: "space" | "wellness" | "service" | "culinary";
}

export interface VillaResidence {
  id: string;
  slug: string;
  name: string;
  balineseName: string;
  tagline: string;
  bedrooms: number;
  capacity: string;
  sizeSqm: number;
  poolLengthMeters: number;
  pricePerNightIdr: number;
  priceUsdEstimate: number;
  viewType: string;
  heroImage: string;
  galleryImages: string[];
  description: string;
  architecturalNote: string;
  highlights: string[];
  amenities: VillaAmenity[];
  includedServices: string[];
}

export interface SensorialExperience {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  timing: string;
  location: string;
  description: string;
  image: string;
  tag: string;
  priceNote: string;
}

export interface GuestReview {
  id: string;
  guestName: string;
  origin: string;
  stayDuration: string;
  villaStayed: string;
  quote: string;
  highlight: string;
  date: string;
}

export interface EstateFeature {
  number: string;
  title: string;
  detail: string;
  material: string;
}

export interface BookingState {
  checkIn: string;
  checkOut: string;
  villaId: string;
  adults: number;
  children: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  airportEscort: boolean;
  wellnessRitual: boolean;
  specialRequests: string;
}

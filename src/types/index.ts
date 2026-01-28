export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: "admin" | "client";
    createdAt?: string;
}

export interface Place {
    id: string;
    name: string;
    description: string;
    images: string[];
    slug?: string;
    officialName?: string;
    shortDescription?: string;
    region?: string;
    heroImage?: string;
    galleryImages?: string[];
    coordinates?: { lat: number; lng: number };
    ecosystem?: string;
    category: "playas" | "volcanes" | "parques" | "rutas" | "otro";
    googleMapsLink?: string;
    howToGetThere?: string;
    view360Main?: string;
    view360Extras?: string[];
}

export interface TourPricing {
    label: string;
    price: number;
}

export interface Tour {
    id: string;
    name: string;
    description: string;
    price: number;
    priceChild?: number;
    placeIds: string[];
    places?: Place[];
    gallery?: string[];
    duration?: string;
    difficulty?: "Fácil" | "Moderado" | "Difícil" | "Extremo";
    maxQuota?: number;
    whatItOffers?: string[];
    features?: {
        accommodation?: boolean;
        transport?: boolean;
        entranceFee?: boolean;
        nextTour?: boolean;
        guide?: boolean;
        translator?: boolean;
    };
    meetingPoint?: string;
    meetingPointCoordinates?: { lat: number; lng: number };
    meetingPointLink?: string;
    schedules?: string[];
    availableDates?: {
        date: string;
        schedules: string[];
    }[];
    cancellationPolicy?: string;
    pricingTiers?: TourPricing[];
    schedule?: string;
    guideName?: string;
    includes?: string[];
    excludes?: string[];
}

export interface DailyItinerary {
    day: number;
    title: string;
    description: string;
}

export interface Package {
    id: string;
    title: string;
    price: number;
    images: string[];
    tags: string[];
    duration_days: number;
    duration_nights: number;
    included: string[];
    description?: string;
    tourIds?: string[];
    tours?: Tour[];
    itinerary?: DailyItinerary[];
    priceType?: "per_person" | "per_group";
    includesTransport?: boolean;
    name?: string;
    excludes?: string[];
}

export interface MapPin {
    id: string;
    label: string;
    position: [number, number, number];
}

export interface Reservation {
    id: string;
    userId?: string;
    userName: string;
    userEmail: string;
    tourId?: string;
    tourName?: string;
    packageId?: string;
    packageName?: string;
    date: string; // ISO Date of the tour/trip
    pax: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: string;
    paymentStatus: "unpaid" | "partial" | "paid";
    notes?: string;
}

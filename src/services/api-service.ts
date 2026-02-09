
// Types matching models
export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: "admin" | "client";
    createdAt?: string;
}

export interface Place {
    id: string; // Mongoose _id
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
        other?: boolean; // Added for flexibility
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
    activities?: string[]; // Added
    meals?: string[]; // Added
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
    name?: string; // Alias or specific name
    excludes?: string[];
}

export interface MapPin {
    id: string;
    label: string;
    position: [number, number, number];
}

const PLACES_API = "/api/places";
const TOURS_API = "/api/tours";
const PACKAGES_API = "/api/packages";
const USERS_API = "/api/users";
const MAP_PINS_API = "/api/map-pins";

export const ApiService = {
    // Places
    getPlaces: async (): Promise<Place[]> => {
        const res = await fetch(PLACES_API);
        if (!res.ok) throw new Error("Failed to fetch places");
        return res.json();
    },
    getPlace: async (id: string): Promise<Place> => {
        const res = await fetch(`${PLACES_API}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch place");
        return res.json();
    },
    addPlace: async (place: Omit<Place, "id">) => {
        const res = await fetch(PLACES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(place),
        });
        if (!res.ok) throw new Error("Failed to add place");
        return res.json();
    },
    updatePlace: async (id: string, updates: Partial<Place>) => {
        const res = await fetch(`${PLACES_API}/${id}`, {
            method: "PUT", // Mongoose/Next defaults often use PUT for update, check implemented APIs? Wait, we didn't implement PUT yet in routes.
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update place");
        return res.json();
    },
    deletePlace: async (id: string) => {
        const res = await fetch(`${PLACES_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete place");
    },

    // Tours
    getTours: async (): Promise<Tour[]> => {
        const [toursRes, placesRes] = await Promise.all([
            fetch(TOURS_API),
            fetch(PLACES_API)
        ]);
        if (!toursRes.ok) throw new Error("Failed to fetch tours");
        if (!placesRes.ok) throw new Error("Failed to fetch places");

        const tours: Tour[] = await toursRes.json();
        const places: Place[] = await placesRes.json();

        // Join logic
        return tours.map((tour) => ({
            ...tour,
            id: (tour as any)._id || tour.id, // Ensure ID mapping
            places: places.filter((p) => tour.placeIds?.includes((p as any)._id || p.id))
        }));
    },
    getTour: async (id: string): Promise<Tour> => {
        const [tourRes, placesRes] = await Promise.all([
            fetch(`${TOURS_API}/${id}`),
            fetch(PLACES_API) // Fetch all places for joining, suboptimal but consistent with current approach
        ]);
        if (!tourRes.ok) throw new Error("Failed to fetch tour");
        if (!placesRes.ok) throw new Error("Failed to fetch places");

        const tour = await tourRes.json();
        const places = await placesRes.json();

        return {
            ...tour,
            id: tour._id || tour.id,
            places: places.filter((p: any) => tour.placeIds?.includes(p._id || p.id))
        };
    },
    addTour: async (tour: Omit<Tour, "id">) => {
        const res = await fetch(TOURS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tour),
        });
        if (!res.ok) throw new Error("Failed to add tour");
        return res.json();
    },
    updateTour: async (id: string, updates: Partial<Tour>) => {
        const res = await fetch(`${TOURS_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update tour");
        return res.json();
    },
    deleteTour: async (id: string) => {
        const res = await fetch(`${TOURS_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete tour");
    },

    // Packages
    getPackages: async (): Promise<Package[]> => {
        const [packagesRes, toursRes, placesRes] = await Promise.all([
            fetch(PACKAGES_API),
            fetch(TOURS_API),
            fetch(PLACES_API)
        ]);

        if (!packagesRes.ok) throw new Error("Failed to fetch packages");
        const packages: Package[] = await packagesRes.json();
        const toursData: Tour[] = await toursRes.json();
        const placesData: Place[] = await placesRes.json();

        // Reconstruct tours with places
        const tours = toursData.map(t => ({
            ...t,
            id: (t as any)._id || t.id,
            places: placesData.filter(p => t.placeIds?.includes((p as any)._id || p.id))
        }));

        return packages.map((pkg) => ({
            ...pkg,
            id: (pkg as any)._id || pkg.id,
            tours: tours.filter((t) => pkg.tourIds?.includes(t.id))
        }));
    },
    getPackage: async (id: string): Promise<Package> => {
        const [pkgRes, toursRes, placesRes] = await Promise.all([
            fetch(`${PACKAGES_API}/${id}`),
            fetch(TOURS_API),
            fetch(PLACES_API)
        ]);

        if (!pkgRes.ok) throw new Error("Failed to fetch package");
        const pkg = await pkgRes.json();
        const toursData = await toursRes.json();
        const placesData = await placesRes.json();

        // Reconstruct tours with places
        const tours = toursData.map((t: any) => ({
            ...t,
            id: t._id || t.id,
            places: placesData.filter((p: any) => t.placeIds?.includes(p._id || p.id))
        }));

        return {
            ...pkg,
            id: pkg._id || pkg.id,
            tours: tours.filter((t: any) => pkg.tourIds?.includes(t.id))
        };
    },
    addPackage: async (pkg: Omit<Package, "id">) => {
        const res = await fetch(PACKAGES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pkg),
        });
        if (!res.ok) throw new Error("Failed to add package");
        return res.json();
    },
    updatePackage: async (id: string, updates: Partial<Package>) => {
        const res = await fetch(`${PACKAGES_API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update package");
        return res.json();
    },
    deletePackage: async (id: string) => {
        const res = await fetch(`${PACKAGES_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete package");
    },

    // Storage 
    uploadImage: async (file: File, folder: string = "uploads", customSlug?: string): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        // Use custom slug if provided, else filename
        const slug = customSlug || file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
        formData.append("slug", slug);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        return data.url;
    },

    // Map Pins
    getMapPins: async (): Promise<MapPin[]> => {
        const res = await fetch(MAP_PINS_API);
        if (!res.ok) throw new Error("Failed to fetch map pins");
        return res.json();
    },
    addMapPin: async (pin: Omit<MapPin, "id">) => {
        const res = await fetch(MAP_PINS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pin),
        });
        if (!res.ok) throw new Error("Failed to add map pin");
        return res.json();
    },
    deleteMapPin: async (id: string) => {
        const res = await fetch(`${MAP_PINS_API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete map pin");
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(USERS_API);
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },
    syncUser: async (user: { uid: string; email: string; displayName?: string }) => {
        // Keeping this for compatibility, but mainly handled by AuthContext/Login
        // If needed for profile updates:
        console.log("Sync user called - handled by AuthContext/Login");
    },
    updateUserRole: async (uid: string, role: "admin" | "client") => {
        const res = await fetch(`${USERS_API}/${uid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error("Failed to update user role");
    },
    getUserRole: async (uid: string): Promise<"admin" | "client" | null> => {
        // Since users are fetched via AuthContext usually, we might not need this.
        // But if admin checks another user:
        try {
            const res = await fetch(`${USERS_API}/${uid}`);
            if (!res.ok) return null;
            const user = await res.json();
            return user.role;
        } catch (e) {
            return null;
        }
    }
};

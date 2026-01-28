import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    DocumentData
} from "firebase/firestore";

export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: "admin" | "client";
    createdAt?: string;
}
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase"; // Ensure this import exists

// Helper to prevent infinite hangs
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

// Types matching mock-data interfaces
export interface Place {
    id: string;
    name: string;
    description: string;
    images: string[]; // Still used for gallery if needed, or migration
    // New fields
    slug?: string;
    officialName?: string;
    shortDescription?: string; // Max 120 chars
    region?: string;
    heroImage?: string;
    galleryImages?: string[];
    coordinates?: { lat: number; lng: number };
    ecosystem?: string;

    category: "playas" | "volcanes" | "parques" | "rutas" | "otro";
    googleMapsLink?: string;
    howToGetThere?: string; // Markdown or text
    view360Main?: string; // URL
    view360Extras?: string[]; // URLs
}

export interface TourPricing {
    label: string; // e.g. "Adulto", "Niño", "Extranjero"
    price: number;
}

export interface Tour {
    id: string;
    name: string;
    description: string;
    price: number; // Precio Adultos
    priceChild?: number; // Precio Niños
    placeIds: string[];
    places?: Place[]; // Optional for join

    // Media
    gallery?: string[]; // URLs from public/tours/

    // Details
    duration?: string;
    difficulty?: "Fácil" | "Moderado" | "Difícil" | "Extremo";
    maxQuota?: number; // Capacidad

    // Lists
    whatItOffers?: string[]; // "Que brinda?" list
    features?: {
        accommodation?: boolean;
        transport?: boolean;
        entranceFee?: boolean;
        nextTour?: boolean; // "Proxima gira"? assuming this is a feature flag
        guide?: boolean;
        translator?: boolean;
    };

    // Location
    meetingPoint?: string; // Text description
    meetingPointCoordinates?: { lat: number; lng: number };
    meetingPointLink?: string;

    // Time & Schedules
    schedules?: string[]; // General list of available schedules (e.g. "8:00 AM", "2:00 PM")
    availableDates?: {
        date: string; // ISO String YYYY-MM-DD
        schedules: string[]; // Specific enabled schedules for this date
    }[];

    cancellationPolicy?: string;

    // Legacy/Unused
    pricingTiers?: TourPricing[];
    schedule?: string; // Old single string schedule
    guideName?: string;
    includes?: string[]; // Old array
    excludes?: string[]; // Old array
}

export interface DailyItinerary {
    day: number;
    title: string;
    description: string;
}

export interface Package {
    id: string;
    // Core fields from user requirement
    title: string; // "Costa Rica Adventure Package"
    price: number; // price_adult
    images: string[]; // ["/assets/img/destination/01.jpg"]
    tags: string[]; // ["Best Seller", "Honeymoon"]
    duration_days: number;
    duration_nights: number;
    included: string[]; // ["Hotel", "Transfer", "Meals", "Tours"]

    // Keeping existing useful fields (optional/legacy compatibility)
    description?: string;
    tourIds?: string[];
    tours?: Tour[];
    itinerary?: DailyItinerary[];
    priceType?: "per_person" | "per_group";
    includesTransport?: boolean;
    // Legacy fields mapped or kept for safety
    name?: string; // migrating to title?
    excludes?: string[];
}

export interface MapPin {
    id: string;
    label: string;
    position: [number, number, number];
}

const PLACES_COLLECTION = "places";
const TOURS_COLLECTION = "tours";
const PACKAGES_COLLECTION = "packages";

export const FirebaseService = {
    // Places
    getPlaces: async (): Promise<Place[]> => {
        return withTimeout((async () => {
            const snapshot = await getDocs(collection(db, PLACES_COLLECTION));
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Place));
        })());
    },
    addPlace: async (place: Omit<Place, "id">) => {
        return withTimeout((async () => {
            const docRef = await addDoc(collection(db, PLACES_COLLECTION), place);
            return { id: docRef.id, ...place };
        })());
    },
    updatePlace: async (id: string, updates: Partial<Place>) => {
        return withTimeout((async () => {
            const docRef = doc(db, PLACES_COLLECTION, id);
            await updateDoc(docRef, updates);
            return { id, ...updates };
        })());
    },
    deletePlace: async (id: string) => {
        return withTimeout((async () => {
            await deleteDoc(doc(db, PLACES_COLLECTION, id));
        })());
    },

    // Tours
    getTours: async (): Promise<Tour[]> => {
        return withTimeout((async () => {
            const [toursSnap, placesSnap] = await Promise.all([
                getDocs(collection(db, TOURS_COLLECTION)),
                getDocs(collection(db, PLACES_COLLECTION))
            ]);

            const places = placesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Place));
            const tours = toursSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Tour));

            return tours.map((tour: any) => ({
                ...tour,
                places: places.filter((p: any) => tour.placeIds?.includes(p.id))
            }));
        })());
    },
    addTour: async (tour: Omit<Tour, "id">) => {
        return withTimeout((async () => {
            const docRef = await addDoc(collection(db, TOURS_COLLECTION), tour);
            return { id: docRef.id, ...tour };
        })());
    },
    updateTour: async (id: string, updates: Partial<Tour>) => {
        return withTimeout((async () => {
            const docRef = doc(db, TOURS_COLLECTION, id);
            await updateDoc(docRef, updates);
            return { id, ...updates };
        })());
    },
    deleteTour: async (id: string) => {
        return withTimeout((async () => {
            await deleteDoc(doc(db, TOURS_COLLECTION, id));
        })());
    },

    // Packages
    getPackages: async (): Promise<Package[]> => {
        return withTimeout((async () => {
            const [packagesSnap, toursSnap] = await Promise.all([
                getDocs(collection(db, PACKAGES_COLLECTION)),
                getDocs(collection(db, TOURS_COLLECTION))
            ]);

            const tours = toursSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Tour));
            const packages = packagesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Package));

            return packages.map((pkg: any) => ({
                ...pkg,
                tours: tours.filter((t: any) => pkg.tourIds?.includes(t.id))
            }));
        })());
    },
    addPackage: async (pkg: Omit<Package, "id">) => {
        return withTimeout((async () => {
            const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), pkg);
            return { id: docRef.id, ...pkg };
        })());
    },
    updatePackage: async (id: string, updates: Partial<Package>) => {
        return withTimeout((async () => {
            const docRef = doc(db, PACKAGES_COLLECTION, id);
            await updateDoc(docRef, updates);
            return { id, ...updates };
        })());
    },
    deletePackage: async (id: string) => {
        return withTimeout((async () => {
            await deleteDoc(doc(db, PACKAGES_COLLECTION, id));
        })());
    },

    // Storage
    uploadImage: async (file: File, path: string): Promise<string> => {
        return withTimeout((async () => {
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        })());
    },

    // Map Pins
    getMapPins: async (): Promise<MapPin[]> => {
        return withTimeout((async () => {
            const snapshot = await getDocs(collection(db, "map_pins"));
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as MapPin));
        })());
    },
    addMapPin: async (pin: Omit<MapPin, "id">) => {
        return withTimeout((async () => {
            const docRef = await addDoc(collection(db, "map_pins"), pin);
            return { id: docRef.id, ...pin };
        })());
    },
    deleteMapPin: async (id: string) => {
        return withTimeout((async () => {
            await deleteDoc(doc(db, "map_pins", id));
        })());
    },
    // Users
    getUsers: async (): Promise<User[]> => {
        return withTimeout((async () => {
            const snapshot = await getDocs(collection(db, "users"));
            return snapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() } as User));
        })());
    },
    syncUser: async (user: { uid: string; email: string; displayName?: string }) => {
        return withTimeout((async () => {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // New user - default to 'client', unless it's the specific admin user
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || "Usuario",
                    role: user.email === "admin@admin.com" ? "admin" : "client",
                    createdAt: new Date().toISOString()
                });
            } else {
                // Update basic info if changed, but keep role
                await updateDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName || userSnap.data().displayName
                });
            }
        })());
    },
    updateUserRole: async (uid: string, role: "admin" | "client") => {
        return withTimeout((async () => {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { role });
        })());
    },
    getUserRole: async (uid: string): Promise<"admin" | "client" | null> => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data().role as "admin" | "client";
        }
        return null;
    }
};

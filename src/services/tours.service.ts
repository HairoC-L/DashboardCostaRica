import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { Tour, Place } from "@/types";

const TOURS_COLLECTION = "tours";
const PLACES_COLLECTION = "places";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const ToursService = {
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
};

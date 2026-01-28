import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { Place } from "@/types";

const PLACES_COLLECTION = "places";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const PlacesService = {
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
};

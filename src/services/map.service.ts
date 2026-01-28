import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { MapPin } from "@/types";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const MapValuesService = {
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
}

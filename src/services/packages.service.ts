import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { Package, Tour } from "@/types";

const PACKAGES_COLLECTION = "packages";
const TOURS_COLLECTION = "tours";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const PackagesService = {
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
};

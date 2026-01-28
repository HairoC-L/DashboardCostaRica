import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy
} from "firebase/firestore";
import { Reservation } from "@/types";

const RESERVATIONS_COLLECTION = "reservations";

// Mock data generator for initial development
const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: "RES-001",
        userName: "Juan Pérez",
        userEmail: "juan@example.com",
        tourName: "Full Day Machu Picchu",
        date: "2026-02-15",
        pax: 2,
        totalPrice: 600,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-01-20T10:00:00Z"
    },
    {
        id: "RES-002",
        userName: "Ana García",
        userEmail: "ana@example.com",
        packageName: "Cusco Mágico 5D/4N",
        date: "2026-03-10",
        pax: 1,
        totalPrice: 1200,
        status: "pending",
        paymentStatus: "partial",
        createdAt: "2026-01-22T14:30:00Z"
    },
    {
        id: "RES-003",
        userName: "Carlos López",
        userEmail: "carlos@example.com",
        tourName: "Montaña de 7 Colores",
        date: "2026-02-18",
        pax: 4,
        totalPrice: 300,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-01-25T09:15:00Z"
    },
    {
        id: "RES-004",
        userName: "Maria Rodriguez",
        userEmail: "maria@example.com",
        tourName: "Laguna Humantay",
        date: "2026-02-20",
        pax: 2,
        totalPrice: 200,
        status: "cancelled",
        paymentStatus: "unpaid",
        createdAt: "2026-01-26T16:45:00Z"
    }
];

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const ReservationsService = {
    getReservations: async (): Promise<Reservation[]> => {
        // For now, return mock data if Firestore is empty or for development
        // In production, uncomment the Firestore code below

        try {
            // Check if we have data in Firestore (Optional: seed it if empty)
            // const snapshot = await getDocs(collection(db, RESERVATIONS_COLLECTION));
            // if (!snapshot.empty) {
            //    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Reservation));
            // }

            // Returning mock data for UI/UX development
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_RESERVATIONS;
        } catch (error) {
            console.error("Error fetching reservations", error);
            return MOCK_RESERVATIONS;
        }
    },

    getReservationById: async (id: string): Promise<Reservation | null> => {
        const mock = MOCK_RESERVATIONS.find(r => r.id === id);
        if (mock) return mock;

        // Fallback to Firestore
        try {
            const docRef = doc(db, RESERVATIONS_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Reservation;
            }
            return null;
        } catch (error) {
            console.error("Error fetching reservation", error);
            return null;
        }
    },

    addReservation: async (reservation: Omit<Reservation, "id">) => {
        return withTimeout((async () => {
            const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), reservation);
            return { id: docRef.id, ...reservation };
        })());
    },

    updateReservation: async (id: string, updates: Partial<Reservation>) => {
        // Update mock data in memory if it exists there (for demo purposes)
        const mockIndex = MOCK_RESERVATIONS.findIndex(r => r.id === id);
        if (mockIndex !== -1) {
            MOCK_RESERVATIONS[mockIndex] = { ...MOCK_RESERVATIONS[mockIndex], ...updates };
            return { id, ...updates };
        }

        return withTimeout((async () => {
            const docRef = doc(db, RESERVATIONS_COLLECTION, id);
            await updateDoc(docRef, updates);
            return { id, ...updates };
        })());
    },

    deleteReservation: async (id: string) => {
        return withTimeout((async () => {
            await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
        })());
    },
};

import { Reservation } from "@/types";

const API_URL = "/api/reservations";

export const ReservationsService = {
    getReservations: async (): Promise<Reservation[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch reservations");
        return res.json();
    },

    getReservationById: async (id: string): Promise<Reservation | null> => {
        const res = await fetch(`${API_URL}/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch reservation");
        return res.json();
    },

    addReservation: async (reservation: Omit<Reservation, "id">) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservation),
        });
        if (!res.ok) throw new Error("Failed to create reservation");
        return res.json();
    },

    updateReservation: async (id: string, updates: Partial<Reservation>) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update reservation");
        return res.json();
    },

    deleteReservation: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete reservation");
    },
};

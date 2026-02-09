import { Place } from "@/types";

const API_URL = "/api/places";

export const PlacesService = {
    getPlaces: async (): Promise<Place[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch places");
        return res.json();
    },
    addPlace: async (place: Omit<Place, "id">) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(place),
        });
        if (!res.ok) throw new Error("Failed to create place");
        return res.json();
    },
    updatePlace: async (id: string, updates: Partial<Place>) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update place");
        return res.json();
    },
    deletePlace: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete place");
    },
};

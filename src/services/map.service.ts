import { MapPin } from "@/types";

const API_URL = "/api/map-pins";

export const MapValuesService = {
    getMapPins: async (): Promise<MapPin[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch map pins");
        return res.json();
    },
    addMapPin: async (pin: Omit<MapPin, "id">) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pin),
        });
        if (!res.ok) throw new Error("Failed to create map pin");
        return res.json();
    },
    deleteMapPin: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete map pin");
    },
};

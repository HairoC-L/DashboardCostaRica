import { Tour, Place } from "@/types";
import { PlacesService } from "./places.service";

const API_URL = "/api/tours";

export const ToursService = {
    getTours: async (): Promise<Tour[]> => {
        const [toursRes, places] = await Promise.all([
            fetch(API_URL),
            PlacesService.getPlaces(),
        ]);

        if (!toursRes.ok) throw new Error("Failed to fetch tours");

        const tours: Tour[] = await toursRes.json();

        return tours.map((tour) => ({
            ...tour,
            places: places.filter((p) => tour.placeIds?.includes(p.id)),
        }));
    },
    addTour: async (tour: Omit<Tour, "id">) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tour),
        });
        if (!res.ok) throw new Error("Failed to create tour");
        return res.json();
    },
    updateTour: async (id: string, updates: Partial<Tour>) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update tour");
        return res.json();
    },
    deleteTour: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete tour");
    },
};

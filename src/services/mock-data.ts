"use client";

// Types
export interface Place {
    id: string;
    name: string;
    description: string;
    images: string[];
}

export interface Tour {
    id: string;
    name: string;
    description: string;
    price: number;
    placeIds: string[];
}

export interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    tourIds: string[];
}

// Initial Data
let places: Place[] = [
    {
        id: "1",
        name: "Machu Picchu",
        description: "Una de las 7 maravillas del mundo moderno.",
        images: ["/images/place-01.jpg"],
    },
    {
        id: "2",
        name: "Montaña de 7 Colores",
        description: "Vinicunca, la montaña arcoíris.",
        images: ["/images/place-02.jpg"],
    },
    {
        id: "3",
        name: "Laguna Humantay",
        description: "Laguna turquesa rodeada de nevados.",
        images: ["/images/place-03.jpg"],
    },
];

let tours: Tour[] = [
    {
        id: "1",
        name: "Full Day Machu Picchu",
        description: "Visita completa a la ciudadela inca.",
        price: 300,
        placeIds: ["1"],
    },
    {
        id: "2",
        name: "Montaña y Laguna",
        description: "Dos aventuras en dos días.",
        price: 150,
        placeIds: ["2", "3"],
    },
];

let packages: Package[] = [
    {
        id: "1",
        name: "Cusco Mágico 5D/4N",
        description: "Experiencia completa en Cusco.",
        price: 1200,
        tourIds: ["1", "2"],
    },
];

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Services
export const MockService = {
    // Places
    getPlaces: async () => {
        await delay(300);
        return [...places];
    },
    addPlace: async (place: Omit<Place, "id">) => {
        await delay(300);
        const newPlace = { ...place, id: Math.random().toString(36).substr(2, 9) };
        places = [...places, newPlace];
        return newPlace;
    },
    updatePlace: async (id: string, updates: Partial<Place>) => {
        await delay(300);
        places = places.map((p) => (p.id === id ? { ...p, ...updates } : p));
        return places.find((p) => p.id === id);
    },
    deletePlace: async (id: string) => {
        await delay(300);
        places = places.filter((p) => p.id !== id);
        // Cleanup references in tours
        tours = tours.map(t => ({ ...t, placeIds: t.placeIds.filter(pid => pid !== id) }));
    },

    // Tours
    getTours: async () => {
        await delay(300);
        return tours.map(t => ({
            ...t,
            places: places.filter(p => t.placeIds.includes(p.id))
        }));
    },
    addTour: async (tour: Omit<Tour, "id">) => {
        await delay(300);
        const newTour = { ...tour, id: Math.random().toString(36).substr(2, 9) };
        tours = [...tours, newTour];
        return newTour;
    },
    updateTour: async (id: string, updates: Partial<Tour>) => {
        await delay(300);
        tours = tours.map((t) => (t.id === id ? { ...t, ...updates } : t));
        return tours.find((t) => t.id === id);
    },
    deleteTour: async (id: string) => {
        await delay(300);
        tours = tours.filter((t) => t.id !== id);
        // Cleanup references in packages
        packages = packages.map(p => ({ ...p, tourIds: p.tourIds.filter(tid => tid !== id) }));
    },

    // Packages
    getPackages: async () => {
        await delay(300);
        return packages.map(p => ({
            ...p,
            tours: tours.filter(t => p.tourIds.includes(t.id))
        }));
    },
    addPackage: async (pkg: Omit<Package, "id">) => {
        await delay(300);
        const newPackage = { ...pkg, id: Math.random().toString(36).substr(2, 9) };
        packages = [...packages, newPackage];
        return newPackage;
    },
    updatePackage: async (id: string, updates: Partial<Package>) => {
        await delay(300);
        packages = packages.map((p) => (p.id === id ? { ...p, ...updates } : p));
        return packages.find((p) => p.id === id);
    },
    deletePackage: async (id: string) => {
        await delay(300);
        packages = packages.filter((p) => p.id !== id);
    },
};

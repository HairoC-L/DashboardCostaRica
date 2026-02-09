import { Package, Tour } from "@/types";
import { ToursService } from "./tours.service";

const API_URL = "/api/packages";

export const PackagesService = {
    getPackages: async (): Promise<Package[]> => {
        const [packagesRes, tours] = await Promise.all([
            fetch(API_URL),
            ToursService.getTours(),
        ]);

        if (!packagesRes.ok) throw new Error("Failed to fetch packages");
        const packages: Package[] = await packagesRes.json();

        return packages.map((pkg) => ({
            ...pkg,
            tours: tours.filter((t) => pkg.tourIds?.includes(t.id)),
        }));
    },
    addPackage: async (pkg: Omit<Package, "id">) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pkg),
        });
        if (!res.ok) throw new Error("Failed to create package");
        return res.json();
    },
    updatePackage: async (id: string, updates: Partial<Package>) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update package");
        return res.json();
    },
    deletePackage: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete package");
    },
};

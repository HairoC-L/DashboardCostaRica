import { User } from "@/types";

export const UsersService = {
    getUsers: async (): Promise<User[]> => {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    },
    syncUser: async (user: {
        uid: string;
        email: string;
        displayName?: string;
    }) => {
        const res = await fetch(`/api/users/${user.uid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Failed to sync user");
        return res.json();
    },
    updateUserRole: async (uid: string, role: "admin" | "client") => {
        const res = await fetch(`/api/users/${uid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error("Failed to update role");
        return res.json();
    },
    getUserRole: async (uid: string): Promise<"admin" | "client" | null> => {
        try {
            const res = await fetch(`/api/users/${uid}`);
            if (res.status === 404) return null;
            if (!res.ok) return null;
            const data = await res.json();
            return data.role;
        } catch (error) {
            console.error("Error fetching user role:", error);
            return null;
        }
    },
};

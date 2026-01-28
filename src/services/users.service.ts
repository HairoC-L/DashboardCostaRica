import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";
import { User } from "@/types";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const UsersService = {
    getUsers: async (): Promise<User[]> => {
        return withTimeout((async () => {
            const snapshot = await getDocs(collection(db, "users"));
            return snapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() } as User));
        })());
    },
    syncUser: async (user: { uid: string; email: string; displayName?: string }) => {
        return withTimeout((async () => {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // New user - default to 'client', unless it's the specific admin user
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || "Usuario",
                    role: user.email === "admin@admin.com" ? "admin" : "client",
                    createdAt: new Date().toISOString()
                });
            } else {
                // Update basic info if changed, but keep role
                await updateDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName || userSnap.data().displayName
                });
            }
        })());
    },
    updateUserRole: async (uid: string, role: "admin" | "client") => {
        return withTimeout((async () => {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { role });
        })());
    },
    getUserRole: async (uid: string): Promise<"admin" | "client" | null> => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data().role as "admin" | "client";
        }
        return null;
    }
};

import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
};

export const StorageService = {
    uploadImage: async (file: File, path: string): Promise<string> => {
        return withTimeout((async () => {
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        })());
    },
};

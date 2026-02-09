export const StorageService = {
    uploadImage: async (file: File, path: string): Promise<string> => {
        // Legacy support: try to parse folder and slug from path
        // path might be "destinos/slug/filename"
        const parts = path.split("/");
        const folder = parts[0] || "uploads";
        const slug = parts[1] || "default";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload image");
        const data = await res.json();
        return data.url;
    },
};

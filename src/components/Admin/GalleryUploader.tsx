"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GalleryUploaderProps {
    images: string[];
    onImagesChange: (newImages: string[]) => void;
    folderName: string;
    slug?: string;
    title?: string;
}

export default function GalleryUploader({
    images = [],
    onImagesChange,
    folderName = "general",
    slug = "default",
    title = "Galería Multimedia"
}: GalleryUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        try {
            const files = Array.from(e.target.files);
            // Use provided slug or timestamp if generic
            const safeSlug = slug || `${folderName}-${Date.now()}`;

            const uploadPromises = files.map(async (file) => {
                const formDataUpload = new FormData();
                formDataUpload.append("file", file);
                formDataUpload.append("slug", safeSlug);
                formDataUpload.append("folder", folderName);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataUpload,
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                return data.url;
            });

            const urls = await Promise.all(uploadPromises);
            onImagesChange([...images, ...urls]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error al subir imágenes");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {title && <h3 className="text-lg font-semibold text-dark dark:text-white">{title}</h3>}

            <div className="border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-8 text-center hover:bg-white dark:hover:bg-white/5 transition-all cursor-pointer relative group bg-gray-50 dark:bg-dark-2">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleUpload}
                    disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    <p className="text-base font-medium text-dark dark:text-white">
                        {isUploading ? "Subiendo imágenes..." : "Arrastra imágenes aquí o haz clic para subir"}
                    </p>
                    <p className="text-sm text-dark-6">Soporta JPG, PNG, WEBP</p>
                </div>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-gray-100 dark:bg-black/20">
                            <Image src={url} alt={`Gallery ${index}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors z-20 shadow-lg transform hover:scale-110 active:scale-95"
                                    title="Eliminar imagen"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

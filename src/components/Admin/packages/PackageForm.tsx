"use client";

import React, { useEffect, useState } from "react";
import { Package, FirebaseService, DailyItinerary } from "@/services/firebase-service";
import Image from "next/image";
import GalleryUploader from "@/components/Admin/GalleryUploader";

interface PackageFormProps {
    initialData?: Partial<Package>;
    onSubmit: (data: Omit<Package, "id">) => Promise<void>;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

const COMMON_INCLUDES = [
    'Hotel', 'Transfer', 'Meals', 'Tours', 'Activities', 'Guides', 'Spa', 'Breakfast', 'All Meals'
];

export default function PackageForm({ initialData, onSubmit, isSubmitting = false, onCancel }: PackageFormProps) {
    // Form state
    const [title, setTitle] = useState(initialData?.title || "");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [description, setDescription] = useState(initialData?.description || "");
    const [durationDays, setDurationDays] = useState(initialData?.duration_days || 1);
    const [durationNights, setDurationNights] = useState(initialData?.duration_nights || 0);

    // Arrays
    const [tags, setTags] = useState<string>(initialData?.tags?.join(", ") || "");
    const [included, setIncluded] = useState<string[]>(initialData?.included || []);

    // Media & Uploads
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isUploading, setIsUploading] = useState(false);

    const [itinerary, setItinerary] = useState<DailyItinerary[]>(initialData?.itinerary || []);

    // Handlers
    const toggleIncluded = (item: string) => {
        setIncluded(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    // Itinerary Handlers
    const addDay = () => {
        setItinerary(prev => [...prev, { day: prev.length + 1, title: "", description: "" }]);
    };

    const updateDay = (index: number, field: keyof DailyItinerary, value: any) => {
        const newItinerary = [...itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setItinerary(newItinerary);
    };

    const removeDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index);
        // Re-index
        setItinerary(newItinerary.map((day, i) => ({ ...day, day: i + 1 })));
    };

    // New Image Upload Logic (Direct to Firebase Storage, similar to TourForm)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        try {
            const files = Array.from(e.target.files);
            const slug = "pkg-" + (initialData?.id || Date.now()); // Simple slug for folder organization

            const uploadPromises = files.map(async (file) => {
                // Use existing API route for consistency if available, otherwise FirebaseService
                // The TourForm uses /api/upload. Let's see if we can use it or stick to FirebaseService to be safe.
                // PackageForm used FirebaseService.uploadImage before. Let's stick to that but make it cleaner.
                // Actually, let's use the API if possible for consistency, but FirebaseService is imported.
                // FirebaseService.uploadImage works.
                return FirebaseService.uploadImage(file, `packages/${slug}/${file.name}`);
            });

            const urls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...urls]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error al subir imágenes");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalTags = tags.split(",").map(t => t.trim()).filter(t => t !== "");

        const data: Omit<Package, "id"> = {
            title,
            description,
            price,
            duration_days: durationDays,
            duration_nights: durationNights,
            tags: finalTags,
            included,
            images,
            itinerary,
            // Defaults/Compat
            tourIds: [],
            tours: [],
            priceType: "per_person",
            includesTransport: included.includes("Transfer"),
            name: title
        };

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* 1. Información General */}
            <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                    Información General
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Título del Paquete <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            placeholder="Ej. Costa Rica Adventure Package"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            placeholder="Descripción atractiva del paquete..."
                        />
                    </div>

                    <div>
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Precio (Adulto - USD) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-dark-6">$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                                min="0"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-8 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Días</label>
                            <input
                                type="number"
                                value={durationDays}
                                onChange={(e) => setDurationDays(Number(e.target.value))}
                                min="1"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Noches</label>
                            <input
                                type="number"
                                value={durationNights}
                                onChange={(e) => setDurationNights(Number(e.target.value))}
                                min="0"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Etiquetas</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Best Seller, Honeymoon, Family (separadas por coma)"
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Inclusiones */}
            <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                    Lo que incluye
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {COMMON_INCLUDES.map(item => (
                        <label key={item} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${included.includes(item) ? "bg-primary/5 border-primary shadow-sm" : "border-stroke hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-white/5"}`}>
                            <input
                                type="checkbox"
                                checked={included.includes(item)}
                                onChange={() => toggleIncluded(item)}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-dark dark:text-white">{item}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. Multimedia */}
            <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
                    Galería Multimedia
                </h3>

                <GalleryUploader
                    images={images}
                    onImagesChange={setImages}
                    folderName="packages"
                    slug={initialData?.id || "new-package"}
                    title="Galería Multimedia"
                />
            </div>

            {/* 4. Itinerario */}
            <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
                        Itinerario
                    </h3>
                    <button
                        type="button"
                        onClick={addDay}
                        className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-all flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Agregar Día
                    </button>
                </div>

                <div className="space-y-4">
                    {itinerary.map((day, idx) => (
                        <div key={idx} className="relative rounded-lg border border-stroke p-5 dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="font-bold text-primary flex items-center gap-2">
                                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded">Día {day.day}</span>
                                    {day.title || "Nuevo Día"}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => removeDay(idx)}
                                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Eliminar
                                </button>
                            </div>
                            <div className="grid gap-4">
                                <input
                                    type="text"
                                    placeholder="Título del día (Ej. Llegada a San José)"
                                    value={day.title}
                                    onChange={(e) => updateDay(idx, "title", e.target.value)}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                                <textarea
                                    placeholder="Descripción detallada de actividades..."
                                    value={day.description}
                                    onChange={(e) => updateDay(idx, "description", e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    ))}
                    {itinerary.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-stroke dark:border-dark-3">
                            <p className="text-dark-6 italic mb-2">No has agregado días al itinerario.</p>
                            <button onClick={addDay} className="text-primary hover:underline text-sm font-medium">Comenzar a agregar</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-stroke px-8 py-3 font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-all shadow-sm"
                        disabled={isSubmitting || isUploading}
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className={`rounded-lg px-8 py-3 font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${isSubmitting || isUploading ? "bg-primary/70 cursor-wait" : "bg-primary hover:bg-opacity-90 active:scale-95"}`}
                    disabled={isSubmitting || isUploading}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar Paquete"
                    )}
                </button>
            </div>
        </form>
    );
}

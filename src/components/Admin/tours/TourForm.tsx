"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tour, Place } from "@/services/api-service";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface TourFormProps {
    initialData?: Partial<Tour>;
    availablePlaces: Place[]; // For the selection list
    onSubmit: (data: Partial<Tour>) => Promise<void>;
    isSubmitting: boolean;
    onCancel?: () => void;
    simpleMode?: boolean; // New prop for simplified creation
}

export default function TourForm({ initialData, availablePlaces, onSubmit, isSubmitting, onCancel, simpleMode = false }: TourFormProps) {
    // Initial State
    const defaultFormState: Partial<Tour> = {
        name: "",
        description: "",
        price: 0,
        priceChild: 0,
        placeIds: [],
        duration: "",
        difficulty: "Moderado",
        maxQuota: 0,
        meetingPoint: "",
        meetingPointLink: "",
        meetingPointCoordinates: { lat: 0, lng: 0 },
        // Lists
        features: {
            accommodation: false,
            transport: false,
            entranceFee: false,
            nextTour: false,
            guide: false,
            translator: false,
        },
        whatItOffers: [],
        schedules: [],
        availableDates: [],
        cancellationPolicy: "",
        gallery: []
    };

    const [formData, setFormData] = useState<Partial<Tour>>(initialData || defaultFormState);
    const [offersText, setOffersText] = useState("");
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...defaultFormState,
                ...initialData,
                features: initialData.features || defaultFormState.features,
                whatItOffers: initialData.whatItOffers || [],
                schedules: initialData.schedules || [],
                availableDates: initialData.availableDates || [],
                gallery: initialData.gallery || []
            }));
            setOffersText(initialData.whatItOffers?.join("\n") || "");
        }
    }, [initialData]);

    const togglePlaceSelection = (placeId: string) => {
        setFormData((prev) => {
            const currentIds = prev.placeIds || [];
            const isSelected = currentIds.includes(placeId);
            if (isSelected) {
                return { ...prev, placeIds: currentIds.filter(id => id !== placeId) };
            } else {
                return { ...prev, placeIds: [...currentIds, placeId] };
            }
        });
    };

    const handleLocationConfirm = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            meetingPointCoordinates: { lat, lng },
            meetingPointLink: `https://www.google.com/maps/?q=${lat},${lng}`
        }));
        setIsLocationPickerOpen(false);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            whatItOffers: offersText.split("\n").filter(line => line.trim() !== ""),
        };
        await onSubmit(submissionData);
    };

    // Gallery is now handled by GalleryUploader


    return (
        <>
            <form id="tourForm" onSubmit={handleFormSubmit} className="space-y-8">

                {/* 1. Destinos Select */}
                <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                        Destinos Asociados
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {availablePlaces.map((place) => (
                            <label
                                key={place.id}
                                className={`
                                    relative flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-200
                                    ${formData.placeIds?.includes(place.id)
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-gray-50 dark:bg-dark-2 border-transparent hover:border-stroke dark:hover:border-dark-3"}
                                `}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={formData.placeIds?.includes(place.id)}
                                        onChange={() => togglePlaceSelection(place.id)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-dark dark:text-white text-sm">{place.name}</span>
                                    {place.region && <span className="text-xs text-dark-6">{place.region}</span>}
                                </div>
                            </label>
                        ))}
                        {availablePlaces.length === 0 && (
                            <p className="text-sm text-dark-6 italic col-span-full text-center py-4 bg-gray-50 rounded-lg">
                                No hay destinos disponibles. Por favor cree destinos primero.
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Información General */}
                <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
                        Información General
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Nombre del Tour <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Ej: Aventura en la Amazonía"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark-2"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Descripción Corta <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Breve resumen de lo que trata el tour..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Duración</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-10 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                    placeholder="Ej: 3 días"
                                    required={simpleMode}
                                />
                                <span className="absolute left-3.5 top-3.5 text-dark-6">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Dificultad</label>
                            <div className="relative">
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                    className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5 py-3 pl-10 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                >
                                    <option value="Fácil">Fácil</option>
                                    <option value="Moderado">Moderado</option>
                                    <option value="Difícil">Difícil</option>
                                    <option value="Extremo">Extremo</option>
                                </select>
                                <span className="absolute left-3.5 top-3.5 text-dark-6">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </span>
                                <span className="absolute right-4 top-4 text-dark-6 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Cupo Máximo</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.maxQuota}
                                    onChange={(e) => setFormData({ ...formData, maxQuota: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-10 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                    required={simpleMode}
                                />
                                <span className="absolute left-3.5 top-3.5 text-dark-6">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Multimedia (Moved up for Simple Mode) */}
                <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1">
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
                        Imágenes del Tour
                    </h3>
                    <GalleryUploader
                        images={formData.gallery || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, gallery: newImages }))}
                        folderName="tours"
                        slug={initialData?.id || formData.name?.toLowerCase() || "new-tour"}
                        title=""
                    />
                </div>

                {/* 4. Advanced Sections (Hidden in Simple Mode) */}
                {!simpleMode && (
                    <div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-1 space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 mb-4 border-b border-stroke pb-4 dark:border-dark-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
                            <h3 className="text-lg font-bold text-dark dark:text-white">Detalles Avanzados</h3>
                        </div>

                        {/* Incluye (Checkboxes) */}
                        <div>
                            <label className="mb-4 block font-medium text-dark dark:text-white">Servicios Incluidos</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formData.features?.accommodation} onChange={e => setFormData({ ...formData, features: { ...formData.features, accommodation: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium">Alojamiento</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formData.features?.transport} onChange={e => setFormData({ ...formData, features: { ...formData.features, transport: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium">Transporte</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formData.features?.entranceFee} onChange={e => setFormData({ ...formData, features: { ...formData.features, entranceFee: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium">Entradas</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formData.features?.guide} onChange={e => setFormData({ ...formData, features: { ...formData.features, guide: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium">Guía</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formData.features?.translator} onChange={e => setFormData({ ...formData, features: { ...formData.features, translator: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span className="text-sm font-medium">Traductor</span>
                                </label>
                            </div>
                        </div>

                        {/* Que brinda */}
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white">¿Qué brinda? <span className="text-sm text-gray-500 font-normal">(Items adicionales por línea)</span></label>
                            <textarea
                                value={offersText}
                                onChange={(e) => setOffersText(e.target.value)}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                rows={4}
                                placeholder="- Equipo de seguridad&#10;- Bebidas hidratantes&#10;- Fotografías digitales"
                            />
                        </div>

                        <hr className="border-stroke dark:border-dark-3" />

                        {/* Precios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block font-medium text-dark dark:text-white">Precio Adultos ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-dark-6">$</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-8 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block font-medium text-dark dark:text-white">Precio Niños ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-dark-6">$</span>
                                    <input
                                        type="number"
                                        value={formData.priceChild}
                                        onChange={(e) => setFormData({ ...formData, priceChild: Number(e.target.value) })}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-8 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Punto de Encuentro */}
                        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-stroke dark:border-dark-3">
                            <div className="flex justify-between items-start mb-3">
                                <label className="block font-medium text-dark dark:text-white">Punto de Encuentro</label>
                                <button
                                    type="button"
                                    onClick={() => setIsLocationPickerOpen(true)}
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Seleccionar en Mapa
                                </button>
                            </div>
                            <input
                                type="text"
                                value={formData.meetingPoint}
                                onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                placeholder="Ej: Lobby del Hotel Principal"
                            />
                            {formData.meetingPointLink && (
                                <p className="mt-2 text-xs text-gray-500 truncate">
                                    Link: {formData.meetingPointLink}
                                </p>
                            )}
                        </div>

                        {/* Horarios */}
                        <CalendarScheduler
                            schedules={formData.schedules || []}
                            availableDates={formData.availableDates || []}
                            onChange={(schedules, dates) => setFormData({ ...formData, schedules, availableDates: dates })}
                        />

                        {/* Políticas */}
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white">Políticas de Cancelación</label>
                            <textarea
                                value={formData.cancellationPolicy}
                                onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-6">
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
                            "Guardar Tour"
                        )}
                    </button>
                </div>
            </form>

            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onConfirm={handleLocationConfirm}
                    initialCoordinates={formData.meetingPointCoordinates}
                />
            )}
        </>
    );
}

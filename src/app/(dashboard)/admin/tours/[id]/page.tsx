"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tour, Place, ApiService } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function TourDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Tour>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            if (!id) return;
            try {
                const tourData = await ApiService.getTour(id);
                // Ensure defaults
                if (!tourData.gallery) tourData.gallery = [];
                setTour(tourData);
                setFormData(tourData);

                if (tourData.placeIds && tourData.placeIds.length > 0) {
                    const allPlaces = await ApiService.getPlaces();
                    const relevant = allPlaces.filter(p => tourData.placeIds.includes(p.id));
                    setRelatedPlaces(relevant);
                }
            } catch (error) {
                console.error("Error fetching tour:", error);
                router.push("/admin/tours");
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este tour?")) {
            await ApiService.deleteTour(id);
            router.push("/admin/tours");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && tour) {
            setFormData(tour); // Reset to current data on enter edit
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await ApiService.updateTour(id, formData);
            setTour(prev => ({ ...prev, ...formData } as Tour));
            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating tour:", error);
            alert("Error al actualizar.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!tour) return null;

    const allImages = tour.gallery || [];
    const hasImages = allImages.length > 0;
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/tours"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{tour.name}</h2>
                        <p className="text-sm text-dark-6">Detalles del tour</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Tour
                    </button>
                </div>
            </div>

            {/* Media Section: Editable */}
            <EditableSection
                title="Galería de Imágenes"
                isEditing={!!editMode['gallery']}
                onEdit={() => toggleEdit('gallery')}
                onSave={() => handleSave('gallery')}
                onCancel={() => toggleEdit('gallery')}
                isSaving={isSaving}
                className="mb-8"
            >
                {editMode['gallery'] ? (
                    <GalleryUploader
                        images={formData.gallery || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, gallery: newImages }))}
                        folderName="tours"
                        slug={tour.id} // Use ID as slug or consistency
                        title="Gestionar Imágenes"
                    />
                ) : (
                    hasImages ? (
                        <div className="relative h-[400px] w-full overflow-hidden rounded-lg group">
                            <Image src={allImages[currentImageIndex]} alt="Slide" fill className="object-cover" />
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-xs">
                                        {currentImageIndex + 1} / {allImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-60 flex items-center justify-center bg-gray-100 dark:bg-dark-2 rounded-lg text-dark-6">
                            Sin imágenes. Haz clic en Editar para agregar.
                        </div>
                    )
                )}
            </EditableSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <EditableSection
                        title="Descripción Turística"
                        isEditing={!!editMode['description']}
                        onEdit={() => toggleEdit('description')}
                        onSave={() => handleSave('description')}
                        onCancel={() => toggleEdit('description')}
                        isSaving={isSaving}
                    >
                        {editMode['description'] ? (
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                            />
                        ) : (
                            <p className="text-body-color dark:text-dark-6 whitespace-pre-line leading-relaxed">
                                {tour.description}
                            </p>
                        )}
                    </EditableSection>

                    {/* Schedules & Calendar */}
                    <EditableSection
                        title="Programación y Fechas"
                        isEditing={!!editMode['schedules']}
                        onEdit={() => toggleEdit('schedules')}
                        onSave={() => handleSave('schedules')}
                        onCancel={() => toggleEdit('schedules')}
                        isSaving={isSaving}
                    >
                        {editMode['schedules'] ? (
                            <div className="pt-2">
                                <CalendarScheduler
                                    schedules={formData.schedules || []}
                                    availableDates={formData.availableDates || []}
                                    onChange={(schedules, dates) => setFormData({ ...formData, schedules, availableDates: dates })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Horarios Base</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tour.schedules && tour.schedules.length > 0 ? (
                                            tour.schedules.map(s => (
                                                <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-dark-2 rounded text-xs text-dark-6">{s}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay horarios definidos</span>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-stroke dark:border-dark-3 pt-4">
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Próximas Fechas ({tour.availableDates?.length || 0})</h4>
                                    <div className="max-h-40 overflow-y-auto">
                                        {tour.availableDates && tour.availableDates.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {tour.availableDates
                                                    .sort((a, b) => a.date.localeCompare(b.date))
                                                    .filter(d => dayjs(d.date).isAfter(dayjs().subtract(1, 'day'))) // Show future dates only
                                                    .slice(0, 9)
                                                    .map(d => (
                                                        <div key={d.date} className="p-2 border border-stroke dark:border-dark-3 rounded bg-gray-50 dark:bg-white/5 text-xs">
                                                            <div className="font-medium text-primary mb-1">{dayjs(d.date).format("D MMM, YYYY")}</div>
                                                            <div className="text-gray-500">{d.schedules.length} horarios</div>
                                                        </div>
                                                    ))}
                                                {tour.availableDates.length > 9 && (
                                                    <div className="flex items-center justify-center p-2 text-xs text-gray-500 italic">
                                                        +{tour.availableDates.length - 9} más...
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay fechas disponibles activas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* What it offers */}
                    <EditableSection
                        title="Lo que ofrece"
                        isEditing={!!editMode['offers']}
                        onEdit={() => toggleEdit('offers')}
                        onSave={() => handleSave('offers')}
                        onCancel={() => toggleEdit('offers')}
                        isSaving={isSaving}
                    >
                        {editMode['offers'] ? (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Ingrese items separados por línea nueva</p>
                                <textarea
                                    value={formData.whatItOffers?.join("\n") || ""}
                                    onChange={(e) => setFormData({ ...formData, whatItOffers: e.target.value.split("\n") })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                                />
                            </div>
                        ) : (
                            <ul className="list-disc pl-5 space-y-1 text-body-color dark:text-dark-6">
                                {tour.whatItOffers && tour.whatItOffers.map((offer, idx) => (
                                    <li key={idx}>{offer}</li>
                                ))}
                            </ul>
                        )}
                    </EditableSection>
                </div>

                <div className="space-y-6">
                    {/* Pricing */}
                    <EditableSection
                        title="Precios"
                        isEditing={!!editMode['pricing']}
                        onEdit={() => toggleEdit('pricing')}
                        onSave={() => handleSave('pricing')}
                        onCancel={() => toggleEdit('pricing')}
                        isSaving={isSaving}
                        className="border-t-4 border-primary"
                    >
                        {editMode['pricing'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Adulto</label>
                                    <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Niño</label>
                                    <input type="number" value={formData.priceChild || 0} onChange={e => setFormData({ ...formData, priceChild: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 uppercase">Precio Adulto</span>
                                    <span className="text-2xl font-bold text-primary">${tour.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 uppercase">Precio Niño</span>
                                    <span className="text-xl font-bold text-secondary">${tour.priceChild}</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Operational Details */}
                    <EditableSection
                        title="Detalles Operativos"
                        isEditing={!!editMode['operation']}
                        onEdit={() => toggleEdit('operation')}
                        onSave={() => handleSave('operation')}
                        onCancel={() => toggleEdit('operation')}
                        isSaving={isSaving}
                    >
                        {editMode['operation'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Duración</label>
                                    <input type="text" value={formData.duration || ""} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Dificultad</label>
                                    <select value={formData.difficulty || "Moderado"} onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full rounded border border-stroke px-3 py-2">
                                        <option value="Fácil">Fácil</option>
                                        <option value="Moderado">Moderado</option>
                                        <option value="Difícil">Difícil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Cupo Máximo</label>
                                    <input type="number" value={formData.maxQuota || 0} onChange={e => setFormData({ ...formData, maxQuota: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Duración</span>
                                    <span className="font-medium text-dark dark:text-white">{tour.duration || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Dificultad</span>
                                    <span className="font-medium px-2 py-0.5 rounded text-xs text-white bg-blue-500">{tour.difficulty}</span>
                                </div>
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Cupo Máximo</span>
                                    <span className="font-medium text-dark dark:text-white">{tour.maxQuota || "-"} personas</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>
                </div>
            </div>
        </div>
    );
}

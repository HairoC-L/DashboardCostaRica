"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Place, FirebaseService } from "@/services/firebase-service";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EditableSection from "@/components/Admin/ui/EditableSection";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import GalleryUploader from "@/components/Admin/GalleryUploader";

export default function DestinationDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Editing States
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Place>>({});
    const [isSaving, setIsSaving] = useState(false);


    // Specific state for location picker
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "places", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as Place;
                    setPlace(data);
                    setFormData(data);
                } else {
                    console.error("No such place!");
                    router.push("/admin/destinos");
                }
            } catch (error) {
                console.error("Error fetching place:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este destino?")) {
            await FirebaseService.deletePlace(id);
            router.push("/admin/destinos");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && place) {
            setFormData(place); // Reset form data to current place data when starting edit
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await FirebaseService.updatePlace(id, formData);
            setPlace(prev => ({ ...prev, ...formData } as Place));
            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating place:", error);
            alert("Error al actualizar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLocationPick = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng },
            googleMapsLink: `https://www.google.com/maps/?q=${lat},${lng}`
        }));
        setIsLocationPickerOpen(false);
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!place) return null;

    const allImages = [place.heroImage, ...(place.galleryImages || place.images || [])].filter(Boolean) as string[];
    const hasImages = allImages.length > 0;

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/destinos"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{place.name}</h2>
                        <p className="text-sm text-dark-6">Detalles del destino</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Destino
                    </button>
                </div>
            </div>

            {/* Media Section (Managed separately for now or could be added to inline edit) */}
            {/* Multimedia Section - Editable */}
            <EditableSection
                title="Galería Multimedia"
                isEditing={!!editMode['gallery']}
                onEdit={() => toggleEdit('gallery')}
                onSave={() => handleSave('gallery')}
                onCancel={() => toggleEdit('gallery')}
                isSaving={isSaving}
                className="mb-8"
            >
                {editMode['gallery'] ? (
                    <GalleryUploader
                        images={formData.galleryImages || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, galleryImages: newImages }))}
                        folderName="destino"
                        slug={place.slug || place.id}
                        title="Gestionar Imágenes de Galería"
                    />
                ) : (
                    hasImages ? (
                        <div className="relative h-[400px] w-full overflow-hidden rounded-lg group">
                            <Image src={allImages[currentImageIndex]} alt="Slide" fill className="object-cover" />
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % allImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {allImages.map((_, idx) => (
                                            <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
                                        ))}
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
                    {/* Description Section */}
                    <EditableSection
                        title="Descripción"
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
                                {place.description}
                            </p>
                        )}
                    </EditableSection>
                </div>

                <div className="space-y-6">
                    {/* General Info Section */}
                    <EditableSection
                        title="Información General"
                        isEditing={!!editMode['general']}
                        onEdit={() => toggleEdit('general')}
                        onSave={() => handleSave('general')}
                        onCancel={() => toggleEdit('general')}
                        isSaving={isSaving}
                    >
                        {editMode['general'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre Oficial</label>
                                    <input
                                        type="text"
                                        value={formData.officialName || ""}
                                        onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Categoría</label>
                                    <select
                                        value={formData.category || ""}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                    >
                                        <option value="playa">Playa</option>
                                        <option value="montaña">Montaña</option>
                                        <option value="ciudad">Ciudad</option>
                                        <option value="histórico">Histórico</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Región</label>
                                    <input
                                        type="text"
                                        value={formData.region || ""}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre Oficial</span>
                                    <span className="text-dark dark:text-white font-medium">{place.officialName || "-"}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Categoría</span>
                                    <span className="inline-block rounded bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase">
                                        {place.category}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Región</span>
                                    <span className="text-dark dark:text-white">{place.region || "-"}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Ecosistema</span>
                                    <span className="text-dark dark:text-white">{place.ecosystem || "-"}</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Location Section */}
                    <EditableSection
                        title="Ubicación"
                        isEditing={!!editMode['location']}
                        onEdit={() => toggleEdit('location')}
                        onSave={() => handleSave('location')}
                        onCancel={() => toggleEdit('location')}
                        isSaving={isSaving}
                    >
                        {editMode['location'] ? (
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLocationPickerOpen(true)}
                                    className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition text-sm"
                                >
                                    Actualizar en Mapa
                                </button>
                                <input
                                    type="text"
                                    readOnly
                                    value={formData.googleMapsLink || ""}
                                    className="w-full text-xs text-gray-500 bg-gray-100 p-2 rounded border border-stroke"
                                />
                            </div>
                        ) : (
                            <>
                                {place.googleMapsLink && (
                                    <a
                                        href={place.googleMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-4 flex items-center gap-2 text-primary hover:underline text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Ver en Google Maps
                                    </a>
                                )}
                                <div className="bg-gray-50 dark:bg-dark-2 p-3 rounded-lg text-xs font-mono text-dark dark:text-white">
                                    Lat: {place.coordinates?.lat}<br />
                                    Lng: {place.coordinates?.lng}
                                </div>
                            </>
                        )}
                    </EditableSection>
                </div>
            </div>

            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onConfirm={handleLocationPick}
                    initialCoordinates={formData.coordinates || place.coordinates}
                />
            )}
        </div>
    );
}

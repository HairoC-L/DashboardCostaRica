"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FirebaseService, Package } from "@/services/firebase-service";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EditableSection from "@/components/Admin/ui/EditableSection";
import GalleryUploader from "@/components/Admin/GalleryUploader";

export default function PackageDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [packageData, setPackageData] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Package>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "packages", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as Package;
                    setPackageData(data);
                    setFormData(data);
                } else {
                    console.error("No such package!");
                    router.push("/admin/paquetes");
                }
            } catch (error) {
                console.error("Error fetching package:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este paquete?")) {
            await FirebaseService.deletePackage(id);
            router.push("/admin/paquetes");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && packageData) {
            setFormData(packageData); // Reset
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await FirebaseService.updatePackage(id, formData);
            setPackageData(prev => ({ ...prev, ...formData } as Package));
            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating package:", error);
            alert("Error al actualizar el paquete.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!packageData) return null;

    const allImages = packageData.images || [];
    const carouselImages = allImages;
    const hasImages = carouselImages.length > 0;

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);


    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/paquetes"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{packageData.title}</h2>
                        <p className="text-sm text-dark-6">Detalles del Paquete</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Paquete
                    </button>
                </div>
            </div>


            {/* Media */}
            {/* Multimedia - Editable */}
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
                        images={formData.images || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                        folderName="packages"
                        slug={packageData.id}
                        title="Gestionar Imágenes del Paquete"
                    />
                ) : (
                    hasImages ? (
                        <div className="relative h-[400px] w-full overflow-hidden rounded-lg group">
                            <Image src={carouselImages[currentImageIndex]} alt="Slide" fill className="object-cover" />
                            {carouselImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {carouselImages.map((_, idx) => (
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
                    {/* Description */}
                    <EditableSection
                        title="Descripción"
                        isEditing={!!editMode['description']}
                        onEdit={() => toggleEdit('description')}
                        onSave={() => handleSave('description')}
                        onCancel={() => toggleEdit('description')}
                        isSaving={isSaving}
                    >
                        {editMode['description'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Título</label>
                                    <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Descripción</label>
                                    <textarea
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h4 className="font-bold text-lg mb-2">{packageData.title}</h4>
                                <p className="text-body-color dark:text-dark-6 whitespace-pre-line leading-relaxed">
                                    {packageData.description}
                                </p>
                            </div>
                        )}
                    </EditableSection>

                    {/* Included Items */}
                    <EditableSection
                        title="Incluye"
                        isEditing={!!editMode['includes']}
                        onEdit={() => toggleEdit('includes')}
                        onSave={() => handleSave('includes')}
                        onCancel={() => toggleEdit('includes')}
                        isSaving={isSaving}
                    >
                        {editMode['includes'] ? (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Ingrese items separados por línea nueva</p>
                                <textarea
                                    value={formData.included?.join("\n") || ""}
                                    onChange={(e) => setFormData({ ...formData, included: e.target.value.split("\n") })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                                />
                            </div>
                        ) : (
                            <ul className="list-disc pl-5 space-y-1 text-body-color dark:text-dark-6">
                                {packageData.included && packageData.included.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </EditableSection>

                    {/* Itinerary maybe? If existing */}
                </div>

                <div className="space-y-6">
                    {/* Pricing */}
                    <EditableSection
                        title="Precio"
                        isEditing={!!editMode['pricing']}
                        onEdit={() => toggleEdit('pricing')}
                        onSave={() => handleSave('pricing')}
                        onCancel={() => toggleEdit('pricing')}
                        isSaving={isSaving}
                        className="border-t-4 border-primary"
                    >
                        {editMode['pricing'] ? (
                            <div className="space-y-4">
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Total</label>
                                <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 uppercase">Precio</span>
                                <span className="text-2xl font-bold text-primary">${packageData.price}</span>
                            </div>
                        )}
                    </EditableSection>


                </div>
            </div>
        </div>
    );
}

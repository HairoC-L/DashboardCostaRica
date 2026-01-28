"use client";

import { useEffect, useState } from "react";
import { PlacesService } from "@/services/places.service";
import { Place } from "@/types";
import Image from "next/image";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

export default function DestinationsAdmin() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPlaces = async () => {
        try {
            setLoading(true);
            const data = await PlacesService.getPlaces();
            setPlaces(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlaces();
    }, []);

    const {
        searchQuery,
        setSearchQuery,
        currentItems,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage
    } = useSearchPagination(places, 6, (place, query) =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        (place.description?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (place.officialName?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    if (loading) {
        return <div className="p-10 text-center">Cargando destinos...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Destinos"
                description="Administra los destinos turísticos del mapa interactivo."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar destino..."
                actionLabel="Nuevo Destino"
                actionHref="/admin/destinos/create"
            />

            <AdminGrid>
                {currentItems.map((place) => (
                    <div
                        key={place.id}
                        className="group relative overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card hover:shadow-2 transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={place.heroImage || (place.images && place.images[0]) || "/images/place-01.jpg"}
                                alt={place.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {place.heroImage && (
                                <div className="absolute top-2 left-2 bg-primary/80 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                                    Hero Asset
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                {place.name}
                            </h3>
                            {place.officialName && (
                                <p className="mb-2 text-xs italic text-gray-500 line-clamp-1">
                                    {place.officialName}
                                </p>
                            )}
                            <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2 min-h-[2.5rem]">
                                {place.shortDescription || place.description}
                            </p>
                            <div className="mb-4 flex flex-wrap gap-2 mt-auto">
                                <span className="inline-block rounded bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {place.category?.toUpperCase() || "SIN CATEGORÍA"}
                                </span>
                                {place.region && (
                                    <span className="inline-block rounded bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-500">
                                        {place.region}
                                    </span>
                                )}
                            </div>

                            <div className="border-t border-stroke pt-4 dark:border-dark-3 mt-auto">
                                <AnimatedButton
                                    href={`/admin/destinos/${place.id}`}
                                    className="w-full"
                                >
                                    Ver detalles
                                </AnimatedButton>
                            </div>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && !loading && <EmptyState />}
            </AdminGrid>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="rounded px-3 py-1 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`rounded px-3 py-1 border border-stroke dark:border-dark-3 ${currentPage === i + 1
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-dark-2 hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="rounded px-3 py-1 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { ToursService } from "@/services/tours.service";
import { Tour, Place } from "@/types";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

dayjs.locale("es");

export default function ToursAdmin() {
    const [tours, setTours] = useState<(Tour & { places?: Place[] })[]>([]);

    const loadData = async () => {
        const toursData = await ToursService.getTours();
        setTours(toursData);
    };

    useEffect(() => {
        loadData();
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
    } = useSearchPagination(tours, 6, (tour, query) =>
        tour.name.toLowerCase().includes(query.toLowerCase()) ||
        (tour.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Tours"
                description="Administra los tours y sus horarios."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar tour..."
                actionLabel="Nuevo Tour"
                actionHref="/admin/tours/create"
            />

            <AdminGrid>
                {currentItems.map((tour) => (
                    <div
                        key={tour.id}
                        className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card group hover:shadow-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            {tour.gallery && tour.gallery.length > 0 ? (
                                <Image
                                    src={tour.gallery[0]}
                                    alt={tour.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-dark-2">
                                    <span className="text-sm text-gray-500">Sin imagen</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                <span className="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                    Adul: ${tour.price}
                                </span>
                                {tour.priceChild !== undefined && tour.priceChild > 0 && (
                                    <span className="inline-flex rounded-full bg-secondary/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                        Niños: ${tour.priceChild}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-dark dark:text-white mb-2 line-clamp-1">
                                {tour.name}
                            </h3>

                            <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2 min-h-[2.5rem]">
                                {tour.description}
                            </p>

                            <div className="mb-4 mt-auto">
                                <p className="text-xs font-semibold uppercase text-dark-5 mb-2">Destinos Incluidos:</p>
                                <div className="flex flex-wrap gap-2">
                                    {tour.places && tour.places.length > 0 ? (
                                        tour.places.slice(0, 3).map(place => (
                                            <span key={place.id} className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                                {place.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-dark-6 italic">Sin destinos asignados</span>
                                    )}
                                    {tour.places && tour.places.length > 3 && (
                                        <span className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                            +{tour.places.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-stroke pt-4 dark:border-dark-3 mt-4">
                                <AnimatedButton
                                    href={`/admin/tours/${tour.id}`}
                                    className="w-full"
                                >
                                    Ver detalles
                                </AnimatedButton>
                            </div>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && <EmptyState />}
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

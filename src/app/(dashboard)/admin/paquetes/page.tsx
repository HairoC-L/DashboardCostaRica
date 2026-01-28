"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PackagesService } from "@/services/packages.service";
import { Package } from "@/types";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

export default function PackagesAdmin() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await PackagesService.getPackages();
            setPackages(data);
        } catch (error) {
            console.error("Error loading packages:", error);
        } finally {
            setLoading(false);
        }
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
    } = useSearchPagination(packages, 6, (pkg, query) =>
        pkg.title.toLowerCase().includes(query.toLowerCase()) ||
        (pkg.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    if (loading) {
        return <div className="p-10 text-center">Cargando paquetes...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Paquetes Turísticos"
                description="Administra los paquetes disponibles en la plataforma."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar paquete..."
                actionLabel="Nuevo Paquete"
                actionHref="/admin/paquetes/create"
            />

            <AdminGrid>
                {currentItems.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="group relative overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card hover:shadow-2 transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            {pkg.images && pkg.images.length > 0 ? (
                                <Image
                                    src={pkg.images[0]}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-dark-2 text-dark-6">
                                    <span className="text-sm">Sin imagen</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
                                {pkg.tags?.map((tag, idx) => (
                                    <span key={idx} className="inline-block rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute bottom-2 right-2">
                                <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-bold text-white shadow-sm">
                                    {pkg.duration_days} Días / {pkg.duration_nights} Noches
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white line-clamp-1">
                                {pkg.title}
                            </h3>
                            <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2 flex-grow">
                                {pkg.description || "Sin descripción"}
                            </p>

                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase text-dark-5 mb-2">Incluye:</p>
                                <div className="flex flex-wrap gap-2">
                                    {pkg.included?.slice(0, 4).map((item, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 dark:bg-dark-2 px-2 py-1 rounded text-dark-6 border border-stroke dark:border-dark-3">
                                            {item}
                                        </span>
                                    ))}
                                    {pkg.included && pkg.included.length > 4 && (
                                        <span className="text-xs text-dark-5">+{pkg.included.length - 4} más</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-stroke dark:border-dark-3">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <span className="text-xs text-dark-6 block">Desde</span>
                                        <span className="text-lg font-bold text-primary">${pkg.price?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <AnimatedButton
                                    href={`/admin/paquetes/${pkg.id}`}
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

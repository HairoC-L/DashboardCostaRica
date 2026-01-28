"use client";

import { useEffect, useState } from "react";
import { ReservationsService } from "@/services/reservations.service";
import { Reservation } from "@/types";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminTable } from "@/components/Admin/AdminTable";
import { useSearchPagination } from "@/hooks/useSearchPagination"; // Reusing pagination hook logic manually for now or adapting
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function ReservationsAdmin() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ReservationsService.getReservations();
            setReservations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 1. Filter by Status first
    const statusFilteredData = reservations.filter(res =>
        filterStatus === "all" || res.status === filterStatus
    );

    // 2. Use hook for Search and Pagination
    const {
        searchQuery,
        setSearchQuery,
        currentItems,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        totalItems
    } = useSearchPagination(statusFilteredData, 10, (res, query) =>
        res.userName.toLowerCase().includes(query.toLowerCase()) ||
        res.userEmail.toLowerCase().includes(query.toLowerCase()) ||
        res.id.toLowerCase().includes(query.toLowerCase()) ||
        (res.tourName?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (res.packageName?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-success bg-success/10";
            case "pending": return "text-warning bg-warning/10";
            case "cancelled": return "text-danger bg-danger/10";
            case "completed": return "text-primary bg-primary/10";
            default: return "text-gray-500 bg-gray-100";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed": return "Confirmada";
            case "pending": return "Pendiente";
            case "cancelled": return "Cancelada";
            case "completed": return "Completada";
            default: return status;
        }
    };

    const columns = [
        {
            header: "ID",
            accessorKey: "id" as keyof Reservation,
            className: "font-semibold"
        },
        {
            header: "Cliente",
            cell: (res: Reservation) => (
                <div>
                    <p className="font-medium text-black dark:text-white">{res.userName}</p>
                    <p className="text-sm text-gray-500">{res.userEmail}</p>
                </div>
            )
        },
        {
            header: "Producto",
            cell: (res: Reservation) => (
                <span className="text-sm">
                    {res.tourName || res.packageName || "N/A"}
                </span>
            )
        },
        {
            header: "Fecha",
            cell: (res: Reservation) => dayjs(res.date).format("DD MMM YYYY")
        },
        {
            header: "Pax",
            accessorKey: "pax" as keyof Reservation,
            className: "text-center"
        },
        {
            header: "Total",
            cell: (res: Reservation) => `$${res.totalPrice}`
        },
        {
            header: "Estado",
            cell: (res: Reservation) => (
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(res.status)}`}>
                    {getStatusLabel(res.status)}
                </span>
            )
        },
        {
            header: "Acciones",
            cell: (res: Reservation) => (
                <div className="flex items-center space-x-2">
                    <Link
                        href={`/admin/reservas/${res.id}`}
                        className="hover:text-primary transition-colors"
                        title="Ver Detalles"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Reservas"
                description="Gestiona todas las reservas de tours y paquetes."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar por cliente, ID..."
            // actionLabel="Nueva Reserva" // Optional if we want manual creation
            // actionHref="/admin/reservas/create"
            />

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${filterStatus === status
                            ? "bg-primary text-white"
                            : "bg-white text-dark hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:hover:bg-white/5"
                            }`}
                    >
                        {status === "all" ? "Todas" : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            <AdminTable
                data={currentItems}
                columns={columns}
                keyExtractor={(item) => item.id}
                isLoading={loading}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {currentItems.length} de {totalItems} reservas
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-strokedark disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-meta-4"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1
                                        ? "bg-primary text-white border-primary"
                                        : "border-gray-300 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-strokedark disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-meta-4"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

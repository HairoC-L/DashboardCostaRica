"use client";

import { useEffect, useState } from "react";
import { ReservationsService } from "@/services/reservations.service";
import { Reservation } from "@/types";
import { useParams, useRouter } from "next/navigation";
import AnimatedButton from "@/components/ui/AnimatedButton";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function ReservationDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await ReservationsService.getReservationById(Array.isArray(id) ? id[0] : id);
                setReservation(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Cargando reserva...</div>;
    if (!reservation) return <div className="p-10 text-center">Reserva no encontrada.</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-success bg-success/10";
            case "pending": return "text-warning bg-warning/10";
            case "cancelled": return "text-danger bg-danger/10";
            case "completed": return "text-primary bg-primary/10";
            default: return "text-gray-500 bg-gray-100";
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">
                        Reserva #{reservation.id}
                    </h2>
                    <p className="text-sm text-dark-6">
                        Creada el {dayjs(reservation.createdAt).format("DD [de] MMMM, YYYY")}
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-dark hover:text-primary dark:text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Client Info */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">Información del Cliente</h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="block text-sm text-dark-6">Nombre Completo</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.userName}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Email</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.userEmail}</span>
                        </div>
                        {reservation.userId && (
                            <div>
                                <span className="block text-sm text-dark-6">ID Usuario</span>
                                <span className="text-base font-medium text-dark dark:text-white text-xs">{reservation.userId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Info */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">Detalles de la Reserva</h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="block text-sm text-dark-6">Producto Reservado</span>
                            <span className="text-base font-medium text-dark dark:text-white">
                                {reservation.tourName || reservation.packageName}
                            </span>
                            {reservation.tourId && <span className="text-xs text-primary ml-2">(Tour)</span>}
                            {reservation.packageId && <span className="text-xs text-secondary ml-2">(Paquete)</span>}
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Fecha del Viaje</span>
                            <span className="text-base font-medium text-dark dark:text-white">
                                {dayjs(reservation.date).format("DD [de] MMMM, YYYY")}
                            </span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Pasajeros (Pax)</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.pax}</span>
                        </div>
                    </div>
                </div>

                {/* Status & Payment */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card md:col-span-2">
                    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">Estado y Pago</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <span className="block text-sm text-dark-6 mb-1">Estado de Reserva</span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(reservation.status)}`}>
                                {(reservation.status).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6 mb-1">Estado de Pago</span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${reservation.paymentStatus === 'paid' ? 'text-success bg-success/10' :
                                    reservation.paymentStatus === 'partial' ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'
                                }`}>
                                {(reservation.paymentStatus).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6 mb-1">Total a Pagar</span>
                            <span className="text-2xl font-bold text-dark dark:text-white">
                                ${reservation.totalPrice}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button className="px-6 py-2 rounded-lg border border-stroke text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition">
                    Cancelar Reserva
                </button>
                <button className="px-6 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition">
                    Confirmar Pago
                </button>
            </div>
        </div>
    );
}

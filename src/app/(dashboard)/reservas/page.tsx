"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function MyReservations() {
    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Mis Reservas" />

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <h3 className="text-xl font-bold mb-4">Historial de Reservas</h3>

                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="bg-gray-100 dark:bg-dark-2 rounded-full p-6 mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-dark dark:text-white mb-2">No tienes reservas activas</h4>
                    <p className="text-body-color dark:text-dark-6 max-w-md">
                        Aquí aparecerán tus próximos viajes y tours reservados. ¡Explora nuestros destinos y comienza tu aventura!
                    </p>
                </div>
            </div>
        </div>
    );
}

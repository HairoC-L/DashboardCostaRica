"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService, Place } from "@/services/api-service";
import DestinationForm from "@/components/Admin/destinos/DestinationForm";
import Link from "next/link";

export default function CreateDestinationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: Partial<Place>) => {
        try {
            setIsSubmitting(true);
            await ApiService.addPlace(data as Omit<Place, "id">);
            router.push("/admin/destinos");
            router.refresh();
        } catch (error) {
            console.error("Error creating place:", error);
            alert("Error al crear el destino. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/admin/destinos"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Nuevo Destino</h2>
                    <p className="text-sm text-dark-6">Complete la información para publicar un nuevo destino turístico.</p>
                </div>
            </div>

            <DestinationForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push("/admin/destinos")}
            />
        </div>
    );
}

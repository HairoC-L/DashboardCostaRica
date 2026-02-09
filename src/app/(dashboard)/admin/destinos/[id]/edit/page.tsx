"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Place, ApiService } from "@/services/api-service";
import DestinationForm from "@/components/Admin/destinos/DestinationForm";
import Link from "next/link";

export default function EditDestinationPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            if (!id) return;
            try {
                const data = await ApiService.getPlace(id);
                setPlace(data);
            } catch (error) {
                console.error("Error fetching place:", error);
                router.push("/admin/destinos");
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id, router]);

    const handleSubmit = async (data: Partial<Place>) => {
        try {
            setIsSubmitting(true);
            await ApiService.updatePlace(id, data);
            router.push(`/admin/destinos/${id}`); // Back to details
            router.refresh();
        } catch (error) {
            console.error("Error updating place:", error);
            alert("Error al actualizar el destino.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando datos...</div>;
    if (!place) return null;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={`/admin/destinos/${id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Editar Destino</h2>
                    <p className="text-sm text-dark-6">Modifica la información del destino turístico.</p>
                </div>
            </div>

            <DestinationForm
                initialData={place}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push(`/admin/destinos/${id}`)}
            />
        </div>
    );
}

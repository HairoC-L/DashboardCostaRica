"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiService, Tour, Place } from "@/services/api-service";
import TourForm from "@/components/Admin/tours/TourForm";
import Link from "next/link";

export default function EditTourPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!id) return;
            try {
                // Fetch Tour
                const tourFn = ApiService.getTour(id);
                // Fetch Places
                const placesFn = ApiService.getPlaces();

                const [tourData, places] = await Promise.all([tourFn, placesFn]);

                setAvailablePlaces(places);
                setTour(tourData);
            } catch (error) {
                console.error("Error loading data:", error);
                router.push("/admin/tours");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [id, router]);

    const handleSubmit = async (data: Partial<Tour>) => {
        try {
            setIsSubmitting(true);
            await ApiService.updateTour(id, data);
            router.push(`/admin/tours/${id}`);
            router.refresh();
        } catch (error) {
            console.error("Error updating tour:", error);
            alert("Error al actualizar el tour.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando datos...</div>;
    if (!tour) return null;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={`/admin/tours/${id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Editar Tour</h2>
                    <p className="text-sm text-dark-6">Modifica la información del tour.</p>
                </div>
            </div>

            <TourForm
                initialData={tour}
                availablePlaces={availablePlaces}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push(`/admin/tours/${id}`)}
            />
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FirebaseService, Tour, Place } from "@/services/firebase-service";
import TourForm from "@/components/Admin/tours/TourForm";
import Link from "next/link";

export default function CreateTourPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            const places = await FirebaseService.getPlaces();
            setAvailablePlaces(places);
        };
        fetchPlaces();
    }, []);

    const handleSubmit = async (data: Partial<Tour>) => {
        try {
            setIsSubmitting(true);
            await FirebaseService.addTour(data as Omit<Tour, "id">);
            router.push("/admin/tours");
            router.refresh();
        } catch (error) {
            console.error("Error creating tour:", error);
            alert("Error al crear el tour. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/admin/tours"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Nuevo Tour</h2>
                    <p className="text-sm text-dark-6">Complete la información básica para empezar. Podrá agregar más detalles luego.</p>
                </div>
            </div>

            <TourForm
                availablePlaces={availablePlaces}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push("/admin/tours")}
                simpleMode={true}
            />
        </div>
    );
}

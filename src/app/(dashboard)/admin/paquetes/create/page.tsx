"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseService, Package } from "@/services/firebase-service";
import PackageForm from "@/components/Admin/packages/PackageForm";
import Link from "next/link";

export default function CreatePackagePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: Omit<Package, "id">) => {
        try {
            setIsSubmitting(true);
            await FirebaseService.addPackage(data);
            router.push("/admin/paquetes");
        } catch (error) {
            console.error("Error creating package:", error);
            alert("Error al crear el paquete. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/admin/paquetes"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Nuevo Paquete</h2>
                    <p className="text-sm text-dark-6">Completa la información para publicar un nuevo paquete.</p>
                </div>
            </div>

            <PackageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}

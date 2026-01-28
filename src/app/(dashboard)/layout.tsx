"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/auth/sign-in");
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen text-bodydark2 dark:text-bodydark">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar />
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-gray-2 dark:bg-[#020d1a]">
                {/* <!-- ===== Header Start ===== --> */}
                <Header />
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
        </div>
    );
}

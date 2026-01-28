import { Navbar } from "@/components/Landing/Navbar";
import { HeroCarousel } from "@/components/Landing/HeroCarousel";
import { InteractiveMap } from "@/components/Landing/InteractiveMap";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <main>
                <section className="relative">
                    <HeroCarousel />
                </section>

                <section className="py-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-dark dark:text-white">
                        Explora el Mapa Interactivo
                    </h2>
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                        Interactúa con nuestro modelo 3D de la zona.
                    </p>

                    <div className="mx-auto max-w-6xl overflow-hidden rounded-xl shadow-2xl">
                        <InteractiveMap />
                    </div>
                </section>

                <section className="bg-gray-50 py-16 dark:bg-gray-900">
                    <div className="mx-auto max-w-screen-xl px-4">
                        <h2 className="mb-8 text-center text-3xl font-bold text-dark dark:text-white">
                            Nuestros Tours
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                                    <div className="h-48 bg-gray-300 dark:bg-gray-700" />
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                                            Tour Destacado {i}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Descripción breve del tour increíble que ofrecemos.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-dark py-8 text-white">
                <div className="mx-auto max-w-screen-xl px-4 text-center">
                    <p>&copy; 2026 Costa Rica Unlocked. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

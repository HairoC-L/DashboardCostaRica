import { cn } from "@/lib/utils";
import { getTopStats } from "@/app/(dashboard)/dashboard/fetch";

type PropsType = {
    className?: string;
};

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400">
                <span className="font-bold">#1</span>
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400">
                <span className="font-bold">#2</span>
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400">
                <span className="font-bold">#3</span>
            </div>
        );
    }
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <span className="font-bold">#{rank}</span>
        </div>
    );
};

export async function TopPerformers({ className }: PropsType) {
    const { places, packages, tours } = await getTopStats();

    return (
        <div
            className={cn(
                "grid gap-6 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card sm:grid-cols-2 lg:grid-cols-3",
                className,
            )}
        >
            {/* Destinos */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-dark dark:text-white border-b border-stroke dark:border-dark-3 pb-2">Top Destinos</h3>
                {places.map((place, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                        <RankBadge rank={index + 1} />
                        <div>
                            <p className="font-bold text-dark dark:text-white">{place.name}</p>
                            <p className="text-xs font-medium text-primary">
                                {place.visits} <span className="text-dark-6">visitas globales</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paquetes */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-dark dark:text-white border-b border-stroke dark:border-dark-3 pb-2">Top Paquetes</h3>
                {packages.map((pkg, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                        <RankBadge rank={index + 1} />
                        <div>
                            <p className="font-bold text-dark dark:text-white">{pkg.name}</p>
                            <p className="text-xs font-medium text-blue-500">
                                {pkg.sales} <span className="text-dark-6">ventas confirmadas</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tours */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-dark dark:text-white border-b border-stroke dark:border-dark-3 pb-2">Top Tours</h3>
                {tours.map((tour, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                        <RankBadge rank={index + 1} />
                        <div>
                            <p className="font-bold text-dark dark:text-white">{tour.name}</p>
                            <p className="text-xs font-medium text-emerald-500">
                                {tour.bookings} <span className="text-dark-6">reservas totales</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

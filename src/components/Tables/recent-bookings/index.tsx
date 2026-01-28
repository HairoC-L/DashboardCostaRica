import { cn } from "@/lib/utils";
import { getRecentBookings } from "@/app/(dashboard)/dashboard/fetch";

type PropsType = {
    className?: string;
};

export async function RecentBookings({ className }: PropsType) {
    const bookings = await getRecentBookings();

    return (
        <div
            className={cn(
                "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
                className,
            )}
        >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
                        Últimas Reservas
                    </h4>
                    <p className="text-sm font-medium text-dark-6 mt-1">
                        Historial reciente de transacciones
                    </p>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-4 rounded-lg bg-gray-100 p-3 mx-2 dark:bg-dark-2 sm:grid-cols-5">
                    <div className="p-2.5 xl:p-3">
                        <h5 className="text-xs font-bold uppercase xsm:text-sm text-dark-5 dark:text-dark-6">ID Reserva</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-3">
                        <h5 className="text-xs font-bold uppercase xsm:text-sm text-dark-5 dark:text-dark-6">Cliente</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-3">
                        <h5 className="text-xs font-bold uppercase xsm:text-sm text-dark-5 dark:text-dark-6">Paquete/Tour</h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-3">
                        <h5 className="text-xs font-bold uppercase xsm:text-sm text-dark-5 dark:text-dark-6">Fecha</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-3">
                        <h5 className="text-xs font-bold uppercase xsm:text-sm text-dark-5 dark:text-dark-6">Estado</h5>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    {bookings.map((booking, key) => (
                        <div
                            className="grid grid-cols-4 sm:grid-cols-5 items-center p-2 mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200"
                            key={key}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-4">
                                <span className="font-semibold text-primary dark:text-primary-dark">
                                    {booking.id}
                                </span>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-4 text-center">
                                <p className="font-medium text-dark dark:text-white text-sm sm:text-base">
                                    {booking.client}
                                </p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-4 text-center">
                                <p className="text-sm font-medium text-dark-6">
                                    {booking.package}
                                </p>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-4">
                                <p className="text-sm text-dark-6">{booking.date}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-4">
                                <span
                                    className={cn(
                                        "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm",
                                        booking.status === "Confirmado" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                                        booking.status === "Cancelado" && "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
                                        booking.status === "Pendiente" && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                    )}
                                >
                                    {booking.status === "Confirmado" && <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>}
                                    {booking.status === "Cancelado" && <span className="mr-1.5 h-2 w-2 rounded-full bg-rose-500"></span>}
                                    {booking.status === "Pendiente" && <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500"></span>}
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

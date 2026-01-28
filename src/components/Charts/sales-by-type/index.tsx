import { cn } from "@/lib/utils";
import { getSalesByType } from "@/app/(dashboard)/dashboard/fetch";
import { SalesByTypeChart } from "./chart";

type PropsType = {
    className?: string;
};

export async function SalesByType({ className }: PropsType) {
    const data = await getSalesByType();

    return (
        <div
            className={cn(
                "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                    Ventas por Tipo
                </h2>
            </div>

            <SalesByTypeChart data={data} />
        </div>
    );
}

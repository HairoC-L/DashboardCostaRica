import { compactFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getIncomeHistory } from "@/app/(dashboard)/dashboard/fetch";
import { IncomeChart } from "./chart";

type PropsType = {
    className?: string;
};

export async function IncomeOverview({ className }: PropsType) {
    const data = await getIncomeHistory();

    const totalIncome = data.series[0].data.reduce((a, b) => a + b, 0);

    return (
        <div
            className={cn(
                "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                    Ingresos en el Tiempo
                </h2>
            </div>

            <IncomeChart data={data} />

            <div className="mt-4 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-dark dark:text-white">
                        ${compactFormat(totalIncome)}
                    </span>
                    <span className="text-sm font-medium text-dark-6">Total Anual</span>
                </div>
            </div>
        </div>
    );
}

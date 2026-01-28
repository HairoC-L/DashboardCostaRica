import { cn } from "@/lib/utils";
import { getNewUsersHistory } from "@/app/(dashboard)/dashboard/fetch";
import { NewUsersChart } from "./chart";

type PropsType = {
    className?: string;
};

export async function NewUsersOverview({ className }: PropsType) {
    const data = await getNewUsersHistory();

    return (
        <div
            className={cn(
                "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                    Nuevos Usuarios
                </h2>
            </div>

            <NewUsersChart data={data} />
        </div>
    );
}

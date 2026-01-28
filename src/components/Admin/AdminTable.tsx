import React from "react";

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
}

export const AdminTable = <T extends any>({
    data,
    columns,
    keyExtractor,
    isLoading = false
}: AdminTableProps<T>) => {

    if (isLoading) {
        return <div className="p-10 text-center">Cargando datos...</div>;
    }

    return (
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card overflow-hidden">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`py-4 px-4 font-medium text-black dark:text-white ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIndex) => (
                            <tr key={keyExtractor(item)} className="border-b border-stroke dark:border-strokedark last:border-b-0 hover:bg-gray-50 dark:hover:bg-meta-4/30 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`py-3 px-4 ${col.className || ""}`}>
                                        {col.cell
                                            ? col.cell(item)
                                            : (col.accessorKey ? String(item[col.accessorKey]) : "")
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No hay datos para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

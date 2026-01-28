import React from "react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No se encontraron resultados",
    description = "Intenta con otra búsqueda o agrega un nuevo elemento.",
    icon
}) => {
    return (
        <div className="col-span-full py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-2">
                {icon ? icon : (
                    <svg className="h-8 w-8 text-dark-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>
            <h3 className="text-lg font-medium text-dark dark:text-white">{title}</h3>
            <p className="text-dark-6">{description}</p>
        </div>
    );
};

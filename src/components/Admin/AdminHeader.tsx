import React from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface AdminHeaderProps {
    title: string;
    description: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchPlaceholder?: string;
    actionLabel?: string;
    actionHref?: string;
    onActionClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    searchQuery,
    setSearchQuery,
    searchPlaceholder = "Buscar...",
    actionLabel,
    actionHref,
    onActionClick
}) => {
    return (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">{title}</h2>
                <p className="text-sm text-dark-6">{description}</p>
            </div>

            <div className="relative w-full sm:w-64 md:w-80">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {(actionLabel && (actionHref || onActionClick)) && (
                <div className="shrink-0">
                    {actionHref ? (
                        <AnimatedButton href={actionHref}>
                            <svg className="w-5 h-5 fill-current mr-2" viewBox="0 0 20 20">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            {actionLabel}
                        </AnimatedButton>
                    ) : (
                        <button
                            onClick={onActionClick}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            <svg className="w-5 h-5 fill-current mr-2" viewBox="0 0 20 20">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

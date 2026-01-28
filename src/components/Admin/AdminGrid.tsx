import React from "react";

interface AdminGridProps {
    children: React.ReactNode;
    className?: string;
}

export const AdminGrid: React.FC<AdminGridProps> = ({ children, className = "" }) => {
    return (
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
            {children}
        </div>
    );
};

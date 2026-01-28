"use client";

import { useState, ReactNode } from "react";

interface EditableSectionProps {
    title: string;
    children: ReactNode;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    className?: string;
    isSaving?: boolean;
}

export default function EditableSection({
    title,
    children,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    className = "",
    isSaving = false
}: EditableSectionProps) {
    return (
        <div className={`rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card relative group ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-dark dark:text-white">{title}</h3>
                {!isEditing && (
                    <button
                        onClick={onEdit}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Editar sección"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className={isEditing ? "animate-in fade-in duration-200" : ""}>
                {children}
            </div>

            {isEditing && (
                <div className="flex gap-3 mt-6 justify-end border-t border-stroke pt-4 dark:border-dark-3 animate-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

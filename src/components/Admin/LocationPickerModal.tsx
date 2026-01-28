"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import LeafletMap to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">Cargando mapa...</div>
});

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (lat: number, lng: number) => void;
    initialCoordinates?: { lat: number; lng: number };
}

export default function LocationPickerModal({
    isOpen,
    onClose,
    onConfirm,
    initialCoordinates
}: LocationPickerModalProps) {
    const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);

    // Sync with initial coordinates when modal opens
    useEffect(() => {
        if (isOpen && initialCoordinates && initialCoordinates.lat && initialCoordinates.lng) {
            setSelectedPos([initialCoordinates.lat, initialCoordinates.lng]);
        } else if (isOpen) {
            // Optional: Reset if no initial coords, or keep previous selection? 
            // Better to reset if strictly following "initial" prop, but for UX maybe keep if reopening?
            // Let's reset if it's explicitly undefined/zero, otherwise keep.
            if (!initialCoordinates?.lat && !initialCoordinates?.lng) {
                setSelectedPos(null);
            }
        }
    }, [isOpen, initialCoordinates]);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedPos([lat, lng]);
    };

    const handleConfirm = () => {
        if (selectedPos) {
            onConfirm(selectedPos[0], selectedPos[1]);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl h-[80vh] flex flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-dark border border-stroke dark:border-dark-3 overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-stroke dark:border-dark-3 flex justify-between items-center bg-gray-50 dark:bg-white/5 relative z-50">
                    <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white">
                            Seleccionar Ubicación
                        </h3>
                        <p className="text-xs text-gray-500">
                            Haga clic en el mapa para colocar el pin.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-dark dark:hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-gray-100 z-0">
                    <LeafletMap
                        onLocationSelect={handleLocationSelect}
                        selectedPos={selectedPos}
                        className="h-full w-full"
                    />

                    {/* Helper overlay if no position selected */}
                    {!selectedPos && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-black/75 text-white px-4 py-2 rounded-full text-sm pointer-events-none backdrop-blur-md">
                            Toca el mapa para seleccionar
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-stroke dark:border-dark-3 flex justify-between items-center bg-white dark:bg-gray-dark relative z-50">
                    <div className="text-sm">
                        {selectedPos ? (
                            <span className="font-mono text-primary">
                                {selectedPos[0].toFixed(6)}, {selectedPos[1].toFixed(6)}
                            </span>
                        ) : (
                            <span className="text-gray-400 italic">Sin selección</span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-stroke text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedPos}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-all shadow-md ${selectedPos
                                ? "bg-primary hover:bg-opacity-90 hover:shadow-lg"
                                : "bg-gray-400 cursor-not-allowed opacity-50"
                                }`}
                        >
                            Confirmar Ubicación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

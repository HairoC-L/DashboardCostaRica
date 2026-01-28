"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet clean icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    boundaryCoords?: { lat: number; lng: number }[];
}

function ClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LeafletMap({ onLocationSelect, boundaryCoords, selectedPos, className }: LeafletMapProps & { selectedPos?: [number, number] | null, className?: string }) {
    // Center of Costa Rica or the bounds
    const center: [number, number] = [9.0, -84.0];

    return (
        <MapContainer center={center} zoom={8} className={className} style={{ height: "100%", width: "100%", zIndex: 0, minHeight: className ? "0" : "600px" }}>
            {/* OpenStreetMap (Standard) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {boundaryCoords && (
                <Polygon
                    positions={boundaryCoords}
                    pathOptions={{ color: 'red', dashArray: '10, 10', fill: false, weight: 2 }}
                />
            )}

            {selectedPos && (
                <Marker position={selectedPos} />
            )}

            <ClickHandler onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
}

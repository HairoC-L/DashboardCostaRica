"use client";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center, Html } from "@react-three/drei";
import { Vector3, Box3, Raycaster } from "three";
import { ApiService, MapPin } from "@/services/api-service";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";

// Dynamically import Leaflet map
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

// 2D Coordinates (User Provided)
const COORDS = {
    TL: { lat: 9.448904954935871, lng: -84.01845893372125 },
    TR: { lat: 9.44050741576135, lng: -81.92028806117499 },
    BR: { lat: 8.057571343207774, lng: -81.92104254676394 },
    BL: { lat: 8.059536010587447, lng: -84.01040199089617 }
};

// --- 3D Model Component ---
function MapModel({ onMapClick, setBounds, sceneRef }: any) {
    const { scene } = useGLTF("/prueba.glb");

    useEffect(() => {
        if (scene) {
            sceneRef.current = scene;
            const box = new Box3().setFromObject(scene);
            setBounds({
                minX: box.min.x,
                maxX: box.max.x,
                minZ: box.min.z,
                maxZ: box.max.z,
                maxY: box.max.y
            });
        }
    }, [scene, setBounds, sceneRef]);

    return (
        <primitive
            object={scene}
            onClick={(e: any) => {
                e.stopPropagation();
                onMapClick(e.point);
            }}
        />
    );
}

// --- Main Page Component ---
export default function AdminMap3DPage() {
    const [pins, setPins] = useState<MapPin[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<Vector3 | null>(null);
    const [selected2DPos, setSelected2DPos] = useState<{ lat: number; lng: number } | null>(null);
    const [newPinName, setNewPinName] = useState("");
    const [loading, setLoading] = useState(false);
    const [modelBounds, setModelBounds] = useState<any>(null);
    const sceneRef = useRef<any>(null);

    useEffect(() => {
        loadPins();
    }, []);

    const loadPins = async () => {
        try {
            const data = await ApiService.getMapPins();
            setPins(data);
        } catch (error) {
            console.error("Error loading pins:", error);
        }
    };

    const handleMapClick = (point: Vector3) => {
        setSelectedPoint(point);
        setNewPinName("");
    };

    const handle2DLocationSelect = (lat: number, lng: number) => {
        setSelected2DPos({ lat, lng });

        if (!modelBounds || !sceneRef.current) {
            alert("El modelo 3D aún está cargando. Por favor espere...");
            return;
        }

        // 1. Map Lat/Lng to X/Z percentages (Linear Approximation)
        const lngMin = -84.01845893372125;
        const lngMax = -81.92028806117499;
        const latMax = 9.448904954935871;
        const latMin = 8.057571343207774;

        const xPercent = (lng - lngMin) / (lngMax - lngMin);
        const zPercent = (latMax - lat) / (latMax - latMin);

        const x3D = modelBounds.minX + (xPercent * (modelBounds.maxX - modelBounds.minX));
        const z3D = modelBounds.minZ + (zPercent * (modelBounds.maxZ - modelBounds.minZ));

        // 2. Raycast for terrain height
        const origin = new Vector3(x3D, modelBounds.maxY + 50000, z3D);
        const direction = new Vector3(0, -1, 0);
        const raycaster = new Raycaster(origin, direction);

        const intersects = raycaster.intersectObject(sceneRef.current, true);

        if (intersects.length > 0) {
            const hit = intersects[0].point;
            setSelectedPoint(hit);
            setNewPinName("");
        } else {
            // Fallback
            setSelectedPoint(new Vector3(x3D, 0, z3D));
            setNewPinName("");
            alert("Ubicación fuera del área del modelo 3D.");
        }
    };

    const handleSavePin = async () => {
        if (!selectedPoint || !newPinName.trim()) return;

        setLoading(true);
        try {
            await ApiService.addMapPin({
                label: newPinName,
                position: [selectedPoint.x, selectedPoint.y, selectedPoint.z]
            });
            await loadPins();
            setSelectedPoint(null);
            setNewPinName("");
        } catch (error) {
            console.error("Error saving pin:", error);
            alert("Error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePin = async (id: string) => {
        if (!confirm("¿Eliminar este pin?")) return;
        setLoading(true);
        try {
            await ApiService.deleteMapPin(id);
            await loadPins();
        } catch (error) {
            console.error("Error deleting pin:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-full">
            <Breadcrumb pageName="Gestión de Mapa 3D" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-6 h-[calc(100vh-200px)] min-h-[800px]">

                {/* --- LEFT COLUMN: 2D Map (Dominant) --- */}
                <div className="xl:col-span-8 flex flex-col gap-6 h-full">
                    <div className="flex-1 rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-hidden flex flex-col">
                        <div className="border-b border-stroke bg-gray-50 px-5 py-3 dark:border-strokedark dark:bg-meta-4/20">
                            <h3 className="font-semibold text-black dark:text-white flex items-center gap-2">
                                Paso 1: Buscar Ubicación (Vista Satelital)
                            </h3>
                        </div>
                        <div className="flex-1 w-full relative z-0">
                            <LeafletMap
                                onLocationSelect={handle2DLocationSelect}
                                boundaryCoords={[
                                    COORDS.TL,
                                    COORDS.TR,
                                    COORDS.BR,
                                    COORDS.BL
                                ]}
                                selectedPos={selected2DPos ? [selected2DPos.lat, selected2DPos.lng] : null}
                            />
                            <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs pointer-events-none z-[1000] border border-red-500/50">
                                Area activa demarcada en rojo
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: 3D Preview & List (Split 50/50) --- */}
                <div className="xl:col-span-4 flex flex-col gap-6 h-full">

                    {/* 2. 3D Preview Card (Flex 1) */}
                    <div className="flex-1 rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-hidden relative group">
                        {/* Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 pointer-events-none">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Paso 2: Vista 3D
                            </h3>
                        </div>

                        {/* 3D Canvas */}
                        <div className="h-full w-full bg-gray-900 block">
                            <Canvas shadows camera={{ position: [0, 80000, 80000], fov: 50, near: 1000, far: 1000000 }}>
                                <Suspense fallback={null}>
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[10000, 10000, 10000]} intensity={1} castShadow />

                                    <Center>
                                        <MapModel onMapClick={handleMapClick} setBounds={setModelBounds} sceneRef={sceneRef} />
                                    </Center>

                                    {pins.map((pin) => (
                                        <group key={pin.id} position={pin.position}>
                                            <group position={[0, 500, 0]}>
                                                <mesh position={[0, 1000, 0]}>
                                                    <sphereGeometry args={[600, 32, 32]} />
                                                    <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
                                                </mesh>
                                                <mesh position={[0, 500, 0]}>
                                                    <coneGeometry args={[200, 1200, 32]} />
                                                    <meshStandardMaterial color="#cc0000" />
                                                </mesh>
                                            </group>
                                            <Html distanceFactor={50000} position={[0, 2500, 0]} style={{ pointerEvents: 'none' }}>
                                                <div className="p-[2px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl transform -translate-x-1/2 -translate-y-full opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-black/80 text-white px-3 py-1.5 rounded-[6px] text-sm font-bold backdrop-blur-md whitespace-nowrap">
                                                        {pin.label}
                                                    </div>
                                                </div>
                                            </Html>
                                        </group>
                                    ))}

                                    {selectedPoint && (
                                        <group position={[selectedPoint.x, selectedPoint.y, selectedPoint.z]}>
                                            <group position={[0, 500, 0]}>
                                                <mesh position={[0, 1000, 0]}>
                                                    <sphereGeometry args={[800, 32, 32]} />
                                                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
                                                </mesh>
                                                <mesh position={[0, 500, 0]}>
                                                    <coneGeometry args={[300, 1200, 32]} />
                                                    <meshStandardMaterial color="#16a34a" />
                                                </mesh>
                                            </group>
                                        </group>
                                    )}
                                </Suspense>
                                <OrbitControls autoRotate={false} enableZoom={true} enablePan={true} />
                                <Environment preset="city" />
                            </Canvas>
                        </div>

                        {/* SAVE DIALOG (Bottom) */}
                        {selectedPoint && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/90 p-3 rounded-xl shadow-2xl backdrop-blur border border-white/20 flex flex-col gap-2 z-20 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-100 text-green-600 p-1.5 rounded-full">✓</div>
                                    <span className="font-bold text-sm">Guardar Punto</span>
                                </div>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Nombre ciudad..."
                                    className="w-full rounded border border-stroke bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-primary dark:bg-meta-4/30 dark:text-white"
                                    value={newPinName}
                                    onChange={(e) => setNewPinName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSavePin()}
                                />
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={handleSavePin}
                                        disabled={loading || !newPinName.trim()}
                                        className="flex-1 rounded bg-primary py-1.5 text-xs font-bold text-white hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                        GUARDAR
                                    </button>
                                    <button
                                        onClick={() => setSelectedPoint(null)}
                                        className="px-3 rounded border border-stroke text-xs font-bold hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. List (Flex 1 - Balanced) */}
                    <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark overflow-hidden">
                        <div className="border-b border-stroke bg-gray-50 px-5 py-3 dark:border-strokedark dark:bg-meta-4/20 flex justify-between items-center shrink-0">
                            <h3 className="font-semibold text-black dark:text-white text-sm">
                                Puntos Guardados ({pins.length})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {pins.length === 0 ? (
                                <div className="text-center text-gray-500 py-4 text-sm">
                                    No hay puntos.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {pins.map((pin) => (
                                        <div key={pin.id} className="flex items-center justify-between rounded border border-stroke p-2 dark:border-strokedark hover:bg-gray-50 group">
                                            <div className="truncate flex-1 min-w-0 pr-2">
                                                <h5 className="font-bold text-xs text-black dark:text-white truncate" title={pin.label}>{pin.label}</h5>
                                            </div>
                                            <button onClick={() => handleDeletePin(pin.id)} className="text-gray-400 hover:text-red-500 flex-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

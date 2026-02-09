"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Environment, useGLTF, Center, Html } from "@react-three/drei";
import { Mesh } from "three";

import { ApiService, MapPin } from "@/services/api-service";

function Model() {
    // Load the GLTF/GLB model. Replace '/Cottage_FREE.glb' with your file path.
    // GLTF is better for textures as they are embedded or referenced correctly.
    const { scene } = useGLTF("/prueba.glb");

    // Traverse to setup shadows
    scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <primitive object={scene} />
    );
}

export function InteractiveMap() {
    const [pins, setPins] = React.useState<MapPin[]>([]);

    React.useEffect(() => {
        const fetchPins = async () => {
            try {
                const data = await ApiService.getMapPins();
                setPins(data);
            } catch (error) {
                console.error("Failed to load map pins:", error);
            }
        };
        fetchPins();
    }, []);

    return (
        <div className="h-[600px] w-full bg-gray-100 dark:bg-gray-900 relative">

            <Canvas shadows camera={{ position: [0, 80000, 80000], fov: 50, near: 1000, far: 1000000 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10000, 10000, 10000]} intensity={1} castShadow />

                    <Center>
                        <Model />
                    </Center>

                    {pins.map((pin) => (
                        <group key={pin.id} position={pin.position}>
                            {/* Pin Icon Construction */}
                            <group position={[0, 500, 0]}> {/* Offset to align tip with point */}
                                {/* Pin Head */}
                                <mesh position={[0, 1000, 0]}>
                                    <sphereGeometry args={[600, 32, 32]} />
                                    <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
                                </mesh>
                                {/* Pin Point (Cone) */}
                                <mesh position={[0, 500, 0]}>
                                    <coneGeometry args={[200, 1200, 32]} />
                                    <meshStandardMaterial color="#cc0000" />
                                </mesh>
                            </group>

                            <Html distanceFactor={50000} position={[0, 2500, 0]} style={{ pointerEvents: 'none' }}>
                                <div className="p-[3px] rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-2xl transform -translate-x-1/2 -translate-y-full">
                                    <div className="bg-white/95 text-black px-4 py-2 rounded-[9px] text-lg font-bold backdrop-blur-sm whitespace-nowrap">
                                        {pin.label}
                                    </div>
                                </div>
                            </Html>
                        </group>
                    ))}
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={true} enablePan={true} />
                <Environment preset="city" />
            </Canvas>
            <div className="absolute bottom-4 left-4 rounded bg-white/80 p-2 text-sm text-black backdrop-blur">
                Mouse: Girar/Acercar/Alejar
            </div>
        </div>
    );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2666&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2664&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518182170546-0766be6ef588?q=80&w=2666&auto=format&fit=crop",
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={img}
                        alt={`Slide ${index}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                    Descubre Costa Rica
                </h1>
                <p className="text-xl md:text-2xl">
                    Explora turismo y tours inolvidables
                </p>
            </div>
        </div>
    );
}

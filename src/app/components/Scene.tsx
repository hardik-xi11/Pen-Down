"use client"

import { Canvas } from "@react-three/fiber";
import Model from "./ModelS";
import { Suspense } from "react";
import { useProgress, Html, ScrollControls } from "@react-three/drei";

function Loader() {
    // Removed unused 'active'
    const { progress } = useProgress();

    return <Html center>{progress.toFixed(2)} % loaded</Html>
}

export default function Scene() {
    return (
        <Canvas gl={{antialias: true}} dpr={[1, 1.5]} className="realtive">
            <directionalLight position={[0, 10, 5]} intensity={1} />
            <Suspense fallback={<Loader />}>
                <ScrollControls damping={0.1} pages={2}> 
                        <Model />
                </ScrollControls>
            </Suspense>
        </Canvas>
    )
}
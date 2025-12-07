import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";

useGLTF.preload("/models/scene.glb");

function Model() {
    const group = useRef<Group>(null);
    // Removed unused nodes, materials
    const { animations, scene } = useGLTF("/mutant_doccrash.glb")
    // Removed unused clips
    const { actions } = useAnimations(animations, scene);
    const scroll = useScroll();

    useEffect(() => {
        // Safe check instead of @ts-ignore
        const action = actions["mixamo.com"];
        if (action) {
            action.play().paused = true;
        }
    }, [actions]) // Added actions dependency

    useFrame(() => {
        const action = actions["mixamo.com"];
        // Safe check and math
        if (action) {
            action.time = (action.getClip().duration * scroll.offset) / 4;
        }
    })

    return (
        <group ref={group}>
            <primitive object={scene} />
        </group>
    )
}

export default Model

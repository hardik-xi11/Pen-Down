import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";

useGLTF.preload("/models/scene.glb");

function Model() {
    const group = useRef<Group>(null);
    const { nodes, materials, animations, scene } = useGLTF("/mutant_doccrash.glb")
    const { actions, clips } = useAnimations(animations, scene);
    const scroll = useScroll();

    useEffect(() => {
        //@ts-ignore
        actions["mixamo.com"].play().paused = true
    }, [])

    useFrame(
    () =>
      //@ts-ignore
      (actions["mixamo.com"].time =
        //@ts-ignore
        (actions["mixamo.com"]!.getClip().duration * scroll.offset) / 4)
  )


  return (
    <group ref={group}>
        <primitive object={scene} />
    </group>
  )
}

export default Model

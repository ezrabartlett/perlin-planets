import { OrbitControls } from '@react-three/drei';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, ColorRepresentation } from 'three';
import StarSystem from './system-objects/StarSystem';
import { useFrame } from '@react-three/fiber';
export type SceneProps = {

}

export default function Scene(props: SceneProps) {
    useFrame((state, delta) => {});

    return (
        <>
            <color attach="background" args={["black" as ColorRepresentation]} />
            <OrbitControls />
            <StarSystem time={3} seed={3}/>
        </>
    );
}
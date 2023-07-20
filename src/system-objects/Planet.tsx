import React from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3 } from 'three';
import { useState } from 'react';
export type PlanetProps = {
    seed: number
    orbitAngle?: Vector3
}

export default function Planet(props: PlanetProps) {
    const material = new MeshStandardMaterial({ color: 0xffff00 })
    const [position, setPosition] = useState(new Vector3(100, 0, 0))

    return (
        <>
            <mesh position={position} material={material}>
                <sphereGeometry args={[16, 20, 20]}/>
            </mesh>
        </>
    );
}
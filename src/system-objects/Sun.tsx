import React from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3 } from 'three';
import { useState } from 'react';
export type SunProps = {
    seed: number
    position?: Vector3
}

export default function Sun(props: SunProps) {
    const [intensity, setIntensity] = useState(1.5)
    const [color, setColor] = useState('yellow')
    
    return (
    <>
        <mesh castShadow={false} material={new MeshStandardMaterial({ color: color, emissive: color })}>
            <sphereGeometry args={[16, 20, 20]}/>
            <pointLight color={color} distance={1000} intensity={100} />
        </mesh>
    </>
    );
}
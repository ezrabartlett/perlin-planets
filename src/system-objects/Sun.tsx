import React, {useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3,  Mesh } from 'three';
import { useState } from 'react';
export type SunProps = {
    seed: number
    position?: Vector3
    setCameraTarget?: Function
}

export default function Sun(props: SunProps) {
    const [intensity, setIntensity] = useState(1.5)
    const [color, setColor] = useState('white')
    const meshRef = useRef<Mesh | null>(null);

    const handleCLicked = () => {
        if(meshRef && meshRef.current){
            console.log(meshRef.current.position)
            props.setCameraTarget && props.setCameraTarget(meshRef)
        }
    }

    return (
    <>
        <mesh ref={meshRef} castShadow={false} onClick={handleCLicked} material={new MeshStandardMaterial({ color: color, emissive: color })}>
            <sphereGeometry args={[36, 20, 20]}/>
            <pointLight color={color} distance={1000} intensity={8} />
        </mesh>
    </>
    );
}
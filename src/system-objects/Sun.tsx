import React, {useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3,  Mesh } from 'three';
import { useState } from 'react';
export type SunProps = {
    seed: string
    position?: Vector3
    setCameraTarget?: Function
    radius: number
}

export default function Sun(props: SunProps) {
    const [intensity, setIntensity] = useState(1.5)
    const [color, setColor] = useState('white')
    const meshRef = useRef<Mesh | null>(null);

    const handleCLicked = (event: any) => {
        if(meshRef && meshRef.current){
            props.setCameraTarget && props.setCameraTarget(meshRef)
            event && event.stopPropagation()
        }
    }

    useEffect(() => {
        props.setCameraTarget && props.setCameraTarget(meshRef)
    }, [])

    return (
    <>
        <mesh ref={meshRef} onClick={handleCLicked} material={new MeshStandardMaterial({ color: 'color', emissive: '#ffdd00' })}>
            <sphereGeometry args={[props.radius, 30, 30]}/>
            <pointLight castShadow color={color} distance={6000000} intensity={0.8} />
        </mesh>
    </>
    );
}
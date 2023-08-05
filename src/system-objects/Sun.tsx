import React, {useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3,  Mesh } from 'three';
import { useState } from 'react';
export type SunProps = {
    seed: string
    position?: Vector3
    setCameraTarget?: Function
}

export default function Sun(props: SunProps) {
    const [intensity, setIntensity] = useState(1.5)
    const [color, setColor] = useState('white')
    const meshRef = useRef<Mesh | null>(null);

    const handleCLicked = (event: any) => {
        if(meshRef && meshRef.current){
            console.log(meshRef.current.position)
            props.setCameraTarget && props.setCameraTarget(meshRef)
            event.stopPropagation()
        }
    }

    useEffect(() => {
        if(meshRef && meshRef.current){
            props.setCameraTarget && props.setCameraTarget(meshRef)
        }
    }, [])

    return (
    <>
        <mesh ref={meshRef} castShadow={false} onClick={handleCLicked} material={new MeshStandardMaterial({ color: 'color', emissive: '#ffdd00' })}>
            <sphereGeometry args={[66, 20, 20]}/>
            <pointLight color={color} distance={1000} intensity={0.5} />
        </mesh>
    </>
    );
}
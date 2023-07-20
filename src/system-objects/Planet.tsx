import React, {useRef} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3, Mesh } from 'three';
import { useState } from 'react';
export type PlanetProps = {
    seed: number
    orbitAngle?: Vector3
    orbitRadius: number
    setCameraTarget?: Function
}

export default function Planet(props: PlanetProps) {
    const material = new MeshStandardMaterial({ color: 'green' })
    const [position, setPosition] = useState(new Vector3(props.orbitRadius, 0, 0))
    const meshRef = useRef<Mesh | null>(null);
    
    const handleCLicked = () => {
        console.log(meshRef!=undefined && meshRef.current != undefined && meshRef.current.position)
        props.setCameraTarget && props.setCameraTarget()
    }

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={position} material={material}>
                <sphereGeometry args={[16, 20, 20]}/>
            </mesh>
        </>
    );
}
import React, {useRef, useEffect} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3, Mesh } from 'three';
import { useState } from 'react';
import TerrainGenerator from '../helpers/terrain-generator'
export type PlanetProps = {
    seed: number
    orbitAngle?: Vector3
    orbitRadius: number
    setCameraTarget?: Function
}

export default function Planet(props: PlanetProps) {
    const material = new MeshStandardMaterial({wireframe: true, color: 'blue' })
    const [position, setPosition] = useState(new Vector3(props.orbitRadius, 0, 0))
    const meshRef = useRef<Mesh | null>(null);
    
    const handleCLicked = () => {
        if(meshRef && meshRef.current){
            console.log(meshRef.current.position)
            props.setCameraTarget && props.setCameraTarget(meshRef)
        }
    }

    useEffect(() => {
        TerrainGenerator.generatePlanet(meshRef, 'asdf')
    }, []);

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={position} material={material}>
                <sphereGeometry args={[16, 40, 40]}/>
            </mesh>
        </>
    );
}
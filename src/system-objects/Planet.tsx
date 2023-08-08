import React, {useRef, useEffect} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3, Mesh, MeshToonMaterial, Color, TextureLoader, NearestFilter, Texture} from 'three';
import { useState } from 'react';
import PlanetGeometry from '../helpers/PlanetGeometry';
import TerrainGenerator from '../helpers/terrain-generator';
import { useFrame, useLoader } from '@react-three/fiber';
//import TerrainGenerator from '../helpers/terrain-generator'
//import CubeSphere from '../helpers/CubeSphere';
export type PlanetProps = {
    seed: string
    orbitAngle?: Vector3
    orbitRadius: number
    setCameraTarget?: Function
    radius: number
    colorProfile: number
}

export default function Planet(props: PlanetProps) {
    const material = new MeshToonMaterial() // MeshStandardMaterial({color: 'blue' })
    const [position, setPosition] = useState(new Vector3(props.orbitRadius, 0, 0))
    const meshRef = useRef<Mesh | null>(null);
    const radius = props.radius
    const resolution = 180
    const baseTemperature = 100

    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const handleCLicked = (event: any) => {
        if(meshRef && meshRef.current){
            console.log(meshRef.current.position)
            props.setCameraTarget && props.setCameraTarget(meshRef)
            event.stopPropagation()
        }
    }

    useFrame((state, delta) => {
        if (meshRef.current) {// && props.colorProfile===0) {
            meshRef.current.rotation.y += 0.0*delta;
            //console.log(meshRef.current.geometry.getAttribute("temperature"))
            // meshRef.current.position.x += 1
        }
    })

    //useEffect(() => {
    //    TerrainGenerator.generatePlanet(meshRef, 'asdf')
    //}, []);

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={position}>
                {/*<sphereGeometry args={[16, 40, 40]}/>*/}
                <PlanetGeometry baseTemperature={baseTemperature} radius={radius} resolution={resolution} seed={props.seed} meshRef={meshRef} colorProfile={props.colorProfile} />
                <mesh renderOrder={1}>
                    <sphereGeometry args={[radius, resolution*4, resolution*2]}/>
                    <meshToonMaterial color={'#66a2d1'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
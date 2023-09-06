import React, {useRef, useEffect, RefObject} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3, Mesh, MeshToonMaterial, Color, TextureLoader, NearestFilter, Texture, ShaderMaterial, Camera, DoubleSide} from 'three';
import { useState } from 'react';
import PlanetGeometry from '../helpers/PlanetGeometry';
import TerrainGenerator from '../helpers/TerrainGenerator';
import { useFrame, useLoader } from '@react-three/fiber';

// @ts-ignore
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragment.js'
// @ts-ignore
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertex.js'
import { PlanetAttributes } from '../types';

//import TerrainGenerator from '../helpers/terrain-generator'
//import CubeSphere from '../helpers/CubeSphere';
export type PlanetProps = {
    seed: string
    
    attributes: PlanetAttributes

    colorProfile: number
    cameraRef: React.MutableRefObject<Camera>
    setCameraTarget?: Function
}

export default function Planet(props: PlanetProps) {
    const material = new MeshToonMaterial() // MeshStandardMaterial({color: 'blue' })
    const atmosphereRef = useRef<Mesh>(null);
    const [position, setPosition] = useState(new Vector3(props.attributes.orbitRadius, 0, 0))
    const meshRef = useRef<Mesh | null>(null);
    const radius = props.attributes.radius
    const resolution = 80
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

    const updateAtmpshereUniforms = () => {
        const material = atmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {

            if (props.cameraRef && props.cameraRef.current && props.cameraRef.current.quaternion) {
                material.uniforms.cameraPos.value = props.cameraRef.current.position;
            }

            meshRef.current && (material.uniforms.pCenter.value = meshRef.current.position)
        }
    }

    useFrame((state, delta) => {
        if (meshRef.current) {// && props.colorProfile===0) {
            meshRef.current.rotation.y += 0.01*delta;
            //console.log(meshRef.current.geometry.getAttribute("temperature"))
            // meshRef.current.position.x += 1
        }

        updateAtmpshereUniforms();
    })

    //useEffect(() => {
    //    TerrainGenerator.generatePlanet(meshRef, 'asdf')
    //}, []);

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={position}>
                {/*<sphereGeometry args={[16, 40, 40]}/>*/}
                <PlanetGeometry baseTemperature={baseTemperature} radius={radius} resolution={resolution} seed={props.seed} meshRef={meshRef} colorProfile={props.colorProfile} />
                <mesh >
                    <sphereGeometry args={[radius, resolution*4, resolution*2]}/>
                    <meshToonMaterial fog={true} color={'#66a2d1'} gradientMap={threeTone} />
                </mesh>
                {<mesh ref={atmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.2, resolution*4, resolution*2]}/>
                    {<shaderMaterial transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.attributes.radius*1.2}}} />}
                </mesh>}
            </mesh>
        </>
    );
}
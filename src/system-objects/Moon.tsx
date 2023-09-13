import React, {useRef, useEffect, RefObject} from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight, Vector3, Mesh, MeshToonMaterial, Color, TextureLoader, NearestFilter, Texture, ShaderMaterial, Camera, DoubleSide, BackSide} from 'three';
import { useState } from 'react';
import PlanetGeometry from '../helpers/PlanetGeometry';
import TerrainGenerator from '../helpers/TerrainGenerator';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType, moonAttributes } from '../types';

// @ts-ignore
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragment.js'
// @ts-ignore
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertex.js'
import { PlanetAttributes } from '../types';

//import TerrainGenerator from '../helpers/terrain-generator'
//import CubeSphere from '../helpers/CubeSphere';
export type MoonProps = {    
    attributes: moonAttributes
    planet: meshRefType
    colorProfile: number
    cameraIndex: number
    orbitCameraRef: React.MutableRefObject<Camera>
    thirdPersonCameraRef: React.MutableRefObject<Camera>
    setCameraTarget?: Function
}

const getOrbitalPeriod = (orbitRadius: number, planetMass: number) => {
    const gravitationalConstant = 6.674*Math.pow(10, -11) // in N*m^2*kg^-2
    const semiMajorAxis = orbitRadius*2 // in kg
    return 2*Math.PI*Math.sqrt(Math.pow(semiMajorAxis, 3)/(planetMass*gravitationalConstant)) // in hours, I think?
}

export default function Moon(props: MoonProps) {
    const material = new MeshToonMaterial(); // MeshStandardMaterial({color: 'blue' })
    const orbitRadius = props.attributes.orbitRadius;
    const orbitAtmosphereRef = useRef<Mesh>(null);
    const shipAtmosphereRef = useRef<Mesh>(null);
    const [position, setPosition] = useState(new Vector3(props.attributes.orbitRadius, 0, 0))
    const meshRef = useRef<Mesh | null>(null);
    const radius = props.attributes.radius
    const resolution = 20
    const baseTemperature = 100
    let cameraIndex = props.cameraIndex

    useEffect(() => {
        cameraIndex = props.cameraIndex
    }, [props.cameraIndex])

    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const orbitalPeriod = getOrbitalPeriod(props.attributes.orbitRadius, props.attributes.planetMass)
    let alphaLast = 0
    let timeLast = 0
    const handleCLicked = (event: any) => {
        if(meshRef && meshRef.current){
            props.setCameraTarget && props.setCameraTarget(meshRef)
            event.stopPropagation()
        }
    }



    const getMoonPosition = (delta: number = 0) => {
        const period = orbitalPeriod*60*60*1000
        const alpha = ( Date.now()%period)/period*2*Math.PI+props.attributes.orbitOffset
        return [orbitRadius*(Math.cos(alpha)), orbitRadius*(Math.sin(alpha))]
    }

    const updateOrbitAtmpshereUniforms = () => {
        const material = orbitAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(props.cameraIndex === 1) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    material.uniforms.cameraPos.value = props.thirdPersonCameraRef.current.position;
                }
            }
            meshRef.current && (material.uniforms.pCenter.value = meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    const updateShipAtmpshereUniforms = () => {
        const material = shipAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(cameraIndex === 1) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    material.uniforms.cameraPos.value = props.thirdPersonCameraRef.current.position;
                }
            }
            meshRef.current && (material.uniforms.pCenter.value = meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    useFrame((state, delta) => {
        if (meshRef.current && props.planet) {// && props.colorProfile===0) {
            //meshRef.current.rotation.y += 0.01*delta;

            const pos = getMoonPosition(delta);
            
            // @ts-ignore
            meshRef.current.position.x = props.planet.current.position.x+pos[0];
            // @ts-ignore
            meshRef.current.position.z = props.planet.current.position.z+pos[1];
            meshRef.current.position.y = 0;
            //console.log(meshRef.current.geometry.getAttribute("temperature"))
            // meshRef.current.position.x += 1
        }
        
        if(cameraIndex) {
            updateOrbitAtmpshereUniforms();
        } else {
            updateShipAtmpshereUniforms();
        }
    })

    //useEffect(() => {
    //    TerrainGenerator.generatePlanet(meshRef, 'asdf')
    //}, []);

    return (
        <>
            <mesh visible={true} ref={meshRef} onClick={handleCLicked} position={position}>
                {/*<sphereGeometry args={[16, 40, 40]}/>*/}
                <PlanetGeometry hasAtmosphere={props.attributes.hasAtmosphere} baseTemperature={baseTemperature} radius={radius} resolution={resolution} seed={props.attributes.seed} meshRef={meshRef} colorProfile={props.colorProfile} />
                <mesh visible={props.attributes.hasAtmosphere}>
                    <sphereGeometry args={[radius, resolution*4, resolution*2]}/>
                    <meshToonMaterial fog={true} color={'#66a2d1'} gradientMap={threeTone} />
                </mesh>
                {<mesh visible={props.attributes.hasAtmosphere && cameraIndex===1} ref={orbitAtmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.2, resolution*4, resolution*2]}/>
                    {<shaderMaterial transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.attributes.radius*1.2}}} />}
                </mesh>}
                {<mesh visible={props.attributes.hasAtmosphere && cameraIndex===0} ref={shipAtmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.2, resolution*4, resolution*2]}/>
                    {<shaderMaterial side={BackSide} transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.attributes.radius*1.2}}} />}
                </mesh>}
            </mesh>
        </>
    );
}
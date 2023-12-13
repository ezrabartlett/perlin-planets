import React, {useRef, useEffect, RefObject} from 'react';
import { Vector3, Mesh, MeshToonMaterial, Color, TextureLoader, NearestFilter, Texture, ShaderMaterial, Camera, DoubleSide, BackSide} from 'three';
import { useState } from 'react';

import { useFrame, useLoader } from '@react-three/fiber';

// @ts-ignore
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragment.js'
// @ts-ignore
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertex.js'
import { GasGiantAttributes, meshRefType, PlanetAttributes } from '../types';

//import TerrainGenerator from '../helpers/terrain-generator'
//import CubeSphere from '../helpers/CubeSphere';
export type GasGiantProps = {    
    meshRef: meshRefType
    attributes: GasGiantAttributes
    starMass: number
    colorProfile: number
    cameraIndex: number
    orbitCameraRef: React.MutableRefObject<Camera>
    thirdPersonCameraRef: React.MutableRefObject<Camera>
    setCameraTarget?: Function
}

function hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    return result ? [parseInt(result[1], 16)/255,parseInt(result[2], 16)/255,parseInt(result[3], 16)/255] : null;
  }
  

const getOrbitalPeriod = (orbitRadius: number, starMass: number) => {
    const gravitationalConstant = 6.674*Math.pow(10, -11) // in N*m^2*kg^-2
    const semiMajorAxis = orbitRadius*2 // in kg
    return 2*Math.PI*Math.sqrt(Math.pow(semiMajorAxis, 3)/(starMass*gravitationalConstant)) // in hours, I think?
}

export default function GasGiant(props: GasGiantProps) {
    const material = new MeshToonMaterial(); // MeshStandardMaterial({color: 'blue' })
    const orbitRadius = props.attributes.orbitRadius;
    const orbitAtmosphereRef = useRef<Mesh>(null);
    const shipAtmosphereRef = useRef<Mesh>(null);
    const [position, setPosition] = useState(new Vector3(props.attributes.orbitRadius, 0, 0))
    const radius = props.attributes.radius
    const resolution = 80
    const baseTemperature = 100
    const atmosphereColor = hexToRgb(props.attributes.color)

    let cameraIndex = props.cameraIndex

    useEffect(() => {
        cameraIndex = props.cameraIndex
    }, [props.cameraIndex])

    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const orbitalPeriod = getOrbitalPeriod(props.attributes.orbitRadius, props.starMass)
    console.log('planet orbital period')
    console.log(orbitalPeriod)
    let alphaLast = 0
    let timeLast = 0
    const handleCLicked = (event: any) => {
        if(props.meshRef && props.meshRef.current){
            props.setCameraTarget && props.setCameraTarget(props.meshRef)
            event.stopPropagation()
        }
    }



    const getPlanetPosition = (delta: number = 0) => {
        const period = orbitalPeriod*60*60*1000
        const alpha = ( Date.now()%period)/period*2*Math.PI+props.attributes.orbitOffset
        return [orbitRadius*(Math.cos(alpha)), orbitRadius*(Math.sin(alpha))]
    }

    const updateOrbitAtmpshereUniforms = () => {
        const material = orbitAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(props.cameraIndex === 0) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    material.uniforms.cameraPos.value = props.thirdPersonCameraRef.current.position;
                }
            }
            props.meshRef.current && (material.uniforms.pCenter.value = props.meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    const cameraWorldPosition = new Vector3();

    const updateShipAtmpshereUniforms = () => {
        const material = shipAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(cameraIndex === 0) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    props.thirdPersonCameraRef.current.getWorldPosition(cameraWorldPosition)
                    material.uniforms.cameraPos.value = cameraWorldPosition;
                }
            }
            props.meshRef.current && (material.uniforms.pCenter.value = props.meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    useFrame((state, delta) => {
        if (props.meshRef.current) {// && props.colorProfile===0) {
            //meshRef.current.rotation.y += 0.01*delta;

            const pos = getPlanetPosition(delta);
        
            props.meshRef.current.position.x = pos[0];
            props.meshRef.current.position.z = pos[1];
            props.meshRef.current.position.y = 0;
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
            <mesh visible={true} ref={props.meshRef} onClick={handleCLicked} position={position}>
                {<mesh >
                    <sphereGeometry args={[radius, resolution, resolution]}/>
                    <meshToonMaterial fog={true} color={props.attributes.color} gradientMap={threeTone} />
                </mesh>}
                {<mesh visible={cameraIndex===0} ref={shipAtmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.06, 30, 30]}/>
                    {<shaderMaterial transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uColor: {value: atmosphereColor}, uRadius: {value: props.attributes.radius*1.06}}} />}
                </mesh>}
                {<mesh visible={cameraIndex!==0} ref={orbitAtmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.06, 30, 30]}/>
                    {<shaderMaterial side={BackSide} transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, uColor: {value: atmosphereColor}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.attributes.radius*1.06}}} />}
                </mesh>}
            </mesh>
        </>
    );
}
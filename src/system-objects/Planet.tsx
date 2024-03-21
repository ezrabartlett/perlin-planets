import React, {useRef, useEffect, RefObject, useMemo} from 'react';
import { createRoot } from 'react-dom/client'
import * as THREE from 'three';
import three, { PointLight, Raycaster, Vector3, Mesh, MeshToonMaterial, Color, TextureLoader, NearestFilter, Texture, ShaderMaterial, Camera, DoubleSide, BackSide} from 'three';
//import * as three from 'three'
import { useState } from 'react';
import PlanetGeometry from '../helpers/PlanetGeometry';
import TerrainGenerator from '../helpers/TerrainGenerator';
import { useFrame, useLoader } from '@react-three/fiber';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
// @ts-ignore
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragment.js'
// @ts-ignore
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertex.js'
import { meshRefType, PlanetAttributes } from '../types';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

//import TerrainGenerator from '../helpers/terrain-generator'
//import CubeSphere from '../helpers/CubeSphere';
export type PlanetProps = {    
    meshRef: meshRefType
    attributes: PlanetAttributes
    starMass: number
    colorProfile: number
    cameraIndex: number
    orbitCameraRef: React.MutableRefObject<Camera>
    thirdPersonCameraRef: React.MutableRefObject<Camera>
    setCameraTarget?: Function
}

const getOrbitalPeriod = (orbitRadius: number, starMass: number) => {
    const gravitationalConstant = 6.674*Math.pow(10, -11) // in N*m^2*kg^-2
    const semiMajorAxis = orbitRadius*2 // in kg
    return 2*Math.PI*Math.sqrt(Math.pow(semiMajorAxis, 3)/(starMass*gravitationalConstant)) // in hours, I think?
}

export default function Planet(props: PlanetProps) {
    const material = new MeshToonMaterial(); // MeshStandardMaterial({color: 'blue' })
    const orbitRadius = props.attributes.orbitRadius;
    const atmosphereRef = useRef<Mesh>(null);
    
    const shipAtmosphereRef = useRef<Mesh>(null);
    const surfaceMeshRef = useRef<Mesh>(null);

    const radius = props.attributes.radius
    const resolution = 80
    const baseTemperature = 100
    const atmosphereColor = new Color(102/255, 162/255, 209/255)
    const shipRayCaster = new Raycaster(undefined, undefined, 0, 10000)
    shipRayCaster.firstHitOnly = true;

    const atmosphereUniforms = useMemo(
        () => ({
            uSunPos: {value: [0,0,0]},
            uColor: {value: atmosphereColor}, 
            cameraPos: {value: [0,0,0]}, 
            pCenter: {value: [0,0,0]}, 
            uRadius: {value: props.attributes.radius*1.2}
        }), []
    );

    let cameraIndex = props.cameraIndex

    useEffect(() => {
        cameraIndex = props.cameraIndex
    }, [props.cameraIndex])

    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const orbitalPeriod = getOrbitalPeriod(props.attributes.orbitRadius, props.starMass)
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

    const cameraWorldPosition = new Vector3();

    const updateAtmosphereUniforms = () => {
        const material = atmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if (props.orbitCameraRef && props.orbitCameraRef.current && cameraIndex === 0 ) {
                material.uniforms.cameraPos.value = props.orbitCameraRef.current.position
            } else if(props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                cameraWorldPosition.copy(props.thirdPersonCameraRef.current.getWorldPosition(cameraWorldPosition))
                material.uniforms.cameraPos.value = cameraWorldPosition
            }
            props.meshRef.current && (material.uniforms.pCenter.value =  props.meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    const rayDir = new Vector3()
    let rayHitPosition = new Vector3(props.attributes.orbitRadius, 0, 0);
    const rayIndicatorRef = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (props.meshRef.current) {// && props.colorProfile===0) {
            //meshRef.current.rotation.y += 0.01*delta;

            // Cast ray and set tracking mesh to correct position
            rayDir.subVectors(props.meshRef.current.position, props.thirdPersonCameraRef.current.position)
            shipRayCaster.set(props.thirdPersonCameraRef.current.position, rayDir)
            const intersection = shipRayCaster.intersectObjects( [ props.meshRef.current ] )[0];
            intersection && intersection.point && (rayHitPosition = intersection.point);

            if(intersection && intersection.point && rayIndicatorRef && rayIndicatorRef.current){
                rayIndicatorRef.current.position.set(intersection.point.x, intersection.point.y, intersection.point.z);
            }

            const pos = getPlanetPosition(delta);
        
            props.meshRef.current.position.x = pos[0];
            props.meshRef.current.position.z = pos[1];
            props.meshRef.current.position.y = 0;
        }
        updateAtmosphereUniforms();
    }, -2)

    //useEffect(() => {
    //    TerrainGenerator.generatePlanet(meshRef, 'asdf')
    //}, []);

    return (
        <>
            {/*<mesh position={rayHitPosition} ref={rayIndicatorRef}>
                <sphereGeometry args={[1000, 2, 2]}/>
                <meshToonMaterial fog={true} color={'red'} gradientMap={threeTone} />
    </mesh>*/}
            <mesh visible={true} ref={props.meshRef} onClick={handleCLicked}>
                {/*<sphereGeometry args={[16, 40, 40]}/>*/}
                <PlanetGeometry hasAtmosphere={props.attributes.hasAtmosphere} baseTemperature={baseTemperature} radius={radius} resolution={resolution} seed={props.attributes.seed} meshRef={surfaceMeshRef} colorProfile={props.colorProfile} />
                { <mesh >
                    <sphereGeometry args={[radius, resolution, resolution]}/>
                    <meshToonMaterial fog={true} color={'#66a2d1'} gradientMap={threeTone} />
                </mesh>}
                <mesh visible={true} ref={atmosphereRef} renderOrder={-10}>
                    <sphereGeometry args={[radius*1.2, 30, 30]}/>
                    {<shaderMaterial transparent side={BackSide} fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={atmosphereUniforms} />}
                </mesh>
            </mesh>
        </>
    );
}
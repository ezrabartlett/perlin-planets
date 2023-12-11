import { OrbitControls, PerspectiveCamera} from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { ColorRepresentation, Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3, Camera, Quaternion, CubeTextureLoader} from 'three';
import StarSystem from './system-objects/StarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import Ship from './player-objects/Ship';
import ThirdPersonCamera from './helpers/ThirdPersonCamera';
import {  EffectComposer } from '@react-three/postprocessing';
import { Atmospheres } from './helpers/Atmosphere';
import PostProcessingEffects from './helpers/PostProcessingEffects';
import RandomNumberGenerator from './helpers/RandomNumberGenorator';


type meshRefObject = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type SceneProps = {
    seed: String,
    cameraIndex: number
}

export default function Scene(props: SceneProps) {

    const orbitCameraRef = useRef<any>(null)
    const thirdPersonCameraRef = useRef<any>(null)
    const orbitCamera = useRef<any>(null)
    const shipRef = useRef<Mesh | null>(null);
    const playerRef = useRef<Mesh | null>(null);
    let targetRef = useRef<Mesh | null>(null);
    const { set, scene } = useThree();
    const orbitCameraPosition = new Vector3(0, 20000000, 70000000);
    let lerping = false;
    let lerpStart = Date.now();
    let offSet = new Vector3(0,0,0);
    let startingCameraTarget = new Vector3(0,0,0);
    let startingCameraPos = new Vector3(0,0,0);
    const lerpTime = 0.3;
    const { size, camera } = useThree(); // Using the useThree hook to get size and camera
    
    function SkyBox() {
        const { scene } = useThree();
        const loader = new CubeTextureLoader();
        // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
        const texture = loader.load([
          "/1.png",
          "/2.png",
          "/3.png",
          "/4.png",
          "/5.png",
          "/6.png"
        ]);
      
        // Set the scene background property to the resulting texture.
        scene.background = texture;
        return null;
      }

    useEffect(() => {
        if(props.cameraIndex === 0) {
            set({ camera: orbitCamera.current });
        } else {
            set({ camera: thirdPersonCameraRef.current });
        }
    }, [props.cameraIndex])

    const setCameraTarget = (newTarget: meshRefObject) => {
        if(props.cameraIndex !== 0|| newTarget === targetRef) {
            return
        }

        const targetPos = orbitCameraRef.current.target.clone()
        const cameraPos = orbitCamera.current.position.clone()

        startingCameraTarget.copy(targetPos)
        startingCameraPos.copy(cameraPos)

        offSet.subVectors(cameraPos, targetPos)

        lerpStart = Date.now()
        lerping = true;
        orbitCameraRef.current.target = targetPos
        
        targetRef = newTarget
    }

    useFrame((state, delts) => {
        if(targetRef && targetRef.current && orbitCameraRef && orbitCameraRef.current) {

            if (lerping) {
                const targetPos = targetRef.current.position
                const cameraPos = orbitCameraRef.current.object.position
                
                let now = Date.now()
                let alpha = ((now-lerpStart)/(lerpTime*1000))
                
                orbitCameraRef.current.target.lerpVectors(startingCameraTarget, targetPos, alpha)
                cameraPos.lerpVectors(startingCameraPos, new Vector3().addVectors(targetPos, offSet), alpha)
                //cameraPos.lerpVectors(targetPos.clone().add(offSet), alpha)

                if((now-lerpStart)>lerpTime*1000) {
                    lerping = false;
                }
            } else {
                orbitCameraRef.current.target = targetRef.current.position
            }
        }
    }) 

    return (
        <>
            {/*<SkyBox/>*/}
            {<ambientLight color={'white'} intensity={0.2} />}
            <color attach="background" args={["black" as ColorRepresentation]} />
            {<ThirdPersonCamera cameraRef={thirdPersonCameraRef} targets={[shipRef, shipRef, playerRef]} cameraIndex={props.cameraIndex}/>}
            
            <PerspectiveCamera ref={orbitCamera} fov={75} position={orbitCameraPosition} far={6000000000}/>
            <OrbitControls ref={orbitCameraRef} camera={orbitCamera.current}/>

            <StarSystem cameraIndex={props.cameraIndex} orbitCamera={orbitCamera} thirdPersonCamera={thirdPersonCameraRef} setCameraTarget={setCameraTarget} time={3} seed={props.seed} playerRef={playerRef}/>
            <Ship startingPosition={new Vector3(780000, 0, 0)} startingAngle={new Quaternion(0, 0, 0)} meshRef={shipRef} />
            {/* multisampling = { 8 } DEFAULT ANTI-ALIASING SETTING*/}
            {/* Posprocessing effect. Couldn't get it to work but should return later */}
            {/* <PostProcessingEffects Atmospheres={[]} cameraRef={orbitCamera} />*/}
        </>
    );
}
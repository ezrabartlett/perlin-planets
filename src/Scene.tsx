import { OrbitControls, PerspectiveCamera} from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { ColorRepresentation, Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3, Camera, Quaternion} from 'three';
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

}

export default function Scene(props: SceneProps) {

    let [seed, setSeed] = useState('Ezra Bartlett')


    const orbitCameraRef = useRef<any>(null)
    const thirdPersonCameraRef = useRef<any>(null)
    const orbitCamera = useRef<any>(null)
    const shipRef = useRef<Mesh | null>(null);
    let targetRef = useRef<Mesh | null>(null);
    const { set, scene } = useThree();
    const orbitCameraPosition = new Vector3(0, 0, 2000000);
    let lerping = false;
    let lerpStart = Date.now();
    let offSet = new Vector3(0,0,0);
    let startingCameraTarget = new Vector3(0,0,0);
    let startingCameraPos = new Vector3(0,0,0);
    let [cameraIndex, setCameraIndex] = useState(1)
    let [useOrbitCamera, setUseOrbitCamera] = useState(true);
    const lerpTime = 0.3;
    const { size, camera } = useThree(); // Using the useThree hook to get size and camera

    useEffect(() => {
        if(useOrbitCamera) {
            set({ camera: orbitCamera.current });
            setCameraIndex(1)
        } else {
            setCameraIndex(0)
            set({ camera: thirdPersonCameraRef.current });
        }
    }, [useOrbitCamera])

    const switchCamera = () => {
        setUseOrbitCamera(!useOrbitCamera)
    }

    function randomSeed(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
    

    const setCameraTarget = (newTarget: meshRefObject) => {
        console.log(window.window.screen.width/window.screen.height)
        if(!useOrbitCamera || newTarget === targetRef) {
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

    window.addEventListener("keyup", (event) => {
        if( event.code === 'Space') {
            setUseOrbitCamera(!useOrbitCamera)
        }
        window.addEventListener("keyup", (event) => {
            if( event.code === 'KeyR') {
                setSeed(randomSeed(5))
            }
        })
    })

    useFrame((state, delts) => {
        if(targetRef && targetRef.current && orbitCameraRef && orbitCameraRef.current) {
            orbitCameraPosition.copy(orbitCamera.current.position)

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
            {<ambientLight color={'white'} intensity={.2} />}
            <color attach="background" args={["black" as ColorRepresentation]} />
            {<ThirdPersonCamera cameraRef={thirdPersonCameraRef} target={shipRef}/>}
            
            <PerspectiveCamera ref={orbitCamera} fov={75} position={orbitCameraPosition} far={300000000}/>
            <OrbitControls ref={orbitCameraRef} camera={orbitCamera.current}/>

            <StarSystem cameraIndex={cameraIndex} orbitCamera={orbitCamera} thirdPersonCamera={thirdPersonCameraRef} setCameraTarget={setCameraTarget} time={3} seed={seed}/>
            <Ship startingPosition={new Vector3(780000, 0, 0)} startingAngle={new Quaternion(0, 0, 0)} meshRef={shipRef} switchCamera={switchCamera} />
            {/* multisampling = { 8 } DEFAULT ANTI-ALIASING SETTING*/}
            {/* Posprocessing effect. Couldn't get it to work but should return later */}
            {/* <PostProcessingEffects Atmospheres={[]} cameraRef={orbitCamera} />*/}
        </>
    );
}
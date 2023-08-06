import { OrbitControls , PerspectiveCamera} from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { ColorRepresentation, Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3, Camera, Quaternion } from 'three';
import StarSystem from './system-objects/StarSystem';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';
import Ship from './player-objects/Ship';
import ThirdPersonCamera from './helpers/ThirdPersonCamera';
import OrbitCamera from './helpers/OrbitCamera';

type meshRefObject = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type SceneProps = {

}



export default function Scene(props: SceneProps) {
    const orbitCameraRef = useRef<any>(null)
    const thirdPersonCameraRef = useRef<any>(null)

    const shipRef = useRef<Mesh | null>(null);
    let [targetRef, setTargetRef] = useState(useRef<Mesh | null>(null));
    const { set, scene } = useThree();

    let [useOrbitCamera, setUseOrbitCamera] = useState(true);

    useEffect(() => {
        console.log(useOrbitCamera)
        if(useOrbitCamera) {
            set({ camera: orbitCameraRef.current });
        } else {
            set({ camera: thirdPersonCameraRef.current });
        }
    }, [useOrbitCamera])

    const handleKeyDown = (e: Event) => {

    }
    const handleKeyUp = (e: Event) => {
        console.log(e.code)
        if(e.code === 'Space') {
            setUseOrbitCamera(!useOrbitCamera)
        }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return (
        <>
            {<ambientLight color={'white'} intensity={.3} />}
            <color attach="background" args={["black" as ColorRepresentation]} />
            <ThirdPersonCamera cameraRef={thirdPersonCameraRef} target={shipRef}/>
            <OrbitCamera cameraRef={orbitCameraRef} startingPosition={new Vector3(-400, 400, 400)} target={targetRef} />
            <StarSystem setCameraTarget={setTargetRef} time={3} seed={'Test Seed'}/>
            <Ship startingPosition={new Vector3(0, 100, 0)} startingAngle={new Quaternion(0, 0, 0)} meshRef={shipRef} switchCamera={()=>{}} />
        </>
    );
}
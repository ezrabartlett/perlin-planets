import { OrbitControls } from '@react-three/drei';
import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client'
import { ColorRepresentation, Mesh, BufferGeometry, NormalBufferAttributes, Material} from 'three';
import StarSystem from './system-objects/StarSystem';
import { useFrame } from '@react-three/fiber';

type meshRefObject = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type SceneProps = {

}



export default function Scene(props: SceneProps) {
    useFrame((state, delta) => {});
    const cameraRef = useRef<any>(null)
    let targetRef = useRef<Mesh | null>(null);

    const setCameraTarget = (newTarget: meshRefObject) => {
        targetRef = newTarget
    }

    useFrame((state, delts) => {
        if(targetRef && targetRef.current && cameraRef && cameraRef.current) {
            cameraRef.current.target = targetRef.current.position
        }
    })

    return (
        <>
            <color attach="background" args={["black" as ColorRepresentation]} />
            <OrbitControls ref={cameraRef}/>
            <StarSystem setCameraTarget={setCameraTarget} time={3} seed={3}/>
        </>
    );
}
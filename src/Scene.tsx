import { OrbitControls } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { ColorRepresentation, Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3 } from 'three';
import StarSystem from './system-objects/StarSystem';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';

type meshRefObject = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type SceneProps = {

}



export default function Scene(props: SceneProps) {
    const cameraRef = useRef<any>(null)
    let targetRef = useRef<Mesh | null>(null);
    let lerping = false

    let lerpStart = Date.now()
    
    let offSet = new Vector3(0,0,0)

    let startingCameraTarget = new Vector3(0,0,0)

    let startingCameraPos = new Vector3(0,0,0)
    

    const lerpTime = 0.3;

    const setCameraTarget = (newTarget: meshRefObject) => {
        if (targetRef && targetRef.current) {

            const targetPos = targetRef.current.position
            const cameraPos = cameraRef.current.object.position

            startingCameraTarget.copy(cameraRef.current.target)
            startingCameraPos.copy(cameraPos)

            offSet.subVectors(cameraPos, targetPos)

            lerpStart = Date.now()
            lerping = true;
            cameraRef.current.target = new Vector3(targetRef.current.position.x, targetRef.current.position.y, targetRef.current.position.z )
        }
        targetRef = newTarget
    }

    useFrame((state, delts) => {
        if(targetRef && targetRef.current && cameraRef && cameraRef.current) {
            if (lerping) {
                const targetPos = targetRef.current.position
                const cameraPos = cameraRef.current.object.position
                

                let now = Date.now()
                let alpha = ((now-lerpStart)/(lerpTime*1000))
                
                cameraRef.current.target.lerpVectors(startingCameraTarget, targetPos, alpha)
                cameraPos.lerpVectors(startingCameraPos, new Vector3().addVectors(targetPos, offSet), alpha)
                //cameraPos.lerpVectors(targetPos.clone().add(offSet), alpha)

                if((now-lerpStart)>lerpTime*1000) {
                    lerping = false;
                }
            } else {
                cameraRef.current.target = targetRef.current.position
            }
        }
    })

    return (
        <>
            {<ambientLight color={'white'} intensity={.3} />}
            <color attach="background" args={["black" as ColorRepresentation]} />
            <OrbitControls ref={cameraRef}/>
            <StarSystem setCameraTarget={setCameraTarget} time={3} seed={'Test Seed'}/>
        </>
    );
}
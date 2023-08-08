import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import {Camera, Vector3} from 'three'
import { PerspectiveCamera, OrbitControls} from '@react-three/drei'
import { meshRefType } from '../types';

export type OrbitCameraProps = {
    cameraRef: React.MutableRefObject<Camera>
    target: meshRefType
    startingPosition: Vector3
}

export default function OrbitCamera(props: OrbitCameraProps) {
    const position = props.startingPosition.clone()
    const orbitControlsRef = useRef<any>(null)
    let startingCameraTarget = new Vector3()
    let startingCameraPos = new Vector3(0,0,0)
    let offset = new Vector3(0,0,0)
    let lerpStart = Date.now()
    const lerpTime = 3;

    const [oldTarget, setOldTarget] = useState<meshRefType | null>(null)
    const [lerping, setLerping] = useState(false)

    useEffect(() => {
        if ( orbitControlsRef.current ) {
            const currentTarget = orbitControlsRef.current.target
            const currentCameraPosition = props.cameraRef.current.position

            startingCameraTarget.copy(orbitControlsRef.current.target)
            startingCameraPos.copy(currentCameraPosition)

            offset.subVectors(currentCameraPosition, currentTarget)

            lerpStart = Date.now()
            setLerping(true);
            orbitControlsRef.current.target = currentTarget.clone()
        }
    }, [props.target])

    useFrame((state, delta) => {
        if(props.target && props.target.current && props.cameraRef && props.cameraRef.current) {
            /*if (lerping) {
                const targetPos = props.target.current.position
                const cameraPos = props.cameraRef.current.position
                
                let now = Date.now()
                let alpha = ((now-lerpStart)/(lerpTime*1000))
                
                orbitControlsRef.current.target.lerpVectors(startingCameraTarget, targetPos, alpha)
                //.lerpVectors(startingCameraPos, new Vector3().addVectors(targetPos, offset), alpha)

                if((now-lerpStart)>lerpTime*1000) {
                    setLerping(false);
                }
            } else {*/
                orbitControlsRef.current.target = props.target.current.position
           // }
        }
    })

    return (
        <>
            <PerspectiveCamera ref={props.cameraRef} far={1000000} position={position} fov={75} />
            <OrbitControls enableDamping={true} ref={orbitControlsRef} />
        </>
    );
}
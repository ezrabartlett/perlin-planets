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
    let startingCameraTarget = new Vector3(0,0,0)
    let startingCameraPos = new Vector3(0,0,0)
    let offset = new Vector3(0,0,0)
    let lerpStart = Date.now()
    const lerpTime = .3;

    const [oldTarget, setOldTarget] = useState<meshRefType | null>(null)
    const [lerping, setLerping] = useState(false)

    useEffect(() => {
        setOldTarget(props.target)
    }, [])

    useEffect(() => {
        if (oldTarget && oldTarget.current && orbitControlsRef.current ) {
            const targetPos = oldTarget.current.position
            const cameraPos = props.cameraRef.current.position

            startingCameraTarget.copy(orbitControlsRef.current.target)
            startingCameraPos.copy(cameraPos)

            offset.subVectors(cameraPos, targetPos)

            lerpStart = Date.now()
            setLerping(true);
            orbitControlsRef.current.target = new Vector3(props.cameraRef.current.position.x, props.cameraRef.current.position.y, props.cameraRef.current.position.z )
        }
        setOldTarget(props.target)
    }, [props.target])

    useFrame((state, delta) => {
        if(props.target && props.target.current && props.cameraRef && props.cameraRef.current) {
            if (lerping) {
                const targetPos = props.target.current.position
                const cameraPos = props.cameraRef.current.position
                
                let now = Date.now()
                let alpha = ((now-lerpStart)/(lerpTime*1000))
                
                orbitControlsRef.current.target.lerpVectors(startingCameraTarget, targetPos, alpha)
                cameraPos.lerpVectors(startingCameraPos, new Vector3().addVectors(targetPos, offset), alpha)

                if((now-lerpStart)>lerpTime*1000) {
                    setLerping(false);
                }
            } else {
                orbitControlsRef.current.target = props.target.current.position
            }
        }
    })

    return (
        <>
            <PerspectiveCamera ref={props.cameraRef} position={position} />
            <OrbitControls enableDamping={true} ref={orbitControlsRef} camera={props.cameraRef.current}/>
        </>
    );
}
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import {Camera, Vector3} from 'three'
import { PerspectiveCamera} from '@react-three/drei'
import { meshRefType } from '../types';

export type ThirdPersonCameraProps = {
    cameraRef: React.MutableRefObject<Camera>
    target: meshRefType
}

export default function ThirdPersonCamera(props: ThirdPersonCameraProps) {
   const ref = useRef()
   const camera = props.cameraRef;
   const currentPosition = new Vector3();
   const currentLookAt = new Vector3();
   const target = props.target

   const calculateIdealOffset = () => {
        const idealOffset = new Vector3(0, 10, -40);
        if (target.current) {
            idealOffset.applyQuaternion(target.current.quaternion)
            idealOffset.add(target.current.position)
        }
        return idealOffset;
    }     
    
    const calculateIdealLookAt = () => {
        const idealLookAt = new Vector3(0, 10, 50);
        if (target.current) {
            idealLookAt.applyQuaternion(target.current.quaternion)
            idealLookAt.add(target.current.position)
        }
        return idealLookAt;
    }      

    useFrame((state, delta) => {
        const idealOffset = calculateIdealOffset();
        const idealLookAt = calculateIdealLookAt();

        currentPosition.copy(idealOffset)
        currentLookAt.copy(idealLookAt);

        camera.current.position.copy(currentPosition)
        camera.current.lookAt(currentLookAt)
    })

    return (
        <PerspectiveCamera ref={props.cameraRef}/>
    );
}
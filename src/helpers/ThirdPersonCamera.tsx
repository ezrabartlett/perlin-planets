import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import {Camera, Euler, Vector3} from 'three'
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
        const idealOffset = new Vector3(0, 0.5, -3);
        if (target.current) {
            idealOffset.applyQuaternion(target.current.quaternion)
            idealOffset.add(target.current.position)
        }
        return idealOffset;
    }     
    
    const calculateIdealLookAt = () => {
        const idealLookAt = new Vector3(0, .4, 1.3);
        if (target.current) {
            idealLookAt.applyQuaternion(target.current.quaternion)
            idealLookAt.add(target.current.position)
        }
        return idealLookAt;
    }      

    const calculateIdealRotation = () => {
        const idealRotation = new Euler();
        if (target.current) {
            idealRotation.copy(target.current.rotation)
        }
        return idealRotation;
    }

    useFrame((state, delta) => {
        const idealOffset = calculateIdealOffset();
        const idealLookAt = calculateIdealLookAt();

        currentPosition.copy(idealOffset)
        currentLookAt.copy(idealLookAt);

        camera.current.position.copy(currentPosition)
        //@ts-ignore
        camera.current.rotation.copy(target.current.rotation)
        camera.current.rotateY(Math.PI)
        //const up = new Vector3(0, 1, 0);

       // up.applyAxisAngle(new Vector3(0, 0, 1), target.current.rotation.z);

        //camera.current.up.copy(up);
       // camera.current.lookAt(currentLookAt)


    })

    return (
        <PerspectiveCamera ref={props.cameraRef} fov={75} far={30000000}/>
    );
}
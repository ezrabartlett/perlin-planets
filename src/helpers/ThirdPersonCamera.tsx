import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import {Camera, Euler, Vector3} from 'three'
import { PerspectiveCamera} from '@react-three/drei'
import { meshRefType } from '../types';

export type ThirdPersonCameraProps = {
    cameraRef: React.MutableRefObject<Camera>
    targets: meshRefType[]
    cameraIndex: number
}

export default function ThirdPersonCamera(props: ThirdPersonCameraProps) {
   const ref = useRef()
   const camera = props.cameraRef;
   const currentPosition = new Vector3();
   const currentLookAt = new Vector3();
   const targets = props.targets

   const calculateIdealOffset = () => {
        const idealOffset = new Vector3(0, 0.5, -3);
        const target = targets[props.cameraIndex].current
        if (target) {
            idealOffset.applyQuaternion(target.quaternion)
            idealOffset.add(target.position)
        }
        return idealOffset;
    }     
    
    const calculateIdealLookAt = () => {
        const idealLookAt = new Vector3(0, .4, 1.3);
        const target = targets[props.cameraIndex].current
        if (target) {
            idealLookAt.applyQuaternion(target.quaternion)
            idealLookAt.add(target.position)
        }
        return idealLookAt;
    }      

    const calculateIdealRotation = () => {
        const idealRotation = new Euler();
        const target = targets[props.cameraIndex].current
        if (target) {
            idealRotation.copy(target.rotation)
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
        targets[props.cameraIndex].current && camera.current.rotation.copy(targets[props.cameraIndex].current.rotation)
        camera.current.rotateY(Math.PI)
        //const up = new Vector3(0, 1, 0);

       // up.applyAxisAngle(new Vector3(0, 0, 1), target.current.rotation.z);

        //camera.current.up.copy(up);
       // camera.current.lookAt(currentLookAt)


    })

    return (
        <PerspectiveCamera ref={props.cameraRef} fov={75} far={300000000}/>
    );
}
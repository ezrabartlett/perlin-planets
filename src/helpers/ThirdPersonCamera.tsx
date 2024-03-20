import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'
import {Camera, Euler, Quaternion, Vector3} from 'three'
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

   const calculateIdealOffset = () => {
        const idealOffset = new Vector3(0, 0, -2 );
        /*const target = props.targets[props.cameraIndex].current
        if (target) {
            idealOffset.applyQuaternion(targetWorldQuaternion);
            idealOffset.add(targetWorldPosition);
        }*/
        return idealOffset;
    }

    const calculateIdealLookAt = () => {
        const idealLookAt = new Vector3(0, 0, 0);

        /*if (target) {
            target.getWorldPosition(targetWorldPosition)
            target.getWorldQuaternion(targetWorldQuaternion)
            
            idealLookAt.applyQuaternion(targetWorldQuaternion);
            idealLookAt.add(targetWorldPosition);
        }*/
        return idealLookAt;
    }      

    const calculateIdealRotation = () => {
        const idealRotation = new Euler();
        const target = props.targets[props.cameraIndex].current
        if (target) {
            idealRotation.copy(target.rotation)
        }
        return idealRotation;
    }

    const worldPosition = new Vector3()
    
    useEffect(()=>{
        if(camera.current.parent != props.targets[props.cameraIndex].current) {
            props.targets[props.cameraIndex].current!.attach(camera.current);
            camera.current.position.set(0, 0.6, -3)
            camera.current.rotation.set(0,0,0)
            camera.current.rotateY(Math.PI)
            camera.current.getWorldPosition(worldPosition)
            props.targets[props.cameraIndex].current!.getWorldPosition(worldPosition)
        }
    },[props.cameraIndex])

    useFrame((state, delta) => {
        //const idealOffset = calculateIdealOffset();
        const idealLookAt = calculateIdealLookAt();

        //currentPosition.copy(idealOffset)
        currentLookAt.copy(idealLookAt);

        //camera.current.position.copy(currentPosition)
        //@ts-ignore
        //props.targets[props.cameraIndex].current && camera.current.rotation.copy(props.targets[props.cameraIndex].current.rotation)
        //camera.current.rotateY(Math.PI)
        //const up =  new Vector3(0, 1, 0); 

       // up.applyAxisAngle(new Vecto r3(0, 0, 1), target.current.rotation.z);

        //camera.current.up.copy(up) ;
        //camera.current.lookAt (currentLookAt)
    }, 0)

    return (
        <PerspectiveCamera ref={props.cameraRef} fov={75} far={300000000}/>
    );
}
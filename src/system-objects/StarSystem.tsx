import React, { useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Camera, MeshStandardMaterial, PointLight } from 'three';
import Planet from './Planet';
import Sun from './Sun';

export type StarSystemProps = {
    seed: string
    time: number
    setCameraTarget?: Function
    cameraRef: React.MutableRefObject<Camera>
}

export default function StarSystem(props: StarSystemProps) {
  return (
    <>
      <Sun setCameraTarget={props.setCameraTarget} radius={40400} seed={props.seed}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={105} orbitRadius={62980} seed={props.seed} colorProfile={0}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={310} orbitRadius={2980} seed={props.seed+props.seed} colorProfile={1}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={107910} orbitRadius={590380} seed={props.seed+props.seed+props.seed} colorProfile={0}/>
    </>
  );
}
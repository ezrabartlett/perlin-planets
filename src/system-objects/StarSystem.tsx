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
      <Sun setCameraTarget={props.setCameraTarget} radius={400000} seed={props.seed}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={60000} orbitRadius={2502980} seed={props.seed} colorProfile={0}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={70000} orbitRadius={1072980} seed={props.seed+props.seed} colorProfile={1}/>
      <Planet cameraRef={props.cameraRef} setCameraTarget={props.setCameraTarget} radius={107910} orbitRadius={1800380} seed={props.seed+props.seed+props.seed} colorProfile={0}/>
    </>
  );
}
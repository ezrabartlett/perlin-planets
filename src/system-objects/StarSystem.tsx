import React from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight } from 'three';
import Planet from './Planet';
import Sun from './Sun';

export type StarSystemProps = {
    seed: number
    time: number
    setCameraTarget?: Function
}

export default function StarSystem(props: StarSystemProps) {
  return (
    <>
      <Sun setCameraTarget={props.setCameraTarget} seed={props.seed}/>
      <Planet setCameraTarget={props.setCameraTarget} orbitRadius={100} seed={props.seed}/>
      <Planet setCameraTarget={props.setCameraTarget} orbitRadius={200} seed={props.seed}/>
      <Planet setCameraTarget={props.setCameraTarget} orbitRadius={300} seed={props.seed}/>
    </>
  );
}
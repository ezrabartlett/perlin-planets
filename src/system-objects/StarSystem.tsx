import React, { useState } from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight } from 'three';
import Planet from './Planet';
import Sun from './Sun';

export type StarSystemProps = {
    seed: string
    time: number
    setCameraTarget?: Function
}

export default function StarSystem(props: StarSystemProps) {
  return (
    <>
      <Sun setCameraTarget={props.setCameraTarget} radius={1400} seed={props.seed}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={205} orbitRadius={1980} seed={props.seed} colorProfile={0}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={310} orbitRadius={2980} seed={props.seed+props.seed} colorProfile={1}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={910} orbitRadius={5380} seed={props.seed+props.seed+props.seed} colorProfile={1}/>
    </>
  );
}
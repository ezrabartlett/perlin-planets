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
      <Sun setCameraTarget={props.setCameraTarget} seed={props.seed}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={16} orbitRadius={160} seed={props.seed} colorProfile={0}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={24} orbitRadius={320} seed={props.seed+props.seed} colorProfile={1}/>
      <Planet setCameraTarget={props.setCameraTarget} radius={20} orbitRadius={480} seed={props.seed+props.seed+props.seed} colorProfile={1}/>
    </>
  );
}
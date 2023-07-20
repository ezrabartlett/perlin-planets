import React from 'react';
import { createRoot } from 'react-dom/client'
import { MeshStandardMaterial, PointLight } from 'three';
import Planet from './Planet';
import Sun from './Sun';

export type StarSystemProps = {
    seed: number,
    time: number
}

export default function StarSystem(props: StarSystemProps) {
  return (
    <>
      <ambientLight intensity={0} />
      <Sun seed={props.seed}/>
      {/*<ambientLight color={'white'} intensity={1} />*/}
      <Planet seed={props.seed}/>
    </>
  );
}
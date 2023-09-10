import React, { useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Camera, MeshStandardMaterial, PointLight } from 'three';
import RandomNumberGenerator from '../helpers/RandomNumberGenorator';
import { PlanetAttributes } from '../types';
import Planet from './Planet';
import Sun from './Sun';

export type StarSystemProps = {
    seed: string
    time: number
    cameraIndex: number
    setCameraTarget?: Function
    orbitCamera: React.MutableRefObject<Camera>
    thirdPersonCamera: React.MutableRefObject<Camera>
}

export default function StarSystem(props: StarSystemProps) {

  const random = new RandomNumberGenerator(props.seed);
  const planetsNum = random.getInt(0, 6)

  const sunRadius = 400000
  const starMass = 400000*Math.pow(10,25)

  const minPlanetRadius = 30000
  const maxPlanetRadius = 110000

  const minPlanetMoons = 0
  const maxPlanetMoons = 3

  const orbitDistance = 1000000

  const planetAttributes: PlanetAttributes[] = []

  for (let i = 0; i <= planetsNum; i++) {
      const radius = random.getInt(minPlanetRadius, maxPlanetRadius)

      let attributes = {
        seed: random.getDouble(1.0, 100000.0).toString(),
        radius: radius,
        seaLevel: radius,
        baseTemperature: 100,
        humidity: 100,
        moons: random.getInt(minPlanetMoons, maxPlanetMoons),
        orbitRadius: (i+1)*orbitDistance+sunRadius,
        orbitInclination: random.getInt(0, 35),
        tilt: random.getInt(0, 35)
      } as PlanetAttributes

      planetAttributes.push(attributes)
  }
  
  return (
    <>
      <Sun setCameraTarget={props.setCameraTarget} radius={400000} seed={props.seed}/>
      {planetAttributes.map( (attributes) => {
        return <Planet cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} starMass={starMass} attributes={attributes}/>
      })}
    </>
  );
}
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Camera, Mesh, MeshStandardMaterial, PointLight } from 'three';
import RandomNumberGenerator from '../helpers/RandomNumberGenorator';
import { meshRefType, moonAttributes, PlanetAttributes } from '../types';
import Moon from './Moon';
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

  let planetRefs: meshRefType[] = []

  const minPlanetRadius = 30000
  const maxPlanetRadius = 110000

  const minPlanetMoons = 0
  const maxPlanetMoons = 3

  const orbitDistance = 1000000
  const moonOrbitDistance = 100000

  const planetAttributes: PlanetAttributes[] = []
  const moonAttributes: moonAttributes[] = []

  const planetMassConstant = 1000000

  for (let i = 0; i < planetsNum; i++) {
      planetRefs.push(useRef<Mesh | null>(null))
      const radius = random.getInt(minPlanetRadius, maxPlanetRadius)
      const density = random.getDouble(0.8, 1.0)
      let attributes = {
        seed: random.getDouble(1.0, 100000.0).toString(),
        radius: radius,
        density: density,
        mass: (4/3)*Math.PI*Math.pow(radius,3)*density*planetMassConstant,
        seaLevel: radius,
        baseTemperature: 100,
        humidity: 100,
        moons: random.getInt(minPlanetMoons, maxPlanetMoons),
        orbitRadius: (i+1)*orbitDistance+sunRadius,
        orbitInclination: random.getInt(0, 35),
        tilt: random.getInt(0, 35)
      } as PlanetAttributes

      for (let j = 0; j <= attributes.moons; j++) {
        const radius = attributes.radius*random.getDouble(.1, .5)

        let moon = {
          planet: i,
          hasAtmosphere: random.getInt(1, 10) === 1,
          seed: random.getDouble(1.0, 100000.0).toString(),
          radius: radius,
          seaLevel: radius,
          planetMass: attributes.mass,
          baseTemperature: 100,
          humidity: 100,
          moons: 0,
          orbitRadius: (j+1)*moonOrbitDistance+attributes.radius,
          orbitInclination: random.getInt(0, 35),
          tilt: random.getInt(0, 35)
        } as moonAttributes

        moonAttributes.push(moon)
      }

      planetAttributes.push(attributes)
  }
  
  return (
    <>
      <Sun setCameraTarget={props.setCameraTarget} radius={400000} seed={props.seed}/>
      {planetAttributes.map( (attributes, index) => {
        return <Planet meshRef={planetRefs[index]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} starMass={starMass} attributes={attributes}/>
      })}
      {moonAttributes.map( (attributes, index) => {
        return <Moon planet={planetRefs[attributes.planet]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} attributes={attributes}/>
      })}
    </>
  );
}
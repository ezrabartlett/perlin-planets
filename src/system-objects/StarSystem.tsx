import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client'
import { Camera, Mesh, MeshStandardMaterial, PointLight } from 'three';
import RandomNumberGenerator from '../helpers/RandomNumberGenorator';
import { GasGiantAttributes, meshRefType, MoonAttributes, PlanetAttributes, StarAttributes, StarClass } from '../types';
import Moon from './Moon';
import Planet from './Planet';
import Sun from './Sun';
import GasGiant from './GasGiant';

export type StarSystemProps = {
    seed: String
    time: number
    cameraIndex: number
    setCameraTarget?: Function
    orbitCamera: React.MutableRefObject<Camera>
    thirdPersonCamera: React.MutableRefObject<Camera>
}

export default function StarSystem(props: StarSystemProps) {

  const STAR_CLASSES: StarClass[] = [
    {
      name: 'Yellow Dwarf',
      color: 'white',
      emissiveColor: '#ffdd00',
      lightColor: 'white',
      radiusMin: 3000000,
      radiusMax: 5000000,
      intensityMin: 0.7,
      intensityMax: 0.9,
      lightBlendFactor: 0,
    },
    {
      name: 'Red Dwarf',
      color: '#f85e00',
      emissiveColor: '#f85e00',
      lightColor: '#f85e00',
      radiusMin: 4000000,
      radiusMax: 6000000,
      intensityMin: 0.5,
      intensityMax: 0.7,
      lightBlendFactor: .5,
    },
    {
      name: 'Red Super Giant',
      color: 'red',
      emissiveColor: 'red',
      lightColor: 'red',
      radiusMin: 7000000,
      radiusMax: 10000000,
      intensityMin: 0.5,
      intensityMax: 0.7,
      lightBlendFactor: .8,
    },
  ]
  const random = new RandomNumberGenerator(props.seed);
  const innerPlanets = random.getInt(0, 3)
  const gasGiants = random.getInt(0, 3)
  const outerPlanets = random.getInt(0, 3)

  const sunRadius = 4000000
  const starMass = 200000000*Math.pow(10,25)

  const minPlanetRadius = 300000
  const maxPlanetRadius = 1100000

  const minGasGiantRadius = 1500000
  const maxGasGiantRadius = 2500000

  const minMoonRadius = 30000
  const maxMoonRadius = 600000

  const minInnerPlanetMoons = 0
  const maxInnerPlanetMoons = 2

  const minGasGiantMoons = 0
  const maxGasGiantMoons = 4

  const orbitDistance = 12000000
  const moonOrbitDistance = 1000000

  const innerPlanetAttributes: PlanetAttributes[] = []
  const innerMoonAttributes: MoonAttributes[] = []
  const gasGiantAttributes: GasGiantAttributes[] = []
  const gasGiantMoonsAttributes: MoonAttributes[] = []
  const gasGiantColors = ['#66a2d1','#9d4edd','#40916c','#1f271b','#023e8a']
  const planetMassConstant = Math.pow(10,15)
  
  const starClassDistribution = [0,0,0,0,0,0,0,1,1,2,2]
  const starClassIndex = starClassDistribution[random.getInt(0, starClassDistribution.length)]
  const starClass = STAR_CLASSES[starClassIndex]

  let starAttributes = {
    radius: random.getInt(starClass.radiusMin, starClass.radiusMax),
    intensity: random.getDouble(starClass.intensityMin, starClass.intensityMax),
    color: starClass.color,
    emissiveColor: starClass.emissiveColor,
    lightColor: starClass.lightColor,
    lightBlendFactor: starClass.lightBlendFactor
  } as StarAttributes

  let totalPlanets = innerPlanets+gasGiants;

  for (let i = 0; i < innerPlanets; i++) {
      const radius = random.getInt(minPlanetRadius, maxPlanetRadius)
      const density = random.getDouble(0.8, 1.0)
      let attributes = {
        seed: random.getDouble(1.0, 100000.0).toString(),
        hasAtmosphere: random.getInt(1, 10) > 1,
        radius: radius,
        density: density,
        mass: (4/3)*Math.PI*Math.pow(radius,3)*density*planetMassConstant,
        seaLevel: radius,
        baseTemperature: 100,
        orbitOffset: random.getDouble(0.0, 2*Math.PI),
        humidity: 100,
        moons: random.getInt(minInnerPlanetMoons, maxInnerPlanetMoons),
        orbitRadius: (i+1)*orbitDistance+sunRadius,
        orbitInclination: random.getInt(0, 35),
        tilt: random.getInt(0, 35)
      } as PlanetAttributes

      totalPlanets+=attributes.moons;

      for (let j = 0; j <= attributes.moons; j++) {
        const radius = attributes.radius*random.getDouble(.1, .5)

        let moon = {
          planet: i,
          hasAtmosphere: random.getInt(1, 10) === 1,
          seed: random.getDouble(1.0, 100000.0).toString(),
          orbitOffset: random.getDouble(0.0, 2*Math.PI),
          radius: radius,
          seaLevel: radius,
          planetMass: attributes.mass,
          baseTemperature: 100,
          humidity: 100,
          moons: 0,
          orbitRadius: (j+1)*moonOrbitDistance+attributes.radius,
          orbitInclination: random.getInt(0, 35),
          tilt: random.getInt(0, 35)
        } as MoonAttributes

        innerMoonAttributes.push(moon)
      }

      innerPlanetAttributes.push(attributes)
  }

  for (let i = 0; i < gasGiants; i++) {
    const radius = random.getInt(minGasGiantRadius, maxGasGiantRadius)
    const density = random.getDouble(0.6, 0.8)
    let attributes = {
      seed: random.getDouble(1.0, 100000.0).toString(),
      radius: radius,
      density: density,
      mass: (4/3)*Math.PI*Math.pow(radius,3)*density*planetMassConstant,
      color: gasGiantColors[random.getInt(0,gasGiantColors.length)],
      baseTemperature: 100,
      orbitOffset: random.getDouble(0.0, 2*Math.PI),
      moons: random.getInt(minGasGiantMoons, maxGasGiantMoons),
      orbitRadius: (innerPlanets+i+1)*orbitDistance+sunRadius,
      orbitInclination: random.getInt(0, 35),
      tilt: random.getInt(0, 35)
    } as GasGiantAttributes

    totalPlanets+=attributes.moons;

    for (let j = 0; j <= attributes.moons; j++) {
      const radius = random.getInt(minMoonRadius, maxMoonRadius)

      let moon = {
        planet: i,
        hasAtmosphere: random.getInt(1, 10) === 1,
        seed: random.getDouble(1.0, 100000.0).toString(),
        orbitOffset: random.getDouble(0.0, 2*Math.PI),
        radius: radius,
        seaLevel: radius,
        planetMass: attributes.mass,
        baseTemperature: 100,
        humidity: 100,
        moons: 0,
        orbitRadius: (j+1)*moonOrbitDistance+attributes.radius,
        orbitInclination: random.getInt(0, 35),
        tilt: random.getInt(0, 35)
      } as MoonAttributes

      gasGiantMoonsAttributes.push(moon)
    }

    gasGiantAttributes.push(attributes)
}

  const innerPlanetsRefs = useRef(Array.from({length: innerPlanets}, a => React.createRef<Mesh>()));
  const gasGiantRefs = useRef(Array.from({length: gasGiants}, a => React.createRef<Mesh>()));


  return (
    <>
      <Sun attributes={starAttributes} setCameraTarget={props.setCameraTarget} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera}/>
      
      {innerPlanetAttributes.map( (attributes, index) => {
        return <Planet meshRef={innerPlanetsRefs.current[index]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} starMass={starMass} attributes={attributes}/>
      })}
      {innerMoonAttributes.map( (attributes, index) => {
        return <Moon planet={innerPlanetsRefs.current[attributes.planet]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} attributes={attributes}/>
      })}

      {gasGiantAttributes.map( (attributes, index) => {
        return <GasGiant meshRef={gasGiantRefs.current[index]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} starMass={starMass} attributes={attributes}/>
      })}
      {gasGiantMoonsAttributes.map( (attributes, index) => {
        return <Moon planet={gasGiantRefs.current[attributes.planet]} cameraIndex={props.cameraIndex} orbitCameraRef={props.orbitCamera} thirdPersonCameraRef={props.thirdPersonCamera} setCameraTarget={props.setCameraTarget} colorProfile={random.getInt(0, 2)} attributes={attributes}/>
      })}
    </>
  );
}
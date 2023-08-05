import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { BoxGeometry, Color, Mesh, MeshToonMaterial, MeshPhongMaterial, ShaderMaterial, Vector3, Float32BufferAttribute, MeshStandardMaterial, NearestFilter, TextureLoader, Texture } from 'three';
import { meshRefType } from '../types';
import TerrainGenerator from '../helpers/terrain-generator'
import PlanetMaterial from './planetMaterial';
import CustomShaderMaterial from 'three-custom-shader-material'
// @ts-ignore
import planetFragment from '../shaders/planetFragment.js'
// @ts-ignore
import planetVertex from '../shaders/planetVertex.js'

type PlanetGeometryProps = {
  radius: number
  resolution: number
  meshRef: meshRefType
  seed: string
  baseTemperature: number
  colorProfile: number
}

const computeColor = (point: Vector3, radius: number) => {
  let color = new Color( 0xffffff );
  if(point.length()<=(radius+radius*.01)){
    color = new Color('white')
  } else {
    color = new Color('green')
  }

  return color
}

const computeTemperature = (point: Vector3, baseTemperature: number, terrain: TerrainGenerator) => {
  // Angular distance from equater
  const angleBetween = (new Vector3(0,1,0)).angleTo(point)/Math.PI
  const distanceFromEquator = Math.abs(0.5-angleBetween)/0.5

  const temperature =(1-distanceFromEquator)*baseTemperature+terrain.getNoise(point.x, point.y, point.z, .1)*10//+terrain.getNoise(point.x, point.y, point.z, .5)*5
  return temperature
}

const PlanetGeometry = (props: PlanetGeometryProps) => {
  const meshRef = useRef<Mesh>(null);
  const terrain = new TerrainGenerator(props.seed, props.radius)
  const colors: number[] = []
  const altitudes: number[] = []
  const temperatures: number[] = []

  const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
  threeTone.minFilter = NearestFilter
  threeTone.magFilter = NearestFilter

  useEffect(() => {
    let geometry = meshRef.current!.geometry as BoxGeometry;
    let material = meshRef.current!.material as ShaderMaterial;

    for(let i = 0; i < geometry.attributes.position.count; i++){
      let x = geometry.attributes.position.getX(i)
      let y = geometry.attributes.position.getY(i)
      let z = geometry.attributes.position.getZ(i)
      let normalVector = new Vector3(x, y, z).normalize()

      normalVector.multiplyScalar(terrain.getTerrain(normalVector.x, normalVector.y, normalVector.z))
      
      let vColor = computeColor(normalVector, props.radius)
      colors.push(vColor.r, vColor.g, vColor.b)
      altitudes.push(normalVector.length())
      temperatures.push(computeTemperature(normalVector, props.baseTemperature, terrain)
      )
      x = normalVector.x
      y = normalVector.y
      z = normalVector.z



      geometry.attributes.position.setX(i, x)
      geometry.attributes.position.setY(i, y)
      geometry.attributes.position.setZ(i, z)
    }

    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('altitude', new Float32BufferAttribute(altitudes, 1));
    geometry.setAttribute('temperature', new Float32BufferAttribute(temperatures, 1));
    // Just here so I remember how to do uniforms
    material.uniforms.time = {value: 1.0}
    if(props.colorProfile === 1){
      material.uniforms.grassColor = {value: [100.0/255.0, 41.0/255.0, 38.0/255.0, 1.0]}
    }
    material.uniforms.radius = {
      value: props.radius
    }
    meshRef.current!.geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals()
    //.vertices.forEach(vertex => vertex.normalize());

  }, []);

  return (
    <>
      <mesh ref={meshRef}>
        {<boxGeometry args={[1, 1, 1, props.resolution, props.resolution, props.resolution]} />}
        <PlanetMaterial/>


        <CustomShaderMaterial
          baseMaterial={MeshToonMaterial}
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          silent
          uniforms={{
            grassColor: {
              value: [10.0/285.0,157.0/285.0,117.0/285.0, 1.0],
            },
          }}
          gradientMap={threeTone}
          // ...
      />


      </mesh>
    </>
  );
};

export default PlanetGeometry;
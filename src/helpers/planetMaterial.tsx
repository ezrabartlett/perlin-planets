import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, Color, Mesh, MeshToonMaterial, MeshPhongMaterial, Vector3, Float32BufferAttribute } from 'three';
import { meshRefType } from '../types';
import TerrainGenerator from '../helpers/terrain-generator'

// @ts-ignore
import planetFragment from '../shaders/planetFragment.js'
// @ts-ignore
import planetVertex from '../shaders/planetVertex.js'

type PlanetMaterialProps = {

}

const PlanetMaterial = (props: PlanetMaterialProps) => {
  return (
    <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment}/>
  );
};

export default PlanetMaterial;
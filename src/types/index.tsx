import { Mesh, BufferGeometry, NormalBufferAttributes, Material } from 'three';

export type meshRefType = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type atmosphereInfoType = {
    planet: meshRefType
    planetRadius: number
    atmosphereRadius: number
}

export type PlanetAttributes = {
    seed: string
    radius: number
    rotationSpeed: number
    seaLevel: number
    baseTemperature: number
    humidity: number
    moons: number
    orbitRadius: number
    orbitInclination: number
    tilt: number 
}
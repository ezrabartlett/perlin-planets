import { Mesh, BufferGeometry, NormalBufferAttributes, Material } from 'three';

export type meshRefType = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>

export type AtmosphereInfoType = {
    planet: meshRefType
    planetRadius: number
    atmosphereRadius: number
}

export type StarAttributes = {
    seed: string
    radius: number
    color: string
    emissiveColor: string
    lightColor: string
    intensity: number
    lightBlendFactor: number
}

export type PlanetAttributes = {
    seed: string
    density: number
    hasAtmosphere: boolean
    mass: number
    radius: number
    orbitOffset: number
    rotationSpeed: number
    seaLevel: number
    baseTemperature: number
    humidity: number
    moons: number
    orbitRadius: number
    orbitInclination: number
    tilt: number 
}

export type StarClass = {
    name: string
    color: string
    emissiveColor: string
    lightColor: string
    intensityMin: number
    intensityMax: number
    radiusMin: number
    radiusMax: number
    lightBlendFactor: number
}

export type MoonAttributes = {
    planet: number
    hasAtmosphere: boolean
    seed: string
    planetMass: number
    orbitOffset: number
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
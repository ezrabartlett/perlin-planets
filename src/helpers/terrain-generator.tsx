import alea from 'alea';
import { createNoise2D, createNoise3D, NoiseFunction3D } from 'simplex-noise';
import { Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3} from 'three';
import { meshRefType } from '../types'

type randomFunction = {
    (): number;
    next(): number;
    uint32(): number;
    fract53(): number;
    version: string;
    args: any[];
    exportState(): [number, number, number, number];
    importState(state: [number, number, number, number]): void;
}

export default class TerrainGenerator {
    seed: string;
    seedFunction: randomFunction;
    baseNoise: NoiseFunction3D;
    layerTwo: NoiseFunction3D;
    generalNoise: NoiseFunction3D;
    radius: number

    constructor(seed: string, radius: number) {
        this.seed = seed;
        this.seedFunction = alea(seed)
        this.baseNoise = createNoise3D(this.seedFunction)
        this.layerTwo = createNoise3D(this.seedFunction)
        this.generalNoise = createNoise3D(this.seedFunction)
        this.radius = radius
    }

    getTerrain(x: number, y: number, z: number): number {
        // use the seeded random function to initialize the noise function
        return this.radius+this.baseNoise(x, y, z)+0.5*this.baseNoise((x+1000)*2, (y+1000)*2, (z+1000)*2)+0.25*this.baseNoise((x+1000)*4, (y+1000)*4, (z+1000)*4)+0.25*this.baseNoise((x+1000)*6, (y+1000)*6, (z+1000)*6)
    }

    getNoise(x: number, y: number, z: number, scale: number): number {
        return this.generalNoise((x+2000)*scale, (y+2000)*scale, (z+2000)*scale)
    }
}

const getTerrain = (x: number, y: number, z: number) => {
    const seedFunction = alea('seed');
    // use the seeded random function to initialize the noise function
    const noise3d = createNoise3D(seedFunction);
    return noise3d
}

const getNoise = (x: number, y: number, z: number) => {
    const seedFunction = alea('seed');
    // use the seeded random function to initialize the noise function
    const noise3d = createNoise3D(seedFunction);
    return noise3d
}

const affectBaseTerrain = (vertex: Vector3) => {

}

const generatePlanet = (meshRef: meshRefType, seed: string) => {
    if(!meshRef.current) {
        console.log('There was an issue generating planet')
        return
    }

    const seedFunction = alea('seed');
    let vertices = meshRef.current && meshRef.current.geometry.attributes.position.array;

    const noise3D = createNoise3D(seedFunction);
    
    for (let i = 0; i < vertices.length; i += 3) {

        let x = vertices[i]
        let y = vertices[i+1]
        let z = vertices[i+2]

        let vertex = new Vector3(x, y, z)

        // **********************
        // Generate base terrain
        // **********************
        const noise = noise3D(x, y, z)
        console.log(noise)
        vertex.multiplyScalar(2)
        // Modulate the vertex position with the noise value
        vertices[i] = vertex.x
        vertices[i+1] = vertex.y
        vertices[i+2] = vertex.z
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
}
import alea from 'alea';
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { Mesh, BufferGeometry, NormalBufferAttributes, Material, Vector3} from 'three';

type meshRefObject = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>


const getTerrain = (x: number, y: number, z: number) => {
    const seedFunction = alea('seed');
    // use the seeded random function to initialize the noise function
    const noise2D = createNoise3D(seedFunction);
    return
}

const affectBaseTerrain = (vertex: Vector3) => {

}

const generatePlanet = (meshRef: meshRefObject, seed: String) => {
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

const TerrainGenerator = {
    generatePlanet
}

export default TerrainGenerator
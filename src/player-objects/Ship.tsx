import React from 'react';
import { Vector3, Mesh, MeshToonMaterial, TextureLoader, NearestFilter, Texture, BoxGeometry, Quaternion} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType } from '../types';

export type ShipProps = {
    startingPosition: Vector3
    startingAngle: Quaternion
    meshRef: meshRefType
    switchCamera: Function
}

export default function Ship(props: ShipProps) {
    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    const meshRef = props.meshRef
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const handleCLicked = (event: any) => {
        props.switchCamera()
    }

    useFrame((state, delts) => {
        if (meshRef.current) {// && props.colorProfile===0) {
            meshRef.current.rotation.y += 0.002;
            //meshRef.current.position.x += .1
        }
    })

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={props.startingPosition}>
                <mesh>
                    <boxGeometry args={[4, 2, 10]}/>
                    <meshToonMaterial color={'#66a2d1'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
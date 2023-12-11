import React, { useState } from 'react';
import { useGLTF } from '@react-three/drei'
import { Vector3, Mesh, MeshToonMaterial, TextureLoader, NearestFilter, Texture, BoxGeometry, Quaternion, MeshBasicMaterial, Euler} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType } from '../types';
import { UFOModel } from '../assets/models/Ufo'

export type PlayerProps = {
    startingPosition: Vector3
    startingAngle: Quaternion
    meshRef: meshRefType
    targetRef: meshRefType
}

export default function Player(props: PlayerProps) {
    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    const meshRef = props.meshRef
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const velocity = new Vector3(0, 0, 0)
    const acceleration = new Vector3(0,0,0)
    const accelerationConstant = 0
    const dampingConstant = .95;
    // @ts-ignore

    const [foreward, setForward] = useState(0)
    const [backward, setBackward] = useState(0)

    const [right, setRight] = useState(0)
    const [left, setLeft] = useState(0)

    const [lookLeft, setLookLeft] = useState(0)
    const [lookRight, setLookRight] = useState(0)

    window.addEventListener('keydown', (e) => {
        //window.alert(e.code)
        switch(e.code) {
            case 'KeyW':
                setForward(1)
                break;
            case 'KeyS':
                setBackward(1)
                break;
            case 'KeyA':
                setLeft(1)
                break;
            case 'KeyD':
                setRight(1)
                break;
            case 'KeyQ':
                setLookLeft(1)
                break;
            case 'KeyE':
                setLookRight(1)
                break;
            default:
                // code block
        }
    })
    window.addEventListener('keyup', (e) => {
        switch(e.code) {
            case 'KeyW':
                setForward(0)
                break;
            case 'KeyS':
                setBackward(0)
                break;
            case 'KeyA':
                setLeft(0)
                break;
            case 'KeyD':
                setRight(0)
                break;
            case 'KeyQ':
                setLookLeft(0)
                break;
            case 'KeyE':
                setLookRight(0)
                break;
            default:
        }
    })

    const move = (delta: number) => {
        if (meshRef.current) {
            meshRef.current.position.add(velocity.multiplyScalar(delta))
        }
    }

    const dampenVelocity = (delta: number) => {
        velocity.multiplyScalar(dampingConstant*delta)
    }

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.getWorldDirection(acceleration)
            meshRef.current.rotateY((lookLeft-lookRight)*0.5*delta)
            //accelerationConstant += delta*
            //meshRef.current.translateZ((accelerating)*0.5*maxSpeed)
            //accelerate(delta)
            //move(delta)
            //dampenVelocity(delta)
        }
    }, -1)

    return (
        <>
            <mesh ref={meshRef} position={props.startingPosition}>
                <mesh position={new Vector3( 0, 0, 0)}>
                    <boxGeometry args={[0.1, 0.2, 0.1]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
                <mesh position={new Vector3( 0, 0.2, 0)}>
                    <boxGeometry args={[0.1, 0.1, 0.1]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
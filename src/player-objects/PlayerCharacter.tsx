import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei'
import { Vector3, Mesh, MeshToonMaterial, TextureLoader, NearestFilter, Texture, BoxGeometry, Quaternion, MeshBasicMaterial, Euler, Raycaster, Camera} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType } from '../types';
import { UFOModel } from '../assets/models/Ufo'
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

const playerCaster = new Raycaster(undefined, undefined, 0, 10000000)
playerCaster.firstHitOnly = true;

export type PlayerProps = {
    startingPosition: Vector3
    startingAngle: Quaternion
    meshRef: meshRefType
    targetRef: meshRefType | undefined
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
    const playerHeight = .95;
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

    const rayDir = new Vector3()
    let rayHitPosition = new Vector3(0, 0, 0);
    let rayOrigin = new Vector3(0,0,0);
    const rayIndicatorRef = useRef<Mesh>(null);
    let playerVector = new Vector3(0,0,0);
      
    const calculateAndSetPlayerPosition = () => {
        rayDir.subVectors(props.targetRef!.current!.position, meshRef.current!.position);
        console.log(rayDir);
        playerVector.copy(rayDir).setLength(playerHeight);
        rayOrigin.addVectors(meshRef.current!.position, playerVector);
        playerCaster.set(rayOrigin,rayDir);
        const intersection = playerCaster.intersectObjects( [ props.targetRef!.current! ] )[0];
        if(intersection && intersection.point){
            rayHitPosition = intersection.point;
            meshRef.current!.position.set(rayHitPosition.x, rayHitPosition.y, rayHitPosition.z)
        };
    }

    useFrame((state, delta) => {
        if (meshRef.current && props.targetRef && props.targetRef.current) {
            //meshRef.current.getWorldDirection(acceleration)
            meshRef.current.rotateY((lookLeft-lookRight)*0.5*delta)
            //meshRef.current!.position.set(0,0,10);
            if(meshRef.current.parent != props.targetRef.current) {
                props.targetRef.current.attach(meshRef.current);
            }
            //calculateAndSetPlayerPosition()
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
                    <boxGeometry args={[.10, .2, .1]}/>
                    <meshToonMaterial color={'#e56b6g'} gradientMap={threeTone} />
                </mesh>
                <mesh position={new Vector3( 0, 0.2, 0)}>
                    <boxGeometry args={[0.1, 0.1, 0.1]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
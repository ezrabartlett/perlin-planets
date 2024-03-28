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
    nearestBody: meshRefType | undefined
}

export default function Player(props: PlayerProps) {
    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    const meshRef = props.meshRef
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const velocity = new Vector3(0, 0, 0)
    const dampingConstant = .95;
    const rayOffset = 400;

    // @ts-ignore
    const yRotation = useRef(0);

    const foreward = useRef(0);
    const backward = useRef(0);

    const right = useRef(0);
    const left = useRef(0);

    const maxSpeed = useRef(100000);

    const lookLeft = useRef(0);
    const lookRight = useRef(0);

    window.addEventListener('keydown', (e) => {
        //window.alert(e.code)
        switch(e.code) {
            case 'KeyW':
                foreward.current = 1;
                break;
            case 'KeyS':
                backward.current = 1;
                break;
            case 'KeyA':
                left.current = 1;
                break;
            case 'KeyD':
                right.current = 1;
                break;
            case 'KeyQ':
                lookLeft.current = 1;
                break;
            case 'KeyE':
                lookRight.current = 1;
                break;
            default:
                // code block
        }
    })
    window.addEventListener('keyup', (e) => {
        switch(e.code) {
            case 'KeyW':
                foreward.current = 0;
                break;
            case 'KeyS':
                backward.current = 0;
                break;
            case 'KeyA':
                left.current = 0;
                break;
            case 'KeyD':
                right.current = 0;
                break;
            case 'KeyQ':
                lookLeft.current = 0;
                break;
            case 'KeyE':
                lookRight.current = 0;
                break;
            default:
                // code block
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
    let rayOrigin = new Vector3(0,0,0);
    let playerVector = new Vector3(0,0,0);
    const localHitPoint = new Vector3()
    let playerWorldDirection = new Vector3()
    let offSetVector = new Vector3(0,0,0);
    let up = new Vector3(0,1,0)
    let positionNormal = new Vector3(0,0,0)
    let playerUpNormal = new Vector3(0,0,0)
    let cross = new Vector3(0,0,0)
    const calculateAndSetPlayerPosition = () => {
        const player = meshRef!.current!

        //Get local up
        up.set(0,1,0)
        //reset player rotation for calculation
        player.rotation.set(0,0,0);
        // Match up vector to player up
        up.applyQuaternion(player.quaternion)
        
        //Get difference between down and 0,0,0 (The center of the parent planet)
        //targetDirection.copy(player.position).negate()
        positionNormal.copy(player.position).normalize()
        playerUpNormal.copy(up).normalize()

        cross.crossVectors(playerUpNormal, positionNormal).normalize()

        //console.log('difference')
        //console.log(playerUpNormal.angleTo(positionNormal))

        player.rotateOnAxis(cross, playerUpNormal.angleTo(positionNormal))

        //calculate ray origin locally
        playerVector.copy(meshRef.current!.position);
        offSetVector.copy(playerVector).setLength(rayOffset);
        playerVector.add(offSetVector);
        //convert to world
        rayOrigin.copy(props.nearestBody!.current!.localToWorld(playerVector));

        //Calculate the ray direction
        rayDir.subVectors(rayOrigin, props.nearestBody!.current!.position).negate();

        playerCaster.set(rayOrigin,rayDir);
        const intersection = playerCaster.intersectObjects( [ props.nearestBody!.current! ] )[0];
        if(intersection && intersection.point){
            localHitPoint.copy(props.nearestBody!.current!.worldToLocal(intersection.point));
            meshRef.current!.position.setLength(localHitPoint.length()+200)
        };
    }

    useEffect(() => {
        //meshRef && meshRef.current && meshRef.current.position.set(props.startingPosition.x, props.startingPosition.y, props.startingPosition.z)
        //props.nearestBody && props.nearestBody.current && meshRef && meshRef.current && meshRef && meshRef.current.position.set(props.nearestBody.current.position.x, props.nearestBody.current.position.y, props.nearestBody.current.position.z)
        if(props.nearestBody && props.nearestBody.current && meshRef && meshRef.current) {
            props.nearestBody?.current.attach(meshRef.current);
            meshRef.current.position.set(830000,830000,0);
        }

    }, [props.nearestBody])

    useFrame((state, delta) => {
        if (meshRef.current && props.nearestBody && props.nearestBody.current) {
            if(meshRef.current.parent != props.nearestBody.current) {
                props.nearestBody.current.attach(meshRef.current);
            }

            meshRef.current.getWorldDirection(playerWorldDirection)
            
            meshRef.current.translateZ((foreward.current-backward.current)*maxSpeed.current*delta)
            meshRef.current.translateX((left.current-right.current)*maxSpeed.current*delta)

            yRotation.current = yRotation.current+(lookLeft.current-lookRight.current)*0.5*delta;
            calculateAndSetPlayerPosition()
            meshRef.current.rotateY(yRotation.current)
        }
    }, 0)

    return (
        <>
            <mesh ref={meshRef}>
                <mesh position={new Vector3( 0, .2, 0)}>
                    <boxGeometry args={[.10, .2, .1]}/>
                    <meshToonMaterial color={'#e56b6g'} gradientMap={threeTone} />
                </mesh>
                <mesh position={new Vector3( 0, 0.4, 0)}>
                    <boxGeometry args={[.1, .1, .1]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
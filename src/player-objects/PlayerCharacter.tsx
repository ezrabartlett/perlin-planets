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
    const acceleration = new Vector3(0,0,0)
    const accelerationConstant = 0
    const dampingConstant = .95;
    const playerHeight = 1;
    const rayOffset = 400;

    // @ts-ignore
    const [yRotation, setYRotation] = useState(0)
    const [playerPosition, setPlayerPosition] = useState(new Vector3())


    const [forward, setForward] = useState(0)
    const [backward, setBackward] = useState(0)

    const [right, setRight] = useState(0)
    const [left, setLeft] = useState(0)
    const [maxSpeed, setMaxSpeed] = useState(100)

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
    const targetDirection = new Vector3(0,0,0);
    let playerVector = new Vector3(0,0,0);
    const playerWorldPosition = new Vector3()
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
        //console.log('Position normal')
        //console.log(positionNormal)

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

        //rayOrigin.addVectors(playerWorldPosition, rayDir);

        playerCaster.set(rayOrigin,rayDir);
        const intersection = playerCaster.intersectObjects( [ props.nearestBody!.current! ] )[0];
        //console.log(intersection)
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

    const calculatePlayerDownVector = () => {
        let playerDirection = new Vector3()
        meshRef!.current!.getWorldDirection(playerDirection)

        let xVector = new Vector3(0,0,0);
        let zVector = new Vector3(0,0,0);
        xVector.x = playerDirection.x
    }

    useFrame((state, delta) => {
        if (meshRef.current && props.nearestBody && props.nearestBody.current) {
            if(meshRef.current.parent != props.nearestBody.current) {
                props.nearestBody.current.attach(meshRef.current);
            }

            meshRef.current.getWorldDirection(playerWorldDirection)
            
            meshRef.current.translateZ((forward-backward)*maxSpeed)
            meshRef.current.translateX((left-right)*maxSpeed)

            //setPlayerPosition(new Vector3(1000, 1000, 0))
            //meshRef.current.position.set(830000*Math.cos(theta),830000*Math.sin(theta),0)
            setYRotation(yRotation+(lookLeft-lookRight)*0.5*delta);
            calculateAndSetPlayerPosition()
            meshRef.current.rotateY(yRotation)
            //console.log(`player direction = ${playerWorldDirection}`)
            
            //accelerationConstant += delta*
            //meshRef.current.translateZ((accelerating)*0.5*maxSpeed)
            //accelerate(delta)
            //move(delta) 
            //dampenVelocity(delta)
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
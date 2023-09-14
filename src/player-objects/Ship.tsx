import React, { useState } from 'react';
import { useGLTF } from '@react-three/drei'
import { Vector3, Mesh, MeshToonMaterial, TextureLoader, NearestFilter, Texture, BoxGeometry, Quaternion, MeshBasicMaterial, Euler} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType } from '../types';
import { UFOModel } from '../assets/models/Ufo'

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

    const velocity = new Vector3(0, 0, 0)
    const acceleration = new Vector3(0,0,0)
    const accelerationConstant = 0
    const dampingConstant = .95;
    // @ts-ignore

    const [roleLeft, setRoleLeft] = useState(0)
    const [roleRight, setRoleRight] = useState(0)

    const [yawLeft, setYawLeft] = useState(0)
    const [yawRight, setYawRight] = useState(0)

    const [pitchUp, setPitchUp] = useState(0)
    const [pitchDown, setPitchDown] = useState(0)

    const [accelerating, setAccelerating] = useState(0)

    const [maxSpeed, setMaxSpeed] = useState(100000)

    const handleCLicked = (event: any) => {
        props.switchCamera()
    }

    window.addEventListener('keydown', (e) => {
        //window.alert(e.code)
        switch(e.code) {
            case 'KeyQ':
                setRoleRight(1)
                break;
            case 'KeyE':
                setRoleLeft(1)
                break;
            case 'KeyA':
                setYawLeft(1)
                break;
            case 'KeyD':
                setYawRight(1)
                break;
            case 'KeyW':
                setPitchDown(1)
                break;
            case 'KeyS':
                setPitchUp(1)
                break;
            case 'ShiftLeft':
                setAccelerating(1)
                break;
            default:
                // code block


        }
    })
    window.addEventListener('keyup', (e) => {
        switch(e.code) {
            case 'KeyQ':
                setRoleRight(0)
                break;
            case 'KeyE':
                setRoleLeft(0)
                break;
            case 'KeyA':
                setYawLeft(0)
                break;
            case 'KeyD':
                setYawRight(0)
                break;
            case 'KeyW':
                setPitchDown(0)
                break;
            case 'KeyS':
                setPitchUp(0)
                break;
            case 'ShiftLeft':
                setAccelerating(0)
                break;
            case 'Enter':
                if(maxSpeed === 100000){
                    setMaxSpeed(10000)
                } else if(maxSpeed === 10000) {
                    setMaxSpeed(200)                
                } else {
                    setMaxSpeed(100000)
                }
                break;
            default:
                // code block
        }
    })

    const accelerate = (delta: number) => {
        if (meshRef.current) {
            velocity.add(acceleration.normalize().multiplyScalar(accelerationConstant*delta*accelerating))
            if(velocity.length()>=maxSpeed) {
                velocity.normalize().multiplyScalar(maxSpeed)
            }
        }
    }

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
            meshRef.current.rotateZ((roleLeft-roleRight)*0.5*delta)
            meshRef.current.rotateY((yawLeft-yawRight)*0.5*delta)
            meshRef.current.rotateX((pitchDown-pitchUp)*0.5*delta)
            //accelerationConstant += delta*
            meshRef.current.translateZ((accelerating)*0.5*maxSpeed)
            //accelerate(delta)
            //move(delta)
            //dampenVelocity(delta)
        }
    }, -1)

    return (
        <>
            <mesh ref={meshRef} onClick={handleCLicked} position={props.startingPosition}>
                <mesh>
                    <coneGeometry args={[0.8, 0.3, 30, 8]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
                <mesh rotation={new Euler(Math.PI, 0, 0)} position={new Vector3( 0, -0.27, 0)}>
                    <coneGeometry args={[0.8, 0.2]}/>
                    <meshToonMaterial color={'#e56b6f'} gradientMap={threeTone} />
                </mesh>
                <mesh>
                    <sphereGeometry args={[0.3, 20, 20]} />
                    <meshToonMaterial color={'#8ecae6'} gradientMap={threeTone} />
                </mesh>
                <mesh position={ new Vector3( 0, -0.17, 0)}>
                    <cylinderGeometry args={[0.8, 0.8, 0.03]}/>
                    <meshToonMaterial color={'#f2e9e4'} gradientMap={threeTone} />
                </mesh>
            </mesh>
        </>
    );
}
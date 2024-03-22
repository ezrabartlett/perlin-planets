import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei'
import { Vector3, Mesh, MeshToonMaterial, TextureLoader, NearestFilter, Texture, BoxGeometry, Quaternion, MeshBasicMaterial, Euler} from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { meshRefType } from '../types';

export type ShipProps = {
    startingPosition: Vector3
    startingAngle: Quaternion
    meshRef: meshRefType
}

export default function Ship(props: ShipProps) {
    const threeTone = useLoader(TextureLoader, require('../assets/textures/threeTone.jpg')) as Texture;
    const meshRef = props.meshRef
    threeTone.minFilter = NearestFilter
    threeTone.magFilter = NearestFilter

    const acceleration = new Vector3(0,0,0)
    const accelerationConstant = 0
    const dampingConstant = .95;
    // @ts-ignore

    let roleLeft = useRef(0);
    let roleRight = useRef(0);

    let yawLeft = useRef(0);
    let yawRight = useRef(0);

    let pitchUp = useRef(0);
    let pitchDown = useRef(0);

    let accelerating = useRef(0);
    const velocityRef = useRef(0);
    const [maxSpeed, setMaxSpeed] = useState(20)

    window.addEventListener('keydown', (e) => {
        //window.alert(e.code)
        switch(e.code) {
            case 'KeyQ':
                roleLeft.current = 1;
                break;
            case 'KeyE':
                roleRight.current = 1;
                break;
            case 'KeyA':
                yawLeft.current = 1 ;
                break;
            case 'KeyD':
                yawRight.current = 1;
                break;
            case 'KeyW':
                pitchDown.current = 1;
                break;
            case 'KeyS':
                pitchUp.current = 1;
                break;
            case 'ShiftLeft':
                accelerating.current = 1
                break;
            default:
                // code block


        }
    })
    window.addEventListener('keyup', (e) => {
        switch(e.code) {
            case 'KeyQ':
                roleLeft.current = 0;
                break;
            case 'KeyE':
                roleRight.current = 0;
                break;
            case 'KeyA':
                yawLeft.current = 0 ;
                break;
            case 'KeyD':
                yawRight.current = 0;
                break;
            case 'KeyW':
                pitchDown.current = 0;
                break;
            case 'KeyS':
                pitchUp.current = 0;
                break;
            case 'ShiftLeft':
                accelerating.current = 0;
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

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(props.startingPosition)
        }
    }, [])

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotateZ((roleRight.current-roleLeft.current)*0.5*delta)
            meshRef.current.rotateY((yawLeft.current-yawRight.current)*0.5*delta)
            meshRef.current.rotateX((pitchDown.current-pitchUp.current)*0.5*delta)

            velocityRef.current+=accelerating.current*4*delta
            if(velocityRef.current < 0){
                velocityRef.current = 0;
            } else if(velocityRef.current > maxSpeed) {
                velocityRef.current = maxSpeed;;
            }

            meshRef.current.translateZ(velocityRef.current*100000*delta);
        }
    }, -1)

    return (
        <>
            <mesh ref={meshRef}>
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
import React, {useEffect, useRef} from 'react';
import { createRoot } from 'react-dom/client'
import { Color, MeshStandardMaterial, PointLight, Vector3,  Mesh, Camera, BackSide, ShaderMaterial } from 'three';
import { useState } from 'react';
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragment';
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertex';
import { useFrame } from '@react-three/fiber';
export type SunProps = {
    seed: String
    position?: Vector3
    setCameraTarget?: Function
    orbitCameraRef: React.MutableRefObject<Camera>
    thirdPersonCameraRef: React.MutableRefObject<Camera>
    radius: number
    cameraIndex: number
}

export default function Sun(props: SunProps) {
    const [intensity, setIntensity] = useState(1.5)
    const [color, setColor] = useState('white')
    const meshRef = useRef<Mesh | null>(null);
    const orbitAtmosphereRef = useRef<Mesh>(null);
    const shipAtmosphereRef = useRef<Mesh>(null);
    const atmosphereColor = new Color('#ffb703')

    const handleCLicked = (event: any) => {
        if(meshRef && meshRef.current){
            props.setCameraTarget && props.setCameraTarget(meshRef)
            event && event.stopPropagation()
        }
    }

    useEffect(() => {
        props.setCameraTarget && props.setCameraTarget(meshRef)
    }, [])


    const updateOrbitAtmpshereUniforms = () => {
        const material = orbitAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(props.cameraIndex === 1) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    material.uniforms.cameraPos.value = props.thirdPersonCameraRef.current.position;
                }
            }
            meshRef.current && (material.uniforms.pCenter.value = meshRef.current.position)
        } else {
            console.log('no material')
        }
    }

    const updateShipAtmpshereUniforms = () => {
        const material = shipAtmosphereRef.current!.material as ShaderMaterial;
        if (material && material.uniforms) {
            if(props.cameraIndex === 1) {
                if (props.orbitCameraRef && props.orbitCameraRef.current) {
                    material.uniforms.cameraPos.value = props.orbitCameraRef.current.position;
                }
            } else {
                if (props.thirdPersonCameraRef && props.thirdPersonCameraRef.current) {
                    material.uniforms.cameraPos.value = props.thirdPersonCameraRef.current.position;
                }
            }
            meshRef.current && (material.uniforms.pCenter.value = meshRef.current.position)
        } else {
            console.log('no material')
        }
    }
    /*
    useFrame((state, delta) => {
        if(props.cameraIndex) {
            updateOrbitAtmpshereUniforms();
        } else {
            updateShipAtmpshereUniforms();
        }
    })
    */

    return (
    <>
        <mesh ref={meshRef} onClick={handleCLicked} material={new MeshStandardMaterial({ color: 'color', emissive: '#ffdd00' })}>
            <sphereGeometry args={[props.radius, 30, 30]}/>
            <pointLight color={color} distance={600000000} intensity={0.8} />
        </mesh>
        {/*<mesh visible={props.cameraIndex===1} ref={orbitAtmosphereRef} renderOrder={-10}>
            <sphereGeometry args={[props.radius*1.2, 30, 30]}/>
            {<shaderMaterial transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, uColor: {value: atmosphereColor}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.radius*1.1}}} />}
        </mesh>}
        {<mesh visible={props.cameraIndex===0} ref={shipAtmosphereRef} renderOrder={-10}>
            <sphereGeometry args={[props.radius*1.2, 30, 30]}/>
            {<shaderMaterial side={BackSide} transparent fragmentShader={atmosphereFragment} vertexShader={atmosphereVertex} uniforms={{uSunPos: {value: [0,0,0]}, uColor: {value: atmosphereColor}, cameraPos: {value: [0,0,0]}, pCenter: {value: [0,0,0]}, uRadius: {value: props.radius*1.1}}} />}
        </mesh>*/}
    </>
    );
}
import React, {useEffect, useRef} from 'react';
import { MeshStandardMaterial, Vector3,  Mesh, Camera, ShaderMaterial } from 'three';
import { StarAttributes, StarClass } from '../types';
export type SunProps = {
    position?: Vector3
    setCameraTarget?: Function
    orbitCameraRef: React.MutableRefObject<Camera>
    thirdPersonCameraRef: React.MutableRefObject<Camera>
    cameraIndex: number
    attributes: StarAttributes
}

function hexToRgb(hex: string) {
    // Remove the hash at the start if it's there
    hex = hex.substring(1);
    const bigint = parseInt(hex, 16);
    const r = 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint >> 16) & 255;

    return [r, g, b];
}

function rgbToHex(color: number[]) {
    return '#' + (1 << 24 | color[0] << 16 | color[1] << 8 | color[2]).toString(16).slice(1).toUpperCase();
}

function blendColors(baseColor: number[], tintColor: number[], factor: number) {
    const r = Math.round(baseColor[0] + (tintColor[0] - baseColor[0]) * factor);
    const g = Math.round(baseColor[1] + (tintColor[1] - baseColor[1]) * factor);
    const b = Math.round(baseColor[2] + (tintColor[2] - baseColor[2]) * factor);

    return [r, g, b];
}

export default function Sun(props: SunProps) {

    const meshRef = useRef<Mesh | null>(null);
    const orbitAtmosphereRef = useRef<Mesh>(null);
    const shipAtmosphereRef = useRef<Mesh>(null);

    const blendedColor = () => {
        return rgbToHex(blendColors([255, 255, 255], hexToRgb(props.attributes.lightColor), props.attributes.lightBlendFactor))
    }

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
        <mesh ref={meshRef} onClick={handleCLicked} material={new MeshStandardMaterial({ color: props.attributes.color, emissive: props.attributes.emissiveColor })}>
            <sphereGeometry args={[props.attributes.radius, 30, 30]}/>
            <pointLight color={blendedColor()} distance={600000000} intensity={props.attributes.intensity} />
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
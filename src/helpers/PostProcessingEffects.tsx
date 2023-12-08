import React, { useRef, useEffect } from 'react';

import { Atmospheres } from './Atmosphere';
import { EffectComposer } from '@react-three/postprocessing';
import { AtmosphereInfoType } from '../types';
import { useFrame } from '@react-three/fiber';
import { Camera, Vector3 } from 'three';

type PostProcessingEffectsProps = {
    Atmospheres: AtmosphereInfoType[]
    cameraRef: React.MutableRefObject<Camera>
}

const PostProcessingEffects = (props: PostProcessingEffectsProps) => {

    const atmosphereRef = useRef(null)
    const cameraPos = new Vector3(3,3,3)
    const planetRefs = props.Atmospheres.map((atms)=>{
        return atms.planet;
    })
    const centers = props.Atmospheres.map((atms)=>{
        if(atms.planet.current) {
            return atms.planet.current.position
        } 
        return new Vector3(0,0,0)
    })

    const radii = props.Atmospheres.map((atms)=>{
        return atms.planetRadius
    })

    const updateAtmosphereUniforms = () => {
        if (atmosphereRef.current && props.cameraRef && props.cameraRef.current) {
            const centers = planetRefs.map(planet => {
                if(planet.current) {
                    return planet.current.position
                } else {
                    return new Vector3(0,0,0)
                }
            })
            const newParams = {
              uCenters: centers, // This should be a three.js Vector3 or an array [x, y, z]
              uCameraPos: props.cameraRef.current.position,// This should be a three.js Vector3 or an array [x, y, z]
              uProjectionMatrix: props.cameraRef.current.projectionMatrix,
              uViewMatrix: props.cameraRef.current.matrixWorldInverse
            };
            // @ts-ignore
            atmosphereRef.current.updateUniforms(newParams);
          }
    }

    useFrame((state, delta) => {
        updateAtmosphereUniforms()
    })

    return (
        <EffectComposer> 
            <Atmospheres ref={atmosphereRef} uCenters={centers} uCameraPos={cameraPos} uRadii={radii} uSunPos={new Vector3(0,0,0)} uNumPlanets={10} />
        </EffectComposer>
    );
};

export default PostProcessingEffects;
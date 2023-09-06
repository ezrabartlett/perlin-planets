import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Matrix4, Uniform, Vector3 } from 'three'
import { Effect } from 'postprocessing'
import atmosphereFragment from '../shaders/atmosphere/atmosphereFragmentPostProcessing'
import atmosphereVertex from '../shaders/atmosphere/atmosphereVertexPostProcessing'

// Effect implementation
class AtmosphereEffect extends Effect {
  constructor({ uCenters = [], uCameraPos = [], uRadii = [], uSunPos=[], uNumPlanets=10} = {}) {
    super('AtmoshpereEffect', atmosphereFragment, {
        // @ts-ignore
      uniforms: new Map([
            ['uCenters', new Uniform(uCenters)],
            ['uCameraPos', new Uniform(uCameraPos)],
            ['uRadii', new Uniform(uRadii)],
            ['uSunPos', new Uniform(uSunPos)],
            ['uNumPlanets', new Uniform(uNumPlanets)],
            ['uProjectionMatrix', new Uniform(new Matrix4().set(
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
              ))],
            ['uViewMatrix', new Uniform(new Matrix4().set(
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
              ))]
        ]),
       // vertexShader: atmosphereVertex
    })
  }

    // Method to update uniforms
    // @ts-ignore
    setUniforms(newParams) {
        for (const [key, value] of Object.entries(newParams)) {
          if (this.uniforms.has(key)) {
            // @ts-ignore
            this.uniforms.get(key).value = value;
          }
        }
      }
}


type newParams = {
    uCenters: number[]
    uCameraPos: Vector3
}

// Effect component
type props = {
    uCenters: Vector3[]
    uCameraPos: Vector3
    uRadii: number[]
    uSunPos: Vector3
    uNumPlanets: number
}
export const Atmospheres = forwardRef((values: props, ref) => {
    // @ts-ignore
  const effect = useMemo(() => new AtmosphereEffect(values), [values.uCenters, values.uCameraPos, values.uRadii, values.uSunPos, values.uNumPlanets])

  useImperativeHandle(ref, () => ({
    updateUniforms: (params: newParams) => {
      effect.setUniforms(params);
    },
  }), [effect]);

  return <primitive ref={ref} object={effect} dispose={null} />
})
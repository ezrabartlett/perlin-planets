import { useFrame, useThree } from "@react-three/fiber"
import { PostFX } from "./PostFx"

export function Effect() {
    const { gl, scene, camera, size } = useThree()
    const renderer = new PostFX(gl)
    return useFrame((state) => {
      renderer.render(scene, camera)
    }, 1)
  }
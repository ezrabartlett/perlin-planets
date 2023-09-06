
/*
  To use it, simply declare:
  `const post = new PostFX(rendering);`
  
  Then on update, instead of:
  `rendering.render(scene, camera);`
  replace with:
  `post.render(scene, camera);`
*/
import {
    WebGLRenderTarget,
    OrthographicCamera,
    RGBAFormat,
    BufferGeometry,
    BufferAttribute,
    Mesh,
    Scene,
    RawShaderMaterial,
    Vector2,
  } from 'three';

  import atmosphereFragment from '../shaders/atmosphere/atmosphereFragmentPostProcessing';
  
  const vertexShader = /*glsl*/ `
  
  precision highp float;
  attribute vec2 position;

  void main() {
    // Look ma! no projection matrix multiplication,
    // because we pass the values directly in clip space coordinates.
    gl_Position = vec4(position, 1.0, 1.0);
  }
  
  `;
  
  const fragmentShader = /*glsl*/ `
  
  precision highp float;
  uniform sampler2D uScene;
  uniform vec2 uResolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    //vec3 color = vec3(uv, 1.0);
    vec4 color = texture2D(uScene, uv).rgba;
    color.rgb = pow(color.rgb, vec3(1.0 / 2.25));
    // Do your cool postprocessing here
    gl_FragColor = color;
  }
  
  `;
  
  export class PostFX {
    constructor(renderer) {
      this.renderer = renderer;

      this.scene = new Scene();
      // three.js for .render() wants a camera, even if we're not using it :(
      this.dummyCamera = new OrthographicCamera();
      this.geometry = new BufferGeometry();
  
      // Triangle expressed in clip space coordinates
      const vertices = new Float32Array([
        -1.0, -1.0,
        3.0, -1.0,
        -1.0, 3.0
      ]);
  
      this.geometry.setAttribute('position', new BufferAttribute(vertices, 2));
  
      this.resolution = new Vector2();
      this.renderer.getDrawingBufferSize(this.resolution);
  
      this.target = new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
        format: RGBAFormat,
        stencilBuffer: false,
        depthBuffer: true,
      });
  
      this.material = new RawShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          uScene: { value: this.target.texture },
          uResolution: { value: this.resolution },
        },
      });
  
      // TODO: handle the resize -> update uResolution uniform and this.target.setSize()
  
      this.triangle = new Mesh(this.geometry, this.material);
      // Our triangle will be always on screen, so avoid frustum culling checking
      this.triangle.frustumCulled = false;
      this.scene.add(this.triangle);
    }
  
    render(scene, camera) {
      this.renderer.setRenderTarget(this.target);

      this.renderer.render(scene, camera);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.dummyCamera);
    }
  }
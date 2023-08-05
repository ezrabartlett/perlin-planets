export default /* glsl */ `
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;
attribute float altitude;
attribute float temperature;
varying float vAltitude;
varying float vTemperature;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vAltitude = altitude;
    vTemperature = temperature;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
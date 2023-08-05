export default /* glsl */ `
varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vColor;
varying float vAltitude;
varying float vTemperature;
uniform float time;
uniform float radius;
uniform vec4 grassColor;

void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    vec4 calculated_color = grassColor;

    if ( vTemperature <= 32.0 ) {
        calculated_color = vec4(1.0, 1.0, 1.0, 1.0);
    } else if ( vAltitude < radius+radius*.01 ) {
        calculated_color = vec4(vec3(244,227,171)/255.0, 1.0);
    }
    /*if ( vTemperature >= 90.0 ) {
        calculated_color = vec4(vec3(244,227,171)/255.0, 1.0);
    }
    if ( vTemperature >= 85.0 ) {
        calculated_color = vec4(mix(vec3(10,157,117), vec3(244,227,171), (vTemperature-85.0)/5.0)/255.0, 1.0);
    }*/
   
    csm_DiffuseColor = calculated_color;
}
`;
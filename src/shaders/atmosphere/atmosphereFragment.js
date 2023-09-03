export default /* glsl */ `
//precision highp float;
#define FLT_MAX 3.402823466e+38

varying vec3 vPosition;

uniform vec3 uSunPos;
uniform vec3 cameraPos;

uniform vec3 pCenter;
uniform float uRadius;

vec2 raySphereIntersection(vec3 center, float radius, vec3 rayOrigin, vec3 rayDir) {
    vec3 offset = rayOrigin - center;
    float a = 1.0; // set to dot(rayDir, rayDir); if raydir not normalized
    float b = 2.0 * dot(offset, rayDir);
    float c = dot(offset, offset) - radius * radius;
    float d = b * b - 4.0 * a * c;

    if (d > 0.0) {
        float s = sqrt(d);
        float dstToSphereNear = max(0.0 , ( -b - s ) / ( 2.0 * a ));
        float dstToSphereFar = ( -b + s ) / ( 2.0 * a );

        if (dstToSphereFar >= 0.0) {
            return vec2(dstToSphereNear, dstToSphereFar-dstToSphereNear);
        }

       /*float t = (-b - sqrt(d)) / (2.0 * a);
        if (t >= 0.0) {
            intersectionPoint = rayOrigin + rayDir * t;
            return true;
        }*/
    }

    return vec2(FLT_MAX, 0);
}

void main() {
    vec3 rayOrigin = cameraPos;
    vec3 rayDir = normalize(vPosition-cameraPos);
    vec2 hitInfo = raySphereIntersection( pCenter, uRadius, cameraPos, rayDir);
    float dstToAtmosphereNear = hitInfo.x;
    float dstThroughAtmosphere = hitInfo.y;
    
    gl_FragColor = vec4(vec3(102.0/255.0, 162.0/255.0, 209.0/255.0)*(dstThroughAtmosphere) / (2.0*uRadius), 1.0);
}
`;

export default /* glsl */ `
//precision highp float;
#define FLT_MAX 3.402823466e+38

#define MAX_PLANETS 20
uniform int uNumPlanets;  // Actual number of planets
uniform vec3 uSunPos;
uniform vec3 uCameraPos;

uniform vec3 uPlanetCenters[MAX_PLANETS];
uniform float uPlanetRadii[MAX_PLANETS];

uniform mat4 uProjectionMatrix; // Projection Matrix
uniform mat4 uViewMatrix; // View Matrix

vec3 getRayDir(vec2 uv, mat4 projMatrix, mat4 viewMatrix) {
    vec4 clipCoords = vec4(uv.x * 2.0 - 1.0, -(uv.y * 2.0 - 1.0), -1.0, 1.0);
    mat4 invProjView = inverse(projMatrix * viewMatrix);
    vec4 eyeCoords = invProjView * clipCoords;
    vec3 rayDir = normalize(eyeCoords.xyz);
    return rayDir;
}

bool raySphereIntersection(vec3 center, float radius, vec3 rayOrigin, vec3 rayDir, out vec2 hitInfo) {
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
            hitInfo = vec2(dstToSphereNear, dstToSphereFar-dstToSphereNear);
            return true;
        }

       /*float t = (-b - sqrt(d)) / (2.0 * a);
        if (t >= 0.0) {
            intersectionPoint = rayOrigin + rayDir * t;
            return true;
        }*/
    }

    hitInfo = vec2(FLT_MAX, 0);
    return false;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec4 sum = inputColor;
    vec3 rayDir = getRayDir(uv, uProjectionMatrix, uViewMatrix);
    vec3 rayOrigin = uCameraPos;
    vec2 hitInfo;
    bool didHit = raySphereIntersection( vec3(200.0, 200.0, 0.0), 1000.0, rayOrigin, rayDir, hitInfo);
    //vec3 rayDir = normalize(position-uCameraPos);

    /*vec3 rayOrigin = uCameraPos;
    vec3 rayDir = normalize(vPosition-cameraPos);
    vec2 hitInfo = raySphereIntersection( pCenter, uRadius, cameraPos, rayDir);*/
    float dstToAtmosphereNear = hitInfo.x;
    float dstThroughAtmosphere = hitInfo.y;
    
    gl_FragColor = vec4(vec3(102.0/255.0, 162.0/255.0, 209.0/255.0)*(dstThroughAtmosphere) / (2.0*200.0), 1.0);

    for (int i = 0; i < uNumPlanets; ++i) {
        vec3 center = uPlanetCenters[i];
        float radius = uPlanetRadii[i];
        // Do something with this planet.
    }
    if(gl_FragCoord.x<1800.0) {
        outputColor = sum;    } 
    else {
        outputColor = vec4(vec3(gl_FragCoord.z / gl_FragCoord.w),1.0);
    }
    // outputColor = vec4(1.0,1.0,1.0-gl_FragCoord.z,1.0);//vec4(vec3(1.0)*gl_FragCoord.x, 1.0);
    /*if(didHit) {
        outputColor = vec4(vec3((dstThroughAtmosphere) / (2.0*200.0)), 1.0);
    } else {
        outputColor = sum;
    }*/
}
`;

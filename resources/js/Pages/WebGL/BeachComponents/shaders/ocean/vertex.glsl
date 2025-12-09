 varying vec2 vUv;
varying vec3 vPosition;
varying float vWaveHeight;
uniform float uTime;

// Gerstner Wave function for realistic ocean waves
vec3 gerstnerWave(vec2 coord, float wavelength, float steepness, vec2 direction, float time) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    float f = k * (dot(d, coord) - c * time);
    float a = steepness / k;
    
    return vec3(
        d.x * a * cos(f),
        a * sin(f),
        d.y * a * cos(f)
    );
}

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Combine multiple Gerstner waves for realistic motion
    vec3 wave1 = gerstnerWave(pos.xy, 30.0, 0.15, vec2(1.0, 0.3), uTime * 0.8);
    vec3 wave2 = gerstnerWave(pos.xy, 20.0, 0.1, vec2(0.8, 0.6), uTime * 1.2);
    vec3 wave3 = gerstnerWave(pos.xy, 12.0, 0.08, vec2(0.5, 1.0), uTime * 1.5);
    vec3 wave4 = gerstnerWave(pos.xy, 8.0, 0.05, vec2(-0.3, 0.9), uTime * 0.6);
    
    vec3 totalWave = wave1 + wave2 + wave3 + wave4;
    
    pos.x += totalWave.x;
    pos.z += totalWave.y;  // Height (mapped to z since plane is rotated)
    pos.y += totalWave.z;
    
    // Pass wave height for foam calculation in fragment shader
    vWaveHeight = totalWave.y;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uShorelinePosition; // Z position where water meets sand (0-1 in UV space)

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate distance from shoreline (in UV space)
    float distFromShore = vUv.y - uShorelinePosition;
    
    // Only apply waves in the ocean area (below shoreline)
    if (distFromShore < 0.0) {
        float oceanDepth = abs(distFromShore);
        
        // Waves moving TOWARD shore (negative direction)
        // Multiple wave layers for realism
        float wave1 = sin(vUv.x * 8.0 - uTime * 1.5 + oceanDepth * 20.0) * 0.3;
        float wave2 = sin(vUv.x * 15.0 - uTime * 2.0 + oceanDepth * 15.0) * 0.15;
        float wave3 = sin(vUv.x * 25.0 - uTime * 2.5) * 0.08;
        
        // Waves get smaller as they approach shore
        float waveAmplitude = smoothstep(0.0, 0.3, oceanDepth);
        
        pos.z += (wave1 + wave2 + wave3) * waveAmplitude;
    }
    
    // Subtle sand dunes in sand area
    if (distFromShore > 0.0) {
        float sandWave = sin(vUv.x * 3.0) * sin(vUv.y * 5.0) * 0.05;
        pos.z += sandWave * smoothstep(0.0, 0.2, distFromShore);
    }
    
    vWorldPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

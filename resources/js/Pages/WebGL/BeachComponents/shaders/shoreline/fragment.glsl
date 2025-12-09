varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uShorelinePosition;
uniform vec3 uSandColor;
uniform vec3 uShallowWaterColor;
uniform vec3 uDeepWaterColor;

// Simplex noise - smoother than random()
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Fractal Brownian Motion - layered noise
float fbm(vec2 st, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    float distFromShore = vUv.y - uShorelinePosition;
    
    // === WATER AREA ===
    if (distFromShore < 0.0) {
        float oceanDepth = abs(distFromShore);
        
        // Caribbean water colors
        vec3 waterColor = mix(uShallowWaterColor, uDeepWaterColor, smoothstep(0.0, 0.4, oceanDepth));
        
        // Animated caustics
        float caustics = snoise(vUv * 30.0 + vec2(uTime * 0.3, uTime * 0.2));
        caustics = pow(abs(caustics), 2.0) * 0.25;
        waterColor += vec3(0.1, 0.15, 0.1) * caustics;
        
        // Wave foam
        float wavePhase = sin(vUv.x * 18.0 - uTime * 2.5 + oceanDepth * 25.0);
        float foam = smoothstep(0.6, 1.0, wavePhase);
        foam *= smoothstep(0.15, 0.0, oceanDepth);
        
        // Breaking wave
        float breakingWave = sin(uTime * 1.5) * 0.02 + 0.03;
        float waveLine = smoothstep(breakingWave + 0.02, breakingWave, oceanDepth);
        waveLine *= smoothstep(breakingWave - 0.02, breakingWave, oceanDepth);
        foam += waveLine * 0.8;
        
        float foamNoise = snoise(vUv * 60.0 + uTime * 0.3);
        foam *= smoothstep(-0.3, 0.5, foamNoise);
        
        waterColor = mix(waterColor, vec3(1.0, 1.0, 1.0), foam * 0.9);
        float alpha = 0.75 + oceanDepth * 0.25;
        
        gl_FragColor = vec4(waterColor, alpha);
    }
    // === TRANSITION ZONE (wet sand) ===
    else if (distFromShore < 0.08) {
        float wetness = 1.0 - (distFromShore / 0.08);
        
        vec3 wetSandColor = uSandColor * 0.6;
        vec3 color = mix(uSandColor, wetSandColor, wetness * 0.8);
        
        float reflection = wetness * 0.25 * (0.5 + 0.5 * sin(uTime * 2.0));
        color = mix(color, uShallowWaterColor * 1.2, reflection);
        
        // Medium frequency grain texture
        float grain = snoise(vUv * 120.0) * 0.06 + snoise(vUv * 50.0) * 0.04;
        color *= (1.0 - grain * wetness);
        
        float wash = sin(uTime * 1.5) * 0.5 + 0.5;
        float washLine = smoothstep(0.04 + wash * 0.04, 0.02 + wash * 0.04, distFromShore);
        color = mix(color, uShallowWaterColor * 0.9, washLine * 0.5);
        
        gl_FragColor = vec4(color, 1.0);
    }
    // === DRY SAND AREA ===
    else {
        vec3 sandColor = uSandColor;
        
        // Multi-layer noise: large dunes + medium texture + fine grain
        float dunes = fbm(vUv * 6.0, 3) * 0.1;           // Large scale variation
        float texture = snoise(vUv * 40.0) * 0.1;         // Medium grain
        float fineGrain = snoise(vUv * 100.0) * 0.06;     // Fine detail (balanced freq)
        float microGrain = snoise(vUv * 180.0) * 0.03;    // Micro texture
        
        sandColor *= (1.0 + dunes + texture + fineGrain + microGrain);
        
        // Color variation - darker and lighter patches
        float colorVar = fbm(vUv * 12.0, 4);
        vec3 darkSand = sandColor * 0.85;
        vec3 lightSand = sandColor * 1.1;
        sandColor = mix(darkSand, lightSand, colorVar * 0.5 + 0.5);
        
        // Sparkle effect - medium frequency, smooth threshold
        float sparkleBase = snoise(vUv * 150.0 + vec2(uTime * 0.03, 0.0));
        float sparkle = smoothstep(0.75, 0.9, sparkleBase);
        sandColor += vec3(1.0, 0.98, 0.9) * sparkle * 0.4;
        
        // Occasional darker grains/pebbles
        float pebbles = snoise(vUv * 200.0);
        pebbles = smoothstep(0.8, 0.85, pebbles);
        sandColor = mix(sandColor, sandColor * 0.7, pebbles * 0.3);
        
        gl_FragColor = vec4(sandColor, 1.0);
    }
}

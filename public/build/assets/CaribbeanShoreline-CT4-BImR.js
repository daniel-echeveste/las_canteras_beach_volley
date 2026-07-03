import{r as c,j as a}from"./app-CtYAKjJz.js";import{u,C as o}from"./events-776716bd.esm-BWDsjMVD.js";import{P as f}from"./shapes-BSeGxU6s.js";import"./extends-CF3RwP-h.js";var x=`varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uShorelinePosition; 

void main() {
    vUv = uv;
    vec3 pos = position;
    
    
    float distFromShore = vUv.y - uShorelinePosition;
    
    
    if (distFromShore < 0.0) {
        float oceanDepth = abs(distFromShore);
        
        
        
        float wave1 = sin(vUv.x * 8.0 - uTime * 1.5 + oceanDepth * 20.0) * 0.3;
        float wave2 = sin(vUv.x * 15.0 - uTime * 2.0 + oceanDepth * 15.0) * 0.15;
        float wave3 = sin(vUv.x * 25.0 - uTime * 2.5) * 0.08;
        
        
        float waveAmplitude = smoothstep(0.0, 0.3, oceanDepth);
        
        pos.z += (wave1 + wave2 + wave3) * waveAmplitude;
    }
    
    
    if (distFromShore > 0.0) {
        float sandWave = sin(vUv.x * 3.0) * sin(vUv.y * 5.0) * 0.05;
        pos.z += sandWave * smoothstep(0.0, 0.2, distFromShore);
    }
    
    vWorldPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,d=`varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uTime;
uniform float uShorelinePosition;
uniform vec3 uSandColor;
uniform vec3 uShallowWaterColor;
uniform vec3 uDeepWaterColor;

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
    
    
    if (distFromShore < 0.0) {
        float oceanDepth = abs(distFromShore);
        
        
        vec3 waterColor = mix(uShallowWaterColor, uDeepWaterColor, smoothstep(0.0, 0.4, oceanDepth));
        
        
        float caustics = snoise(vUv * 30.0 + vec2(uTime * 0.3, uTime * 0.2));
        caustics = pow(abs(caustics), 2.0) * 0.25;
        waterColor += vec3(0.1, 0.15, 0.1) * caustics;
        
        
        float wavePhase = sin(vUv.x * 18.0 - uTime * 2.5 + oceanDepth * 25.0);
        float foam = smoothstep(0.6, 1.0, wavePhase);
        foam *= smoothstep(0.15, 0.0, oceanDepth);
        
        
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
    
    else if (distFromShore < 0.08) {
        float wetness = 1.0 - (distFromShore / 0.08);
        
        vec3 wetSandColor = uSandColor * 0.6;
        vec3 color = mix(uSandColor, wetSandColor, wetness * 0.8);
        
        float reflection = wetness * 0.25 * (0.5 + 0.5 * sin(uTime * 2.0));
        color = mix(color, uShallowWaterColor * 1.2, reflection);
        
        
        float grain = snoise(vUv * 120.0) * 0.06 + snoise(vUv * 50.0) * 0.04;
        color *= (1.0 - grain * wetness);
        
        float wash = sin(uTime * 1.5) * 0.5 + 0.5;
        float washLine = smoothstep(0.04 + wash * 0.04, 0.02 + wash * 0.04, distFromShore);
        color = mix(color, uShallowWaterColor * 0.9, washLine * 0.5);
        
        gl_FragColor = vec4(color, 1.0);
    }
    
    else {
        vec3 sandColor = uSandColor;
        
        
        float dunes = fbm(vUv * 6.0, 3) * 0.1;           
        float texture = snoise(vUv * 40.0) * 0.1;         
        float fineGrain = snoise(vUv * 100.0) * 0.06;     
        float microGrain = snoise(vUv * 180.0) * 0.03;    
        
        sandColor *= (1.0 + dunes + texture + fineGrain + microGrain);
        
        
        float colorVar = fbm(vUv * 12.0, 4);
        vec3 darkSand = sandColor * 0.85;
        vec3 lightSand = sandColor * 1.1;
        sandColor = mix(darkSand, lightSand, colorVar * 0.5 + 0.5);
        
        
        float sparkleBase = snoise(vUv * 150.0 + vec2(uTime * 0.03, 0.0));
        float sparkle = smoothstep(0.75, 0.9, sparkleBase);
        sandColor += vec3(1.0, 0.98, 0.9) * sparkle * 0.4;
        
        
        float pebbles = snoise(vUv * 200.0);
        pebbles = smoothstep(0.8, 0.85, pebbles);
        sandColor = mix(sandColor, sandColor * 0.7, pebbles * 0.3);
        
        gl_FragColor = vec4(sandColor, 1.0);
    }
}`;function g({position:r=[0,0,0],size:e=[200,150],shorelinePosition:t=.5,sandColor:i="#f5deb3",shallowWaterColor:s="#40E0D0",deepWaterColor:l="#006994",...v}){const n=c.useRef();return u((h,m)=>{n.current&&(n.current.material.uniforms.uTime.value+=m)}),a.jsx(f,{ref:n,args:[e[0],e[1],128,128],rotation:[-Math.PI/2,0,Math.PI],position:r,receiveShadow:!0,...v,children:a.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uShorelinePosition:{value:t},uSandColor:{value:new o(i)},uShallowWaterColor:{value:new o(s)},uDeepWaterColor:{value:new o(l)}},vertexShader:x,fragmentShader:d,transparent:!0})})}export{g as default};

import{r as c,j as e}from"./app-BnGFERzL.js";import{u,C as n}from"./events-776716bd.esm-3GYt-qZn.js";import{P as f}from"./shapes-Ct9QN4oA.js";import"./extends-CF3RwP-h.js";var x=`varying vec2 vUv;\r
varying vec3 vWorldPosition;\r
uniform float uTime;\r
uniform float uShorelinePosition; 

void main() {\r
    vUv = uv;\r
    vec3 pos = position;\r
    \r
    
    float distFromShore = vUv.y - uShorelinePosition;\r
    \r
    
    if (distFromShore < 0.0) {\r
        float oceanDepth = abs(distFromShore);\r
        \r
        
        
        float wave1 = sin(vUv.x * 8.0 - uTime * 1.5 + oceanDepth * 20.0) * 0.3;\r
        float wave2 = sin(vUv.x * 15.0 - uTime * 2.0 + oceanDepth * 15.0) * 0.15;\r
        float wave3 = sin(vUv.x * 25.0 - uTime * 2.5) * 0.08;\r
        \r
        
        float waveAmplitude = smoothstep(0.0, 0.3, oceanDepth);\r
        \r
        pos.z += (wave1 + wave2 + wave3) * waveAmplitude;\r
    }\r
    \r
    
    if (distFromShore > 0.0) {\r
        float sandWave = sin(vUv.x * 3.0) * sin(vUv.y * 5.0) * 0.05;\r
        pos.z += sandWave * smoothstep(0.0, 0.2, distFromShore);\r
    }\r
    \r
    vWorldPosition = pos;\r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,d=`varying vec2 vUv;\r
varying vec3 vWorldPosition;\r
uniform float uTime;\r
uniform float uShorelinePosition;\r
uniform vec3 uSandColor;\r
uniform vec3 uShallowWaterColor;\r
uniform vec3 uDeepWaterColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\r
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\r
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {\r
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,\r
                        -0.577350269189626, 0.024390243902439);\r
    vec2 i  = floor(v + dot(v, C.yy));\r
    vec2 x0 = v - i + dot(i, C.xx);\r
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\r
    vec4 x12 = x0.xyxy + C.xxzz;\r
    x12.xy -= i1;\r
    i = mod289(i);\r
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\r
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\r
    m = m*m; m = m*m;\r
    vec3 x = 2.0 * fract(p * C.www) - 1.0;\r
    vec3 h = abs(x) - 0.5;\r
    vec3 ox = floor(x + 0.5);\r
    vec3 a0 = x - ox;\r
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\r
    vec3 g;\r
    g.x = a0.x * x0.x + h.x * x0.y;\r
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r
    return 130.0 * dot(m, g);\r
}

float fbm(vec2 st, int octaves) {\r
    float value = 0.0;\r
    float amplitude = 0.5;\r
    for (int i = 0; i < 6; i++) {\r
        if (i >= octaves) break;\r
        value += amplitude * snoise(st);\r
        st *= 2.0;\r
        amplitude *= 0.5;\r
    }\r
    return value;\r
}

void main() {\r
    float distFromShore = vUv.y - uShorelinePosition;\r
    \r
    
    if (distFromShore < 0.0) {\r
        float oceanDepth = abs(distFromShore);\r
        \r
        
        vec3 waterColor = mix(uShallowWaterColor, uDeepWaterColor, smoothstep(0.0, 0.4, oceanDepth));\r
        \r
        
        float caustics = snoise(vUv * 30.0 + vec2(uTime * 0.3, uTime * 0.2));\r
        caustics = pow(abs(caustics), 2.0) * 0.25;\r
        waterColor += vec3(0.1, 0.15, 0.1) * caustics;\r
        \r
        
        float wavePhase = sin(vUv.x * 18.0 - uTime * 2.5 + oceanDepth * 25.0);\r
        float foam = smoothstep(0.6, 1.0, wavePhase);\r
        foam *= smoothstep(0.15, 0.0, oceanDepth);\r
        \r
        
        float breakingWave = sin(uTime * 1.5) * 0.02 + 0.03;\r
        float waveLine = smoothstep(breakingWave + 0.02, breakingWave, oceanDepth);\r
        waveLine *= smoothstep(breakingWave - 0.02, breakingWave, oceanDepth);\r
        foam += waveLine * 0.8;\r
        \r
        float foamNoise = snoise(vUv * 60.0 + uTime * 0.3);\r
        foam *= smoothstep(-0.3, 0.5, foamNoise);\r
        \r
        waterColor = mix(waterColor, vec3(1.0, 1.0, 1.0), foam * 0.9);\r
        float alpha = 0.75 + oceanDepth * 0.25;\r
        \r
        gl_FragColor = vec4(waterColor, alpha);\r
    }\r
    
    else if (distFromShore < 0.08) {\r
        float wetness = 1.0 - (distFromShore / 0.08);\r
        \r
        vec3 wetSandColor = uSandColor * 0.6;\r
        vec3 color = mix(uSandColor, wetSandColor, wetness * 0.8);\r
        \r
        float reflection = wetness * 0.25 * (0.5 + 0.5 * sin(uTime * 2.0));\r
        color = mix(color, uShallowWaterColor * 1.2, reflection);\r
        \r
        
        float grain = snoise(vUv * 120.0) * 0.06 + snoise(vUv * 50.0) * 0.04;\r
        color *= (1.0 - grain * wetness);\r
        \r
        float wash = sin(uTime * 1.5) * 0.5 + 0.5;\r
        float washLine = smoothstep(0.04 + wash * 0.04, 0.02 + wash * 0.04, distFromShore);\r
        color = mix(color, uShallowWaterColor * 0.9, washLine * 0.5);\r
        \r
        gl_FragColor = vec4(color, 1.0);\r
    }\r
    
    else {\r
        vec3 sandColor = uSandColor;\r
        \r
        
        float dunes = fbm(vUv * 6.0, 3) * 0.1;           
        float texture = snoise(vUv * 40.0) * 0.1;         
        float fineGrain = snoise(vUv * 100.0) * 0.06;     
        float microGrain = snoise(vUv * 180.0) * 0.03;    
        \r
        sandColor *= (1.0 + dunes + texture + fineGrain + microGrain);\r
        \r
        
        float colorVar = fbm(vUv * 12.0, 4);\r
        vec3 darkSand = sandColor * 0.85;\r
        vec3 lightSand = sandColor * 1.1;\r
        sandColor = mix(darkSand, lightSand, colorVar * 0.5 + 0.5);\r
        \r
        
        float sparkleBase = snoise(vUv * 150.0 + vec2(uTime * 0.03, 0.0));\r
        float sparkle = smoothstep(0.75, 0.9, sparkleBase);\r
        sandColor += vec3(1.0, 0.98, 0.9) * sparkle * 0.4;\r
        \r
        
        float pebbles = snoise(vUv * 200.0);\r
        pebbles = smoothstep(0.8, 0.85, pebbles);\r
        sandColor = mix(sandColor, sandColor * 0.7, pebbles * 0.3);\r
        \r
        gl_FragColor = vec4(sandColor, 1.0);\r
    }\r
}`;function g({position:a=[0,0,0],size:o=[200,150],shorelinePosition:t=.5,sandColor:i="#f5deb3",shallowWaterColor:s="#40E0D0",deepWaterColor:l="#006994",...v}){const r=c.useRef();return u((h,m)=>{r.current&&(r.current.material.uniforms.uTime.value+=m)}),e.jsx(f,{ref:r,args:[o[0],o[1],128,128],rotation:[-Math.PI/2,0,Math.PI],position:a,receiveShadow:!0,...v,children:e.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uShorelinePosition:{value:t},uSandColor:{value:new n(i)},uShallowWaterColor:{value:new n(s)},uDeepWaterColor:{value:new n(l)}},vertexShader:x,fragmentShader:d,transparent:!0})})}export{g as default};

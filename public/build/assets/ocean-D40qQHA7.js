import{r as f,j as e}from"./app-BNNdsKan.js";import{u as p,C as o,V as d}from"./events-776716bd.esm-PPlkp2jz.js";var y=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying float vWaveHeight;\r
uniform float uTime;

vec3 gerstnerWave(vec2 coord, float wavelength, float steepness, vec2 direction, float time) {\r
    float k = 2.0 * 3.14159 / wavelength;\r
    float c = sqrt(9.8 / k);\r
    vec2 d = normalize(direction);\r
    float f = k * (dot(d, coord) - c * time);\r
    float a = steepness / k;\r
    \r
    return vec3(\r
        d.x * a * cos(f),\r
        a * sin(f),\r
        d.y * a * cos(f)\r
    );\r
}

void main() {\r
    vUv = uv;\r
    vec3 pos = position;\r
    \r
    
    vec3 wave1 = gerstnerWave(pos.xy, 30.0, 0.15, vec2(1.0, 0.3), uTime * 0.8);\r
    vec3 wave2 = gerstnerWave(pos.xy, 20.0, 0.1, vec2(0.8, 0.6), uTime * 1.2);\r
    vec3 wave3 = gerstnerWave(pos.xy, 12.0, 0.08, vec2(0.5, 1.0), uTime * 1.5);\r
    vec3 wave4 = gerstnerWave(pos.xy, 8.0, 0.05, vec2(-0.3, 0.9), uTime * 0.6);\r
    \r
    vec3 totalWave = wave1 + wave2 + wave3 + wave4;\r
    \r
    pos.x += totalWave.x;\r
    pos.z += totalWave.y;  
    pos.y += totalWave.z;\r
    \r
    
    vWaveHeight = totalWave.y;\r
    vPosition = pos;\r
    \r
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,C=`varying vec2 vUv;\r
varying vec3 vPosition;\r
varying float vWaveHeight;\r
uniform float uTime;\r
uniform vec3 uColor1;\r
uniform vec3 uColor2;\r
uniform vec3 uSunPosition;

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

void main() {\r
    
    vec3 deepColor = uColor2;\r
    vec3 shallowColor = uColor1;\r
    \r
    
    float depthFactor = smoothstep(-0.5, 0.5, vWaveHeight);\r
    vec3 baseColor = mix(deepColor, shallowColor, depthFactor);\r
    \r
    
    float colorVariation = sin(vUv.x * 15.0 + uTime * 0.5) * 0.5 + 0.5;\r
    colorVariation *= sin(vUv.y * 10.0 + uTime * 0.3) * 0.5 + 0.5;\r
    baseColor = mix(baseColor, shallowColor * 1.2, colorVariation * 0.15);\r
    \r
    
    float foam = smoothstep(0.3, 0.8, vWaveHeight);\r
    float foamNoise = snoise(vUv * 80.0 + uTime * 0.5);\r
    foamNoise += snoise(vUv * 150.0 + uTime * 0.3) * 0.5;\r
    foam *= smoothstep(-0.2, 0.5, foamNoise);\r
    \r
    
    vec3 foamColor = vec3(0.95, 0.98, 1.0);\r
    baseColor = mix(baseColor, foamColor, foam * 0.8);\r
    \r
    
    vec3 viewDirection = normalize(cameraPosition - vPosition);\r
    vec3 normal = vec3(0.0, 1.0, 0.0); 
    float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 3.0);\r
    baseColor = mix(baseColor, vec3(0.8, 0.9, 1.0), fresnel * 0.4);\r
    \r
    
    vec3 sunDir = normalize(uSunPosition);\r
    vec3 reflectDir = reflect(-sunDir, normal);\r
    float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 64.0);\r
    baseColor += vec3(1.0, 0.95, 0.8) * specular * 0.6;\r
    \r
    
    float caustics = snoise(vUv * 30.0 + uTime * 0.2);\r
    caustics = pow(abs(caustics), 2.0);\r
    baseColor += vec3(0.1, 0.15, 0.2) * caustics * 0.3;\r
    \r
    
    float alpha = 0.85 + foam * 0.1;\r
    \r
    gl_FragColor = vec4(baseColor, alpha);\r
}`;function W({position:n=[0,-2,0],rotation:a=[-Math.PI/2,0,0],args:v=[100,100,64,64],color1:t="#0080cc",color2:i="#003380",sunPosition:s=[50,100,50],...c}){const r=f.useRef();p((w,u)=>{r.current&&(r.current.material.uniforms.uTime.value+=u)});const l=new o(t),m=new o(i),x=new d(...s);return e.jsxs("mesh",{ref:r,rotation:a,position:n,...c,children:[e.jsx("planeGeometry",{args:v}),e.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor1:{value:l},uColor2:{value:m},uSunPosition:{value:x}},vertexShader:y,fragmentShader:C,transparent:!0,wireframe:!1})]})}export{W as default};

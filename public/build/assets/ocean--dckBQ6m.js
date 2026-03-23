import{r as f,j as o}from"./app-BIy-4LZa.js";import{u as p,C as n,V as d}from"./events-776716bd.esm-BpfZRcvg.js";var y=`varying vec2 vUv;
varying vec3 vPosition;
varying float vWaveHeight;
uniform float uTime;

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
    
    
    vec3 wave1 = gerstnerWave(pos.xy, 30.0, 0.15, vec2(1.0, 0.3), uTime * 0.8);
    vec3 wave2 = gerstnerWave(pos.xy, 20.0, 0.1, vec2(0.8, 0.6), uTime * 1.2);
    vec3 wave3 = gerstnerWave(pos.xy, 12.0, 0.08, vec2(0.5, 1.0), uTime * 1.5);
    vec3 wave4 = gerstnerWave(pos.xy, 8.0, 0.05, vec2(-0.3, 0.9), uTime * 0.6);
    
    vec3 totalWave = wave1 + wave2 + wave3 + wave4;
    
    pos.x += totalWave.x;
    pos.z += totalWave.y;  
    pos.y += totalWave.z;
    
    
    vWaveHeight = totalWave.y;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,C=`varying vec2 vUv;
varying vec3 vPosition;
varying float vWaveHeight;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uSunPosition;

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

void main() {
    
    vec3 deepColor = uColor2;
    vec3 shallowColor = uColor1;
    
    
    float depthFactor = smoothstep(-0.5, 0.5, vWaveHeight);
    vec3 baseColor = mix(deepColor, shallowColor, depthFactor);
    
    
    float colorVariation = sin(vUv.x * 15.0 + uTime * 0.5) * 0.5 + 0.5;
    colorVariation *= sin(vUv.y * 10.0 + uTime * 0.3) * 0.5 + 0.5;
    baseColor = mix(baseColor, shallowColor * 1.2, colorVariation * 0.15);
    
    
    float foam = smoothstep(0.3, 0.8, vWaveHeight);
    float foamNoise = snoise(vUv * 80.0 + uTime * 0.5);
    foamNoise += snoise(vUv * 150.0 + uTime * 0.3) * 0.5;
    foam *= smoothstep(-0.2, 0.5, foamNoise);
    
    
    vec3 foamColor = vec3(0.95, 0.98, 1.0);
    baseColor = mix(baseColor, foamColor, foam * 0.8);
    
    
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    vec3 normal = vec3(0.0, 1.0, 0.0); 
    float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 3.0);
    baseColor = mix(baseColor, vec3(0.8, 0.9, 1.0), fresnel * 0.4);
    
    
    vec3 sunDir = normalize(uSunPosition);
    vec3 reflectDir = reflect(-sunDir, normal);
    float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 64.0);
    baseColor += vec3(1.0, 0.95, 0.8) * specular * 0.6;
    
    
    float caustics = snoise(vUv * 30.0 + uTime * 0.2);
    caustics = pow(abs(caustics), 2.0);
    baseColor += vec3(0.1, 0.15, 0.2) * caustics * 0.3;
    
    
    float alpha = 0.85 + foam * 0.1;
    
    gl_FragColor = vec4(baseColor, alpha);
}`;function W({position:a=[0,-2,0],rotation:r=[-Math.PI/2,0,0],args:v=[100,100,64,64],color1:t="#0080cc",color2:i="#003380",sunPosition:s=[50,100,50],...c}){const e=f.useRef();p((w,u)=>{e.current&&(e.current.material.uniforms.uTime.value+=u)});const l=new n(t),m=new n(i),x=new d(...s);return o.jsxs("mesh",{ref:e,rotation:r,position:a,...c,children:[o.jsx("planeGeometry",{args:v}),o.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor1:{value:l},uColor2:{value:m},uSunPosition:{value:x}},vertexShader:y,fragmentShader:C,transparent:!0,wireframe:!1})]})}export{W as default};

import{r as a,j as e}from"./app-BrDPs7py.js";import{u as i,V as l,C as s}from"./events-776716bd.esm-Ep0sZkZd.js";import{P as u}from"./shapes-Cs0JVkJN.js";import"./extends-CF3RwP-h.js";var v=`varying vec2 vUv;\r
uniform float uTime;

void main() {\r
  vUv = uv;\r
  vec3 pos = position;\r
  \r
  
  
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,f=`varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSunPosition;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    
    vec3 sandColor = uColor;
    
    
    float n1 = noise(vUv * 80.0);   
    float n2 = noise(vUv * 40.0);   
    float n3 = fbm(vUv * 20.0);     
    
    
    float combinedNoise = n1 * 0.3 + n2 * 0.4 + n3 * 0.3;
    
    
    vec3 darkSand = sandColor * 0.75;
    vec3 lightSand = sandColor * 1.15;
    vec3 texturedColor = mix(darkSand, lightSand, combinedNoise);
    
    
    float sparkleNoise = noise(vUv * 500.0 + uTime * 0.1);
    float sparkle = pow(sparkleNoise, 15.0); 
    sparkle *= sin(uTime * 3.0 + vUv.x * 100.0) * 0.5 + 0.5; 
    vec3 sparkleColor = vec3(1.0, 0.98, 0.9);
    texturedColor = mix(texturedColor, sparkleColor, sparkle * 0.8);
    
    
    float wetness = smoothstep(0.0, 0.15, vUv.y);
    wetness = 1.0 - wetness;
    
    
    vec3 wetSandColor = sandColor * 0.6;
    wetSandColor = mix(wetSandColor, vec3(0.4, 0.35, 0.25), 0.3);
    texturedColor = mix(wetSandColor, texturedColor, 1.0 - wetness * 0.8);
    
    
    float wetSpecular = wetness * pow(sparkleNoise, 3.0) * 0.3;
    texturedColor += vec3(0.8, 0.85, 0.9) * wetSpecular;
    
    
    float footprints = noise(vUv * 8.0 + vec2(1.5, 2.3));
    footprints = smoothstep(0.4, 0.6, footprints);
    texturedColor = mix(texturedColor, texturedColor * 0.9, footprints * 0.2);
    
    gl_FragColor = vec4(texturedColor, 1.0);
}`;function C({sunPosition:o=[50,100,50],...r}){const n=a.useRef();return i((d,t)=>{n.current&&(n.current.material.uniforms.uTime.value+=t)}),e.jsx(u,{ref:n,args:[200,100,128,128],rotation:[-Math.PI/2,0,0],receiveShadow:!0,...r,children:e.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor:{value:new s("#f2d2a9")},uSunPosition:{value:new l(...o)}},vertexShader:v,fragmentShader:f})})}export{C as default};

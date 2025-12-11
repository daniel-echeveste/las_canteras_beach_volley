import{r as a,j as n}from"./app-BNNdsKan.js";import{u as i,V as l,C as s}from"./events-776716bd.esm-PPlkp2jz.js";import{P as u}from"./shapes-C86F8Gi-.js";import"./extends-CF3RwP-h.js";var v=`varying vec2 vUv;\r
uniform float uTime;

void main() {\r
  vUv = uv;\r
  vec3 pos = position;\r
  \r
  
  
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,f=`varying vec2 vUv;\r
uniform float uTime;\r
uniform vec3 uColor;\r
uniform vec3 uSunPosition;

float random(vec2 st) {\r
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\r
}

float noise(vec2 st) {\r
    vec2 i = floor(st);\r
    vec2 f = fract(st);

    
    float a = random(i);\r
    float b = random(i + vec2(1.0, 0.0));\r
    float c = random(i + vec2(0.0, 1.0));\r
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +\r
            (c - a)* u.y * (1.0 - u.x) +\r
            (d - b) * u.x * u.y;\r
}

float fbm(vec2 st) {\r
    float value = 0.0;\r
    float amplitude = 0.5;\r
    float frequency = 1.0;\r
    \r
    for (int i = 0; i < 5; i++) {\r
        value += amplitude * noise(st * frequency);\r
        frequency *= 2.0;\r
        amplitude *= 0.5;\r
    }\r
    return value;\r
}

void main() {\r
    
    vec3 sandColor = uColor;\r
    \r
    
    float n1 = noise(vUv * 80.0);   
    float n2 = noise(vUv * 40.0);   
    float n3 = fbm(vUv * 20.0);     
    \r
    
    float combinedNoise = n1 * 0.3 + n2 * 0.4 + n3 * 0.3;\r
    \r
    
    vec3 darkSand = sandColor * 0.75;\r
    vec3 lightSand = sandColor * 1.15;\r
    vec3 texturedColor = mix(darkSand, lightSand, combinedNoise);\r
    \r
    
    float sparkleNoise = noise(vUv * 500.0 + uTime * 0.1);\r
    float sparkle = pow(sparkleNoise, 15.0); 
    sparkle *= sin(uTime * 3.0 + vUv.x * 100.0) * 0.5 + 0.5; 
    vec3 sparkleColor = vec3(1.0, 0.98, 0.9);\r
    texturedColor = mix(texturedColor, sparkleColor, sparkle * 0.8);\r
    \r
    
    float wetness = smoothstep(0.0, 0.15, vUv.y);\r
    wetness = 1.0 - wetness;\r
    \r
    
    vec3 wetSandColor = sandColor * 0.6;\r
    wetSandColor = mix(wetSandColor, vec3(0.4, 0.35, 0.25), 0.3);\r
    texturedColor = mix(wetSandColor, texturedColor, 1.0 - wetness * 0.8);\r
    \r
    
    float wetSpecular = wetness * pow(sparkleNoise, 3.0) * 0.3;\r
    texturedColor += vec3(0.8, 0.85, 0.9) * wetSpecular;\r
    \r
    
    float footprints = noise(vUv * 8.0 + vec2(1.5, 2.3));\r
    footprints = smoothstep(0.4, 0.6, footprints);\r
    texturedColor = mix(texturedColor, texturedColor * 0.9, footprints * 0.2);\r
    \r
    gl_FragColor = vec4(texturedColor, 1.0);\r
}`;function C({sunPosition:e=[50,100,50],...o}){const r=a.useRef();return i((d,t)=>{r.current&&(r.current.material.uniforms.uTime.value+=t)}),n.jsx(u,{ref:r,args:[200,100,128,128],rotation:[-Math.PI/2,0,0],receiveShadow:!0,...o,children:n.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor:{value:new s("#f2d2a9")},uSunPosition:{value:new l(...e)}},vertexShader:v,fragmentShader:f})})}export{C as default};

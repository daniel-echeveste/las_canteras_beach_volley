import{r as a,j as n}from"./app-D9oCCLFU.js";import{x as t,G as i}from"./events-776716bd.esm-C9jZLqK3.js";import{P as v}from"./shapes-Hi74h9fd.js";import"./extends-CF3RwP-h.js";var u=`varying vec2 vUv;\r
uniform float uTime;

void main() {\r
  vUv = uv;\r
  vec3 pos = position;\r
  \r
  
  
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
}`,f=`varying vec2 vUv;\r
uniform float uTime;\r
uniform vec3 uColor;

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

void main() {\r
    
    vec3 color = uColor;\r
    \r
    
    float n = noise(vUv * 50.0); 
    \r
    
    color = mix(color, color * 0.8, n * 0.3);\r
    \r
    gl_FragColor = vec4(color, 1.0);\r
}`;function x(o){const r=a.useRef();return t((c,e)=>{r.current&&(r.current.material.uniforms.uTime.value+=e)}),n.jsx(v,{ref:r,args:[200,100,64,64],rotation:[-Math.PI/2,0,0],receiveShadow:!0,...o,children:n.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor:{value:new i("#f2d2a9")}},vertexShader:u,fragmentShader:f})})}export{x as default};

import{j as r}from"./app-D9oCCLFU.js";import{P as e}from"./shapes-Hi74h9fd.js";import"./extends-CF3RwP-h.js";var i=`varying vec2 vUv;

void main() {\r
  vUv = uv;\r
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}`,v=`varying vec2 vUv;

void main() {\r
    
    vec2 brickSize = vec2(0.1, 0.05); 
    vec2 jointSize = vec2(0.01, 0.01); 
    \r
    
    vec2 uv = vUv * vec2(50.0, 10.0); 
    \r
    
    if (fract(uv.y * 0.5) > 0.5) {\r
        uv.x += 0.5;\r
    }\r
    \r
    
    vec2 st = fract(uv);\r
    vec2 brick = step(jointSize, st);\r
    float isBrick = brick.x * brick.y;\r
    \r
    
    vec3 brickColor = vec3(0.8, 0.3, 0.2); 
    vec3 jointColor = vec3(0.9, 0.9, 0.9); 
    \r
    
    vec3 color = mix(jointColor, brickColor, isBrick);\r
    \r
    gl_FragColor = vec4(color, 1.0);\r
}`;function a(n){return r.jsx(e,{args:[500,20],rotation:[-Math.PI/2,0,0],receiveShadow:!0,...n,children:r.jsx("shaderMaterial",{vertexShader:i,fragmentShader:v})})}export{a as default};

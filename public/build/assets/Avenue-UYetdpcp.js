import{j as n}from"./app-CtYAKjJz.js";import{P as r}from"./shapes-BSeGxU6s.js";import"./extends-CF3RwP-h.js";var i=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,v=`varying vec2 vUv;

void main() {
    
    vec2 brickSize = vec2(0.1, 0.05); 
    vec2 jointSize = vec2(0.01, 0.01); 
    
    
    vec2 uv = vUv * vec2(50.0, 10.0); 
    
    
    if (fract(uv.y * 0.5) > 0.5) {
        uv.x += 0.5;
    }
    
    
    vec2 st = fract(uv);
    vec2 brick = step(jointSize, st);
    float isBrick = brick.x * brick.y;
    
    
    vec3 brickColor = vec3(0.8, 0.3, 0.2); 
    vec3 jointColor = vec3(0.9, 0.9, 0.9); 
    
    
    vec3 color = mix(jointColor, brickColor, isBrick);
    
    gl_FragColor = vec4(color, 1.0);
}`;function a(e){return n.jsx(r,{args:[500,20],rotation:[-Math.PI/2,0,0],receiveShadow:!0,...e,children:n.jsx("shaderMaterial",{vertexShader:i,fragmentShader:v})})}export{a as default};

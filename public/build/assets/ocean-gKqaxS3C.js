import{r as x,j as o}from"./app-LdkVWVao.js";import{x as p,G as r}from"./events-776716bd.esm-DQvuJuAl.js";function g({position:i=[0,-2,0],rotation:a=[-Math.PI/2,0,0],args:s=[100,100,64,64],color1:t="#0080cc",color2:u="#003380",...n}){const e=x.useRef();p((d,f)=>{e.current&&(e.current.material.uniforms.uTime.value+=f)});const m=`
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.5;
      pos.z += cos(pos.y * 2.0 + uTime) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,l=`
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    void main() {
      float mixValue = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(uColor1, uColor2, mixValue), 0.8);
    }
  `,v=new r(t),c=new r(u);return o.jsxs("mesh",{ref:e,rotation:a,position:i,...n,children:[o.jsx("planeGeometry",{args:s}),o.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor1:{value:v},uColor2:{value:c}},vertexShader:m,fragmentShader:l,transparent:!0,wireframe:!1})]})}export{g as default};

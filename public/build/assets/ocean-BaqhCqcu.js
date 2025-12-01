import{r as c,j as e}from"./app-D9S3Tyf8.js";import{x as f,G as o}from"./events-776716bd.esm-OdAoM7in.js";var x=`varying vec2 vUv;\r
    uniform float uTime;\r
    void main() {\r
      vUv = uv;\r
      vec3 pos = position;\r
      pos.z += sin(pos.x * 2.0 + uTime) * 0.5;\r
      pos.z += cos(pos.y * 2.0 + uTime) * 0.5;\r
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\r
    }`,p=`varying vec2 vUv;\r
    uniform float uTime;\r
    uniform vec3 uColor1;\r
    uniform vec3 uColor2;\r
    \r
    void main() {\r
      float mixValue = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;\r
      gl_FragColor = vec4(mix(uColor1, uColor2, mixValue), 0.8);\r
    }`;function T({position:n=[0,-2,0],rotation:a=[-Math.PI/2,0,0],args:i=[100,100,64,64],color1:t="#0080cc",color2:u="#003380",...s}){const r=c.useRef();f((d,v)=>{r.current&&(r.current.material.uniforms.uTime.value+=v)});const m=new o(t),l=new o(u);return e.jsxs("mesh",{ref:r,rotation:a,position:n,...s,children:[e.jsx("planeGeometry",{args:i}),e.jsx("shaderMaterial",{uniforms:{uTime:{value:0},uColor1:{value:m},uColor2:{value:l}},vertexShader:x,fragmentShader:p,transparent:!0,wireframe:!1})]})}export{T as default};

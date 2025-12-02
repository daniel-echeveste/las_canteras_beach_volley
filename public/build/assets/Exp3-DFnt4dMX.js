import{j as e,S as a,r as s}from"./app-h5-eNdo8.js";import{C as i,O as o}from"./OrbitControls-QJfiTeH5.js";import{N as n}from"./Navbar-Bf4HSaqs.js";import{S as l,a as m}from"./Stars-CB44Xdu9.js";import{x as c}from"./events-776716bd.esm-BoyXepgW.js";import"./extends-CF3RwP-h.js";import"./constants-B3Wxu9NC.js";function x(){const t=s.useRef();return c((v,r)=>{t.current.material.uniforms.uTime.value+=r}),e.jsxs("mesh",{ref:t,rotation:[-Math.PI/2,0,0],position:[0,-2,0],children:[e.jsx("planeGeometry",{args:[100,100,64,64]}),e.jsx("shaderMaterial",{uniforms:{uTime:{value:0}},vertexShader:`
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.5;
      pos.z += cos(pos.y * 2.0 + uTime) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,fragmentShader:`
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec3 color1 = vec3(0.0, 0.5, 0.8);
      vec3 color2 = vec3(0.0, 0.2, 0.5);
      float mixValue = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
      gl_FragColor = vec4(mix(color1, color2, mixValue), 0.8);
    }
  `,transparent:!0,wireframe:!1})]})}function y(){return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Exp 3: Ocean Sunset"}),e.jsxs("div",{className:"h-screen w-full bg-black",children:[e.jsx(n,{}),e.jsxs(i,{camera:{position:[0,5,10],fov:45},children:[e.jsx("ambientLight",{intensity:.2}),e.jsx(x,{}),e.jsx(l,{sunPosition:[100,10,100],turbidity:.1,rayleigh:.5,mieCoefficient:.005,mieDirectionalG:.8}),e.jsx(m,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),e.jsx(o,{maxPolarAngle:Math.PI/2-.1})]}),e.jsxs("div",{className:"absolute bottom-10 left-0 w-full text-center pointer-events-none",children:[e.jsx("h1",{className:"text-4xl font-extrabold text-white drop-shadow-lg",children:"Experiencia 3: Atardecer en el Mar"}),e.jsx("p",{className:"text-white/80 text-lg mt-2",children:"La calma después del partido."})]})]})]})}export{y as default};

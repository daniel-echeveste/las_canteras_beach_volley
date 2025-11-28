import{r as t,j as e,S as M}from"./app-LdkVWVao.js";import{C as w,O as C}from"./OrbitControls-B5jvPzlu.js";import{N as E}from"./Navbar-iJnrdgRy.js";import{S as P}from"./Sky-C12OCpJz.js";import{K as A,G as z,x as d,Q as T,V as _,X as F,S as V}from"./events-776716bd.esm-DQvuJuAl.js";import"./extends-CF3RwP-h.js";import"./constants-fs86oH6b.js";const N=()=>parseInt(A.replace(/\D+/g,"")),I=N();class O extends V{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${I>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}const R=r=>new _().setFromSpherical(new F(r,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),G=t.forwardRef(({radius:r=100,depth:o=50,count:a=5e3,saturation:l=0,factor:i=4,fade:v=!1,speed:p=1},x)=>{const c=t.useRef(),[h,g,b]=t.useMemo(()=>{const s=[],u=[],j=Array.from({length:a},()=>(.5+.5*Math.random())*i),n=new z;let f=r+o;const y=o/a;for(let m=0;m<a;m++)f-=y*Math.random(),s.push(...R(f).toArray()),n.setHSL(m/a,l,.9),u.push(n.r,n.g,n.b);return[new Float32Array(s),new Float32Array(u),new Float32Array(j)]},[a,o,i,r,l]);d(s=>c.current&&(c.current.uniforms.time.value=s.clock.elapsedTime*p));const[S]=t.useState(()=>new O);return t.createElement("points",{ref:x},t.createElement("bufferGeometry",null,t.createElement("bufferAttribute",{attach:"attributes-position",args:[h,3]}),t.createElement("bufferAttribute",{attach:"attributes-color",args:[g,3]}),t.createElement("bufferAttribute",{attach:"attributes-size",args:[b,1]})),t.createElement("primitive",{ref:c,object:S,attach:"material",blending:T,"uniforms-fade-value":v,depthWrite:!1,transparent:!0,vertexColors:!0}))});function U(){const r=t.useRef();return d((l,i)=>{r.current.material.uniforms.uTime.value+=i}),e.jsxs("mesh",{ref:r,rotation:[-Math.PI/2,0,0],position:[0,-2,0],children:[e.jsx("planeGeometry",{args:[100,100,64,64]}),e.jsx("shaderMaterial",{uniforms:{uTime:{value:0}},vertexShader:`
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
  `,transparent:!0,wireframe:!1})]})}function W(){return e.jsxs(e.Fragment,{children:[e.jsx(M,{title:"Exp 3: Ocean Sunset"}),e.jsxs("div",{className:"h-screen w-full bg-black",children:[e.jsx(E,{}),e.jsxs(w,{camera:{position:[0,5,10],fov:45},children:[e.jsx("ambientLight",{intensity:.2}),e.jsx(U,{}),e.jsx(P,{sunPosition:[100,10,100],turbidity:.1,rayleigh:.5,mieCoefficient:.005,mieDirectionalG:.8}),e.jsx(G,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),e.jsx(C,{maxPolarAngle:Math.PI/2-.1})]}),e.jsxs("div",{className:"absolute bottom-10 left-0 w-full text-center pointer-events-none",children:[e.jsx("h1",{className:"text-4xl font-extrabold text-white drop-shadow-lg",children:"Experiencia 3: Atardecer en el Mar"}),e.jsx("p",{className:"text-white/80 text-lg mt-2",children:"La calma después del partido."})]})]})]})}export{W as default};

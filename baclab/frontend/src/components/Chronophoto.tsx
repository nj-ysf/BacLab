import {useEffect,useMemo,useRef,useState} from 'react';
import {solve} from '../utils/physics';

// Live chronophotograph: positions M0..Mn every τ, computed by the same deterministic engine as the lab.
const V0=15, G=9.81, TAU=0.15, ANGLES=[45,62,30,70,52];
type Size={w:number;h:number};
type Mark={x:number;y:number};
const fmt=(v:number)=>v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function layout({w,h}:Size){
 // One scale for every angle, so ranges and heights stay physically comparable between launches.
 const pad=w<600?18:44, ground=h-(w<600?34:56);
 const r45=V0*V0/G, hTop=(V0*Math.sin(72*Math.PI/180))**2/(2*G);
 const scale=Math.min((w-pad*2)*0.92/r45,(ground-24)*0.9/hTop);
 return {pad,ground,scale,ox:pad+(w<600?6:10)};
}

export function Chronophoto({labels}:{labels:{t:string;hint:string;range:string;height:string;legendV:string;legendG:string;legendM:string;square:string}}){
 const box=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState<Size>({w:760,h:520});
 const [angle,setAngle]=useState(ANGLES[0]);
 const [marks,setMarks]=useState<Mark[]>([]);
 const [landed,setLanded]=useState(false);
 const ball=useRef<SVGCircleElement>(null),vel=useRef<SVGLineElement>(null),grav=useRef<SVGLineElement>(null),velLabel=useRef<SVGTextElement>(null),gravLabel=useRef<SVGTextElement>(null);
 const readout=useRef<Record<string,HTMLElement|null>>({});
 const cycle=useRef(0);
 const {pad,ground,scale,ox}=layout(size);
 const result=useMemo(()=>solve('projectile_motion',{initial_speed:V0,launch_angle:angle,initial_height:0,gravity:G}),[angle]);
 const small=size.w<600;
 const px=(x:number)=>ox+x*scale, py=(y:number)=>ground-y*scale;
 const path=useMemo(()=>result.samples.map((s,i)=>`${i?'L':'M'}${(ox+s.x*scale).toFixed(1)} ${(ground-s.y*scale).toFixed(1)}`).join(''),[result,ox,scale,ground]);

 useEffect(()=>{const el=box.current;if(!el)return;const ro=new ResizeObserver(([e])=>setSize({w:Math.round(e.contentRect.width),h:Math.round(e.contentRect.height)}));ro.observe(el);return()=>ro.disconnect()},[]);

 useEffect(()=>{
  const el=box.current;if(!el)return;
  const k=(small?42:72)/V0;
  const draw=(t:number)=>{const s=result.at(t);const bx=px(s.x),by=py(s.y);const show=t<result.time||result.time===0?'visible':'hidden';for(const el of [vel.current,grav.current,velLabel.current,gravLabel.current])el?.setAttribute('visibility',show);
   ball.current?.setAttribute('cx',String(bx));ball.current?.setAttribute('cy',String(by));
   const vx=bx+s.vx*k,vy=by-s.vy*k;vel.current?.setAttribute('x1',String(bx));vel.current?.setAttribute('y1',String(by));vel.current?.setAttribute('x2',String(vx));vel.current?.setAttribute('y2',String(vy));
   velLabel.current?.setAttribute('x',String(vx+6));velLabel.current?.setAttribute('y',String(vy-6));
   const gl=small?26:40;grav.current?.setAttribute('x1',String(bx));grav.current?.setAttribute('y1',String(by));grav.current?.setAttribute('x2',String(bx));grav.current?.setAttribute('y2',String(by+gl));
   gravLabel.current?.setAttribute('x',String(bx+7));gravLabel.current?.setAttribute('y',String(by+gl));
   const r=readout.current;if(r.t)r.t.textContent=fmt(s.t)+' s';if(r.x)r.x.textContent=fmt(s.x)+' m';if(r.y)r.y.textContent=fmt(s.y)+' m';if(r.v)r.v.textContent=fmt(s.velocity)+' m/s'};
  const all=Array.from({length:Math.floor(result.time/TAU)+1},(_,i)=>result.at(i*TAU)).map(s=>({x:s.x,y:s.y}));
  if(reducedMotion()){setMarks(all);setLanded(true);draw(result.peakTime);return}
  setMarks([]);setLanded(false);
  let raf=0,last=0,t=0,dropped=0,hold=0,visible=true,running=true;
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&running&&!raf){last=0;raf=requestAnimationFrame(tick)}});io.observe(el);
  function tick(now:number){raf=0;if(!visible||document.hidden){return}
   const dt=last?Math.min((now-last)/1000,0.05):0;last=now;
   if(t<result.time){t=Math.min(result.time,t+dt*0.8);while(dropped*TAU<=t+1e-9){const s=result.at(dropped*TAU);setMarks(m=>[...m,{x:s.x,y:s.y}]);dropped++}draw(t);if(t>=result.time)setLanded(true)}
   else{hold+=dt;if(hold>2.4){running=false;cycle.current=(cycle.current+1)%ANGLES.length;setAngle(ANGLES[cycle.current]);return}}
   raf=requestAnimationFrame(tick)}
  const onVis=()=>{if(!document.hidden&&visible&&running&&!raf){last=0;raf=requestAnimationFrame(tick)}};
  document.addEventListener('visibilitychange',onVis);
  draw(0);raf=requestAnimationFrame(tick);
  return()=>{running=false;cancelAnimationFrame(raf);io.disconnect();document.removeEventListener('visibilitychange',onVis)};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[result,scale,ox,ground,small]);

 function relaunch(e:React.PointerEvent<SVGSVGElement>){
  const r=e.currentTarget.getBoundingClientRect();const dx=e.clientX-r.left-ox,dy=ground-(e.clientY-r.top);
  const a=Math.round(Math.min(72,Math.max(15,Math.atan2(dy,Math.max(dx,1))*180/Math.PI)));
  setAngle(a===angle?a+1:a);
 }

 const major=scale, minor=scale/5, ticks=Array.from({length:Math.floor((size.w-ox-pad)/scale/5)+1},(_,i)=>i*5);
 const apex=result.at(result.peakTime);
 return <figure className="chrono">
  <div className="chrono-sheet" ref={box} dir="ltr">
  <svg className="chrono-plot" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} onPointerDown={relaunch} role="img" aria-label={`Chronophotographie d’un lancer à ${angle}° : positions toutes les ${TAU} s, vecteur vitesse et pesanteur.`}>
   <defs>
    <pattern id="mm-minor" width={minor} height={minor} patternUnits="userSpaceOnUse" x={ox} y={ground}><path d={`M${minor} 0H0V${minor}`} fill="none" stroke="var(--rule-minor)" strokeWidth="1"/></pattern>
    <pattern id="mm-major" width={major} height={major} patternUnits="userSpaceOnUse" x={ox} y={ground}><rect width={major} height={major} fill={minor>=6?'url(#mm-minor)':'none'}/><path d={`M${major} 0H0V${major}`} fill="none" stroke="var(--rule)" strokeWidth="1"/></pattern>
    <marker id="arrow-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--velocity)"/></marker>
    <marker id="arrow-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--gravity)"/></marker>
   </defs>
   <rect width={size.w} height={size.h} fill="url(#mm-major)"/>
   <line x1={0} x2={size.w} y1={ground} y2={ground} stroke="var(--axis)" strokeWidth="1.5"/>
   <line x1={ox} x2={ox} y1={ground} y2={12} stroke="var(--axis)" strokeWidth="1.5"/>
   {ticks.map(m=><g key={m}><line x1={px(m)} x2={px(m)} y1={ground} y2={ground+6} stroke="var(--axis)"/>{!small||m%10===0?<text x={px(m)} y={ground+(small?18:22)} className="chrono-tick">{m}</text>:null}</g>)}
   <text x={size.w-pad} y={ground-8} className="chrono-axis" textAnchor="end">x (m)</text>
   <text x={ox+8} y={22} className="chrono-axis">y (m)</text>
   <path d={path} className="chrono-path" style={{opacity:landed?0.55:0.14}}/>
   {landed&&result.peakTime>0&&<g className="chrono-measure">
    <line x1={px(apex.x)} x2={px(apex.x)} y1={ground} y2={py(apex.y)}/>
    <text x={px(apex.x)+8} y={py(apex.y)-12}>{labels.height} {fmt(result.maxHeight)} m</text>
    <line x1={px(0)} x2={px(result.range)} y1={ground-1} y2={ground-1} className="chrono-range"/><text x={px(result.range/2)} y={ground-12} textAnchor="middle">{labels.range} {fmt(result.range)} m</text>
   </g>}
   {marks.map((m,i)=><g key={i} className="chrono-mark"><circle cx={px(m.x)} cy={py(m.y)} r={small?3.2:4.6}/>{!small&&<text x={px(m.x)+7} y={py(m.y)+16}>M<tspan baselineShift="sub" fontSize="0.75em">{i}</tspan></text>}</g>)}
   <line ref={grav} className="chrono-g" markerEnd="url(#arrow-g)"/>
   <text ref={gravLabel} className="chrono-g-label">g</text>
   <line ref={vel} className="chrono-v" markerEnd="url(#arrow-v)"/>
   <text ref={velLabel} className="chrono-v-label">v</text>
   <circle ref={ball} r={small?6:9} className="chrono-ball"/>
  </svg>
  <dl className="chrono-readout" aria-live="off">
   <div><dt>θ</dt><dd>{angle}°</dd></div>
   <div><dt>{labels.t}</dt><dd ref={e=>{readout.current.t=e}}>0,00 s</dd></div>
   <div><dt>x</dt><dd ref={e=>{readout.current.x=e}}>0,00 m</dd></div>
   <div><dt>y</dt><dd ref={e=>{readout.current.y=e}}>0,00 m</dd></div>
   <div className="v"><dt>|v|</dt><dd ref={e=>{readout.current.v=e}}>{fmt(V0)} m/s</dd></div>
  </dl>
  </div>
  <figcaption>
  <ul className="chrono-legend">
   <li className="v">{labels.legendV}</li><li className="g">{labels.legendG}</li><li className="m">{labels.legendM}</li><li className="sq">{labels.square}</li>
  </ul>
  <p className="chrono-hint">{labels.hint}</p>
  </figcaption>
 </figure>;
}

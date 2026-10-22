import type {Kind,Values} from '../types';
export const fields:Record<Kind,string[]>={projectile_motion:['initial_speed','launch_angle','initial_height','gravity'],free_fall:['initial_height','initial_velocity','gravity'],uniform_motion:['initial_position','speed','duration']};
export const units:Record<string,string>={initial_speed:'m/s',launch_angle:'degree',initial_height:'m',gravity:'m/s²',initial_velocity:'m/s',initial_position:'m',speed:'m/s',duration:'s'};
export const bounds:Record<string,[number,number,number]>={initial_speed:[0,200,0.5],launch_angle:[0,90,1],initial_height:[0,1000,1],gravity:[0.1,30,0.01],initial_velocity:[-200,200,0.5],initial_position:[-1000,1000,1],speed:[-200,200,0.5],duration:[0.1,600,0.1]};
export function normalize(value:number,unit:string,field:string){
 const table:Record<string,Record<string,number>>={m:{m:1,cm:0.01,km:1000},s:{s:1,min:60,h:3600},'m/s':{'m/s':1,'km/h':1/3.6},'m/s²':{'m/s²':1,'m/s^2':1},degree:{degree:1,degrees:1,'°':1,rad:180/Math.PI,radians:180/Math.PI}};
 const factor=table[units[field]]?.[unit]; if(factor===undefined||!Number.isFinite(value))throw Error('Unité incompatible ou valeur invalide');return value*factor;
}
export function validate(kind:Kind,p:Values){return fields[kind].flatMap(k=>{const [min,max]=bounds[k];return !Number.isFinite(p[k])||p[k]<min||p[k]>max?[`${k} : ${min} ≤ valeur ≤ ${max} ${units[k]}`]:[]})}
export function solve(kind:Kind,p:Values){
 const errors=validate(kind,p);if(errors.length)throw Error(errors.join('\n'));
 const g=p.gravity,vy=kind==='projectile_motion'?p.initial_speed*Math.sin(p.launch_angle*Math.PI/180):p.initial_velocity;
 const vx=kind==='projectile_motion'?p.initial_speed*Math.cos(p.launch_angle*Math.PI/180):kind==='uniform_motion'?p.speed:0;
 const time=kind==='uniform_motion'?p.duration:(vy+Math.sqrt(vy*vy+2*g*p.initial_height))/g;
 const peakTime=kind==='uniform_motion'?0:Math.min(time,Math.max(0,vy/g));
 const at=(t:number)=>{t=Math.max(0,Math.min(time,t));const x=kind==='uniform_motion'?p.initial_position+vx*t:vx*t; const y=kind==='uniform_motion'?0:Math.max(0,p.initial_height+vy*t-0.5*g*t*t); const vY=kind==='uniform_motion'?0:vy-g*t;return {t,x,y,vx,vy:vY,velocity:Math.hypot(vx,vY)}};
 const samples=Array.from({length:121},(_,i)=>at(time*i/120));
 return {time,peakTime,vx0:vx,vy0:vy,maxHeight:at(peakTime).y,range:vx*time,finalPosition:at(time).x,distance:Math.abs(vx*time),impactVelocity:at(time).vy,samples,at};
}

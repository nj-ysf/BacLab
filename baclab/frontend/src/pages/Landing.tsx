import type {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {useApp} from '../main';
import {Chronophoto} from '../components/Chronophoto';
import type {Kind} from '../types';

// Strobe signature of each motion: equal intervals τ, so spacing alone tells the physics.
const W=240,H=150;
const figures:Record<Kind,{x:number;y:number}[]>={
 uniform_motion:Array.from({length:9},(_,i)=>({x:22+i*24.5,y:96})),
 free_fall:Array.from({length:7},(_,i)=>({x:120,y:14+0.5*9.81*(i*0.2)**2*16.5})),
 projectile_motion:Array.from({length:11},(_,i)=>{const t=i*0.2161;return {x:22+10.6*t*8.9,y:128-(10.6*t-0.5*9.81*t*t)*8.9}}),
};
const order:Kind[]=['uniform_motion','free_fall','projectile_motion'];

export function MotionFigure({kind}:{kind:Kind}){
 const pts=figures[kind];
 return <svg className="motion-figure" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
  <rect width={W} height={H} fill="url(#fig-grid)"/>
  {kind!=='free_fall'&&<line x1="10" x2={W-10} y1={kind==="uniform_motion"?110:134} y2={kind==="uniform_motion"?110:134} className="fig-ground"/>}
  {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={i===pts.length-1?6:kind==='free_fall'?3.2:4} className={i===pts.length-1?'fig-dot last':'fig-dot'} style={{'--i':i} as CSSProperties}/>)}
 </svg>;
}

export function Landing(){
 const {t}=useApp();
 return <>
  <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true"><defs><pattern id="fig-grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="var(--rule-minor)"/></pattern></defs></svg>
  <section className="stage">
   <div className="stage-copy">
    <h1>{t('hero_title')}</h1>
    <p>{t('hero_text')}</p>
    <div className="stage-actions">
     <Link className="button primary" to="/exercise">{t('hero_cta')}</Link>
     <Link className="button quiet" to="/exercise?example=projectile_motion">{t('hero_example')}</Link>
    </div>
   </div>
   <Chronophoto labels={{t:'t',hint:t('chrono_hint'),range:t('range_label'),height:t('height_label'),legendV:t('legend_v'),legendG:t('legend_g'),legendM:t('legend_m'),square:t('legend_sq')}}/>
  </section>
  <section className="motions">
   <div className="motions-intro"><h2>{t('motions_title')}</h2><p>{t('motions_text')}</p></div>
   <div className="motion-strip">
    {order.map(k=><Link key={k} to={'/exercise?example='+k} className="motion">
     <MotionFigure kind={k}/>
     <h3>{t(k)}</h3>
     <p>{t(k+'_desc')}</p>
     <span className="motion-link">{t('open_example')}</span>
    </Link>)}
   </div>
  </section>
  <section className="how">
   <h2>{t('how_title')}</h2>
   <ol>{['step1','step2','step3'].map(s=><li key={s}>{t(s)}</li>)}</ol>
  </section>
  <footer><span>BacLab</span><span>{t('footer_model')}</span></footer>
 </>;
}

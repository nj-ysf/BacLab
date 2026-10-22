import React,{createContext,lazy,Suspense,useContext,useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Link,NavLink,Navigate} from 'react-router-dom';
import {FlaskConical,Globe2} from 'lucide-react';
import type {Extraction,Lang} from './types';
import {tr} from './utils/i18n';
import {request} from './services/api';
import {InputPage,ConfirmPage} from './pages/Exercise';
import {Landing} from './pages/Landing';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import './style.css';
const Laboratory=lazy(()=>import('./pages/Laboratory'));
type Context={lang:Lang;t:(key:string)=>string;exercise:Extraction|null;setExercise:(v:Extraction)=>void;online:boolean;ai:boolean};
export const AppContext=createContext<Context>(null!);
export const useApp=()=>useContext(AppContext);
function App(){const [lang,setLang]=useState<Lang>('fr');const [exercise,setExerciseState]=useState<Extraction|null>(()=>{try{return JSON.parse(sessionStorage.getItem('baclab-exercise')||'null')}catch{return null}});const [online,setOnline]=useState(false);const [ai,setAi]=useState(false);useEffect(()=>{request('health').then(r=>{setOnline(true);setAi(r.ai_configured)}).catch(()=>{})},[]);useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr'},[lang]);const t=(k:string)=>tr(lang,k);function setExercise(v:Extraction){setExerciseState(v);sessionStorage.setItem('baclab-exercise',JSON.stringify(v))}return <AppContext.Provider value={{lang,t,exercise,setExercise,online,ai}}><div className="app-shell"><header><Link className="brand" to="/" aria-label="BacLab, accueil"><svg className="brand-mark" viewBox="0 0 34 24" aria-hidden="true"><path d="M3 21Q17 -6 31 21" className="brand-arc"/>{[[3,21],[8.6,11.6],[17,7.5],[25.4,11.6]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===3?3:2}/>)}</svg>BacLab</Link><nav><NavLink to="/" end>{t('home')}</NavLink><NavLink to="/exercise">{t('lab')}</NavLink></nav><div className="header-right"><span className={'mode'+(ai?' live':'')}><span/>{ai?t('ai_on'):t('demo')}</span><label className="language"><Globe2 size={15}/><select aria-label="Langue" value={lang} onChange={e=>setLang(e.target.value as Lang)}><option value="fr">FR</option><option value="en">EN</option><option value="ar">العربية</option></select></label></div></header><main><Suspense fallback={<div className="loading"><FlaskConical/>{t('loading')}</div>}><Routes><Route path="/" element={<Landing/>}/><Route path="/exercise" element={<InputPage/>}/><Route path="/confirm" element={exercise?<ConfirmPage/>:<Navigate to="/exercise"/>}/><Route path="/lab" element={exercise?.supported?<Laboratory/>:<Navigate to="/exercise"/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></Suspense></main></div></AppContext.Provider>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);

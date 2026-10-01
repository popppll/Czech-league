/* ══════════════════════ 0) JÁDRO: pomocné funkce, paměť, porozumění ══════════════════════ */
var VERSION='3.0';
var AI2=window.AIW_AI2, X=AI2&&AI2._x;
if(!AI2||!X){ return {version:VERSION,error:'AIW_AI2 chybí'}; }
var esc=X.esc, fold=X.fold;

function $(id){ return document.getElementById(id); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function r0(x){ return Math.round(x); }
function f1(x){ return String(Math.round(x*10)/10).replace('.',','); }
function f2(x){ return String(Math.round(x*100)/100).replace('.',','); }
function nz(x,d){ return (x==null||isNaN(x))?(d==null?0:d):+x; }
function pad2(n){ return (n<10?'0':'')+n; }
function cap(s){ s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1); }
function plur(n,a,b,c){ return n===1?a:(n>=2&&n<=4?b:c); }
function uniq(a){ var o={},r=[]; a.forEach(function(x){ if(!o[x]){ o[x]=1; r.push(x); } }); return r; }
function sum(a){ var s=0; for(var i=0;i<a.length;i++) s+=nz(a[i]); return s; }
function avg(a){ return a.length?sum(a)/a.length:0; }
function mx(a){ var m=-1e9; for(var i=0;i<a.length;i++) if(a[i]!=null&&a[i]>m) m=a[i]; return m===-1e9?null:m; }
function mn(a){ var m=1e9; for(var i=0;i<a.length;i++) if(a[i]!=null&&a[i]<m) m=a[i]; return m===1e9?null:m; }
function lsGet(k,def){ try{ var v=localStorage.getItem(k); return v==null?def:JSON.parse(v); }catch(e){ return def; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function hash(s){ return X.hashStr(String(s)); }

/* neopakující se výběr — každá „zásoba vět" si pamatuje, co řekla naposledy */
var _used={};
function say(key,arr){
  if(!arr||!arr.length) return '';
  if(arr.length===1) return arr[0];
  var u=_used[key]||(_used[key]=[]), cand=[], i;
  for(i=0;i<arr.length;i++) if(u.indexOf(i)<0) cand.push(i);
  if(!cand.length){ u.length=0; for(i=0;i<arr.length;i++) cand.push(i); }
  var k=cand[Math.floor(Math.random()*cand.length)];
  u.push(k); while(u.length>Math.min(8,arr.length-1)) u.shift();
  return arr[k];
}

/* ── globální data appky ── */
function WD(){ return window._lastWeatherData||null; }
function HOME(){ return window._homeCity||null; }
function MODEL(){ return X.cur?X.cur():AI2.cur(); }
function depth(){ try{ return AI2.cur().depth||1; }catch(e){ return 1; } }

/* ── PAMĚŤ O UŽIVATELI (jen v tomhle zařízení, localStorage) ── */
var PK='aiw_ai3_profile_v1';
var PROF=lsGet(PK,null)||{name:null,nick:null,age:null,city:null,job:null,school:null,formal:false,
  likes:[],dislikes:[],hobbies:[],pets:[],family:[],health:[],goals:[],facts:[],birthday:null,
  mood:[],seen:0,first:Date.now(),last:0,lastMood:null,lastMoodAt:0,topics:{}};
function saveProf(){ PROF.last=Date.now(); lsSet(PK,PROF); }
function addTo(list,val,max){
  val=String(val||'').trim(); if(!val) return false;
  var f=fold(val);
  for(var i=0;i<list.length;i++) if(fold(list[i])===f) return false;
  list.push(val); while(list.length>(max||14)) list.shift();
  return true;
}
function who(){ return PROF.nick||PROF.name||''; }
/* oslovení (5. pád) — nejběžnější vzory českých jmen */
var VOC_EXC={'jiri':'Jiří','petr':'Petře','pavel':'Pavle','karel':'Karle','tomas':'Tomáši','lukas':'Lukáši','ondrej':'Ondřeji','matej':'Matěji','marek':'Marku','zdenek':'Zdeňku','michal':'Michale','jan':'Jene','ales':'Aleši','david':'Davide','jakub':'Jakube','vojtech':'Vojtěchu','josef':'Josefe','frantisek':'Františku','vaclav':'Václave','stepan':'Štěpáne','martin':'Martine','filip':'Filipe','adam':'Adame','milan':'Milane','roman':'Romane','ivan':'Ivane','lubos':'Luboši','radek':'Radku','patrik':'Patriku','daniel':'Danieli','kamil':'Kamile','robert':'Roberte','dominik':'Dominiku','tereza':'Terezo','marie':'Marie','lucie':'Lucie','petra':'Petro','jana':'Jano','eva':'Evo','anna':'Anno','katerina':'Kateřino','lenka':'Lenko','veronika':'Veroniko','honza':'Honzo','kuba':'Kubo','pepa':'Pepo','tomas':'Tomáši','vlad':'Vlade'};
function voc(n){
  if(!n) return ''; var k=fold(n); if(VOC_EXC[k]) return VOC_EXC[k];
  if(/a$/.test(n)) return n.slice(0,-1)+'o'; if(/(ek)$/.test(n)) return n.slice(0,-2)+'ku'; if(/[ščžřcj]$/i.test(n)) return n+'i';
  if(/[eiyoú]$/i.test(n)) return n; if(/[bdfhklmnprstvz]$/i.test(n)) return n+'e'; return n;
}
function addr(){ return voc(who()); }
/* tykání × vykání */
function T(tu,vy){ return PROF.formal?vy:tu; }

/* ── KONTEXT KONVERZACE ── */
var CTX={city:null,cityName:null,day:0,topic:null,metric:null,intent:null,t:0,listen:null,pending:null,lastChart:null,lastData:null};
function ctxFresh(){ return Date.now()-CTX.t<12*60*1000; }
function touch(intent){ CTX.intent=intent; CTX.t=Date.now(); }

/* ── ČESKÝ ČAS A DNY ── */
var DOWN=['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'];
var DOWV=['v neděli','v pondělí','v úterý','ve středu','ve čtvrtek','v pátek','v sobotu'];
var DOWF={'nedele':0,'nedeli':0,'pondeli':1,'utery':2,'streda':3,'stredu':3,'stredy':3,'ctvrtek':4,'ctvrtka':4,'patek':5,'patku':5,'sobota':6,'sobotu':6,'soboty':6};
function isoDate(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function dowOf(iso){ var p=iso.split('-'); return new Date(+p[0],+p[1]-1,+p[2],12).getDay(); }
function dmy(iso){ var p=iso.split('-'); return (+p[2])+'. '+(+p[1])+'.'; }
function dayLabel(iso,todayIso){
  var a=iso.split('-'),b=todayIso.split('-');
  var diff=Math.round((new Date(+a[0],+a[1]-1,+a[2],12)-new Date(+b[0],+b[1]-1,+b[2],12))/864e5);
  if(diff===0) return 'dnes'; if(diff===1) return 'zítra'; if(diff===2) return 'pozítří'; if(diff===-1) return 'včera';
  return DOWV[dowOf(iso)]+' '+dmy(iso);
}
function dayShort(iso,todayIso){
  var a=iso.split('-'),b=todayIso.split('-');
  var diff=Math.round((new Date(+a[0],+a[1]-1,+a[2],12)-new Date(+b[0],+b[1]-1,+b[2],12))/864e5);
  if(diff===0) return 'dnes'; if(diff===1) return 'zítra';
  return DOWN[dowOf(iso)].slice(0,2);
}

/* ── JAZYK: zkratky, slang, překlepy ──
   Všechno se děje nad „složeným" textem (malá písmena bez diakritiky). */
var SLANG=[
  [/\b(chcije|chcanky|leje jak z konve|leje jako z konve|lije jak z konve|lije jako z konve|prsi jak z konve|prsi jako z konve|prusek mraku|slejvak|slejvaky)\b/g,' prsi silne '],
  [/\b(parak|parna|hic|hicka|vedro|vedra|peklo venku|smazi|smazime|je to na umreni)\b/g,' horko '],
  [/\b(kosa|je kosa|je studeno|studeno|ledovo|ztuhnu|zamrznu)\b/g,' zima '],
  [/\b(fici|ficet|ficeni|vichrno|vichrice|bourlivak|trepe|trha)\b/g,' vitr '],
  [/\b(pocasicko|pocasicka|pocasi venku|co je venku|jak je venku|jak je tam|co venku|jak to vypada venku|jak to je venku)\b/g,' pocasi '],
  [/\b(slunicko|slunecko)\b/g,' slunce '],
  [/\b(mrholeni|mrholi|poprchava|poprchavat|popruchuje)\b/g,' prsi slabe '],
  [/\b(sneh|snehu|snehy)\b/g,' snih '],
  [/\b(co nas ceka|co nas caka|co to bude|jak to bude|jak se to vyvine|co mam cekat)\b/g,' jak bude '],
  [/\b(zitrek|zitrka|zitrku|zejtra|zejtrek)\b/g,' zitra '],
  [/\b(dneska|dnesek|dnesni den|dnes)\b/g,' dnes '],
  [/\b(odpoledko|odpoledne)\b/g,' odpoledne '],
  [/\b(vecirek|vecer)\b/g,' vecer ']
];
function slangFix(f){ var s=' '+f+' '; SLANG.forEach(function(p){ s=s.replace(p[0],p[1]); }); return s.replace(/\s+/g,' ').trim(); }

/* slovník oboru — slouží k opravě překlepů (jen bezpečné opravy) */
var LEXW=('pocasi predpoved teplota teploty stupne stupnu vitr vetr foukat prset prsi destnik snih snezit snezeni bourka bourky mlha '
 +'oblacnost jasno polojasno zatazeno slunce mesic vlhkost tlak vzduchu srazky srazek nahoru dolu tabulka tabulku graf grafu sloupcovy '
 +'spojnicovy kolacovy porovnej porovnani sekce sekci panel okno menu aplikace funkce zobrazit vysvetli popis ukaz vikend zitra pozitri '
 +'dnes vecer rano odpoledne dopoledne poledne noci tyden tydne pondeli utery streda ctvrtek patek sobota nedele hodinu hodiny hodinova '
 +'radar kamera stanice historie pyl kvalita ovzdusi sucho horko zima mraz mrzne inverze naledi ledovka kroupy blesky nadmorska vyska '
 +'prumer soucet maximum minimum nejvyssi nejnizsi seradit serad podle okolo celkem celkove kamarad poradit pomoc smutny unaveny stres '
 +'radost rozhodnout nevim jestli povidat vyslechni poslouchej').split(' ');
var LEXSET={}; LEXW.forEach(function(w){ LEXSET[w]=1; });
function lev(a,b){
  var m=a.length,n=b.length; if(!m) return n; if(!n) return m;
  var p=[],c=[],i,j; for(j=0;j<=n;j++) p[j]=j;
  for(i=1;i<=m;i++){ c[0]=i; for(j=1;j<=n;j++){ var k=a.charCodeAt(i-1)===b.charCodeAt(j-1)?0:1; c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+k); } for(j=0;j<=n;j++) p[j]=c[j]; }
  return p[n];
}
var COMMON=(' jak jaky jaka jake bude byla bylo byly mame mate bylo tomu tohle tady tamto tohle kolik kdyz kdyby pokud protoze proc kdyz '
 +'prosim dekuji dik diky ahoj cau neco nikdo nikde kazdy kazde jeden jedna jedno dobry dobre dobra delat udelat mluvit mluvim cekat '
 +'delsi kratsi mensi vetsi hodne trochu vlastne hlavne samozrejme urcite asi snad hodin hodina minut minuta mesto mesta meste kamen '
 +'okno oknu okna sila silny silne tabor zbozi pocet pocty ').split(' ');
var COMMONSET={}; COMMON.forEach(function(w){ if(w) COMMONSET[w]=1; });
function fixTypos(f){
  return f.split(' ').map(function(t){
    if(t.length<5||LEXSET[t]||COMMONSET[t]||/\d/.test(t)) return t;
    var best=null,bd=9,tie=false,lim=t.length>=9?2:1;
    for(var i=0;i<LEXW.length;i++){
      var w=LEXW[i]; if(Math.abs(w.length-t.length)>lim||w.charAt(0)!==t.charAt(0)) continue;
      var d=lev(t,w); if(d<=lim){ if(d<bd){ bd=d; best=w; tie=false; } else if(d===bd&&w!==best) tie=true; }
    }
    return (best&&!tie)?best:t;
  }).join(' ');
}
/* kanonický tvar dotazu pro všechny moduly */
function canon(text){ return slangFix(fold(text)); }
function canonFix(text){ return fixTypos(canon(text)); }
function has(f,re){ return re.test(f); }
function hasAny(f,list){ var s=' '+f+' '; for(var i=0;i<list.length;i++){ if(s.indexOf(list[i])>=0) return true; } return false; }
function wc(f){ return f?f.split(' ').length:0; }

/* ── MĚSTO V TEXTU ── */
function cityByName(name){
  var arr=window.ALL_CITIES||[]; for(var i=0;i<arr.length;i++) if(arr[i].name===name) return arr[i];
  return null;
}
function cityIn(text){
  try{ var nm=window.AIW_ASSISTANT&&AIW_ASSISTANT._matchCity(text); return nm?cityByName(nm):null; }catch(e){ return null; }
}
function sameCity(a,b){ return !a||!b||a.name===b.name; }

/* ── ČASOVÝ VÝRAZ ──
   {off:dny od dneška, hour:celá hodina|null, part:'rano'.., span:N dní|null, weekend:bool, now:bool, rel:hodiny, label} */
var PARTS={rano:[5,9,'ráno'],dopoledne:[9,12,'dopoledne'],poledne:[11,14,'v poledne'],odpoledne:[12,18,'odpoledne'],podvecer:[16,19,'podvečer'],vecer:[18,23,'večer'],noc:[22,30,'v noci']};
function parseWhen(f){
  var s=' '+f+' ', w={off:0,hour:null,part:null,span:null,weekend:false,now:false,rel:null,any:false,past:false,label:'dnes',from:0};
  var m;
  if(/ (pozitri|pozitrek) /.test(s)){ w.off=2; w.any=true; }
  else if(/ (zitra|zitrek) /.test(s)){ w.off=1; w.any=true; }
  else if(/ vcera /.test(s)){ w.off=-1; w.any=true; w.past=true; }
  else if(/ dnes /.test(s)){ w.off=0; w.any=true; }
  var dowHit=null;
  for(var k in DOWF){ if(new RegExp(' (v |ve |na |o )?'+k+' ').test(s)){ dowHit=DOWF[k]; break; } }
  if(dowHit!=null&&!/ (dnes|zitra|pozitri) /.test(s)){
    w.dow=dowHit; w.any=true;
  }
  if(/ (vikend|vikendu|vikendovy|vikendove) /.test(s)){ w.weekend=true; w.any=true; }
  m=s.match(/ (?:na )?(\d{1,2}) (?:dni|dnu|dny|den|dnech)\b/);
  if(m){ w.span=clamp(+m[1],1,14); w.any=true; }
  else if(/ (na |tento |tenhle |cely |celej )?(tyden|tydne|tydnu|tydenni|tydny) /.test(s)||/ sedm dni /.test(s)){ w.span=7; w.any=true; if(/ pristi tyden| za tyden /.test(s)){ w.from=7; } }
  else if(/ dva tydny | 14 dni | ctrnact dni /.test(s)){ w.span=14; w.any=true; }
  else if(/ (par|nekolik|dalsi|nasledujici|pristi) (dni|dny) /.test(s)){ w.span=5; w.any=true; }
  for(var p in PARTS){ if(new RegExp(' '+(p==='noc'?'(noc|noci|nocni)':p)+' ').test(s)){ w.part=p; w.any=true; break; } }
  m=s.match(/ (?:v|ve|kolem|okolo|na) (\d{1,2})(?::(\d{2}))?(?: hodin| h| hod)? /);
  if(m&&+m[1]<=24){ w.hour=+m[1]%24; w.any=true; if(w.hour<=6&&!/ rano | v noci /.test(s)&&false) w.hour=w.hour; }
  m=s.match(/ za (\d{1,2}) ?(?:hodin|hodiny|hodinu|h|hod) /);
  if(m){ w.rel=+m[1]; w.any=true; } else if(/ za hodinu /.test(s)){ w.rel=1; w.any=true; }
  if(/ (ted|nyni|prave ted|momentalne|aktualne|v tuhle chvili|zrovna) /.test(s)){ w.now=true; w.any=true; }
  w.label=w.now?'teď':'dnes';
  return w;
}

/* ── ČÍSLA ── */
function numCz(s){ return parseFloat(String(s).replace(/\s/g,'').replace(',','.')); }

/* ══════════════════════ 4) POČASÍ: porozumění dotazu a odpovědi ══════════════════════ */
function addDays(iso,n){ var p=iso.split('-'); return isoDate(new Date(+p[0],+p[1]-1,+p[2]+n,12)); }
function dateFor(m,w){
  if(w.dow!=null){ var diff=(w.dow-dowOf(m.todayIso)+7)%7, nh=m.hrs[m.iNow]?m.hrs[m.iNow].h:12;
    /* „ve čtvrtek ráno“ řečeno ve čtvrtek večer = příští čtvrtek */
    if(diff===0&&((w.part&&w.part!=='noc'&&PARTS[w.part][1]<=nh)||(w.hour!=null&&w.hour<nh))) diff=7;
    return addDays(m.todayIso,diff); }
  return addDays(m.todayIso,w.off||0);
}
function rangeDates(m,w){
  var out=[], i;
  if(w.weekend){ for(i=0;i<14;i++){ var d=addDays(m.todayIso,i), dw=dowOf(d); if(dw===6||dw===0){ out.push(d); } if(out.length>=2) break; } return out; }
  var from=w.from||0; for(i=from;i<from+(w.span||7);i++){ var dd=addDays(m.todayIso,i); if(m.by[dd]) out.push(dd); } return out;
}
/* okno hodin pro cílenou otázku */
function mkWin(m,w){
  var base=ctxFresh()&&false;
  if(w.span||w.weekend){ var ds=rangeDates(m,w); if(!ds.length) return null; var a=m.by[ds[0]][0].i, b=m.by[ds[ds.length-1]][m.by[ds[ds.length-1]].length-1].i+1; return {a:a,b:b,dates:ds,range:true,label:w.weekend?'o víkendu':('v následujících '+ds.length+' dnech')}; }
  var date=dateFor(m,w), hs=hoursOf(m,date);
  if(!hs.length) return null;
  var dl=dayLabel(date,m.todayIso);
  if(w.rel!=null){ var a1=clamp(m.iNow+w.rel,0,m.hrs.length-1); return {a:a1,b:Math.min(m.hrs.length,a1+2),date:m.hrs[a1].date,label:'za '+w.rel+' '+plur(w.rel,'hodinu','hodiny','hodin'),point:true}; }
  if(w.hour!=null){
    var ix=hs.filter(function(h){ return h.h===w.hour; })[0]; if(!ix) return null;
    return {a:ix.i,b:ix.i+1,date:date,label:(dl==='dnes'?'':dl+' ')+'v '+w.hour+' h',point:true};
  }
  if(w.part){
    var P=PARTS[w.part], a2,b2;
    if(w.part==='noc'){ var s=hs.filter(function(h){ return h.h===22; })[0]; if(!s) return null; a2=s.i; b2=Math.min(m.hrs.length,s.i+8); }
    else { var fa=hs.filter(function(h){ return h.h>=P[0]; })[0]; if(!fa) return null; a2=fa.i; b2=Math.min(m.hrs.length,a2+(P[1]-P[0])); }
    return {a:a2,b:b2,date:date,part:w.part,label:(dl==='dnes'?'':dl+' ')+P[2],partRange:[P[0],P[1]>=24?24:P[1]]};
  }
  if(w.now&&!w.any2) return {a:m.iNow,b:Math.min(m.hrs.length,m.iNow+3),date:m.todayIso,label:'právě teď',point:true,nowOnly:true};
  if(w.explicit) return {a:hs[0].i,b:hs[hs.length-1].i+1,date:date,label:dl,full:true};
  return {a:m.iNow,b:Math.min(m.hrs.length,m.iNow+24),date:m.todayIso,label:'v příštích 24 hodinách',next24:true};
}
function winHours(m,win){ return m.hrs.slice(win.a,win.b); }
function whenWords(w){
  var s=[]; if(w.weekend) s.push('víkend'); else if(w.span) s.push((w.span)+' dní'); else if(w.dow!=null) s.push(DOWN[w.dow]); else if(w.off) s.push(w.off===1?'zítra':(w.off===2?'pozítří':'včera')); else s.push('dnes');
  if(w.part) s.push(PARTS[w.part][2]); if(w.hour!=null) s.push(w.hour+' h'); if(w.now) s.push('teď'); return s.join(', ');
}

/* ── jaké téma ve větě je ── */
var TOPICS=[
  ['storm',/ (bour|blesk|hrmi|hrmot|hrm|krupob|kroup|tornad|supercel|silna bourka)\w* /],
  ['snow',/ (snih|snez|vlock|ledovk|namraz|kalamit|snehov|zasnez)\w* /],
  ['rain',/ (prs|dest|srazk|mokr|prehank|destnik|plastenk|zmokn|mrhol|zaprsi|naprsi|lije|leje)\w* /],
  ['wind',/ (vitr|vetr|fouk|poryv|naraz|vichr|vichric|vetrn)\w* /],
  ['fog',/ (mlh|mlz)\w* /],
  ['uv',/ (uv|opalov|spalim|spf|opalit)\w* /],
  ['sun',/ (vychod|zapad|svitani|soumrak|delka dne|kdy zapada|kdy vychazi)\w* .*slunc|slunc\w* .*(vychod|zapad|vychazi|zapada)|(vychod|zapad) slunce/],
  ['press',/ (tlak|tlaku|tlakov)\w* /],
  ['hum',/ (vlhk|dusno|rosny bod|vlhko)\w* /],
  ['frost',/ (mraz|mrzn|mrzl|namrz|pod nulou|nulou|premrzne|prizemni mraz)\w* /],
  ['heat',/ (horko|vedro|parak|tropick|letni den|30 stupnu)\w* /],
  ['temp',/ (teplot|stupn|teplo|zima|chlad|chladno|pocitov|oteplen|ochlazen|teplejsi|chladnejsi)\w* /],
  ['sky',/ (slunce|slunick|jasno|zatazen|oblac|polojasno|mrak|mraky|svit)\w* /]
];
function topicOf(f){ var s=' '+f+' '; for(var i=0;i<TOPICS.length;i++) if(TOPICS[i][1].test(s)) return TOPICS[i][0]; return 'general'; }
var TOPIC_NAME={general:'celkové počasí',rain:'srážky',snow:'sníh',storm:'bouřky',wind:'vítr',fog:'mlha',uv:'UV index',sun:'slunce',press:'tlak',hum:'vlhkost',frost:'mráz',heat:'horko',temp:'teplota',sky:'obloha'};

/* ── obecný rozcestník: je to dotaz na počasí? ── */
var WX_ANY=/ (pocasi\w*|predpoved\w*|prognoz\w*|meteo\w*|jak bude|jaky bude|jaka bude|jake bude|prset|prsi\w*|dest|deste|destiv\w*|destnik\w*|srazk\w*|srazek|snih\w*|snez\w*|vitr\w*|vetr\w*|fouk\w*|teplot\w*|stupn\w*|teplo|tepleji|teplejsi|chladneji|chladnejsi|zima|zimy|chlad\w*|horko|vedro|mraz\w*|mrzn\w*|bour\w*|blesk\w*|mlh\w*|slunce|slunick\w*|slunecn\w*|opalov\w*|hezk\w*|pekn\w*|nepekn\w*|osklive|hnusn\w*|jasno|zatazen\w*|oblac\w*|polojasno|uv|vlhk\w*|dusno|tlak\w*|prehank\w*|kroup\w*|namraz\w*|ledovk\w*|naledi|venku|mrholi\w*|vichr\w*|poryv\w*|narazy|narazu|narazovy) /;
var WX_NOT=/ (zmen mesto|zmenit mesto|prepni|prepnout|ukaz radar|ukaz kameru|ukaz stanice|ukaz mesic|ukaz pudu|ukaz historii|otevri radar|otevri kameru|co je inverze|jak vznika|proc hrmi|proc prsi|proc je|vysvetli|co znamena|co je to|k cemu je|co je v sekci|co ukazuje|jak funguje|v menu|v sekci|v panelu|v okne) /;
var WX_NAV=/ (radar|kamer|webcam|stanic|meteostanic|pudu|pudy|zavlah|historii|historie|kalendar|mesic|mesice|faze) /;
function isWx(f){
  var s=' '+f+' ';
  if(WX_NOT.test(s)) return false;
  if(!WX_ANY.test(s)){ return /^(jak|jaky|jaka|jake|co) (je|bude|nas ceka|to bude|na tom)\b.*\b(zitra|dnes|pozitri|vikend\w*|vecer|rano|odpoledne|dopoledne|noc\w*|tyden|venku)\b/.test(f)&&!/(sekc|panel|appk|aplikac|menu)/.test(f); }
  /* čistá navigace na sekci patří původnímu asistentovi */
  if(WX_NAV.test(s)&&!/ (pocasi|predpoved|teplot|prset|vitr) /.test(s)) return false;
  /* „venku" samotné je slabé — chce to aspoň otázku nebo čas */
  if(/ venku /.test(s)&&!/ (jak|jaky|jaka|jake|co|bude|je|ted|dnes|zitra|vecer|rano) /.test(s)) return false;
  return true;
}

/* ── nadpis odpovědi a odznak ── */
function badgeKind(m,w){ return 'počasí · '+(m.city&&m.city.name?m.city.name:'tady'); }

/* ══ A) PŘEHLED (teď + dnes) ══ */
function buildOverview(m,w){
  var D=depth(), c=m.cur, sk=skyOf(c.code), today=dayHeadline(m,m.todayIso), S=today&&today.S;
  var h=[], sp=[];
  h.push(heroHTML(m)); h.push(chipsNow(m));
  var wi=windWord(c.wind), nowS='Teď je '+r0(c.temp)+' °C ('+tdesc(c.temp)+'), '+sk[1]+(c.wind>=6?', '+wi+(dirText(c.dir)?' '+dirText(c.dir):''):', téměř bezvětří')+'.';
  if(c.rain>0.05) nowS=nowS.replace(/\.$/,'')+', právě prší ('+f1(c.rain)+' mm/h).';
  var rest=[]; if(S){
    var futureWet=wetSpans(S.hs.filter(function(x){ return x.i>=m.iNow; }));
    if(futureWet.length) rest.push(futureWet.slice(0,2).map(function(s){ return spanPhrase(s,m); }).join(' '));
    else if(S.rain<0.1) rest.push('Do večera se srážky nečekají.');
    if(S.tmax!=null){ var hnow=m.hrs[m.iNow]?m.hrs[m.iNow].h:12, restT=S.hs.filter(function(x){ return x.h>=hnow; }).map(function(x){ return x.temp; }); if(restT.length>3){ var mxr=mx(restT), mnr=mn(restT); rest.push('Přes zbytek dne '+r0(mnr)+' až '+r0(mxr)+' °C'+(mxr>c.temp+2?' (ještě se oteplí)':(mnr<c.temp-2?' (ještě se ochladí)':''))+'.'); } }
    var yd=yesterdayDelta(m); if(yd&&Math.abs(yd.tmax)>=2) rest.push('Je o '+r0(Math.abs(yd.tmax))+' °C '+(yd.tmax>0?'tepleji':'chladněji')+' než včera.');
  }
  var lead=nowS+' '+rest.join(' ');
  h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
  var i0=Math.max(0,m.iNow-3), i1=Math.min(m.hrs.length,m.iNow+25);
  h.push(sectionHTML('📈 Dalších 24 hodin',chartHours(m,i0,i1)));
  var ins=insights(m,m.todayIso);
  h.push(insightsHTML(ins,D>=3?7:(D>=2?5:2)));
  if(D>=2){
    h.push(sectionHTML('🕒 Dnes podle části dne',partsTable(m,m.todayIso)));
    h.push(sectionHTML('🧭 Co s tím',adviceHTML(advice(m,m.todayIso),D>=3?6:4)));
    var tm=dayHeadline(m,addDays(m.todayIso,1)); if(tm) h.push('<p class="a3-tmr"><b>Zítra:</b> '+esc(tm.lead.replace(/^Zítra /,'')+' '+(tm.wet||'')+' '+tm.temp)+'</p>');
  }
  if(D>=3){
    var dd0=m.dT, dd1=Math.min(m.days.length-1,m.dT+6);
    h.push(sectionHTML('📅 Výhled na týden',chartDays(m,dd0,dd1)+weekTable(m,dd0,dd1,{actions:false})));
    var wk=[]; for(var q=1;q<=6;q++){ var dq=addDays(m.todayIso,q); insights(m,dq).filter(function(x){ return x.p>=6; }).slice(0,1).forEach(function(x){ wk.push({ic:x.ic,t:cap(dayLabel(dq,m.todayIso))+': '+x.t}); }); }
    if(wk.length) h.push(sectionHTML('⚠️ Rizika v týdnu',insightsHTML(wk,5)));
  }
  var speech=lead+' '+(today?today.temp:'');
  var follow=[['🕒 Po hodinách','hodinová předpověď'],['📅 Na týden','předpověď na týden'],['🌧 Srážky','graf srážek dnes'],['🔮 Zítra','počasí zítra'],['🧥 Co na sebe','co si vzít na sebe']];
  var needModels=D>=3;
  var steps=['🔤 Rozumím: celkové počasí · '+(m.city&&m.city.name||'tady')+' · teď a dnes','📡 Čtu '+m.hrs.length+' hodin dat a '+m.days.length+' dní předpovědi','🌧 Skládám srážková okna ('+(S?S.spans.length:0)+' nalezeno)','📈 Hledám zlomy: tlak, vítr, rozdíl proti včerejšku','🧥 Počítám pocitovou teplotu a rady','✅ Kontroluju čísla proti denním maximům'];
  var think=[['Čemu rozumím',['Dotaz na celkové počasí — odpovídám stavem teď a vývojem dne.','Místo: '+(m.city&&m.city.name||'tady')+'.']],
    ['Co jsem četl',[m.hrs.length+' hodinových hodnot, '+m.days.length+' denních souhrnů, tlak, vítr a oblačnost.','Čas měření: '+(m.cur.time||'—')+'.']],
    ['Jak jsem to vyhodnotil',['Srážkové okno = souvislé hodiny s ≥ 0,1 mm nebo šancí ≥ 70 % (mezera 1 h se spojí).','Nejlepší okno ven = sucho, nárazy < 42 km/h, pocitová teplota 6–29 °C, aspoň 2 h v kuse.','Rady podle průměrné pocitové teploty 8–20 h.']],
    ['Nejistota',[m.hrs[m.iNow]&&m.hrs[m.iNow].pop>=40?'Šance srážek je ve vyšších hodnotách — načasování se může o hodinu či dvě posunout.':'Krátkodobá předpověď je na prvních 12 hodin velmi spolehlivá, dál se rozptyl zvětšuje.']]];
  return {html:wrapWx(h.join('')),speech:speech,follow:follow,steps:steps,think:think,needModels:needModels,thinkIt:D>=2,kind:badgeKind(m,w)};
}

/* ══ B) JEDEN DEN (zítra, v sobotu, večer, ve 20 h) ══ */
function buildDay(m,w,win){
  var D=depth(), date=win.date||dateFor(m,w), H=dayHeadline(m,date), S=H.S, h=[];
  var lab=dayLabel(date,m.todayIso);
  var hs=winHours(m,win), part=win.part||win.point;
  var lead, speech;
  if(win.partRange||win.point){
    var T=hs.map(function(x){ return x.temp; }), mm=sum(hs.map(function(x){ return x.rain+x.snow*0.7; })), pop=mx(hs.map(function(x){ return x.pop; })), sk=periodSky(hs);
    var wsp=wetSpans(hs);
    lead=cap(win.label)+': '+(T.length>1?(r0(mn(T))+' až '+r0(mx(T))+' °C'):(r0(T[0])+' °C'))+', '+sk[1]+(mm>=0.1?(', srážky '+f1(mm)+' mm'):(pop>=30?(', šance srážek '+r0(pop)+' %'):', bez srážek'))+', vítr '+r0(avg(hs.map(function(x){ return x.wind; })))+' km/h'+(mx(hs.map(function(x){ return x.gust; }))>=40?(' (nárazy až '+r0(mx(hs.map(function(x){ return x.gust; })))+')'):'')+'.';
    if(wsp.length) lead+=' '+wsp.slice(0,2).map(function(s){ return spanPhrase(s,m); }).join(' ');
    speech=lead;
    h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
    h.push(sectionHTML('📈 '+cap(win.label),chartHours(m,Math.max(0,win.a-4),Math.min(m.hrs.length,win.b+5))));
  } else {
    lead=H.lead+(H.wet?' '+H.wet:'')+' '+H.temp;
    speech=lead;
    var d0=m.days.filter(function(d){ return d.date===date; })[0], sk0=d0?skyOf(d0.code):skyOf(S.code);
    h.push('<div class="a3-dayhead"><span class="a3-hico">'+sk0[0]+'</span><div><b>'+cap(lab)+'</b><small>'+DOWN[dowOf(date)]+' '+dmy(date)+' · '+(m.city&&m.city.name||'')+'</small></div>'
      +'<div class="a3-hrange"><b>'+r0(S.tmax)+'°</b><span>'+r0(S.tmin)+'°</span></div></div>');
    h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
    h.push(sectionHTML('📈 '+cap(lab)+' po hodinách',chartHours(m,hoursOf(m,date)[0].i,hoursOf(m,date)[hoursOf(m,date).length-1].i+1)));
  }
  var ins=insights(m,date);
  h.push(insightsHTML(ins,D>=3?7:(D>=2?5:2)));
  if(D>=2){
    h.push(sectionHTML('🕒 Část po části',partsTable(m,date)));
    h.push(sectionHTML('🧭 Co s tím',adviceHTML(advice(m,date),D>=3?6:4)));
  }
  var follow=[['🕒 Hodinově','hodinová předpověď '+(lab==='dnes'?'':lab)],['📅 Na týden','předpověď na týden'],['🌧 Srážky','graf srážek '+(lab==='dnes'?'':lab)],['🧥 Co na sebe','co si vzít na sebe '+(lab==='dnes'?'':lab)]];
  var steps=['🔤 Rozumím: počasí · '+(m.city&&m.city.name||'tady')+' · '+whenWords(w),'📡 Vybírám hodiny '+date+' z '+m.hrs.length+' hodnot','🌧 Hledám srážková okna ('+S.spans.length+')','🌡 Počítám rozpětí teplot a pocitovku','🧥 Skládám rady','✅ Kontroluju denní souhrn'];
  var think=[['Čemu rozumím',['Počasí na '+lab+' ('+date+')'+(win.label&&win.part?', část dne: '+win.label:'')+'.']],
    ['Co jsem četl',[hoursOf(m,date).length+' hodin tohoto dne + denní souhrn.']],
    ['Jak jsem to vyhodnotil',['Obloha podle průměrné oblačnosti v částech dne; srážky podle souvislých oken.','Teploty z hodinové křivky, maximum/minimum z denního souhrnu.']],
    ['Nejistota',[(m.days.indexOf(m.days.filter(function(d){ return d.date===date; })[0])-m.dT)>=4?'Čím dál dopředu, tím víc se načasování deště a výška teplot mohou posunout.':'Do dvou dnů bývá předpověď velmi spolehlivá.']]];
  var off=Math.round((new Date(date+'T12:00')-new Date(m.todayIso+'T12:00'))/864e5);
  return {html:wrapWx(h.join('')),speech:speech,follow:follow,steps:steps,think:think,needModels:D>=3&&off>=0&&off<=3,thinkIt:D>=2,kind:badgeKind(m,w)};
}

/* ══ C) VÍC DNÍ (týden, víkend, 5 dní) ══ */
function buildRange(m,w,win){
  var D=depth(), ds=win.dates, days=ds.map(function(d){ return m.days.filter(function(x){ return x.date===d; })[0]; }).filter(Boolean);
  var h=[], tmax=days.map(function(d){ return d.tmax; }), tmin=days.map(function(d){ return d.tmin; });
  var hot=days.filter(function(d){ return d.tmax===mx(tmax); })[0], cold=days.filter(function(d){ return d.tmin===mn(tmin); })[0];
  var wet=days.filter(function(d){ return d.rain+d.snow*0.7>=0.5||d.pop>=60; }), dry=days.filter(function(d){ return d.rain<0.3&&d.pop<35; });
  var sc=days.map(function(d){ return {d:d,s:d.pop*1.2+d.code*3+Math.abs(d.tmax-23)*1.4+nz(d.gust)*0.3}; }).sort(function(a,b){ return a.s-b.s; });
  var best=sc[0]&&sc[0].d, worst=sc[sc.length-1]&&sc[sc.length-1].d;
  var half=Math.max(1,Math.floor(days.length/2)), a1=avg(tmax.slice(0,half)), a2=avg(tmax.slice(-half)), trend=a2-a1;
  var parts=[];
  parts.push((w.weekend?'Víkend':'Příštích '+days.length+' '+plur(days.length,'den','dny','dní'))+': teploty '+r0(mn(tmin))+' až '+r0(mx(tmax))+' °C.');
  if(days.length>=3&&Math.abs(trend)>=2.5) parts.push(trend>0?'Postupně se oteplí (o '+r0(trend)+' °C).':'Postupně se ochladí (o '+r0(-trend)+' °C).');
  if(hot&&days.length>1) parts.push('Nejtepleji '+dayLabel(hot.date,m.todayIso)+' ('+r0(hot.tmax)+' °C)'+(cold&&cold!==hot?', nejchladněji '+dayLabel(cold.date,m.todayIso)+' ('+r0(cold.tmin)+' °C)':'')+'.');
  if(!wet.length) parts.push('Srážky se nečekají — suché období.');
  else parts.push('Srážky: '+wet.map(function(d){ return dayShort(d.date,m.todayIso)+' ('+f1(d.rain+d.snow*0.7)+' mm)'; }).join(', ')+'.');
  if(best&&days.length>2) parts.push('Nejhezčí vypadá '+dayLabel(best.date,m.todayIso)+' ('+skyOf(best.code)[1]+', '+r0(best.tmax)+' °C).');
  var lead=parts.join(' ');
  h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
  var d0i=m.days.indexOf(days[0]), d1i=m.days.indexOf(days[days.length-1]);
  h.push(sectionHTML('📅 Teploty a srážky po dnech',chartDays(m,d0i,d1i)));
  h.push(sectionHTML('🗓 Dny v tabulce',weekTable(m,d0i,d1i,{actions:D>=2})));
  var warn=[]; ds.forEach(function(d){ insights(m,d).filter(function(x){ return x.p>=6; }).slice(0,2).forEach(function(x){ warn.push({ic:x.ic,t:cap(dayLabel(d,m.todayIso))+': '+x.t}); }); });
  if(warn.length) h.push(sectionHTML('⚠️ Na co si dát pozor',insightsHTML(warn,D>=3?8:4)));
  if(D>=2&&ds.length>=1) h.push(sectionHTML('🕒 '+cap(dayLabel(ds[0],m.todayIso))+' po hodinách',chartHours(m,hoursOf(m,ds[0])[0].i,hoursOf(m,ds[0])[hoursOf(m,ds[0]).length-1].i+1)));
  if(D>=3&&ds.length>=2&&!w.weekend) h.push(sectionHTML('🧭 Co s tím '+dayLabel(ds[0],m.todayIso),adviceHTML(advice(m,ds[0]),5)));
  var follow=[['🌧 Srážky','graf srážek na týden'],['🌡 Teploty','graf teploty na týden'],['🔮 Zítra','počasí zítra'],['🌅 Víkend','počasí o víkendu'],['📅 14 dní','předpověď na 14 dní']];
  var steps=['🔤 Rozumím: výhled · '+(m.city&&m.city.name||'tady')+' · '+whenWords(w),'📡 Beru '+days.length+' denních souhrnů z '+m.days.length,'📈 Porovnávám začátek a konec období (trend '+(trend>=0?'+':'')+f1(trend)+' °C)','🌧 Hledám deštivé a suché dny ('+wet.length+' / '+dry.length+')','⚠️ Procházím rizika: mráz, vedro, vítr, bouřky','✅ Skládám tabulku a graf'];
  var think=[['Čemu rozumím',['Výhled na '+days.length+' dní'+(w.weekend?' (víkend)':'')+'.']],
    ['Jak jsem to vyhodnotil',['Trend = rozdíl průměrných maxim druhé a první poloviny období.','Mokrý den = úhrn ≥ 0,5 mm nebo šance ≥ 60 %.','Nejhezčí den = nejnižší skóre ze šance srážek, kódu počasí, odchylky maxima od 23 °C a nárazů.']],
    ['Nejistota',[days.length>=7?'Po 5.–7. dni se rozptyl mezi modely zvětšuje; ber teploty jako orientační a deště hlavně jako trend.':'Do pěti dnů je předpověď teplot spolehlivá, srážky se mohou časově posunout.']]];
  return {html:wrapWx(h.join('')),speech:lead,follow:follow,steps:steps,think:think,needModels:D>=3,thinkIt:D>=2,kind:badgeKind(m,w)};
}

/* ══ D) CÍLENÁ OTÁZKA: bude pršet? kolik je stupňů? bude foukat? … ══ */
function nextEvent(m,from,pred,maxH){
  for(var i=from;i<Math.min(m.hrs.length,from+(maxH||168));i++) if(pred(m.hrs[i])) return m.hrs[i]; return null;
}
function buildFocus(m,topic,w,win){
  var D=depth(), hs=winHours(m,win), h=[], lead='', rows=null, chart='', extra='', ins=[];
  var place=m.city&&m.city.name||'tady', label=win.nowOnly?'v nejbližších hodinách':win.label;
  var date=win.date||m.todayIso, rng=win.range;
  function chartFor(key){ return chartMetric(m,key,Math.max(0,win.a-(win.point?6:0)),Math.min(m.hrs.length,win.b+(win.point?6:0)),{}); }
  if(topic==='rain'||topic==='snow'||topic==='storm'){
    var spans=wetSpans(hs), wantSnow=topic==='snow', wantStorm=topic==='storm';
    if(wantSnow) spans=spans.filter(function(s){ return s.kind==='sníh'||s.snow>0; });
    if(wantStorm){ spans=spans.filter(function(s){ return s.kind==='bouře'; }); }
    var mm=sum(hs.map(function(x){ return x.rain; })), sn=sum(hs.map(function(x){ return x.snow; })), pop=mx(hs.map(function(x){ return x.pop; }))||0;
    var peak=hs.slice().sort(function(a,b){ return (b.pop-a.pop)||((b.rain+b.snow)-(a.rain+a.snow)); })[0];
    if(wantStorm){
      var ts=hs.filter(function(x){ return x.code>=95||x.lt>=20; });
      if(ts.length) lead='⚡ Ano — v okně '+label+' se počítá s bouřkou'+(spans.length?': '+spanWhen(spans[0],m):' (kolem '+ts[0].h+' h)')+'. Při blescích do budovy nebo auta, ne pod strom.';
      else { var nxt=nextEvent(m,win.a,function(x){ return x.code>=95; },240);
        lead='✅ Ne — '+label+' bouřka v předpovědi není.'+(nxt?' Nejbližší bouřky model čeká '+dayLabel(nxt.date,m.todayIso)+' kolem '+nxt.h+' h.':' Ani v dalších dnech nic nenasvědčuje.'); }
    } else if(spans.length){
      var s0=spans[0], tot=wantSnow?sn:mm;
      lead=(wantSnow?'❄️ Ano':'🌧 Ano')+' — '+spanPhrase(s0,m,{lc:true})+(spans.length>1?' Pak ještě '+spanWhen(spans[1],m)+'.':'')
        +(tot>=0.1?(' Celkem '+(wantSnow?'≈ '+f1(sn)+' cm':'≈ '+f1(mm)+' mm')+' '+label+'.'):'')+' Šance až '+r0(pop)+' %.';
      if(!wantSnow&&sn>=0.3) lead+=' Část srážek bude sněhová ('+f1(sn)+' cm).';
    } else {
      var nx=nextEvent(m,win.b,function(x){ return wantSnow?x.snow>=0.2:isWet(x); },168);
      lead=(wantSnow?'☀️ Ne':'🌤 Ne')+' — '+label+' '+(wantSnow?'sníh nehrozí':'se srážky nečekají')+(peak&&pop>=15?(' (nejvyšší šance '+r0(pop)+' % kolem '+peak.h+' h)'):'')+'.';
      if(wantSnow){ var tmin=mn(hs.map(function(x){ return x.temp; })); lead+=' Nejnižší teplota '+r0(tmin)+' °C'+(tmin>3?' — na sníh je moc teplo.':'.'); }
      lead+=nx?' Nejbližší '+(wantSnow?'sněžení':'srážky')+' model čeká '+dayLabel(nx.date,m.todayIso)+' kolem '+nx.h+' h.':' Ani v dalších dnech nic nenasvědčuje.';
    }
    chart=chartFor(wantSnow?'rain':'rain');
    var wspAll=wetSpans(m.hrs.slice(m.iNow,m.iNow+168)).filter(function(s){ return wantSnow?s.kind==='sníh':true; });
    if(D>=2&&wspAll.length){
      rows=tableHTML(['Kdy','Co','Úhrn','Šance'],wspAll.slice(0,7).map(function(s){ return {cells:[{t:cap(spanWhen(s,m)),s:s.from.i},{t:s.adj+' '+KIND[s.kind].ins,s:s.kind},{t:s.kind==='sníh'?f1(s.snow)+' cm':f1(s.mm)+' mm',s:s.mm},{t:r0(s.pop)+' %',s:s.pop}]}; }),{compact:true});
    }
    if(!wantSnow&&!wantStorm&&D>=2){ var bw=bestWindow(m,date); if(bw&&hs.length) ins.push({ic:'⏳',t:'Nejlepší okno bez deště: '+bw.a+'–'+bw.b+' h.'}); }
  }
  else if(topic==='wind'){
    var g=hs.slice().sort(function(a,b){ return b.gust-a.gust; })[0], wmax=mx(hs.map(function(x){ return x.wind; })), gmax=g?g.gust:0, avgW=avg(hs.map(function(x){ return x.wind; }));
    lead='🌬 Vítr '+label+': '+windWord(avgW)+' (průměr '+r0(avgW)+' km/h'+(dirText(avg(hs.map(function(x){ return nz(x.dir); })))?' '+dirText(hs[Math.floor(hs.length/2)].dir):'')+'), nejsilněji kolem '+(g?g.h:'—')+' h — nárazy až '+r0(gmax)+' km/h.'
      +(gmax>=75?' Nebezpečný vítr!':(gmax>=55?' Silný vítr — pozor venku.':(gmax>=40?' Občas nepříjemné nárazy.':' Nic dramatického.')));
    chart=chartFor('wind');
    if(D>=2) ins.push({ic:'📏',t:'Na stupnici: '+windWord(avgW)+' ≈ '+(avgW<13?'1–2':(avgW<22?'3':(avgW<32?'4':(avgW<45?'5–6':'7+'))))+' stupně Beaufortovy stupnice.'});
  }
  else if(topic==='temp'||topic==='heat'||topic==='frost'){
    var T=hs.map(function(x){ return x.temp; }), F=hs.map(function(x){ return nz(x.feel,x.temp); }), tx=mx(T), tn=mn(T), now=m.cur;
    if(win.nowOnly) lead='🌡 Teď je '+r0(now.temp)+' °C, pocitově '+r0(now.feel)+' °C ('+tdesc(now.temp)+'). Za 3 hodiny '+r0(m.hrs[Math.min(m.hrs.length-1,m.iNow+3)].temp)+' °C.';
    else if(win.point&&hs.length) lead='🌡 '+cap(label)+' bude '+r0(hs[0].temp)+' °C, pocitově '+r0(nz(hs[0].feel,hs[0].temp))+' °C ('+tdesc(hs[0].temp)+').';
    else lead='🌡 '+cap(label)+': '+r0(tn)+' až '+r0(tx)+' °C (pocitově '+r0(mn(F))+' až '+r0(mx(F))+'), nejteplejší kolem '+hs.filter(function(x){ return x.temp===tx; })[0].h+' h, nejchladnější kolem '+hs.filter(function(x){ return x.temp===tn; })[0].h+' h.';
    if(topic==='frost'){ var fr=hs.filter(function(x){ return x.temp<=0; }); lead=(fr.length?'🥶 Ano, mrznout bude — ':'✅ Ne, nemrzne — ')+(fr.length?('teplota klesne až na '+r0(tn)+' °C, '+fr.length+' h pod nulou (první kolem '+fr[0].h+' h).'+(tn<=-5?' Chraň rostliny i auto.':'')):('nejnižší teplota '+label+' je '+r0(tn)+' °C'+(tn<=3?', ale přízemní mráz na loukách není vyloučen.':'.'))); }
    if(topic==='heat'){ lead=(tx>=30?'🔥 Ano, tropické horko — ':(tx>=25?'☀️ Letní den — ':'🌤 Žádné horko — '))+'maximum '+r0(tx)+' °C ('+label+').'+(tx>=30?' Pij hodně vody a nejdřív přes poledne.':''); }
    chart=chartFor('temp');
    var yd=yesterdayDelta(m); if(D>=2&&yd&&!rng) ins.push({ic:yd.tmax>0?'📈':'📉',t:'Proti včerejšku: maximum '+(yd.tmax>0?'+':'')+r0(yd.tmax)+' °C ('+r0(yd.y.tmax)+' → '+r0(m.days[m.dT].tmax)+').'});
  }
  else if(topic==='uv'){
    var dd=m.days.filter(function(x){ return x.date===date; })[0]||dayAt(m,0), u=dd&&dd.uv; 
    if(u==null){ lead='UV index se mi pro tohle místo nepodařilo zjistit.'; }
    else { var lvl=u<3?'nízký':(u<6?'střední':(u<8?'vysoký':(u<11?'velmi vysoký':'extrémní'))); lead='☀️ UV index '+label+' až '+r0(u)+' — '+lvl+'. '+(u<3?'Ochrana není potřeba.':(u<6?'Při delším pobytu venku brýle a krém.':(u<8?'SPF 30+, klobouk, přes poledne do stínu.':'Nutná ochrana, poledne raději ve stínu.')))+' Maximum bývá mezi 11 a 14 h.'; }
    var us=m.days.filter(function(x){ return x.date>=m.todayIso&&x.uv!=null; }).slice(0,7);
    if(us.length>1) chart='<div class="a3c-box">'+svgHBar(us.map(function(x){ return {label:dayShort(x.date,m.todayIso)+' '+dmy(x.date),value:r0(x.uv),color:x.uv>=8?'#ff5a4f':(x.uv>=6?'#ff9f43':(x.uv>=3?'#ffd24d':'#7be0a0'))}; }),{unit:'',title:'UV index po dnech'})+'</div>';
  }
  else if(topic==='sun'){
    var d1=m.days.filter(function(x){ return x.date===date; })[0]||dayAt(m,0), dy=m.days[m.days.indexOf(d1)-1];
    if(d1&&d1.sunrise){ var len=d1.daylight!=null?d1.daylight:null, dlen=(dy&&dy.daylight!=null&&len!=null)?Math.round((len-dy.daylight)/60):null;
      lead='🌅 '+cap(label)+': slunce vychází v '+hhmm(d1.sunrise)+' a zapadá v '+hhmm(d1.sunset)+(len!=null?(' — den trvá '+Math.floor(len/3600)+' h '+pad2(Math.round(len%3600/60))+' min'):'')+(dlen!=null?(', '+(dlen<0?'o '+Math.abs(dlen)+' min kratší':'o '+dlen+' min delší')+' než předchozí den'):'')+'.'; }
    else lead='Časy východu a západu slunce se mi nepodařilo zjistit.';
    var ss=m.days.filter(function(x){ return x.date>=m.todayIso&&x.sunrise; }).slice(0,7);
    if(ss.length) rows=tableHTML(['Den','Východ','Západ','Délka dne'],ss.map(function(x){ return {_cls:x.date===m.todayIso?'a3-now':'',cells:[{t:dayShort(x.date,m.todayIso)+' '+dmy(x.date),s:x.date},{t:hhmm(x.sunrise),s:x.sunrise},{t:hhmm(x.sunset),s:x.sunset},{t:x.daylight!=null?Math.floor(x.daylight/3600)+' h '+pad2(Math.round(x.daylight%3600/60))+' min':'—',s:x.daylight}]}; }),{compact:true});
  }
  else if(topic==='press'){
    var pt=pressTrend(m); lead=pt?'🧭 Tlak je '+r0(pt.now)+' hPa ('+(pt.now<1000?'tlaková níže — proměnlivo':(pt.now>1022?'tlaková výše — stabilně':'průměrný tlak'))+'), za 12 h '+(Math.abs(pt.d12)<1?'zůstane skoro stejný':(pt.d12>0?'vystoupá o '+f1(pt.d12)+' hPa':'klesne o '+f1(-pt.d12)+' hPa'))+'.':'Tlak se mi nepodařilo zjistit.'; chart=chartFor('press');
  }
  else if(topic==='hum'||topic==='fog'){
    var hm=m.cur.hum; var fogH=hs.filter(function(x){ return x.code===45||x.code===48; });
    lead=topic==='fog'?(fogH.length?'🌫 Ano — mlha se počítá kolem '+fogH[0].h+' h ('+fogH.length+' h).':'✅ Mlha v předpovědi '+label+' není'+(hm>=93?', ale vlhkost je '+r0(hm)+' % — v údolích a u vody se může tvořit.':'.')):'💧 Vlhkost je '+r0(hm)+' % ('+(hm<35?'suchý vzduch':(hm<60?'příjemná vlhkost':(hm<80?'vlhko':'velmi vlhko, může být dusno')))+').';
    chart=chartFor('hum');
  }
  else { /* sky */
    var cl=avg(hs.map(function(x){ return nz(x.cloud); })), dd2=m.days.filter(function(x){ return x.date===date; })[0]||dayAt(m,0), sunh=dd2&&dd2.sunshine!=null?dd2.sunshine/3600:null;
    lead='⛅ '+cap(label)+': '+cloudWord(cl)+' (oblačnost '+r0(cl)+' %)'+(sunh!=null&&!win.point?', slunce svítí zhruba '+f1(sunh)+' h':'')+'.';
    chart=chartFor('cloud');
  }
  h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
  if(chart) h.push(chart);
  if(ins.length) h.push(insightsHTML(ins,3));
  if(rows) h.push(rows);
  var cur=hs.length&&hs[0].date===m.todayIso;
  if(D>=2&&(topic==='rain'||topic==='temp'||topic==='wind')&&!win.range) h.push(sectionHTML('🧭 Co s tím',adviceHTML(advice(m,date),3)));
  var follow=[['🌡 Teplota','kolik bude stupňů '+(label||'')],['🌧 Srážky','bude pršet'],['🌬 Vítr','jaký bude vítr'],['📅 Týden','předpověď na týden'],['📊 Vše dnes','jaké je počasí']];
  var steps=['🔤 Rozumím: '+TOPIC_NAME[topic]+' · '+place+' · '+label,'📡 Beru '+hs.length+' hodin z okna a '+m.hrs.length+' celkem','🔎 Hledám '+(topic==='rain'||topic==='snow'||topic==='storm'?'srážková okna':'extrémy a průběh')+' v okně','📈 Zkouším, co přijde po oknu (dalších 7 dní)','✅ Kontrola čísel a formulace'];
  var think=[['Čemu rozumím',['Téma: '+TOPIC_NAME[topic]+', okno: '+label+' ('+hs.length+' h).']],
    ['Jak jsem to vyhodnotil',[topic==='rain'||topic==='snow'?'Srážka = ≥ 0,1 mm/h nebo šance ≥ 70 % u deště; okna s mezerou 1 h splývají.':'Hodnoty beru z hodinové křivky v daném okně, extrémy z jejích hodin.']],
    ['Nejistota',['Čím delší horizont, tím větší rozptyl; u srážek se může načasování posunout o 1–2 hodiny.']]];
  return {html:wrapWx(h.join('')),speech:lead,follow:follow,steps:steps,think:think,needModels:false,thinkIt:D>=2,kind:badgeKind(m,w)};
}

/* ══ E) SROVNÁNÍ DVOU MĚST / DNÍ ══ */
function buildCompare(ms,w){
  var D=depth(), rows=[], names=ms.map(function(m){ return m.city.name; }), t0=ms.map(function(m){ return m.cur.temp; });
  function dm(m){ return dayAt(m,w.off||0); }
  var d0=ms.map(dm);
  var lines=[['Teď °C',function(m){ return r0(m.cur.temp)+' (poc. '+r0(m.cur.feel)+')'; },function(m){ return m.cur.temp; }],
    ['Obloha',function(m){ var s=skyOf(m.cur.code); return s[0]+' '+s[1]; },function(m){ return m.cur.code; }],
    [cap(dayLabel(addDays(ms[0].todayIso,w.off||0),ms[0].todayIso))+' max / min',function(m){ var d=dm(m); return d?r0(d.tmax)+' / '+r0(d.tmin)+' °C':'—'; },function(m){ var d=dm(m); return d?d.tmax:0; }],
    ['Srážky',function(m){ var d=dm(m); return d?(f1(d.rain)+' mm · '+r0(d.pop)+' %'):'—'; },function(m){ var d=dm(m); return d?d.rain:0; }],
    ['Vítr',function(m){ return r0(m.cur.wind)+' km/h '+dirShort(m.cur.dir); },function(m){ return m.cur.wind; }],
    ['Tlak',function(m){ return m.cur.press!=null?r0(m.cur.press)+' hPa':'—'; },function(m){ return m.cur.press||0; }],
    ['UV max',function(m){ var d=dm(m); return d&&d.uv!=null?String(r0(d.uv)):'—'; },function(m){ var d=dm(m); return d?nz(d.uv):0; }]];
  rows=lines.map(function(l){ return {cells:[{html:'<b>'+esc(l[0])+'</b>'}].concat(ms.map(function(m){ return {t:l[1](m),s:l[2](m)}; }))}; });
  var warmest=ms.slice().sort(function(a,b){ return b.cur.temp-a.cur.temp; })[0], diff=Math.max.apply(null,t0)-Math.min.apply(null,t0);
  var drier=ms.slice().sort(function(a,b){ var x=dm(a),y=dm(b); return (x?x.rain:0)-(y?y.rain:0); })[0];
  var lead='🌡 '+(diff<1?'Teď je v obou městech zhruba stejně ('+r0(t0[0])+' °C).':warmest.city.name+' je teď teplejší o '+f1(diff)+' °C ('+r0(warmest.cur.temp)+' °C proti '+r0(Math.min.apply(null,t0))+' °C).')
    +' '+(drier&&dm(drier)&&dm(drier).rain<(Math.max.apply(null,d0.map(function(d){ return d?d.rain:0; })))-0.3?'Sušší '+(w.off?dayLabel(addDays(ms[0].todayIso,w.off),ms[0].todayIso):'dnes')+' bude '+drier.city.name+'.':'Srážky vychází podobně.');
  var h=['<div class="ai2-lead a3-lead">'+esc(lead)+'</div>',tableHTML(['Údaj'].concat(names),rows,{compact:true}),
    '<div class="a3c-box">'+svgXY({W:340,H:190,labels:ms[0].hrs.slice(ms[0].iNow,ms[0].iNow+25).map(function(x){ return x.iso; }),title:'Teplota po hodinách',
      lines:ms.map(function(m,i){ return {v:m.hrs.slice(m.iNow,m.iNow+25).map(function(x){ return x.temp; }),cls:'a3c-s'+i}; }),unitLabel:'°C',
      xTick:function(k,iso){ var hh2=+iso.slice(11,13); return hh2%3===0?String(hh2):''; }})+legendHTML(names.map(function(n,i){ return {cls:'a3c-lg-s'+i,name:n}; }))+'</div>'];
  return {html:wrapWx(h.join('')),speech:lead,follow:[['📅 Na týden','předpověď na týden'],['🌧 Srážky','graf srážek']],
    steps:['🔤 Rozumím: srovnání '+names.join(' × '),'📡 Stahuju předpověď pro obě místa','📊 Skládám tabulku a graf','✅ Kontrola čísel'],
    think:[['Čemu rozumím',['Srovnání měst '+names.join(' a ')+'.']],['Co jsem četl',['Aktuální stav a hodinovou křivku z Open-Meteo pro každé město.']]],needModels:false,thinkIt:D>=2,kind:'srovnání měst'};
}

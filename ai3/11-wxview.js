/* ══════════════════════ 3) POČASÍ: zobrazení (karty, grafy, tabulky, rozbory) ══════════════════════ */
function tzClockNow(m){ var t=m.cur.time||''; return t.slice(11,16); }
function aboveSec(t){ return '<h4>'+t+'</h4>'; }

/* ── grafy ── */
function chartHours(m,i0,i1,o){
  o=o||{}; i0=Math.max(0,i0); i1=Math.min(m.hrs.length,i1);
  var hs=m.hrs.slice(i0,i1); if(hs.length<2) return '';
  var labels=hs.map(function(h){ return h.iso; });
  var step=hs.length<=14?1:(hs.length<=30?3:6);
  var bands=[], i, inNight=false, a=0;
  hs.forEach(function(h,k){
    var d=null; for(var q=0;q<m.days.length;q++) if(m.days[q].date===h.date) d=m.days[q];
    var sr=d&&d.sunrise?+d.sunrise.slice(11,13)+ +d.sunrise.slice(14,16)/60:6, ss=d&&d.sunset?+d.sunset.slice(11,13)+ +d.sunset.slice(14,16)/60:18;
    var night=(h.h+0.5)<sr||(h.h+0.5)>ss;
    if(night&&!inNight){ inNight=true; a=k; } if(!night&&inNight){ inNight=false; bands.push([a,k-1,'a3c-night']); }
  });
  if(inNight) bands.push([a,hs.length-1,'a3c-night']);
  var T=hs.map(function(h){ return h.temp; }), F=hs.map(function(h){ return h.feel; });
  var iMax=T.indexOf(mx(T)), iMin=T.indexOf(mn(T));
  var marks=[]; if(iMax>=0) marks.push({i:iMax,text:r0(T[iMax])+'°',cls:'a3c-mkhot'}); if(iMin>=0&&iMin!==iMax) marks.push({i:iMin,text:r0(T[iMin])+'°',below:true,cls:'a3c-mkcold'});
  var svg=svgXY({W:340,H:o.H||190,labels:labels,title:o.title||'Teplota a srážky po hodinách',
    lines:[{v:F,cls:'a3c-feel',dash:true},{v:T,cls:'a3c-temp'}],bars:[{v:hs.map(function(h){ return h.rain+h.snow*0.7; }),cls:'a3c-rain'}],
    barMin:2,bands:bands,marks:marks,zero:0,now:(m.iNow>=i0&&m.iNow<i1)?m.iNow-i0:null,
    xTick:function(k,iso){ var h=+iso.slice(11,13); return (h%step===0)?String(h):''; },
    xSub:function(k,iso){ var h=+iso.slice(11,13); return (h===0||k===0)?dayShort(iso.slice(0,10),m.todayIso):''; },
    tip:function(k){ var h=hs[k]; return pad2(h.h)+':00 · '+r0(h.temp)+' °C (pocitově '+r0(nz(h.feel,h.temp))+') · '+skyOf(h.code)[1]+' · srážky '+f1(h.rain+h.snow*0.7)+' mm ('+r0(h.pop)+' %) · vítr '+r0(h.wind)+' km/h'; }});
  return '<div class="a3c-box">'+svg+legendHTML([{cls:'a3c-lg-temp',name:'teplota °C'},{cls:'a3c-lg-feel',name:'pocitová'},{cls:'a3c-lg-rain',name:'srážky mm'},{cls:'a3c-lg-night',name:'noc'}])+'</div>';
}
function chartMetric(m,key,i0,i1,o){
  o=o||{}; i0=Math.max(0,i0); i1=Math.min(m.hrs.length,i1); var hs=m.hrs.slice(i0,i1); if(hs.length<2) return '';
  var step=hs.length<=14?1:(hs.length<=30?3:6);
  var lines=[],leg=[],unit='';
  if(key==='wind'){ lines=[{v:hs.map(function(h){ return h.gust; }),cls:'a3c-gust',dash:true},{v:hs.map(function(h){ return h.wind; }),cls:'a3c-wind',area:true}]; leg=[{cls:'a3c-lg-wind',name:'vítr km/h'},{cls:'a3c-lg-gust',name:'nárazy'}]; unit='km/h'; }
  else if(key==='press'){ lines=[{v:hs.map(function(h){ return h.press; }),cls:'a3c-press',area:true}]; leg=[{cls:'a3c-lg-press',name:'tlak hPa'}]; unit='hPa'; }
  else if(key==='hum'){ lines=[{v:hs.map(function(h){ return h.hum; }),cls:'a3c-hum',area:true}]; leg=[{cls:'a3c-lg-hum',name:'vlhkost %'}]; unit='%'; }
  else if(key==='cloud'){ lines=[{v:hs.map(function(h){ return h.cloud; }),cls:'a3c-cloud',area:true}]; leg=[{cls:'a3c-lg-cloud',name:'oblačnost %'}]; unit='%'; }
  else if(key==='rain'){ var bars=[{v:hs.map(function(h){ return h.rain+h.snow*0.7; }),cls:'a3c-rain'}], pops=hs.map(function(h){ return h.pop; });
    return '<div class="a3c-box">'+svgXY({W:340,H:o.H||170,labels:hs.map(function(h){ return h.iso; }),title:'Srážky po hodinách',bars:bars,barMin:2,unitLabel:'mm',
      now:(m.iNow>=i0&&m.iNow<i1)?m.iNow-i0:null,xTick:function(k,iso){ var h=+iso.slice(11,13); return h%step===0?String(h):''; },
      xSub:function(k,iso){ var h=+iso.slice(11,13); return (h===0||k===0)?dayShort(iso.slice(0,10),m.todayIso):''; },
      tip:function(k){ var h=hs[k]; return pad2(h.h)+':00 · '+f1(h.rain+h.snow*0.7)+' mm · šance '+r0(h.pop)+' %'; }})
      +legendHTML([{cls:'a3c-lg-rain',name:'srážky mm za hodinu'}])+'</div>'; }
  else return chartHours(m,i0,i1,o);
  return '<div class="a3c-box">'+svgXY({W:340,H:o.H||170,labels:hs.map(function(h){ return h.iso; }),title:o.title||key,lines:lines,unitLabel:unit,
    yMin:key==='hum'||key==='cloud'?0:null,yMax:key==='hum'||key==='cloud'?100:null,
    now:(m.iNow>=i0&&m.iNow<i1)?m.iNow-i0:null,xTick:function(k,iso){ var h=+iso.slice(11,13); return h%step===0?String(h):''; },
    xSub:function(k,iso){ var h=+iso.slice(11,13); return (h===0||k===0)?dayShort(iso.slice(0,10),m.todayIso):''; },
    tip:function(k){ var h=hs[k]; return pad2(h.h)+':00 · '+(key==='wind'?r0(h.wind)+' km/h, nárazy '+r0(h.gust):fmtTick(h[key])+' '+unit); }})+legendHTML(leg)+'</div>';
}
/* denní „rozpětí" — sloupec od minima k maximu, barva podle teploty, dole srážky */
function chartDays(m,d0,d1,o){
  o=o||{}; var ds=m.days.slice(Math.max(0,d0),Math.min(m.days.length,d1+1)).filter(function(d){ return d.tmax!=null&&d.tmin!=null; });
  if(ds.length<2) return '';
  var n=ds.length, W=340,H=o.H||200, pl=26, pr=8, pt=30, pb=58, pw=W-pl-pr, bw=pw/n, ph=H-pt-pb;
  var lo=Math.min.apply(null,ds.map(function(d){ return d.tmin; })), hi=Math.max.apply(null,ds.map(function(d){ return d.tmax; }));
  var sc=niceScale(lo,hi,4), rmax=Math.max(2,Math.max.apply(null,ds.map(function(d){ return d.rain+d.snow*0.7; })));
  function Y(v){ return pt+ph-(v-sc.min)/(sc.max-sc.min)*ph; }
  var out=['<svg class="a3c" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Teploty a srážky po dnech" xmlns="http://www.w3.org/2000/svg">'];
  sc.ticks.forEach(function(t){ var y=Y(t); out.push('<line class="a3c-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'"/><text class="a3c-tx a3c-yl" x="'+(pl-4)+'" y="'+(y+3).toFixed(1)+'" text-anchor="end">'+fmtTick(t)+'</text>'); });
  if(sc.min<0&&sc.max>0) out.push('<line class="a3c-zero" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'"/>');
  ds.forEach(function(d,i){
    var cx=pl+(i+0.5)*bw, w=Math.min(18,bw*0.52), y1=Y(d.tmax), y2=Y(d.tmin), isT=d.date===m.todayIso;
    if(isT) out.push('<rect class="a3c-today" x="'+(pl+i*bw).toFixed(1)+'" y="'+(pt-24)+'" width="'+bw.toFixed(1)+'" height="'+(H-pt+24-4)+'" rx="6"/>');
    out.push('<text x="'+cx.toFixed(1)+'" y="'+(pt-12)+'" text-anchor="middle" font-size="13">'+skyOf(d.code)[0]+'</text>');
    out.push('<rect class="a3c-range" x="'+(cx-w/2).toFixed(1)+'" y="'+y1.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+Math.max(4,y2-y1).toFixed(1)+'" rx="'+(w/2).toFixed(1)+'" style="fill:'+tcol((d.tmax+d.tmin)/2)+'"><title>'+esc(dayLabel(d.date,m.todayIso)+' · '+r0(d.tmin)+' až '+r0(d.tmax)+' °C · srážky '+f1(d.rain)+' mm ('+r0(d.pop)+' %) · vítr do '+r0(nz(d.gust,d.wind))+' km/h')+'</title></rect>');
    out.push('<text class="a3c-tx a3c-vl" x="'+cx.toFixed(1)+'" y="'+(y1-4).toFixed(1)+'" text-anchor="middle">'+r0(d.tmax)+'°</text>');
    out.push('<text class="a3c-tx a3c-vl a3c-dim" x="'+cx.toFixed(1)+'" y="'+(y2+11).toFixed(1)+'" text-anchor="middle">'+r0(d.tmin)+'°</text>');
    var mm=d.rain+d.snow*0.7, bh=mm>0?Math.max(2,mm/rmax*24):0;
    if(bh) out.push('<rect class="a3c-bar a3c-rain" x="'+(cx-w/2).toFixed(1)+'" y="'+(H-22-bh).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="2"/>');
    if(mm>=0.1) out.push('<text class="a3c-tx a3c-xs" x="'+cx.toFixed(1)+'" y="'+(H-25-bh).toFixed(1)+'" text-anchor="middle">'+f1(mm)+'</text>');
    out.push('<text class="a3c-tx a3c-xl'+(isT?' a3c-strong':'')+'" x="'+cx.toFixed(1)+'" y="'+(H-10)+'" text-anchor="middle">'+esc(dayShort(d.date,m.todayIso))+'</text>');
  });
  out.push('</svg>');
  return '<div class="a3c-box">'+out.join('')+legendHTML([{cls:'a3c-lg-range',name:'min–max °C'},{cls:'a3c-lg-rain',name:'srážky mm'}])+'</div>';
}

/* ── tabulky ── */
function periodSky(hs){
  if(!hs.length) return ['—','']; var worst=null,sev=-1;
  hs.forEach(function(h){ var s=h.code>=95?9:((h.code>=71&&h.code<=77)||h.code===85||h.code===86?8:(h.code>=61?7:(h.code>=51?6:(h.code===45||h.code===48?5:0)))); if(s>sev){ sev=s; worst=h; } });
  if(sev>=5&&worst) return skyOf(worst.code);
  var c=avg(hs.map(function(h){ return nz(h.cloud); })); return skyOf(c<12?0:(c<32?1:(c<58?2:3)));
}
function partsTable(m,date){
  var hs=hoursOf(m,date); if(!hs.length) return '';
  var P=[['Noc',0,6],['Ráno',6,9],['Dopoledne',9,12],['Odpoledne',12,18],['Večer',18,24]], rows=[];
  P.forEach(function(p){
    var a=between(hs,p[1],p[2]); if(!a.length) return;
    var T=a.map(function(h){ return h.temp; }), mm=sum(a.map(function(h){ return h.rain+h.snow*0.7; })), pop=mx(a.map(function(h){ return h.pop; })), sk=periodSky(a);
    var isNow=date===m.todayIso&&m.hrs[m.iNow]&&m.hrs[m.iNow].h>=p[1]&&m.hrs[m.iNow].h<p[2];
    rows.push({_cls:isNow?'a3-now':'',cells:[{html:'<b>'+p[0]+'</b><small> '+p[1]+'–'+p[2]+'</small>',s:p[1]},{html:sk[0]+' '+esc(sk[1]),s:sk[1]},{t:r0(mn(T))+'…'+r0(mx(T))+' °C',s:avg(T)},{t:mm>=0.1?f1(mm)+' mm · '+r0(pop)+' %':(pop>=20?'0 · '+r0(pop)+' %':'—'),s:mm},{t:r0(avg(a.map(function(h){ return h.wind; })))+' / '+r0(mx(a.map(function(h){ return h.gust; })))+' km/h',s:avg(a.map(function(h){ return h.wind; }))}]});
  });
  return tableHTML(['Část dne','Obloha','Teplota','Srážky','Vítr / nárazy'],rows,{compact:true,actions:false});
}
function rangeBar(d,lo,hi){
  var span=Math.max(1,hi-lo), a=(d.tmin-lo)/span*100, w=Math.max(6,(d.tmax-d.tmin)/span*100);
  return '<span class="a3-rng"><i style="left:'+a.toFixed(0)+'%;width:'+w.toFixed(0)+'%;background:linear-gradient(90deg,'+tcol(d.tmin)+','+tcol(d.tmax)+')"></i></span>';
}
function weekTable(m,d0,d1,o){
  o=o||{}; var ds=m.days.slice(Math.max(0,d0),Math.min(m.days.length,d1+1)).filter(function(d){ return d.tmax!=null; });
  if(!ds.length) return '';
  var lo=Math.min.apply(null,ds.map(function(d){ return d.tmin; })), hi=Math.max.apply(null,ds.map(function(d){ return d.tmax; }));
  var rows=ds.map(function(d,i){
    var sk=skyOf(d.code), mm=d.rain+d.snow*0.7;
    return {_cls:d.date===m.todayIso?'a3-now':'',cells:[
      {html:'<b>'+esc(dayShort(d.date,m.todayIso))+'</b><small> '+dmy(d.date)+'</small>',s:i},
      {html:sk[0]+' <span class="a3-sm">'+esc(sk[1])+'</span>',s:sk[1]},
      {html:'<b>'+r0(d.tmax)+'°</b> / '+r0(d.tmin)+'° '+rangeBar(d,lo,hi),s:d.tmax},
      {t:mm>=0.1?f1(mm)+' mm':'—',s:mm},{t:r0(d.pop)+' %',s:d.pop},
      {t:r0(nz(d.wind))+(d.gust?' ('+r0(d.gust)+')':'')+' '+dirShort(d.dir),s:nz(d.wind)}]};
  });
  return tableHTML(['Den','Obloha','Max / min','Srážky','Šance','Vítr'],rows,{compact:true,actions:o.actions});
}

/* ── hero a čipy ── */
function heroHTML(m){
  var c=m.cur, sk=skyOf(c.code), nm=m.city&&m.city.name||'tady';
  return '<div class="a3-hero"><div class="a3-hico">'+sk[0]+'</div><div class="a3-htemp">'+r0(c.temp)+'°'
    +(c.feel!=null?'<small>pocitově '+r0(c.feel)+'°</small>':'')+'</div><div class="a3-hmeta"><b>'+esc(nm)+'</b><span>'+esc(sk[1])+' · '+(tzClockNow(m)?'naměřeno '+tzClockNow(m):'teď')+'</span></div></div>';
}
function chipsNow(m){
  var c=m.cur, pt=pressTrend(m), d=dayAt(m,0), ch=[];
  if(c.hum!=null) ch.push('💧 '+r0(c.hum)+' %');
  ch.push('🌬 '+r0(c.wind)+' km/h '+dirShort(c.dir)+(c.gust>c.wind+8?', nárazy '+r0(c.gust):''));
  if(c.press!=null) ch.push('🧭 '+r0(c.press)+' hPa'+(pt?(pt.d12<=-2?' ↘':(pt.d12>=2?' ↗':' →')):''));
  if(c.cloud!=null) ch.push('☁ '+r0(c.cloud)+' %');
  if(d&&d.uv!=null) ch.push('☀ UV '+r0(d.uv));
  if(d&&d.sunrise) ch.push('🌅 '+hhmm(d.sunrise)+' · 🌇 '+hhmm(d.sunset));
  return '<div class="a3-chips">'+ch.map(function(x){ return '<span>'+x+'</span>'; }).join('')+'</div>';
}
function chipBtns(list){ return '<div class="a3-follow">'+list.map(function(q){ return '<button type="button" class="a3-chip" data-a3ask="'+esc(q[1])+'">'+esc(q[0])+'</button>'; }).join('')+'</div>'; }
function insightsHTML(list,n){
  list=list.slice(0,n); if(!list.length) return '';
  return '<ul class="a3-ins">'+list.map(function(x){ return '<li><span>'+x.ic+'</span><div>'+esc(x.t)+'</div></li>'; }).join('')+'</ul>';
}
function adviceHTML(list,n){
  list=list.slice(0,n); if(!list.length) return '';
  return '<ul class="a3-ins a3-adv">'+list.map(function(x){ return '<li><span>'+x.ic+'</span><div>'+esc(x.t)+'</div></li>'; }).join('')+'</ul>';
}
function wrapWx(inner){ return '<div class="ai3-wx">'+inner+'</div>'; }

/* ── srovnání předpovědních modelů (Ultraagent) ── */
function modelsCompare(city,m){
  var c=city&&city.lat!=null?city:HOME(); if(!c||c.lat==null) return Promise.resolve(null);
  var url='https://api.open-meteo.com/v1/forecast?latitude='+c.lat+'&longitude='+c.lon
   +'&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&models=ecmwf_ifs025,icon_seamless,gfs_seamless&forecast_days=5&timezone=auto';
  return X.withTimeout(fetch(url).then(function(r){ if(!r.ok) throw 0; return r.json(); }),14000,null).then(function(j){
    if(!j||!j.daily) return null;
    var MODS=[['ecmwf_ifs025','ECMWF'],['icon_seamless','ICON'],['gfs_seamless','GFS']], D=j.daily, t=D.time||[], rows=[], spreads=[], agree=[];
    var got=MODS.filter(function(md){ return D['temperature_2m_max_'+md[0]]; }); if(got.length<2) return null;
    for(var i=0;i<Math.min(t.length,4);i++){
      var tx=got.map(function(md){ return D['temperature_2m_max_'+md[0]][i]; }).filter(function(x){ return x!=null; });
      var pr=got.map(function(md){ return nz(D['precipitation_sum_'+md[0]]&&D['precipitation_sum_'+md[0]][i]); });
      if(!tx.length) continue; var sp=Math.max.apply(null,tx)-Math.min.apply(null,tx), wet=pr.filter(function(x){ return x>=1; }).length;
      spreads.push(sp); agree.push(wet===0||wet===pr.length);
      var verdict=sp<=1.5?'✅ dobrá shoda':(sp<=3.5?'🟡 střední':'🔴 rozcházejí se');
      rows.push({cells:[{html:'<b>'+esc(dayShort(t[i],m.todayIso))+'</b>',s:i}].concat(tx.map(function(v){ return {t:r0(v)+'°',s:v}; })).concat([{t:(wet===0?'sucho':(wet===pr.length?'mokro':wet+'/'+pr.length+' modely déšť')),s:wet},{t:verdict,s:sp}])});
    }
    if(!rows.length) return null;
    var avgSp=avg(spreads);
    return {html:tableHTML(['Den'].concat(got.map(function(md){ return md[1]+' max'; })).concat(['Srážky','Shoda']),rows,{compact:true,actions:false}),
      avgSpread:avgSp,names:got.map(function(md){ return md[1]; }),
      verdict:avgSp<=1.5?'Tři nezávislé modely se v teplotách shodují (průměrný rozptyl '+f1(avgSp)+' °C) — předpověď je spolehlivá.':(avgSp<=3.5?'Modely se shodují jen zhruba (průměrný rozptyl '+f1(avgSp)+' °C) — počítej s odchylkou pár stupňů.':'Modely se výrazně rozcházejí (rozptyl '+f1(avgSp)+' °C) — předpověď je nejistá, sleduj ji průběžně.')};
  }).catch(function(){ return null; });
}

/* ── společné skládání karet ── */
function sectionHTML(title,html){ return html?('<h4>'+title+'</h4>'+html):''; }
function thinkBox(rows){
  return '<details class="ai2-think-box"'+(depth()>=3?' open':'')+'><summary>🧠 Extended thinking — jak jsem k tomu došel</summary>'
   +rows.map(function(r){ return '<div class="ai2-tb-sec"><b>'+esc(r[0])+'</b><ul>'+r[1].map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>'; }).join('')
   +'<div class="ai2-tb-note">Čísla beru přímo z předpovědních dat appky (Open-Meteo), nic si nedomýšlím — rozdíl mezi modely je v tom, kolik pohledů ti ukážu.</div></details>';
}
function sourceNote(m){
  var t=m&&m.cur&&m.cur.time?m.cur.time.slice(11,16):''; return '<div class="ai2-note">Zdroj: Open-Meteo (best match)'+(t?' · stav z '+t:'')+(m&&!m.home?' · cizí město, staženo právě teď':'')+'.</div>';
}

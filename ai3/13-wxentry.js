/* ══════════════════════ 5) ODPOVÍDÁNÍ: přemýšlení, odznak, vykreslení ══════════════════════ */
var forceDepth=null;
function depthNow(){ return forceDepth||depth(); }
function think(st,steps,total){
  var per=Math.max(220,total/Math.max(1,steps.length)), i=0;
  return new Promise(function(res){ (function next(){ if(st.rush||i>=steps.length) return res(); st.log(steps[i++]); setTimeout(next,per); })(); });
}
function nstepsFor(M){ return M.depth>=3?7:(M.depth>=2?5:2); }
function targetMs(M){ return M.depth>=3?11000:(M.depth>=2?6000:1400); }
function thinkHTMLOf(r,M){
  if(!r.think||M.depth<2) return '';
  return thinkBox(r.think);
}
/* společné dokončení: karta s odznakem, přemýšlení a doplňky */
function respond(text,fromVoice,make,opts){
  opts=opts||{};
  if(!opts.noUser) X.addUser(text);
  if(X.busy()){ X.note('Ještě dopřemýšlím tu předchozí otázku — hned jsem u tebe.'); return; }
  X.setBusy(true);
  var M=AI2.cur(), st=X.thinker(M), t0=Date.now();
  st.log('🔤 Rozkládám dotaz a hledám, čeho se týká');
  Promise.resolve().then(make).then(function(r){
    if(!r){ throw new Error('empty'); }
    var steps=(r.steps||[]).slice(0,nstepsFor(M));
    var extra=(r.async?r.async(M,st):Promise.resolve(null));
    return Promise.all([think(st,steps,targetMs(M)),extra]).then(function(a){ return {r:r,extra:a[1]}; });
  }).then(function(o){
    var r=o.r, secs=st.end(), html='<div class="ai2-badge">'+M.ic+' '+esc(M.name)+' · '+secs.toFixed(1).replace('.',',')+' s · '+esc(r.kind||'odpověď')+(M.ext?' · extended thinking':'')+'</div>';
    if(r.pre) html+=r.pre;
    html+=r.html;
    if(o.extra&&o.extra.html) html+=o.extra.html;
    if(r.think&&M.depth>=2){
      var th=r.think.slice(); if(o.extra&&o.extra.verdict) th.push(['Kontrola modelů',[o.extra.verdict,'Porovnáno: '+(o.extra.names||[]).join(', ')+'.']]); html+=thinkBox(th);
    }
    if(r.note) html+=r.note;
    if(r.follow) html+=chipBtns(r.follow);
    var el=X.addHTML(html);
    try{ if(X.voice()||fromVoice) X.sayText((r.speech||'')+(o.extra&&o.extra.verdict?' '+o.extra.verdict:'')); }catch(e){}
    X.setBusy(false);
    if(r.after) try{ r.after(el); }catch(e){}
  }).catch(function(err){
    try{ st.end(); }catch(e){} X.setBusy(false);
    try{ console.warn('[AI3]',err); }catch(e){}
    X.note('Tohle se mi teď nepodařilo složit. Zkus to prosím jinak, nebo se zeptej na část — třeba jen na teplotu.');
  });
}
function noData(){
  return '<div class="ai2-lead">Počasí se ještě načítá — dej mi pár vteřin a zeptej se znovu. ⏳</div>';
}

/* hodinová tabulka */
function hoursTable(m,i0,i1){
  var hs=m.hrs.slice(Math.max(0,i0),Math.min(m.hrs.length,i1)); if(!hs.length) return '';
  return tableHTML(['Čas','Obloha','Teplota','Srážky','Vítr'],hs.map(function(h){
    var sk=skyOf(h.code), mm=h.rain+h.snow*0.7;
    return {_cls:h.i===m.iNow?'a3-now':'',cells:[{t:pad2(h.h)+':00',s:h.i},{t:sk[0]+' '+sk[1],s:sk[1]},{t:r0(h.temp)+' °C',s:h.temp},{t:mm>=0.1?f1(mm)+' mm · '+r0(h.pop)+' %':(h.pop>=20?'0 · '+r0(h.pop)+' %':'—'),s:mm},{t:r0(h.wind)+' km/h',s:h.wind}]};
  }),{compact:true});
}
function buildHourly(m,w,win){
  var D=depthNow(), date=win.date||m.todayIso, hs=hoursOf(m,date);
  var a=(date===m.todayIso&&!win.full)?Math.max(hs[0].i,m.iNow-1):hs[0].i, b=Math.min(a+24,m.hrs.length);
  if(win.part||win.point){ a=win.a; b=win.b; }
  var S=dayHeadline(m,date), h=[];
  var lead=(S.lead+' '+(S.wet||'')+' '+S.temp).trim();
  h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
  h.push(chartHours(m,a,b));
  h.push(sectionHTML('🕒 Hodinu po hodině',hoursTable(m,a,b)));
  if(D>=2) h.push(insightsHTML(insights(m,date),D>=3?6:4));
  return {html:wrapWx(h.join('')),speech:lead,kind:badgeKind(m,w),follow:[['📅 Na týden','předpověď na týden'],['🌧 Srážky','graf srážek'],['🔮 Zítra','hodinová předpověď zítra']],
    steps:['🔤 Rozumím: hodinová předpověď · '+(m.city&&m.city.name||'tady'),'📡 Beru '+(b-a)+' hodin z '+m.hrs.length,'📈 Kreslím křivku teploty a srážek','🕒 Skládám tabulku po hodinách','✅ Kontrola čísel'],
    think:[['Čemu rozumím',['Hodinová předpověď pro '+dayLabel(date,m.todayIso)+'.']]],thinkIt:D>=2};
}

/* srovnání dnů: „je zítra tepleji než dnes?" */
function buildDayCompare(m,w1,w2){
  var d1=dateFor(m,w1), d2=dateFor(m,w2), a=dayStats(m,d1), b=dayStats(m,d2); if(!a||!b) return null;
  var l1=dayLabel(d1,m.todayIso), l2=dayLabel(d2,m.todayIso), dx=a.tmax-b.tmax;
  var lead=cap(l1)+' bude '+(Math.abs(dx)<1?'zhruba stejně jako '+l2:(dx>0?'tepleji než '+l2+' (o '+r0(dx)+' °C)':'chladněji než '+l2+' (o '+r0(-dx)+' °C)'))+': maxima '+r0(a.tmax)+' °C proti '+r0(b.tmax)+' °C. '
    +'Srážky: '+(a.rain>=0.1?f1(a.rain)+' mm':'žádné')+' proti '+(b.rain>=0.1?f1(b.rain)+' mm':'žádným')+'.';
  var rows=[['Obloha',skyOf(a.code)[0]+' '+skyOf(a.code)[1],skyOf(b.code)[0]+' '+skyOf(b.code)[1]],['Max / min',r0(a.tmax)+' / '+r0(a.tmin)+' °C',r0(b.tmax)+' / '+r0(b.tmin)+' °C'],
    ['Srážky',f1(a.rain)+' mm · '+r0(a.pop)+' %',f1(b.rain)+' mm · '+r0(b.pop)+' %'],['Vítr (nárazy)',r0(a.wind)+' ('+r0(a.gust)+') km/h',r0(b.wind)+' ('+r0(b.gust)+') km/h'],['UV',a.uv!=null?String(r0(a.uv)):'—',b.uv!=null?String(r0(b.uv)):'—']];
  var h=['<div class="ai2-lead a3-lead">'+esc(lead)+'</div>',tableHTML(['Údaj',cap(l1),cap(l2)],rows.map(function(r){ return {cells:[{html:'<b>'+r[0]+'</b>'},r[1],r[2]]}; }),{compact:true})];
  var i0=hoursOf(m,d1)[0].i, i1=hoursOf(m,d1)[hoursOf(m,d1).length-1].i+1, j0=hoursOf(m,d2)[0].i;
  h.push('<div class="a3c-box">'+svgXY({W:340,H:180,labels:hoursOf(m,d1).map(function(x){ return x.iso; }),title:'Teplota po hodinách',
    lines:[{v:hoursOf(m,d2).map(function(x){ return x.temp; }),cls:'a3c-s1',dash:true},{v:hoursOf(m,d1).map(function(x){ return x.temp; }),cls:'a3c-s0'}],unitLabel:'°C',
    xTick:function(k,iso){ var q=+iso.slice(11,13); return q%3===0?String(q):''; }})+legendHTML([{cls:'a3c-lg-s0',name:cap(l1)},{cls:'a3c-lg-s1',name:cap(l2)}])+'</div>');
  return {html:wrapWx(h.join('')),speech:lead,kind:'srovnání dnů',follow:[['📅 Na týden','předpověď na týden']],steps:['🔤 Rozumím: srovnání '+l1+' × '+l2,'📡 Vybírám hodiny obou dnů','📊 Skládám tabulku a křivky','✅ Kontrola čísel'],think:[['Čemu rozumím',['Srovnání dvou dnů: '+l1+' a '+l2+'.']]],thinkIt:depthNow()>=2};
}

/* ══ vstupní bod: dotaz na počasí ══ */
function wxExtras(city,m,r){
  /* Ultraagent: porovnání tří předpovědních modelů */
  if(r.needModels&&depth()>=3){
    r.steps=(r.steps||[]).concat(['🌍 Porovnávám modely ECMWF · ICON · GFS','🧮 Počítám rozptyl a shodu na déšť']);
    r.async=function(M,st){ return modelsCompare(city,m).then(function(x){
      if(!x){ st.log('📴 Porovnání modelů se nepodařilo stáhnout — ukazuju jen hlavní předpověď'); return {html:'<div class="ai2-note">Porovnání předpovědních modelů se teď nepodařilo načíst, zobrazuju hlavní předpověď.</div>'}; }
      st.log('✅ '+x.verdict);
      return {html:'<h4>🌍 Tři modely vedle sebe</h4>'+x.html+'<div class="ai2-note">'+esc(x.verdict)+'</div>',verdict:x.verdict,names:x.names}; }); };
  }
  return r;
}
function handleWx(text,f,fromVoice,opt){
  opt=opt||{};
  var w=opt.w||parseWhen(f), topic=opt.topic||topicOf(f);
  var city=opt.city!==undefined?opt.city:cityIn(text);
  var fol=ctxFresh()&&CTX.intent==='wx';
  if(!city&&fol&&opt.follow&&CTX.city&&!/ (tady|u me|domu|doma) /.test(' '+f+' ')) city=CTX.city;
  if(opt.follow&&fol){ if(!w.any&&CTX.w){ w=JSON.parse(JSON.stringify(CTX.w)); } if(topic==='general'&&CTX.topic) topic=CTX.topic; }
  /* přítomný čas bez časového údaje = „teď“ („kolik je stupňů“, „jaký je vítr“, „prší?“) */
  if(!w.any&&topic!=='general'&&/ (je|jsou|prsi|fouka|sviti|mrzne|snezi) /.test(' '+f+' ')&&!/ (bude|budou|bylo|byl|zitra|pozitri|vikend) /.test(' '+f+' ')){ w=Object.assign({},w,{now:true}); }
  var wantTable=/ (tabulk|tabulka|prehled) /.test(' '+f+' '), wantChart=/ (graf|grafu|grafy|diagram|krivk|nakresli|zobraz) /.test(' '+f+' ');
  var hourly=/ (hodinov\w*|po hodinach|hodinu po hodine|kazdou hodinu|hodinovka) /.test(' '+f+' ');
  if(/ (stru(c|n)ne|zkratka|jednou vetou|jen strucne) /.test(' '+f+' ')) forceDepth=1;
  else if(/ (podrobne|podrobneji|detailne|detailneji|do hloubky|vsechno|vse o|celou zpravu|rozved|vic detailu|vice detailu) /.test(' '+f+' ')) forceDepth=3;
  else forceDepth=null;
  var twoC=twoCities(text,f);
  respond(text,fromVoice,function(){
    if(twoC){ return Promise.all([cityModel(twoC[0]),cityModel(twoC[1])]).then(function(ms){ if(!ms[0]||!ms[1]) return {html:noData(),kind:'počasí',steps:[]}; return wxExtras(null,ms[0],buildCompare(ms,w)); }); }
    return cityModel(city).then(function(m){
      if(!m) return {html:noData(),kind:'počasí',steps:[]};
      CTX.city=city&&!sameCity(city,HOME())?city:null; CTX.w=w; CTX.topic=topic; touch('wx');
      var r;
      var dayCmp=dayCompareOf(f);
      if(dayCmp){ r=buildDayCompare(m,dayCmp[0],dayCmp[1]); if(r) return wxExtras(city,m,r); }
      var win=mkWin(m,Object.assign({},w,{explicit:(w.any&&!w.now)||topic==='sun'||topic==='uv'}));
      if(!win){
        var maxOff=m.days.length-1-m.dT;
        return {html:'<div class="ai2-lead">Tak daleko dopředu předpověď nesahá — mám data zhruba '+maxOff+' dní dopředu. Zkus se zeptat na kratší horizont, nebo na „předpověď na 14 dní“.</div>',kind:'počasí',steps:[],follow:[['📅 14 dní','předpověď na 14 dní'],['🔮 Zítra','počasí zítra']]}; }
      if(hourly&&!win.range&&topic==='general') r=buildHourly(m,w,win);
      else if(win.range) r=buildRange(m,w,win);
      else if(topic!=='general') r=buildFocus(m,topic,w,win);
      else if((w.any&&!w.now)||win.part||win.point) r=buildDay(m,w,win);
      else r=buildOverview(m,w);
      if(wantTable&&!win.range&&topic!=='general'){ var dt=win.date||m.todayIso, hs0=hoursOf(m,dt); r.html=r.html.replace(/<\/div>$/,sectionHTML('🕒 Tabulka po hodinách',hoursTable(m,win.a,win.b))+'</div>'); }
      var sw=r; r=wxExtras(city,m,sw); return r;
    });
  });
}
function twoCities(text,f){
  if(!/ (nebo|versus|vs|porovnej|srovnej|srovnani|porovnani|kde je) /.test(' '+f+' ')&&!/ a /.test(' '+f+' ')) return null;
  var parts=String(text).split(/\s+(?:nebo|versus|vs\.?|a|či|ci)\s+|,|\s+oproti\s+|\s+než\s+/i), found=[];
  parts.forEach(function(p){ var c=cityIn(p); if(c&&!found.some(function(x){ return x.name===c.name; })) found.push(c); });
  return found.length>=2?found.slice(0,2):null;
}
function dayCompareOf(f){
  var s=' '+f+' ';
  if(!/ (nez|oproti|ve srovnani|vs) /.test(s)||!/ (tepleji|chladneji|hur|lip|vic|min|mokreji|sucheji|vetrneji|lepsi|horsi|jine|rozdil|zmeni|oteplilo|ochladi) /.test(s)) return null;
  var a=null,b=null,parts=s.split(/ (?:nez|oproti|ve srovnani s|vs) /);
  if(parts.length<2) return null; var w1=parseWhen(' '+parts[0]+' '), w2=parseWhen(' '+parts[1]+' ');
  if(!w1.any&&w2.any) w1={off:w2.off===0?1:0}; if(!w2.any&&w1.any) w2={off:w1.off===0?-1:0};
  if(!w1.any&&!w2.any) return null; return [w1,w2];
}

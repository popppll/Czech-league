/* ══════════════════════ 2) POČASÍ: datový model, statistiky, vyprávění ══════════════════════ */
var SKY={0:['☀️','jasno'],1:['🌤️','skoro jasno'],2:['⛅','polojasno'],3:['☁️','zataženo'],45:['🌫️','mlha'],48:['🌫️','namrzající mlha'],
  51:['🌦️','slabé mrholení'],53:['🌦️','mrholení'],55:['🌧️','silné mrholení'],56:['🌧️','mrznoucí mrholení'],57:['🌧️','silné mrznoucí mrholení'],
  61:['🌦️','slabý déšť'],63:['🌧️','déšť'],65:['🌧️','silný déšť'],66:['🌧️','mrznoucí déšť'],67:['🌧️','silný mrznoucí déšť'],
  71:['🌨️','slabé sněžení'],73:['🌨️','sněžení'],75:['❄️','silné sněžení'],77:['❄️','sněhové krupky'],
  80:['🌦️','slabé přeháňky'],81:['🌧️','přeháňky'],82:['⛈️','silné přeháňky'],85:['🌨️','sněhové přeháňky'],86:['❄️','silné sněhové přeháňky'],
  95:['⛈️','bouřka'],96:['⛈️','bouřka s kroupami'],99:['⛈️','silná bouřka s kroupami']};
function skyOf(c){ return SKY[c]||['🌡️','proměnlivo']; }
function codeKind(c){
  if(c>=95) return 'bouře'; if((c>=71&&c<=77)||c===85||c===86) return 'sníh';
  if(c>=80&&c<=82) return 'přeháňky'; if(c>=51&&c<=57) return 'mrholení'; if(c>=61&&c<=67) return 'déšť';
  if(c===45||c===48) return 'mlha'; return null;
}
var KIND={
  'déšť':{ins:'deštěm',adj:['slabým','mírným','silným','prudkým'],verb:'bude pršet'},
  'přeháňky':{ins:'přeháňkami',adj:['slabými','mírnými','silnými','prudkými'],verb:'přijdou přeháňky'},
  'mrholení':{ins:'mrholením',adj:['slabým','mírným','silným','silným'],verb:'bude mrholit'},
  'sníh':{ins:'sněžením',adj:['slabým','mírným','silným','intenzivním'],verb:'bude sněžit'},
  'bouře':{ins:'bouřkami',adj:['slabými','mírnými','silnými','prudkými'],verb:'přijdou bouřky'}
};
var COMPASS=['severu','severoseveru','severovýchodu','východoseveru','východu','východojihu','jihovýchodu','jihojihovýchodu','jihu','jihojihozápadu','jihozápadu','západojihu','západu','západoseveru','severozápadu','severoseveru'];
var COMP8=['ze severu','ze severovýchodu','z východu','z jihovýchodu','z jihu','z jihozápadu','ze západu','ze severozápadu'];
function dirText(deg){ if(deg==null||isNaN(deg)) return ''; return COMP8[Math.round(deg/45)%8]; }
function dirShort(deg){ if(deg==null||isNaN(deg)) return ''; return ['S','SV','V','JV','J','JZ','Z','SZ'][Math.round(deg/45)%8]; }
function windWord(k){ return k<6?'bezvětří':(k<13?'slabý vítr':(k<22?'mírný vítr':(k<32?'čerstvý vítr':(k<45?'silný vítr':(k<62?'velmi silný vítr':'vichr'))))); }
function tdesc(t){ return t<=-10?'třeskutý mráz':(t<=-3?'mráz':(t<=2?'kolem nuly':(t<9?'chladno':(t<15?'svěže':(t<21?'příjemně':(t<26?'teplo':(t<31?'horko':'úmorné vedro'))))))); }
function cloudWord(c){ return c<12?'jasno':(c<32?'skoro jasno':(c<58?'polojasno':(c<82?'oblačno':'zataženo'))); }
function tcol(t){
  var S=[[-15,[138,180,255]],[0,[111,211,255]],[10,[123,224,160]],[20,[255,210,77]],[28,[255,159,67]],[36,[255,90,79]]];
  if(t<=S[0][0]) return 'rgb('+S[0][1]+')'; if(t>=S[S.length-1][0]) return 'rgb('+S[S.length-1][1]+')';
  for(var i=0;i<S.length-1;i++) if(t<=S[i+1][0]){ var k=(t-S[i][0])/(S[i+1][0]-S[i][0]), a=S[i][1], b=S[i+1][1];
    return 'rgb('+[0,1,2].map(function(j){ return Math.round(a[j]+(b[j]-a[j])*k); }).join(',')+')'; }
}

/* ── model z dat Open-Meteo (domácí město z appky, ostatní se dotáhnou) ── */
function mkModel(d,city){
  var H=d.hourly||{}, D=d.daily||{}, C=d.current||{}, T=H.time||[];
  if(!T.length||!(D.time||[]).length) return null;
  var ck=String(C.time||T[0]);
  var iNow=T.indexOf(ck.slice(0,13)+':00');
  if(iNow<0){ var tn=new Date(); var p=function(n){ return n<10?'0'+n:n; };
    iNow=T.indexOf(tn.getFullYear()+'-'+p(tn.getMonth()+1)+'-'+p(tn.getDate())+'T'+p(tn.getHours())+':00'); if(iNow<0) iNow=Math.min(T.length-1,Math.max(0,48)); }
  var g=function(k,i){ var a=H[k]; return a?a[i]:null; };
  var hrs=T.map(function(iso,i){
    var rain=g('rain',i), sh=g('showers',i), pr=g('precipitation',i);
    var mm=(rain!=null||sh!=null)?nz(rain)+nz(sh):nz(pr);
    return {i:i,iso:iso,date:iso.slice(0,10),h:+iso.slice(11,13),temp:g('temperature_2m',i),feel:g('apparent_temperature',i),
      pop:nz(g('precipitation_probability',i)),code:nz(g('weather_code',i)),rain:mm,snow:nz(g('snowfall',i)),
      wind:nz(g('wind_speed_10m',i)),gust:nz(g('wind_gusts_10m',i)),dir:g('wind_direction_10m',i),cloud:g('cloud_cover',i),
      press:g('pressure_msl',i),hum:g('relative_humidity_2m',i),uv:g('uv_index',i),rad:g('shortwave_radiation',i),lt:nz(g('lightning_potential',i))};
  });
  var dg=function(k,i){ var a=D[k]; return a?a[i]:null; };
  var days=D.time.map(function(date,i){
    return {i:i,date:date,code:nz(dg('weather_code',i)),tmax:dg('temperature_2m_max',i),tmin:dg('temperature_2m_min',i),
      fmax:dg('apparent_temperature_max',i),fmin:dg('apparent_temperature_min',i),uv:dg('uv_index_max',i),pop:nz(dg('precipitation_probability_max',i)),
      wind:dg('wind_speed_10m_max',i),gust:dg('wind_gusts_10m_max',i),dir:dg('wind_direction_10m_dominant',i),sunrise:dg('sunrise',i),sunset:dg('sunset',i),
      rain:nz(dg('precipitation_sum',i)),snow:nz(dg('snowfall_sum',i)),sunshine:dg('sunshine_duration',i),daylight:dg('daylight_duration',i)};
  });
  var todayIso=ck.slice(0,10), dT=D.time.indexOf(todayIso); if(dT<0) dT=Math.min(2,days.length-1);
  var by={}; hrs.forEach(function(h){ (by[h.date]||(by[h.date]=[])).push(h); });
  var cur=hrs[iNow]||{};
  return {city:city,hrs:hrs,days:days,iNow:iNow,dT:dT,todayIso:todayIso,by:by,tz:d.timezone||null,
    cur:{temp:C.temperature_2m!=null?C.temperature_2m:cur.temp,feel:C.apparent_temperature!=null?C.apparent_temperature:cur.feel,
      code:C.weather_code!=null?C.weather_code:cur.code,hum:C.relative_humidity_2m!=null?C.relative_humidity_2m:cur.hum,
      wind:C.wind_speed_10m!=null?C.wind_speed_10m:cur.wind,gust:C.wind_gusts_10m!=null?C.wind_gusts_10m:cur.gust,dir:C.wind_direction_10m!=null?C.wind_direction_10m:cur.dir,
      press:C.pressure_msl!=null?C.pressure_msl:cur.press,cloud:C.cloud_cover!=null?C.cloud_cover:cur.cloud,
      rain:nz(C.rain)+nz(C.showers),snow:nz(C.snowfall),time:ck},
    ts:Date.now()};
}
function homeModel(){
  var d=WD(); if(!d||!d.hourly||!d.daily) return null;
  if(!d.__a3m||d.__a3m.ts<Date.now()-20000){ try{ d.__a3m=mkModel(d,HOME()||{name:'tady'}); if(d.__a3m) d.__a3m.home=true; }catch(e){ return null; } }
  return d.__a3m;
}
var _cc={};
function cityModel(city){
  if(!city||sameCity(city,HOME())){ return Promise.resolve(homeModel()); }
  var k=city.name, c=_cc[k]; if(c&&Date.now()-c.t<25*60*1000) return Promise.resolve(c.m);
  var url='https://api.open-meteo.com/v1/forecast?latitude='+city.lat+'&longitude='+city.lon
   +'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,cloud_cover'
   +'&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,relative_humidity_2m,snowfall,rain,showers,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,pressure_msl,uv_index'
   +'&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunrise,sunset,precipitation_sum,snowfall_sum,sunshine_duration,daylight_duration'
   +'&past_days=1&forecast_days=10&timezone=auto';
  return X.withTimeout(fetch(url).then(function(r){ if(!r.ok) throw 0; return r.json(); }),15000,null).then(function(j){
    if(!j||!j.hourly) return null; var m=mkModel(j,city); if(m){ _cc[k]={t:Date.now(),m:m}; } return m;
  }).catch(function(){ return null; });
}

/* ── pomocníci nad modelem ── */
function dayAt(m,off){ var i=m.dT+off; return (i>=0&&i<m.days.length)?m.days[i]:null; }
function hoursOf(m,date){ return m.by[date]||[]; }
function between(arr,a,b){ return arr.filter(function(h){ return h.h>=a&&h.h<b; }); }
function hhmm(iso){ return iso?String(iso).slice(11,16):''; }
function hh(h){ return (h%24)+' h'; }
function isWet(h){ return h.rain>=0.1||h.snow>=0.1||(h.pop>=70&&h.code>=51); }
/* souvislá srážková okna (mezera ≤ 1 h se spojí) */
function wetSpans(hrs){
  var spans=[],cur=null,gap=0;
  hrs.forEach(function(h){
    if(isWet(h)){
      if(!cur){ cur={a:h.i,b:h.i,hrs:[],mm:0,snow:0,pop:0,mmMax:0,codes:{}}; spans.push(cur); }
      cur.b=h.i; cur.hrs.push(h); cur.mm+=h.rain; cur.snow+=h.snow; cur.pop=Math.max(cur.pop,h.pop); cur.mmMax=Math.max(cur.mmMax,h.rain+h.snow*0.7);
      cur.codes[h.code]=(cur.codes[h.code]||0)+1; gap=0;
    } else if(cur){ gap++; if(gap>1){ cur=null; gap=0; } }
  });
  spans.forEach(function(s){
    var best=null,bn=0; for(var c in s.codes){ if(s.codes[c]>bn){ bn=s.codes[c]; best=+c; } }
    var kind=codeKind(best)||'déšť'; if(kind==='mlha') kind='déšť';
    if(s.snow>0.3&&s.snow*0.7>s.mm) kind='sníh';
    if(s.hrs.some(function(h){ return h.code>=95; })) kind='bouře';
    s.kind=kind; var lv=s.mmMax<0.5?0:(s.mmMax<2.5?1:(s.mmMax<7.5?2:3)); s.lvl=lv; s.adj=KIND[kind].adj[lv];
    s.from=s.hrs[0]; s.to=s.hrs[s.hrs.length-1]; s.len=s.hrs.length;
  });
  return spans;
}
function spanWhen(s,m){
  var a=s.from.h, b=(s.to.h+1)%24, tod=m.todayIso;
  var dl=s.from.date===tod?'':(dayLabel(s.from.date,tod)+' ');
  if(s.len>=22) return dl+'po celý den';
  if(s.from.i<=m.iNow&&s.to.i>=m.iNow) return 'už teď — do '+(b||24)+' h'+(s.to.date!==tod?' ('+dayLabel(s.to.date,tod)+')':'');
  if(s.len<=1) return dl+'kolem '+a+' h';
  var cross=s.to.date!==s.from.date;
  return dl+'od '+a+' do '+(b||24)+' h'+(cross?' ('+dayLabel(s.to.date,tod)+')':'');
}
function lc(s){ return s.charAt(0).toLowerCase()+s.slice(1); }
function spanPhrase(s,m,o){
  var mm=s.kind==='sníh'?(s.snow>=0.1?('≈ '+f1(s.snow)+' cm'):''):(s.mm>=0.1?('≈ '+f1(s.mm)+' mm'):'');
  var t=spanWhen(s,m)+' se počítá s '+s.adj+' '+KIND[s.kind].ins+(mm?' ('+mm+')':'')+'.';
  return (o&&o.lc)?t:cap(t);
}
/* souhrn dne (24 h daného data) */
function dayStats(m,date){
  var hs=hoursOf(m,date); if(!hs.length) return null;
  var d=null; for(var i=0;i<m.days.length;i++) if(m.days[i].date===date) d=m.days[i];
  var T=hs.map(function(h){ return h.temp; }), tmx=mx(T), tmn=mn(T);
  var hxmax=hs.filter(function(h){ return h.temp===tmx; })[0], hxmin=hs.filter(function(h){ return h.temp===tmn; })[0];
  var cl=function(a,b){ var c=between(hs,a,b).map(function(h){ return h.cloud; }).filter(function(x){ return x!=null; }); return c.length?avg(c):null; };
  var spans=wetSpans(hs);
  var rainSum=sum(hs.map(function(h){ return h.rain; })), snowSum=sum(hs.map(function(h){ return h.snow; }));
  var res={date:date,d:d,hs:hs,tmax:d&&d.tmax!=null?d.tmax:tmx,tmin:d&&d.tmin!=null?d.tmin:tmn,tmaxH:hxmax?hxmax.h:null,tminH:hxmin?hxmin.h:null,
    cm:cl(6,12),ca:cl(12,18),ce:cl(18,24),cn:cl(0,6),cloud:avg(hs.map(function(h){ return nz(h.cloud); })),
    spans:spans,rain:Math.max(rainSum,d?d.rain:0),snow:Math.max(snowSum,d?d.snow:0),pop:Math.max(mx(hs.map(function(h){ return h.pop; }))||0,d?d.pop:0),
    gust:Math.max(mx(hs.map(function(h){ return h.gust; }))||0,d&&d.gust||0),wind:Math.max(mx(hs.map(function(h){ return h.wind; }))||0,d&&d.wind||0),
    fmax:d?d.fmax:mx(hs.map(function(h){ return h.feel; })),fmin:d?d.fmin:mn(hs.map(function(h){ return h.feel; })),uv:d?d.uv:null,
    thunder:hs.some(function(h){ return h.code>=95; }),fogAM:between(hs,3,10).some(function(h){ return h.code===45||h.code===48; }),
    code:d?d.code:(hxmax?hxmax.code:0),sunrise:d?d.sunrise:null,sunset:d?d.sunset:null,sunshine:d&&d.sunshine!=null?d.sunshine/3600:null,daylight:d&&d.daylight!=null?d.daylight/3600:null,dir:d?d.dir:null};
  var pr=hs.map(function(h){ return h.press; }).filter(function(x){ return x!=null; });
  res.pressDelta=pr.length>=2?pr[pr.length-1]-pr[0]:null; res.hum=avg(hs.map(function(h){ return nz(h.hum); }));
  return res;
}
function skyArc(S){
  var c=[S.cm,S.ca,S.ce].filter(function(x){ return x!=null; }); if(!c.length) return skyOf(S.code)[1];
  var lo=Math.min.apply(null,c), hi=Math.max.apply(null,c), a=avg(c);
  if(hi-lo>=34&&S.cm!=null&&S.ce!=null){
    var first=(S.cm+(S.ca||S.cm))/2, last=((S.ca||S.ce)+S.ce)/2;
    if(first-last>=26) return 'ráno '+cloudWord(first)+', k večeru se vyjasní';
    if(last-first>=26) return 'ráno '+cloudWord(first)+', pak se zatáhne';
    return 'proměnlivá oblačnost ('+cloudWord(lo)+' až '+cloudWord(hi)+')';
  }
  return cloudWord(a);
}
/* vedlejší věty o dni — hlavní věta + podrobnosti */
function dayHeadline(m,date,opt){
  opt=opt||{}; var S=dayStats(m,date); if(!S) return null;
  var lab=dayLabel(date,m.todayIso), out=[], bits=[];
  var sky=skyArc(S);
  var wetMain=S.spans.filter(function(s){ return s.len>=1; }).sort(function(a,b){ return (b.mm+b.snow)-(a.mm+a.snow); }).slice(0,2).sort(function(a,b){ return a.a-b.a; });
  var lead;
  if(S.thunder) lead=cap(lab)+' se počítá s bouřkami'+(wetMain.length?': '+spanWhen(wetMain[0],m):'')+'.';
  else if(wetMain.length&&wetMain.some(function(s){ return s.mm+s.snow*0.7>=0.4; })) lead=cap(lab)+' '+say('wxwet',['bude spíš mokré','přinese srážky','se bez deště neobejde','bude mokřejší'])+'. ';
  else if(S.fogAM) lead=cap(lab)+' ráno mlhy, pak '+(S.cloud>60?'zataženo':'se vyjasní')+'.';
  else lead=cap(lab)+' '+(/^ráno|^proměnl/.test(sky)?'':'bude ')+sky+'.';
  var wetTxt=wetMain.map(function(s){ return spanPhrase(s,m); }).join(' ');
  if(S.thunder||/^\S+ se počítá s bouřkami/.test(lead)) wetTxt=wetMain.slice(S.thunder?1:0).map(function(s){ return spanPhrase(s,m); }).join(' ');
  var tx=(S.tmax!=null&&S.tmin!=null)?('Teploty '+r0(S.tmin)+' až '+r0(S.tmax)+' °C'+(S.tmaxH!=null?(', nejtepleji kolem '+S.tmaxH+' h'):'')+'.'):'';
  return {S:S,lead:lead.trim(),wet:wetTxt,temp:tx,lab:lab,sky:sky};
}
function yesterdayDelta(m){
  var a=dayAt(m,0), b=dayAt(m,-1); if(!a||!b||a.tmax==null||b.tmax==null) return null;
  return {tmax:a.tmax-b.tmax,tmin:(a.tmin!=null&&b.tmin!=null)?a.tmin-b.tmin:null,y:b};
}
/* nejlepší okno ven (denní světlo, sucho, rozumný vítr a pocitovka) */
function bestWindow(m,date,opt){
  opt=opt||{}; var dd=null; for(var q=0;q<m.days.length;q++) if(m.days[q].date===date) dd=m.days[q];
  var sr=dd&&dd.sunrise?+dd.sunrise.slice(11,13):7, ss=dd&&dd.sunset?+dd.sunset.slice(11,13):20;
  var hs=hoursOf(m,date).filter(function(h){ return h.h>=Math.max(6,sr)&&h.h<=ss; }), best=null,cur=null;
  var minF=opt.minFeel!=null?opt.minFeel:6, maxF=opt.maxFeel!=null?opt.maxFeel:29;
  hs.forEach(function(h){
    var ok=h.pop<40&&h.rain<0.1&&h.snow<0.1&&h.gust<42&&h.feel!=null&&h.feel>=minF&&h.feel<=maxF&&h.code<95;
    if(ok){ if(!cur) cur={a:h.h,b:h.h+1,n:1,f:[h.feel]}; else { cur.b=h.h+1; cur.n++; cur.f.push(h.feel); } }
    else if(cur){ if(!best||cur.n>best.n) best=cur; cur=null; }
  });
  if(cur&&(!best||cur.n>best.n)) best=cur;
  return best&&best.n>=2?best:null;
}
/* tlak: změna za 12 h od teď */
function pressTrend(m){
  var a=m.hrs[m.iNow], b=m.hrs[Math.min(m.hrs.length-1,m.iNow+12)], p0=m.hrs[Math.max(0,m.iNow-6)];
  if(!a||!b||a.press==null||b.press==null) return null;
  return {d12:b.press-a.press,back6:p0&&p0.press!=null?a.press-p0.press:null,now:a.press};
}
/* shrnutí důležitého — seřazeno podle naléhavosti */
function insights(m,date,opt){
  var S=dayStats(m,date); if(!S) return []; var out=[], tod=m.todayIso, isToday=date===tod;
  function add(p,ic,t){ out.push({p:p,ic:ic,t:t}); }
  if(S.thunder) add(10,'⚡','Možné bouřky — při blescích se schovej do budovy nebo auta, ne pod osamělý strom.');
  if(S.gust>=75) add(10,'🌪️','Nárazy až '+r0(S.gust)+' km/h — nebezpečný vítr, pozor na padající větve a lehké věci venku.');
  else if(S.gust>=55) add(8,'💨','Nárazy až '+r0(S.gust)+' km/h — silný vítr, upevni věci na balkóně a pozor na kolo či motorku.');
  else if(S.gust>=40) add(5,'🌬️','Nárazový vítr do '+r0(S.gust)+' km/h'+(S.dir!=null?(' '+dirText(S.dir)):'')+'.');
  var sn=S.spans.filter(function(s){ return s.kind==='sníh'; });
  if(sn.length&&S.snow>=0.5) add(8,'❄️','Nasněží kolem '+f1(S.snow)+' cm — počítej s kluzkými cestami a delší jízdou.');
  if(S.tmin!=null&&S.tmin<=-8) add(8,'🥶','Silný mráz (až '+r0(S.tmin)+' °C) — chraň prsty, uši a baterku v telefonu.');
  else if(S.tmin!=null&&S.tmin<=0) add(6,'🧊','V noci a k ránu mrzne ('+r0(S.tmin)+' °C) — ráno může být náledí nebo námraza na autě.');
  if(S.tmax!=null&&S.tmax>=33) add(8,'🔥','Úmorné vedro až '+r0(S.tmax)+' °C — hodně pij, vyhni se poledni a nenechávej nikoho v autě.');
  else if(S.tmax!=null&&S.tmax>=29) add(6,'☀️','Horko až '+r0(S.tmax)+' °C — vezmi vodu a drž se ve stínu.');
  if(S.tmin!=null&&S.tmin>=20) add(5,'🌙','Tropická noc (min. '+r0(S.tmin)+' °C) — bude se špatně spát, pomůže průvan v noci a ranní větrání.');
  if(S.uv!=null&&S.uv>=6) add(6,'🧴','UV index až '+r0(S.uv)+' — krém SPF 30+, brýle a klobouk, hlavně mezi 11 a 15 h.');
  else if(S.uv!=null&&S.uv>=3&&(S.tmax||0)>12) add(2,'😎','UV index kolem '+r0(S.uv)+' — při delším pobytu venku se hodí brýle.');
  if(S.fogAM) add(5,'🌫️','Ráno mlha — do auta si dej čas a svítit potkávačkami.');
  if(S.tmax!=null&&S.tmin!=null&&S.tmax-S.tmin>=13) add(4,'🧅','Rozdíl mezi ránem a odpolednem je '+r0(S.tmax-S.tmin)+' °C — nejlepší je oblékat se do vrstev.');
  var pt=pressTrend(m);
  if(isToday&&pt){
    if(pt.d12<=-5) add(5,'📉','Tlak za 12 h klesne o '+f1(-pt.d12)+' hPa — blíží se zhoršení (fronta); citlivější lidé mohou cítit únavu nebo bolest hlavy.');
    else if(pt.d12>=5) add(3,'📈','Tlak za 12 h vzroste o '+f1(pt.d12)+' hPa — stabilizace a vyjasňování.');
  }
  var yd=isToday?yesterdayDelta(m):null;
  if(yd&&Math.abs(yd.tmax)>=3) add(4,yd.tmax>0?'📈':'📉','Maximum je o '+r0(Math.abs(yd.tmax))+' °C '+(yd.tmax>0?'vyšší':'nižší')+' než včera ('+r0(yd.y.tmax)+' °C).');
  if(S.sunshine!=null&&S.daylight&&S.sunshine>=0.5) add(2,'🌞','Slunce svítí zhruba '+f1(S.sunshine)+' h z '+f1(S.daylight)+' h denního světla.');
  if(S.sunrise&&S.sunset) add(1,'🌅','Slunce vychází v '+hhmm(S.sunrise)+' a zapadá v '+hhmm(S.sunset)+'.');
  if(S.rain<0.1&&S.snow<0.1&&S.pop<30) add(2,'✅','Žádné srážky se nečekají — celý den bude sucho.');
  var bw=bestWindow(m,date); if(bw) add(3,'🚶','Nejlepší okno ven: '+bw.a+'–'+bw.b+' h (sucho, příjemná pocitovka, bez silného větru).');
  out.sort(function(a,b){ return b.p-a.p; });
  return out;
}
/* rady podle počasí a podle toho, co o uživateli vím */
function advice(m,date){
  var S=dayStats(m,date); if(!S) return [];
  var day=between(S.hs,8,20), fe=avg(day.map(function(h){ return nz(h.feel,h.temp); })), out=[];
  var cl=fe<-5?'zimní bunda, čepice, rukavice a šála — pořádně se zabal':(fe<3?'zimní bunda a vrstvy (čepice a rukavice se vyplatí)':(fe<9?'teplejší bunda nebo silnější mikina a dlouhé kalhoty':(fe<15?'lehká bunda nebo mikina přes tričko':(fe<21?'tričko s dlouhým rukávem, večer mikina':(fe<27?'lehké oblečení — tričko a kraťasy':'co nejlehčí věci, světlé barvy a klobouk')))));
  out.push({ic:'🧥',t:'Oblečení: '+cl+' (pocitově kolem '+r0(fe)+' °C přes den).'});
  var rainy=S.spans.filter(function(s){ return s.mm>=0.3||s.snow>=0.3; });
  if(rainy.length) out.push({ic:'☔',t:'Vezmi '+(S.thunder?'raději plášť než deštník (bouřky, vítr)':(S.gust>=45?'pláštěnku — deštník by u větru nepřežil':'deštník nebo pláštěnku'))+(rainy[0]?' — hlavně '+spanWhen(rainy[0],m)+'.':'.')});
  else if(S.pop>=40) out.push({ic:'🌂',t:'Déšť nehrozí jistě, ale šance je '+r0(S.pop)+' % — malý skládací deštník nezaškodí.'});
  if(S.uv!=null&&S.uv>=5) out.push({ic:'🧴',t:'Opalovací krém a brýle — UV index '+r0(S.uv)+'.'});
  if(S.tmin!=null&&S.tmin<=1) out.push({ic:'🚗',t:'Na ráno počítej s námrazou na autě — škrabka a čas navíc.'});
  var bw=bestWindow(m,date); if(bw) out.push({ic:'🏃',t:'Pohyb venku nejlíp '+bw.a+'–'+bw.b+' h.'});
  /* na míru podle toho, co o tobě vím */
  if(PROF.health.some(function(x){ return /pyl|alerg|senn/.test(fold(x)); })&&S.tmax>8&&S.spans.length===0) out.push({ic:'🤧',t:'Máš alergii — za suchého a větrného počasí je pylu víc; po návratu domů se osprchuj a vyper oblečení.'});
  var pt=pressTrend(m); if(pt&&pt.d12<=-5&&PROF.health.some(function(x){ return /migren|hlav|tlak/.test(fold(x)); })) out.push({ic:'💊',t:'Víš o sobě, že tě trápí tlak: dnes klesá, tak pij dost, spi a nepřeháněj kofein.'});
  if(PROF.pets.length&&bw) out.push({ic:'🐾',t:'S '+PROF.pets[0]+' ven nejlíp '+bw.a+'–'+bw.b+' h.'});
  var hobby=PROF.hobbies[0];
  if(hobby){ var f=fold(hobby), gd=!rainy.length&&S.gust<40&&fe>5&&fe<30;
    if(/fotbal|beh|bez|kolo|cyklo|tenis|golf|plav|turist|chod|hory|zahrad|rybar|grill/.test(f)) out.push({ic:'💡',t:(gd?'Na '+hobby+' to dnes vypadá dobře.':'Na '+hobby+' to dnes není ideální — '+(rainy.length?'kvůli srážkám':(S.gust>=40?'kvůli větru':(fe<=5?'je chladno':'je horko')))+'.')+(bw&&gd?(' Zkus '+bw.a+'–'+bw.b+' h.'):'')}); }
  return out;
}

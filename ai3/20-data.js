/* ══════════════════════ 6) TABULKY A GRAFY Z TVÝCH DAT ══════════════════════
   Vložíš čísla (řádky, čárky, CSV, tabulku z Excelu) a řekneš, co z nich chceš:
   „udělej sloupcový graf: Praha 5, Brno 7, Ostrava 3", „seřaď to", „koláč z toho". */
var UNITS=/^(%|°c|°|c|km\/h|m\/s|mm|cm|m|km|kg|g|t|kc|czk|eur|€|\$|usd|ks|h|hod|min|s|l|hpa|w|kw|mw|gb|mb)$/i;
function toNum(s){ s=String(s).trim().replace(/\s/g,'').replace(/,/g,'.'); return /^-?\d+(\.\d+)?$/.test(s)?parseFloat(s):NaN; }
function splitCmd(text){
  /* odděl povel („udělej graf z") od dat — data jsou po dvojtečce, po novém řádku, nebo v celé větě */
  var t=String(text).replace(/\r/g,''), nl=t.indexOf('\n');
  var l0=t.slice(0,nl);
  if(nl>0&&nl<160&&!/\d/.test(l0.replace(/\d+\s*(dni|dnu|dny)/g,''))&&!/[|;\t]/.test(l0)){ return {cmd:l0,data:t.slice(nl+1)}; }
  var ci=t.indexOf(':'); if(ci>0&&ci<120&&/[0-9]/.test(t.slice(ci))) return {cmd:t.slice(0,ci),data:t.slice(ci+1)};
  var m=t.match(/\b(z|ze|pro|podle|takovych|takovehle|techto)\s+(dat|cisel|hodnot|udaju)\b\s*[,:]?\s*/i); if(m) return {cmd:t.slice(0,m.index+m[0].length),data:t.slice(m.index+m[0].length)};
  var j=t.search(/[\p{L}][\p{L} .\-]*?\s*[:=]?\s*-?\d/u); // první „štítek číslo"
  return {cmd:'',data:t};
}
function parseTable(data){
  var lines=data.split('\n').map(function(l){ return l.trim(); }).filter(Boolean); if(lines.length<2) return null;
  var delim=null;
  if(lines.filter(function(l){ return l.indexOf('|')>=0; }).length>=2) lines=lines.filter(function(l){ return l.indexOf('|')>=0; });
  [['\t'],['|'],[';']].forEach(function(d){ if(delim) return; var c=lines.filter(function(l){ return l.indexOf(d[0])>=0; }).length; if(c>=Math.max(2,lines.length-1)) delim=d[0]; });
  if(!delim){ var cc=lines.filter(function(l){ return l.split(',').length>=2&&/\d/.test(l); }).length; if(cc>=lines.length&&lines.every(function(l){ return !/\s,|,\s{2,}/.test(l); })&&lines[0].split(',').length===lines[1].split(',').length&&lines[0].split(',').length>=2) delim=','; }
  if(!delim) return null;
  var rows=lines.filter(function(l){ return !/^\|?\s*:?-{2,}/.test(l); }).map(function(l){ var c=l.split(delim).map(function(x){ return x.trim(); }); if(c.length&&c[0]==='') c.shift(); if(c.length&&c[c.length-1]==='') c.pop(); return c; });
  var w=Math.max.apply(null,rows.map(function(r){ return r.length; })); if(w<2) return null;
  var head=rows[0], hasHead=head.some(function(c,i){ return i>0&&isNaN(toNum(c)); })||isNaN(toNum(head[0]))&&rows.slice(1).every(function(r){ return !isNaN(toNum(r[1])); })&&isNaN(toNum(head[1]));
  var body=hasHead?rows.slice(1):rows; if(!body.length) return null;
  var names=hasHead?head.slice(1):null, labels=body.map(function(r){ return r[0]; });
  var series=[]; for(var c=1;c<w;c++){ var vals=body.map(function(r){ return toNum((r[c]||'').replace(/[^\d,.\-\s]/g,'')); }); if(vals.filter(function(v){ return !isNaN(v); }).length>=Math.ceil(body.length/2)) series.push({name:(names&&names[c-1])||('Řada '+c),vals:vals}); }
  if(!series.length) return null;
  return {labels:labels,series:series,kind:'table',labelName:hasHead?head[0]:''};
}
function parsePairs(data){
  var segs=data.replace(/\n/g,',').split(/[,;]|\s+a\s+(?=[\p{L}])|\s+\/\s+/u).map(function(s){ return s.trim(); }).filter(Boolean);
  var labels=[],vals=[],unit='';
  segs.forEach(function(sg){
    var my=sg.match(/^(\d{1,4})\s*[:=]\s*(-?\d[\d\s]*(?:[.,]\d+)?)\s*([%°€$\p{L}\/]{0,6})\s*$/u);
    if(my){ labels.push(my[1]); vals.push(toNum(my[2])); if(my[3]&&UNITS.test(my[3])) unit=unit||my[3]; return; }
    var m=sg.match(/^(.*?[\p{L}].*?)[\s:=\-–—]*?(-?\d[\d\s]*(?:[.,]\d+)?)\s*([%°€$\p{L}\/]{0,6}(?:\s?C)?)\s*\.?$/u);
    if(m&&m[1].trim()){ var v=toNum(m[2]); if(!isNaN(v)){ labels.push(m[1].replace(/[\s:=\-–—]+$/,'').trim()); vals.push(v); if(m[3]&&UNITS.test(m[3].replace(/\s/g,''))) unit=unit||m[3]; return; } }
    var m2=sg.match(/^(-?\d[\d\s]*(?:[.,]\d+)?)\s*([%°€$\p{L}\/]{0,6})\s+(?=[\p{L}])(.+)$/u);
    if(m2){ var v2=toNum(m2[1]); if(!isNaN(v2)&&(UNITS.test(m2[2])||!m2[2])){ labels.push(m2[3].trim()); vals.push(v2); if(m2[2]&&UNITS.test(m2[2])) unit=unit||m2[2]; } }
  });
  if(labels.length<2) return null;
  return {labels:labels,series:[{name:'Hodnota',vals:vals}],kind:'pairs',unit:unit};
}
function parseNumbers(data){
  var from=data.search(/-?\d/); if(from>0) data=data.slice(from);
  var nums=(data.match(/-?\d+(?:[.,]\d+)?/g)||[]).map(toNum).filter(function(x){ return !isNaN(x); });
  if(nums.length<3||/[\p{L}]{3,}/u.test(data.replace(/\b(a|je|to|z|do|pro)\b/g,''))) return null;
  return {labels:nums.map(function(_,i){ return String(i+1); }),series:[{name:'Hodnota',vals:nums}],kind:'list'};
}
function parseData(text){
  var sp=splitCmd(text), d=sp.data;
  var r=parseTable(d)||parsePairs(d)||parseNumbers(d);
  if(!r&&sp.cmd) r=parseTable(text)||parsePairs(text);
  if(r){ r.cmd=sp.cmd||''; }
  return r;
}
function unitFrom(text){
  var f=fold(text); if(/(°c|stupn)/.test(f)||/°/.test(text)) return ' °C'; if(/%|procent/.test(f)) return ' %'; if(/\bkc\b|korun|czk/.test(f)) return ' Kč'; if(/eur/.test(f)) return ' €'; if(/\bmm\b/.test(f)) return ' mm'; if(/km\/h/.test(f)) return ' km/h'; return '';
}
/* ── co chce uživatel: typ grafu, třídění, statistiky ── */
function dataIntent(f){
  var s=' '+f+' ', I={chart:null,sort:null,top:null,stats:/ (prumer|soucet|median|celkem|statistik|analyz|vyhodnot|rozptyl|odchylk|procent|podil|zmen|rust|pokles|rozdil|nejvyssi|nejnizsi|maximum|minimum) /.test(s),table:/ (tabulk|tabulka|tabulce) /.test(s),graph:/ (graf|grafu|grafy|diagram|sloupcov|spojnicov|carov|kolacov|koblizov|plosn|vizualiz|nakresli|zobraz) /.test(s)};
  if(/ (kolac|kolacov|koblizov|pie|podil|procentni zastoupeni) /.test(s)) I.chart='pie';
  else if(/ (vodorovn|horizontaln) /.test(s)) I.chart='hbar';
  else if(/ (spojnicov|carov|line|trend|vyvoj|krivk|casov) /.test(s)) I.chart='line';
  else if(/ (plosn|area) /.test(s)) I.chart='area';
  else if(/ (sloupcov|sloupce|sloupec|bar|histogram) /.test(s)) I.chart='bar';
  if(/ (sestupne|od nejvyssi\w*|od nejvetsi\w*|nejvyssi prvni|klesajici) /.test(s)) I.sort='desc';
  else if(/ (vzestupne|od nejnizsi\w*|od nejmensi\w*|nejnizsi prvni|rostouci) /.test(s)) I.sort='asc';
  else if(/ (seradit|serad|seridit|usporadej|setrid) /.test(s)) I.sort='desc';
  var m=s.match(/ (?:top|nejlepsi|nejvyssich|nejvetsich|prvnich) (\d{1,2}) /); if(m) I.top=+m[1];
  I.ask=[]; if(/ prumer\w* /.test(s)) I.ask.push('avg'); if(/ (soucet|celkem|dohromady|sectit|secti) /.test(s)) I.ask.push('sum'); if(/ median\w* /.test(s)) I.ask.push('med'); if(/ (maximum|nejvyssi|nejvetsi|max) /.test(s)) I.ask.push('max'); if(/ (minimum|nejnizsi|nejmensi|min) /.test(s)) I.ask.push('min');
  return I;
}
function statsOf(vals,labels){
  var v=vals.filter(function(x){ return !isNaN(x); }); if(!v.length) return null;
  var s=v.slice().sort(function(a,b){ return a-b; }), n=v.length, tot=sum(v), av=tot/n, med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
  var sd=Math.sqrt(sum(v.map(function(x){ return (x-av)*(x-av); }))/n);
  var imax=vals.indexOf(s[n-1]), imin=vals.indexOf(s[0]);
  return {n:n,sum:tot,avg:av,med:med,min:s[0],max:s[n-1],sd:sd,lmax:labels[imax],lmin:labels[imin],range:s[n-1]-s[0]};
}
function numFmt(x,u){ var a=Math.abs(x); var s=a>=1000?String(Math.round(x*10)/10).replace(/\B(?=(\d{3})+(?!\d))/g,' ').replace('.',','):String(Math.round(x*100)/100).replace('.',','); return s+(u||''); }

function buildData(D,I,text){
  var depthD=depthNow(), unit=D.unit?(' '+D.unit.replace(/^C$/,'°C')):unitFrom(text), h=[], speech='';
  var labels=D.labels.slice(), series=D.series.map(function(s){ return {name:s.name,vals:s.vals.slice()}; });
  /* seřazení podle první řady */
  var order=labels.map(function(_,i){ return i; });
  if(I.sort){ order.sort(function(a,b){ var x=nz(series[0].vals[a],-1e18), y=nz(series[0].vals[b],-1e18); return I.sort==='asc'?x-y:y-x; }); }
  if(I.top&&!I.sort) order.sort(function(a,b){ return nz(series[0].vals[b],-1e18)-nz(series[0].vals[a],-1e18); });
  if(I.top) order=order.slice(0,I.top);
  if(I.sort||I.top){ labels=order.map(function(i){ return D.labels[i]; }); series=D.series.map(function(s){ return {name:s.name,vals:order.map(function(i){ return s.vals[i]; })}; }); }
  var multi=series.length>1, st=statsOf(series[0].vals,labels), n=labels.length;
  var type=I.chart||(multi?(n>12?'line':'bar'):(D.kind==='list'||/ (vyvoj|trend|cas|rok|mesic|den)/.test(' '+fold(D.labelName||'')+' ')||labels.every(function(l){ return /^(\d{4}|\d{1,2}\.?\s?\d{0,4}|led|uno|bre|dub|kve|cvn|cvc|srp|zar|rij|lis|pro|po|ut|st|ct|pa|so|ne)/i.test(fold(l)); })&&n>=4?'line':(n>7||labels.some(function(l){ return l.length>9; })?'hbar':'bar')));
  if(type==='pie'&&(multi||series[0].vals.some(function(v){ return v<0; }))) type='bar';
  var chart='';
  if(type==='pie'){ chart=svgPie(labels.map(function(l,i){ return {label:l,value:series[0].vals[i]}; }),{unit:unit,title:'Koláčový graf'}); }
  else if(type==='hbar'&&!multi){ chart=svgHBar(labels.map(function(l,i){ return {label:l,value:series[0].vals[i]}; }),{unit:unit,title:'Sloupcový graf'}); }
  else if(type==='line'||type==='area'){ chart=svgXY({W:340,H:200,labels:labels,title:'Spojnicový graf',unit:'',unitLabel:unit.trim(),yTicks:4,
      lines:series.map(function(s,i){ return {v:s.vals,cls:'a3c-s'+(i%10),area:type==='area'&&i===0,dots:true,labels:n<=8&&!multi}; }),
      xTick:function(i,l){ return n>10&&i%Math.ceil(n/8)?'':String(l).slice(0,8); },tip:function(i){ return labels[i]+': '+series.map(function(s){ return numFmt(s.vals[i],unit); }).join(' · '); },zero:0}); }
  else { chart=svgXY({W:340,H:200,labels:labels,title:'Sloupcový graf',unitLabel:unit.trim(),padB:34,
      bars:series.map(function(s,i){ return {v:s.vals.map(function(v){ return v>0?v:0; }),cls:'a3c-c'+(i%10)}; }),
      xTick:function(i,l){ return String(l).length>9?String(l).slice(0,8)+'…':l; },tip:function(i){ return labels[i]+': '+series.map(function(s){ return numFmt(s.vals[i],unit); }).join(' · '); }}); }
  var leg=multi?legendHTML(series.map(function(s,i){ return {cls:'a3c-lg-s'+(i%6),name:s.name}; })):'';
  /* hlavní věta */
  var lead;
  if(st){
    var nm=function(v,arr){ var i=arr.indexOf(v); return D.kind==='list'?(i+1)+'. hodnota':labels[i]; };
    var ans=(I.ask||[]).map(function(k){ return {avg:'Průměr: '+numFmt(st.avg,unit),sum:'Součet: '+numFmt(st.sum,unit),med:'Medián: '+numFmt(st.med,unit),max:'Maximum: '+numFmt(st.max,unit)+' ('+nm(st.max,series[0].vals)+')',min:'Minimum: '+numFmt(st.min,unit)+' ('+nm(st.min,series[0].vals)+')'}[k]; }).join(' · ');
    lead=(ans?ans+'. ':'')+(multi?'Tady je '+n+' '+plur(n,'hodnota','hodnoty','hodnot')+' ve '+series.length+' řadách. ':'Hotovo — '+n+' '+plur(n,'hodnota','hodnoty','hodnot')+'. ')+'Nejvyšší: '+(D.kind==='list'?numFmt(st.max,unit)+' ('+(series[0].vals.indexOf(st.max)+1)+'. hodnota)':labels[series[0].vals.indexOf(st.max)]+' ('+numFmt(st.max,unit)+')')+', nejnižší: '+(D.kind==='list'?numFmt(st.min,unit)+' ('+(series[0].vals.indexOf(st.min)+1)+'. hodnota)':labels[series[0].vals.indexOf(st.min)]+' ('+numFmt(st.min,unit)+')')+', průměr '+numFmt(st.avg,unit)+(multi?' (první řada)':'')+'.';
    if(I.sort) lead+=' Seřazeno '+(I.sort==='asc'?'vzestupně':'sestupně')+(I.top?', jen top '+I.top:'')+'.';
  } else lead='Z těchhle hodnot se mi nepodařilo spočítat statistiku.';
  speech=lead;
  h.push('<div class="ai2-lead a3-lead">'+esc(lead)+'</div>');
  if(chart) h.push('<div class="a3c-box">'+chart+leg+'</div>');
  /* tabulka */
  var head=[D.labelName||'Položka'].concat(series.map(function(s){ return s.name==='Hodnota'?'Hodnota'+(unit?' ('+unit.trim()+')':''):s.name; }));
  if(!multi&&n>=2) head.push('Podíl');
  var tot0=multi?0:sum(series[0].vals.map(function(v){ return Math.max(0,v); }));
  var rows=labels.map(function(l,i){ var c=[{t:l,s:l}].concat(series.map(function(s){ return {t:isNaN(s.vals[i])?'—':numFmt(s.vals[i],''),s:s.vals[i]}; })); if(!multi&&n>=2) c.push({t:tot0>0?Math.round(Math.max(0,series[0].vals[i])/tot0*100)+' %':'—',s:tot0>0?series[0].vals[i]/tot0:0}); return {cells:c}; });
  h.push(tableHTML(head,rows,{compact:true}));
  /* statistiky a postřehy */
  if(st&&depthD>=2){
    var sr=[['Počet',String(st.n)],['Součet',numFmt(st.sum,unit)],['Průměr',numFmt(st.avg,unit)],['Medián',numFmt(st.med,unit)],['Minimum',numFmt(st.min,unit)+' ('+st.lmin+')'],['Maximum',numFmt(st.max,unit)+' ('+st.lmax+')'],['Rozpětí',numFmt(st.range,unit)],['Směrodatná odchylka',numFmt(st.sd,unit)]];
    h.push('<h4>📐 Statistika'+(multi?' (první řada)':'')+'</h4>'+tableHTML(['Údaj','Hodnota'],sr.map(function(r){ return {cells:[{html:'<b>'+r[0]+'</b>'},r[1]]}; }),{compact:true,actions:false}));
    var ins=[], v0=series[0].vals;
    if(n>=3&&(D.kind==='list'||type==='line'||type==='area')){ var ch=v0.slice(1).map(function(v,i){ return v-v0[i]; }), bi=ch.indexOf(Math.max.apply(null,ch)), si=ch.indexOf(Math.min.apply(null,ch));
      ins.push({ic:'📈',t:'Největší skok nahoru: '+labels[bi]+' → '+labels[bi+1]+' (+'+numFmt(ch[bi],unit)+').'}); if(ch[si]<0) ins.push({ic:'📉',t:'Největší pokles: '+labels[si]+' → '+labels[si+1]+' ('+numFmt(ch[si],unit)+').'});
      if(v0[0]!==0){ var pct=(v0[n-1]-v0[0])/Math.abs(v0[0])*100; ins.push({ic:pct>=0?'⬆️':'⬇️',t:'Celkově od začátku do konce '+(pct>=0?'růst':'pokles')+' o '+f1(Math.abs(pct))+' %.'}); } }
    if(st.sd>0){ var out=[]; v0.forEach(function(v,i){ if(Math.abs(v-st.avg)>2*st.sd) out.push(labels[i]); }); if(out.length) ins.push({ic:'🔎',t:'Odlehlé hodnoty (víc než 2 směrodatné odchylky od průměru): '+out.join(', ')+'.'}); }
    if(!multi&&n>=3){ var top=v0.slice().sort(function(a,b){ return b-a; }), t3=sum(top.slice(0,Math.min(3,n))); if(tot0>0) ins.push({ic:'🥇',t:'Tři největší tvoří '+Math.round(t3/tot0*100)+' % celku.'}); }
    h.push(insightsHTML(ins,depthD>=3?5:3));
  }
  h.push('<div class="a3-acts"><button type="button" class="ai2-act" data-a3="png">🖼 Uložit graf jako obrázek</button><button type="button" class="ai2-act" data-a3ask="seřaď to sestupně">↕️ Seřadit</button><button type="button" class="ai2-act" data-a3ask="udělej z toho koláčový graf">🥧 Koláč</button><button type="button" class="ai2-act" data-a3ask="udělej z toho spojnicový graf">📈 Spojnice</button></div>');
  return {html:'<div class="ai3-data">'+h.join('')+'</div>',speech:speech,kind:'tabulka a graf',
    steps:['🔤 Rozumím: vlastní data ('+(D.kind==='table'?'tabulka':(D.kind==='pairs'?'dvojice popisek–číslo':'řada čísel'))+')','🧮 Čtu '+n+' hodnot'+(multi?' ve '+series.length+' řadách':''),'📐 Počítám součet, průměr, medián a odlehlé hodnoty','📊 Vybírám typ grafu: '+({bar:'sloupcový',hbar:'vodorovné sloupce',line:'spojnicový',area:'plošný',pie:'koláčový'}[type]),'✅ Kontrola čísel v tabulce'],
    think:[['Čemu rozumím',['Dostal jsem '+n+' hodnot'+(multi?' v '+series.length+' řadách':'')+'.','Typ grafu: '+type+(I.chart?' (na tvoje přání)':' (vybral jsem podle dat)')+'.']],['Co jsem spočítal',['Součet, průměr, medián, rozpětí a směrodatnou odchylku; odlehlé = víc než 2 odchylky od průměru.']]],
    follow:[['🌡 Počasí','jaké je počasí']],thinkIt:depthD>=2,store:{D:{labels:D.labels,series:D.series,kind:D.kind,unit:D.unit,labelName:D.labelName}}};
}
function handleData(text,f,fromVoice){
  var s=' '+f+' ', I=dataIntent(f);
  var isDataWord=I.graph||I.table||I.sort||I.top||I.stats||I.chart;
  /* pokračování nad posledními daty: „seřaď to", „udělej z toho koláč" */
  if(CTX.lastData&&Date.now()-CTX.lastData.t<30*60*1000&&wc(f)<=9&&isDataWord&&!/\d/.test(f.replace(/top \d+/,''))&&/ (to|toho|ten|tu|tyhle|tyto|data|hodnoty|cisla) /.test(s+' ')){
    var Dl=CTX.lastData.D; respond(text,fromVoice,function(){ var r=buildData(Dl,I,''); CTX.lastData={D:Dl,t:Date.now()}; return r; }); return true; }
  if(!isDataWord&&!/ (porovnej|srovnej|spocitej|vyhodnot|analyzuj|prumer|soucet) /.test(s)) return false;
  /* počasí si bere své (graf teploty, tabulka srážek…) — pokud ve zprávě nejsou vlastní data */
  var D=parseData(text);
  if(!D||(D.labels.length<2)) return false;
  if(isWx(f)&&D.kind==='list'&&!/\d{2,}/.test(text)) return false;
  if(!(isDataWord||D.labels.length>=3)) return false;
  respond(text,fromVoice,function(){ var r=buildData(D,I,text); CTX.lastData={D:{labels:D.labels,series:D.series,kind:D.kind,unit:D.unit,labelName:D.labelName},t:Date.now()}; touch('data'); return r; });
  return true;
}

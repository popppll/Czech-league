/* ══════════════════════ 1) GRAFY A TABULKY (SVG, bez knihoven) ══════════════════════ */
var PAL=['#4a9eff','#f0a030','#22d474','#ff6b8b','#a78bfa','#00d4c8','#ffd24d','#ff7a45','#7bd3ff','#c0e86a'];
function niceNum(x,round){
  var e=Math.floor(Math.log(x)/Math.LN10), f=x/Math.pow(10,e), n;
  if(round) n=f<1.5?1:(f<3?2:(f<7?5:10)); else n=f<=1?1:(f<=2?2:(f<=5?5:10));
  return n*Math.pow(10,e);
}
function niceScale(lo,hi,count){
  if(!(hi>lo)){ hi=lo+1; lo=lo-1; }
  var range=niceNum(hi-lo,false), step=niceNum(range/Math.max(2,(count||4)),true);
  var a=Math.floor(lo/step)*step, b=Math.ceil(hi/step)*step, ticks=[];
  for(var v=a;v<=b+step*0.001;v+=step) ticks.push(Math.round(v/step)*step);
  return {min:a,max:b,step:step,ticks:ticks};
}
function fmtTick(v){ return String(Math.round(v*100)/100).replace('.',','); }

/* hlavní kreslič: spojnice + sloupce + pásma + značka „teď" */
function svgXY(o){
  var W=o.W||340, H=o.H||180, pl=o.padL||32, pr=o.padR||10, pt=o.padT||14, pb=o.padB||26;
  var n=o.labels.length; if(n<1) return '';
  var pw=W-pl-pr, ph=H-pt-pb, bw=pw/n;
  var lines=o.lines||[], bars=o.bars||[], out=[];
  var lo=1e9,hi=-1e9;
  lines.forEach(function(L){ L.v.forEach(function(x){ if(x!=null&&!isNaN(x)){ if(x<lo)lo=x; if(x>hi)hi=x; } }); });
  if(o.yMin!=null) lo=Math.min(lo,o.yMin);
  if(o.yMax!=null) hi=Math.max(hi,o.yMax);
  var hasL=lines.length&&lo<1e9;
  var sc=hasL?niceScale(lo,hi,o.yTicks||4):null;
  var barsOnly=!hasL;
  var bmax=0; bars.forEach(function(B){ B.v.forEach(function(x){ if(x>bmax)bmax=x; }); });
  var bsc=bars.length?niceScale(0,Math.max(o.barMin||1,bmax),barsOnly?4:2):null;
  var bTop=barsOnly?pt:(pt+ph*0.62);
  function X_(i){ return pl+(i+0.5)*bw; }
  function Y_(v){ return pt+ph-(v-sc.min)/(sc.max-sc.min)*ph; }
  function YB(v){ return pt+ph-(v/bsc.max)*(pt+ph-bTop); }
  out.push('<svg class="a3c" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.title||'graf')+'" xmlns="http://www.w3.org/2000/svg">');
  (o.bands||[]).forEach(function(b){
    out.push('<rect class="a3c-band '+(b[2]||'')+'" x="'+(pl+b[0]*bw).toFixed(1)+'" y="'+pt+'" width="'+(Math.max(1,(b[1]-b[0]+1))*bw).toFixed(1)+'" height="'+ph+'"/>');
  });
  if(hasL){
    sc.ticks.forEach(function(t){
      var y=Y_(t); if(y<pt-1||y>pt+ph+1) return;
      out.push('<line class="a3c-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'"/>');
      out.push('<text class="a3c-tx a3c-yl" x="'+(pl-4)+'" y="'+(y+3).toFixed(1)+'" text-anchor="end">'+fmtTick(t)+'</text>');
    });
  } else if(bsc){
    bsc.ticks.forEach(function(t){
      var y=YB(t);
      out.push('<line class="a3c-grid" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'"/>');
      out.push('<text class="a3c-tx a3c-yl" x="'+(pl-4)+'" y="'+(y+3).toFixed(1)+'" text-anchor="end">'+fmtTick(t)+'</text>');
    });
  }
  if(o.zero!=null&&hasL&&sc.min<o.zero&&sc.max>o.zero){
    var yz=Y_(o.zero); out.push('<line class="a3c-zero" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yz.toFixed(1)+'" y2="'+yz.toFixed(1)+'"/>');
  }
  var nb=bars.length;
  bars.forEach(function(B,bi){
    var gw=bw*0.78, w1=gw/nb, x0=-gw/2+bi*w1;
    B.v.forEach(function(v,i){
      if(!(v>0)) return;
      var y=YB(v), base=pt+ph, h=Math.max(1.5,base-y);
      out.push('<rect class="a3c-bar '+(B.cls||('a3c-c'+(bi%PAL.length)))+'" x="'+(X_(i)+x0).toFixed(1)+'" y="'+(base-h).toFixed(1)+'" width="'+Math.max(1.5,w1-1).toFixed(1)+'" height="'+h.toFixed(1)+'" rx="1.5"/>');
    });
  });
  lines.forEach(function(L,li){
    var d='',pen=false;
    L.v.forEach(function(v,i){
      if(v==null||isNaN(v)){ pen=false; return; }
      d+=(pen?'L':'M')+X_(i).toFixed(1)+' '+Y_(v).toFixed(1); pen=true;
    });
    var cls=L.cls||('a3c-s'+(li%PAL.length));
    if(L.area&&L.v.length){
      var first=null,last=null; L.v.forEach(function(v,i){ if(v!=null&&!isNaN(v)){ if(first==null)first=i; last=i; } });
      if(first!=null) out.push('<path class="a3c-area '+cls+'" d="'+d+'L'+X_(last).toFixed(1)+' '+(pt+ph)+'L'+X_(first).toFixed(1)+' '+(pt+ph)+'Z"/>');
    }
    out.push('<path class="a3c-line '+cls+(L.dash?' a3c-dash':'')+'" d="'+d+'"/>');
    if(L.dots||n<=16) L.v.forEach(function(v,i){ if(v!=null&&!isNaN(v)) out.push('<circle class="a3c-dot '+cls+'" cx="'+X_(i).toFixed(1)+'" cy="'+Y_(v).toFixed(1)+'" r="'+(n>16?1.6:2.6)+'"/>'); });
    if(L.labels){ L.v.forEach(function(v,i){ if(v!=null&&!isNaN(v)&&(L.labels===true||L.labels(i)))
      out.push('<text class="a3c-tx a3c-vl" x="'+X_(i).toFixed(1)+'" y="'+(Y_(v)-6).toFixed(1)+'" text-anchor="middle">'+fmtTick(v)+(o.unit||'')+'</text>'); }); }
  });
  (o.marks||[]).forEach(function(mk){
    var L=lines[mk.line||0]; if(!L||L.v[mk.i]==null) return;
    var x=X_(mk.i), y=Y_(L.v[mk.i]);
    out.push('<circle class="a3c-mk '+(mk.cls||'')+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3.6"/>');
    out.push('<text class="a3c-tx a3c-vl" x="'+Math.min(W-pr-14,Math.max(pl+14,x)).toFixed(1)+'" y="'+(y+(mk.below?13:-7)).toFixed(1)+'" text-anchor="middle">'+esc(mk.text)+'</text>');
  });
  if(o.now!=null&&o.now>=0&&o.now<n){
    var xn=X_(o.now);
    out.push('<line class="a3c-now" x1="'+xn.toFixed(1)+'" x2="'+xn.toFixed(1)+'" y1="'+pt+'" y2="'+(pt+ph)+'"/>');
    out.push('<text class="a3c-now-t" x="'+xn.toFixed(1)+'" y="'+(pt-3)+'" text-anchor="middle">teď</text>');
  }
  o.labels.forEach(function(lb,i){
    var t=o.xTick?o.xTick(i,lb):lb; if(t==null||t==='') return;
    out.push('<text class="a3c-tx a3c-xl" x="'+X_(i).toFixed(1)+'" y="'+(H-pb+13)+'" text-anchor="middle">'+esc(t)+'</text>');
  });
  if(o.xSub) o.labels.forEach(function(lb,i){ var t=o.xSub(i,lb); if(t) out.push('<text class="a3c-tx a3c-xs" x="'+X_(i).toFixed(1)+'" y="'+(H-pb+24)+'" text-anchor="middle">'+esc(t)+'</text>'); });
  if(o.tip) o.labels.forEach(function(lb,i){
    out.push('<rect class="a3c-hit" x="'+(pl+i*bw).toFixed(1)+'" y="'+pt+'" width="'+bw.toFixed(1)+'" height="'+ph+'"><title>'+esc(o.tip(i))+'</title></rect>');
  });
  if(o.unitLabel) out.push('<text class="a3c-tx a3c-ul" x="'+(pl-4)+'" y="'+(pt-4)+'" text-anchor="end">'+esc(o.unitLabel)+'</text>');
  out.push('</svg>');
  return out.join('');
}
function legendHTML(items){
  return '<div class="a3c-leg">'+items.map(function(it){ return '<span><i class="'+it.cls+'"></i>'+esc(it.name)+'</span>'; }).join('')+'</div>';
}

/* vodorovné sloupce — přehledné i s dlouhými popisky na telefonu */
function svgHBar(items,o){
  o=o||{}; var n=items.length; if(!n) return '';
  var W=340, rowH=o.rowH||24, pt=6, pb=6;
  var labW=o.labW||clamp(Math.max.apply(null,items.map(function(i){ return Math.min(22,String(i.label).length); }))*5.8+12,60,130), pr=o.pr||58;
  var H=pt+pb+n*rowH, pw=W-labW-pr;
  var vmax=Math.max.apply(null,items.map(function(i){ return Math.abs(i.value); }))||1;
  var neg=items.some(function(i){ return i.value<0; });
  var out=['<svg class="a3c" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.title||'graf')+'" xmlns="http://www.w3.org/2000/svg">'];
  var zero=labW+(neg?pw*0.5:0), scl=(neg?pw*0.5:pw)/vmax;
  items.forEach(function(it,i){
    var y=pt+i*rowH, w=Math.abs(it.value)*scl, x=it.value<0?zero-w:zero;
    out.push('<text class="a3c-tx a3c-hl" x="'+(labW-6)+'" y="'+(y+rowH/2+3.5)+'" text-anchor="end">'+esc(String(it.label).slice(0,22))+'</text>');
    out.push('<rect class="a3c-bar" style="fill:'+(it.color||PAL[i%PAL.length])+'" x="'+x.toFixed(1)+'" y="'+(y+3)+'" width="'+Math.max(1.5,w).toFixed(1)+'" height="'+(rowH-8)+'" rx="3"><title>'+esc(it.label+': '+fmtTick(it.value)+(o.unit||''))+'</title></rect>');
    out.push('<text class="a3c-tx a3c-vl" x="'+(it.value<0?zero-w-4:zero+w+4).toFixed(1)+'" y="'+(y+rowH/2+3.5)+'" text-anchor="'+(it.value<0?'end':'start')+'">'+fmtTick(it.value)+(o.unit||'')+'</text>');
  });
  if(neg) out.push('<line class="a3c-zero" x1="'+zero+'" x2="'+zero+'" y1="'+pt+'" y2="'+(H-pb)+'"/>');
  out.push('</svg>'); return out.join('');
}

/* koláč / prstenec */
function svgPie(items,o){
  o=o||{}; var tot=sum(items.map(function(i){ return Math.max(0,i.value); })); if(!(tot>0)) return '';
  var W=340,H=170,cx=84,cy=85,R=70,r=40, a0=-Math.PI/2, out=['<svg class="a3c" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.title||'koláčový graf')+'" xmlns="http://www.w3.org/2000/svg">'];
  items.forEach(function(it,i){
    var v=Math.max(0,it.value); if(!v) return;
    var a1=a0+v/tot*Math.PI*2, big=(a1-a0)>Math.PI?1:0;
    if(v/tot>0.9999){ a1=a0+Math.PI*2-0.0001; big=1; }
    var p=[cx+R*Math.cos(a0),cy+R*Math.sin(a0),cx+R*Math.cos(a1),cy+R*Math.sin(a1),cx+r*Math.cos(a1),cy+r*Math.sin(a1),cx+r*Math.cos(a0),cy+r*Math.sin(a0)];
    out.push('<path class="a3c-slice" style="fill:'+(it.color||PAL[i%PAL.length])+'" d="M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+'A'+R+' '+R+' 0 '+big+' 1 '+p[2].toFixed(1)+' '+p[3].toFixed(1)+'L'+p[4].toFixed(1)+' '+p[5].toFixed(1)+'A'+r+' '+r+' 0 '+big+' 0 '+p[6].toFixed(1)+' '+p[7].toFixed(1)+'Z"><title>'+esc(it.label+': '+fmtTick(v)+(o.unit||'')+' ('+Math.round(v/tot*100)+' %)')+'</title></path>');
    a0=a1;
  });
  out.push('<text class="a3c-tx a3c-big" x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle">'+fmtTick(tot)+(o.unit||'')+'</text>');
  items.slice(0,9).forEach(function(it,i){
    var y=18+i*17;
    out.push('<rect x="170" y="'+(y-9)+'" width="10" height="10" rx="2" style="fill:'+(it.color||PAL[i%PAL.length])+'"/>');
    out.push('<text class="a3c-tx a3c-hl" x="186" y="'+y+'">'+esc(String(it.label).slice(0,16))+' · '+Math.round(Math.max(0,it.value)/tot*100)+' %</text>');
  });
  out.push('</svg>'); return out.join('');
}

/* tabulka — řaditelná klepnutím na hlavičku */
var _tabSeq=0;
function tableHTML(head,rows,o){
  o=o||{}; var id='a3t'+(++_tabSeq)+Math.floor(Math.random()*1e4);
  var h='<div class="a3-tabwrap"><table class="ai2-tab a3-tab'+(o.compact?' a3-compact':'')+'" id="'+id+'" data-a3tab="1">';
  h+='<thead><tr>'+head.map(function(c,i){ return '<th data-a3sort="'+i+'" title="Seřadit">'+esc(c)+'</th>'; }).join('')+'</tr></thead><tbody>';
  rows.forEach(function(r){
    var cells=r.cells||r;
    h+='<tr'+(r._cls?' class="'+r._cls+'"':'')+'>'+cells.map(function(c){
      var raw=(c&&typeof c==='object')?c:{t:c};
      return '<td'+(raw.s!=null?(' data-s="'+esc(raw.s)+'"'):'')+(raw.cls?(' class="'+raw.cls+'"'):'')+'>'+(raw.html?raw.html:esc(raw.t==null?'':raw.t))+'</td>';
    }).join('')+'</tr>';
  });
  h+='</tbody></table></div>';
  if(o.actions!==false) h+='<div class="a3-acts"><button type="button" class="ai2-act" data-a3="csv" data-t="'+id+'">📋 Kopírovat jako CSV</button></div>';
  return h;
}
function sortTable(tb,col){
  var body=tb.tBodies[0], rows=[].slice.call(body.rows);
  var dir=tb.getAttribute('data-sd'+col)==='asc'?'desc':'asc';
  tb.setAttribute('data-sd'+col,dir);
  function val(r){ var c=r.cells[col]; var s=c.getAttribute('data-s'); var t=s!=null?s:c.textContent; var n=parseFloat(String(t).replace(/\s/g,'').replace(',','.')); return isNaN(n)?String(t).toLowerCase():n; }
  rows.sort(function(a,b){ var x=val(a),y=val(b); var r=(typeof x==='number'&&typeof y==='number')?x-y:String(x).localeCompare(String(y),'cs'); return dir==='asc'?r:-r; });
  rows.forEach(function(r){ body.appendChild(r); });
  [].forEach.call(tb.tHead.rows[0].cells,function(c,i){ c.classList.toggle('a3-sorted',i===col); c.setAttribute('data-dir',i===col?dir:''); });
}
function tableCSV(tb){
  var rows=[]; [].forEach.call(tb.rows,function(r){ rows.push([].map.call(r.cells,function(c){ var t=c.textContent.replace(/\s+/g,' ').trim(); return /[;"\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t; }).join(';')); });
  return rows.join('\n');
}
function copyText(t){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText) return navigator.clipboard.writeText(t); }catch(e){}
  return new Promise(function(res,rej){ try{ var a=document.createElement('textarea'); a.value=t; a.style.position='fixed'; a.style.opacity='0'; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); res(); }catch(e){ rej(e); } });
}
/* SVG → PNG: styly se před převodem přepíšou přímo do prvků, aby obrázek nebyl bez barev */
function svgToPng(svg,name){
  var clone=svg.cloneNode(true), src=svg.querySelectorAll('*'), dst=clone.querySelectorAll('*');
  var props=['fill','stroke','stroke-width','stroke-dasharray','font-size','font-weight','opacity','fill-opacity','stroke-opacity','font-family'];
  for(var i=0;i<src.length;i++){
    var cs=getComputedStyle(src[i]), st='';
    props.forEach(function(p){ st+=p+':'+cs.getPropertyValue(p)+';'; });
    dst[i].setAttribute('style',st);
  }
  var bg=getComputedStyle(document.querySelector('#aiaOverlay .aia-panel')||document.body).backgroundColor||'#0b1020';
  if(/rgba\(.*,\s*0\)/.test(bg)) bg='#0b1020';
  var s=new XMLSerializer().serializeToString(clone);
  var img=new Image();
  img.onload=function(){
    var vb=svg.viewBox.baseVal, sc=3, c=document.createElement('canvas'); c.width=vb.width*sc; c.height=vb.height*sc;
    var g=c.getContext('2d'); g.fillStyle=bg; g.fillRect(0,0,c.width,c.height); g.drawImage(img,0,0,c.width,c.height);
    c.toBlob(function(b){ var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=(name||'graf')+'.png'; document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); URL.revokeObjectURL(a.href); },600); });
  };
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
}

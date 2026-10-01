/* ══════════════════════ 9) NAPOJENÍ NA ASISTENTA ══════════════════════ */
function isCrisis(text){ try{ var e=X.emoOf(text); return !!(e&&e.stop); }catch(e){ return false; } }
function aiWants(text){ try{ return AI2.analyze(text).wants||{}; }catch(e){ return {}; } }
var CHART_RE=/ (graf|grafu|grafy|grafem|diagram|tabulk|tabulka|tabulce|sloupcov|spojnicov|kolacov|koblizov|histogram) /;

function socialIntent(text,f){
  if(/(nevim jestli|rozhoduju se|rozhodnout se|co je lepsi|pomoz mi (se )?(rozhodnout|vybrat))/.test(f)) return true;
  if(/(^|[^\p{L}])(poraď|potřebuju radu|chci radu)/iu.test(text)) return true;
  if(typeof wantsAdvice==='function'&&wantsAdvice(text,f)) return true;
  if(typeof emoKind==='function'&&emoKind(f)) return true;
  return false;
}
function route(text,f,fromVoice){
  var s=' '+f+' ';
  if(typeof friendPending==='function'&&friendPending(text,f,fromVoice)) return true;
  /* praktické rady k činnostem a plán dne umí AIW_LIFE */
  try{ if(window.AIW_LIFE&&AIW_LIFE.claims(text)&&!CHART_RE.test(s)&&!socialIntent(text,f)) return false; }catch(e){}
  if(typeof handleGuide==='function'&&handleGuide(text,f,fromVoice)) return true;
  if(typeof handleData==='function'&&handleData(text,f,fromVoice)) return true;
  if(typeof handleFriendFirst==='function'&&handleFriendFirst(text,f,fromVoice)) return true;
  if(isWx(f)){ handleWx(text,f,fromVoice); return true; }
  if(isFollowWx(text,f)){ handleWx(text,f,fromVoice,{follow:true}); return true; }
  if(typeof handleFriend==='function'&&handleFriend(text,f,fromVoice)) return true;
  return false;
}
function handle(text,fromVoice){
  text=String(text||'').trim(); if(text.length<2) return false;
  if(isCrisis(text)) return false;
  var _ib=(typeof imageBridge==='function')?imageBridge(text,canon(text)):null;
  if(_ib){ try{ AI2.ask(_ib); return true; }catch(e){} }
  var wants=aiWants(text);
  /* obrázky, design, video, produkt a „jak vypadá" nechávám AI 2.0 / původním dílnám */
  if(wants.image||wants.design||wants.video||wants.product||wants.pics) return false;
  var f=canon(text);
  if(typeof learnProfile==='function'){ try{ learnProfile(text,f); }catch(e){} }
  if(route(text,f,fromVoice)) return true;
  /* druhý pokus s opravenými překlepy („predpovet na zitra") */
  var f2=canonFix(text);
  if(f2!==f&&route(text,f2,fromVoice)) return true;
  return false;
}
function isFollowWx(text,f){
  if(!(ctxFresh()&&CTX.intent==='wx')) return false;
  if(wc(f)>7) return false;
  var w=parseWhen(f), s=' '+f+' ';
  if(/^(a|a co|co|tak|jeste|a jak|jak|a v|a pro|a na)\b/.test(f)&&(w.any||cityIn(text)||topicOf(f)!=='general')) return true;
  if(w.any&&wc(f)<=3) return true;
  if(cityIn(text)&&wc(f)<=3) return true;
  if(/^(podrobneji|detailneji|vic|vice|stru(c|n)ne|rozved|a podrobne|a vic)\b/.test(f)) return true;
  return false;
}

/* zavěšení do AI 2.0 — původní chování zůstává, 3.0 si bere jen to, v čem je lepší */
var _origIntercept=AI2.intercept;
AI2.intercept=function(text,fromVoice){
  try{ if(handle(text,fromVoice)) return true; }catch(e){ try{ console.warn('[AI3]',e); }catch(_){} }
  return _origIntercept?_origIntercept.apply(AI2,arguments):false;
};

/* kliky na tlačítka v odpovědích (delegace — fungují i po obnovení chatu) */
document.addEventListener('click',function(e){
  var t=e.target; if(!t||!t.closest) return;
  var ask=t.closest('[data-a3ask]');
  if(ask){ e.preventDefault(); var q=ask.getAttribute('data-a3ask'); try{ window.AIW_ASSISTANT&&AIW_ASSISTANT._process(q,false); }catch(_){} return; }
  var th=t.closest('th[data-a3sort]');
  if(th){ var tb=th.closest('table'); if(tb) sortTable(tb,+th.getAttribute('data-a3sort')); return; }
  var ac=t.closest('[data-a3]');
  if(ac){
    var kind=ac.getAttribute('data-a3');
    if(kind==='csv'){ var tb2=document.getElementById(ac.getAttribute('data-t')); if(tb2) copyText(tableCSV(tb2)).then(function(){ var o=ac.textContent; ac.textContent='✅ Zkopírováno'; setTimeout(function(){ ac.textContent=o; },1600); }); }
    else if(kind==='png'){ var box=ac.closest('.ai3-data,.ai3-wx,.ai2-msg'); var sv=box&&box.querySelector('svg.a3c'); if(sv) svgToPng(sv,'ai-weather-graf'); }
    else if(typeof actionA3==='function') actionA3(kind,ac,e);
  }
},false);

var API={
  version:VERSION,
  ask:function(t){ try{ AIW_ASSISTANT._process(t,false); }catch(e){} },
  handle:handle,
  understand:function(t){ var f=canon(t); return {canon:f,topic:topicOf(f),when:parseWhen(f),city:(cityIn(t)||{}).name||null,wx:isWx(f),wxFollow:isFollowWx(t,f)}; },
  profile:function(){ return JSON.parse(JSON.stringify(PROF)); },
  _ctx:CTX,
  _model:function(){ return homeModel(); }
};
return API;

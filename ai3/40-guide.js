/* ══════════════════════ 10) PRŮVODCE APPKOU: vysvětlí sekce a řekne, co v nich je ══════════════════════
   Čte nápovědu appky (AIW_HELPDATA) i živý obsah stránky, takže ví, co v sekci právě je,
   aniž by ses musel dívat. */
var SEC_ALIAS={
 'sec-next':['co bude dal','casova osa','osa 36 hodin','odpocet do udalosti','cas teď a dal'],
 'sec-stats':['data o pocasi','sekce data','sekci data','statistiky pocasi','udaje o pocasi'],
 'sec-soil':['puda a zavlahy','teplota pudy','zavlahy','vlhkost pudy','zalevani'],
 'sec-home':['chytra domacnost','automatizace','home assistant','ifttt','node red','nodered'],
 'sec-moon':['mesic','faze mesice','mesicni faze','vychod a zapad slunce'],
 'sec-airflow':['odkud jde vzduch','odkud k tobe jde vzduch','trajektorie vzduchu','vzduchova hmota'],
 'sec-twin':['dvojnik','dvojnik pocasi','podobne pocasi','kde je stejne pocasi'],
 'sec-onthisday':['na tento den','historie dne','pred rokem','stejny den v minulosti'],
 'sec-skyev':['specialni ukazy','nebeske ukazy','zatmeni','meteoricke roje','superuplnek'],
 'sec-stations':['meteostanice','stanice','seznam stanic'],
 'sec-escape':['kam ujet','ujet za lepsim pocasim','kam za lepsim pocasim'],
 'sec-hourly':['hodinova predpoved','hodinova','hodinovka','po hodinach'],
 'sec-daily':['7 dni','sedm dni','denni predpoved','tydenni predpoved','14 dni'],
 'sec-temphistory':['teploty za rok','rocni teploty','historie teplot','teploty rok'],
 'sec-rain':['srazky za rok','rocni srazky','srazky rok'],
 'sec-wind':['vitr','ruzice vetru','vetrna ruzice','smer vetru'],
 'sec-radar':['radar','srazkovy radar'],
 'sec-webcam':['zivy pohled','webkamera','webkamery','kamera','kamery'],
 'sec-contact':['napis mi','kontakt na autora','napsat autorovi']
};
/* jen tyhle výrazy jsou natolik jedinečné, že stačí zmínit je s „co je…“ — u obecných slov (vítr, radar…) chci slovo „sekce“ */
var SEC_UNIQUE={'sec-next':1,'sec-home':1,'sec-airflow':1,'sec-twin':1,'sec-onthisday':1,'sec-skyev':1,'sec-escape':1,'sec-temphistory':1,'sec-rain':1,'sec-contact':1,'sec-soil':1};
var EXTRA=[
 {id:'x-morning',key:'aiwsf-s-morningBrief',names:['prehled dne','karta nahore','horni karta','ranni prehled'],i:'🌅',t:'Přehled dne',where:'Karta úplně nahoře na stránce',sel:'#morningBrief'},
 {id:'x-wc',names:['kalendar sveta','svatky','jmeniny'],i:'🗓',t:'Kalendář světa',where:'Bublina „🗓 Kalendář světa“ nad stránkou (pod hodinami)',sel:'#wcTabPanel',btn:'wcTabBtn',d:'Státní svátky, jmeniny a kalendářní zajímavosti pro vybrané místo a měsíc. Rozbalíš ho klepnutím na bublinu nahoře.'},
 {id:'x-tc',names:['kalendar teplot','teploty kalendar'],i:'🌡',t:'Kalendář teplot',where:'Bublina „🌡 Kalendář teplot“ vedle Kalendáře světa',sel:'#tcTabPanel',btn:'tcTabBtn',d:'Kalendář teplot na rok dopředu — nejbližší dva týdny z předpovědi, dál z dlouhodobých průměrů.'},
 {id:'x-nw',names:['socialni','socialni sit','socialka','socialy'],i:'💬',t:'Sociál',where:'Bublina „💬 Sociál“ nad stránkou',sel:'#nwTabPanel',btn:'nwTabBtn',d:'Komunitní kolonka — sdílení a čtení příspěvků ostatních uživatelů appky.'},
 {id:'x-np',names:['noviny','zpravy','clanky'],i:'📰',t:'Noviny',where:'Bublina „📰 Noviny“ nad stránkou',sel:'#npTabPanel',btn:'npTabBtn',d:'Články a zprávy k tvému místu a tématům, s ukládáním oblíbených a hledáním. Obnovují se jednou denně.'},
 {id:'x-city',names:['zmenit mesto','vyber mesta','zmena mesta'],i:'📍',t:'Změnit město',where:'Horní lišta nebo ☰ Menu → 📍 Změnit město',fn:function(){ window.openCityPicker&&openCityPicker(); },d:'Vyber město, pro které se zobrazuje počasí. Hledat můžeš i podle státu nebo světadílu.'},
 {id:'x-compare',names:['porovnani mest','srovnani mest'],i:'⚖',t:'Porovnání měst',where:'☰ Menu → ⚖ Porovnání měst',fn:function(){ window.openCompare&&openCompare(); },d:'Postaví počasí více měst vedle sebe — hodí se před výletem.'},
 {id:'x-game',names:['herni zona','hry','kviz','tipovani pocasi','odmeny'],i:'🎮',t:'Herní zóna',where:'☰ Menu → 🎮 Herní zóna',fn:function(){ window.openGameZone&&openGameZone(); },d:'Tipování počasí a vědomostní kvíz. Za hraní sbíráš XP a odemykáš odměny.'},
 {id:'x-trim',names:['co zobrazovat','prizpusobit stranku','prizpusobeni','skryt sekci','vypnout sekci'],i:'🎛',t:'Co zobrazovat',where:'☰ Menu → 🎛 Co zobrazovat, nebo kolečko 🎛 vpravo dole',fn:function(){ window.AIW_TRIM&&AIW_TRIM.open&&AIW_TRIM.open(); },d:'Seznam všeho, co na stránce je — sekce, bubliny, plovoucí tlačítka i položky menu. Každé jde vypnout a zapnout.'},
 {id:'x-nav',names:['kde jsem','rejstrik stranky','navigace'],i:'🧭',t:'Kde jsem',where:'☰ Menu → 🧭 Kde jsem',d:'Rejstřík celé stránky — skočí na kteroukoli sekci a ukazuje, kde právě jsi.'},
 {id:'x-parrot',names:['papousek','carryparrot','carry parrot'],i:'🦜',t:'CarryParrot',where:'Plovoucí kolečko vpravo dole',fn:function(){ window.AIW_PARROT&&AIW_PARROT.open&&AIW_PARROT.open(); },d:'Papoušek-parťák, který s tebou na stránce žije a komentuje počasí.'},
 {id:'x-clock',names:['hodiny','svetove hodiny'],i:'🕐',t:'Hodiny',where:'☰ Menu → 🕐 Hodiny',fn:function(){ window.AIW_ENTRY&&AIW_ENTRY.clocks&&AIW_ENTRY.clocks(); },d:'Světové hodiny s motivy a scénami, které reagují na skutečné počasí.'},
 {id:'x-notif',names:['notifikace','upozorneni'],i:'🔔',t:'Notifikace',where:'☰ Menu → 🔔 Notifikace',fn:function(){ window.openNotifSettings&&openNotifSettings(); },d:'Nastavení upozornění na déšť, bouřky, mráz a další události.'},
 {id:'x-album',names:['fotoalbum','album','fotky mist'],i:'📷',t:'Fotoalbum',where:'☰ Menu → 📷 Fotoalbum',fn:function(){ window.AIW_LAUNCH&&AIW_LAUNCH.album&&AIW_LAUNCH.album(); },d:'Fotky míst a poznávačka — hádání, kde fotka vznikla.'},
 {id:'x-ai',names:['ai asistent','asistent','robot','chat','ty'],i:'🤖',t:'AI asistent (já)',where:'Kolečko s robotem vpravo dole',d:'Jsem AI Weather 3.0 — umím počasí, grafy a tabulky, vysvětlení appky, rady, povídání, obrázky a fakta z internetu.'},
 {id:'x-ultra',names:['ultra','diamant','premium','premium ucet'],i:'💎',t:'AI Weather ULTRA',where:'☰ Menu → 🔓 Odemknout ULTRA kódem',d:'Delší výhled, jemnější data, Bouřková laboratoř, Svislý profil, Laboratoř modelů a bonusy navíc.'}
];
function helpData(){ return window.AIW_HELPDATA||{sections:{},titles:{}}; }
function stripTags(h){ var d=document.createElement('div'); d.innerHTML=String(h||'').replace(/<\/(p|li|h\d)>/gi,'$&\n'); return (d.textContent||'').replace(/[ \t]+/g,' ').replace(/\n\s*/g,'\n').trim(); }
function firstSentences(s,n){ var m=String(s).replace(/\s+/g,' ').match(/[^.!?]+[.!?]+/g)||[s]; return m.slice(0,n).join(' ').trim(); }

/* ── živý stav stránky ── */
function pageSections(){
  var out=[]; [].forEach.call(document.querySelectorAll('.w-wrap[data-widget]'),function(el,i){
    var id=el.getAttribute('data-widget'), hd=helpData().sections[id]||{};
    out.push({id:id,el:el,label:el.getAttribute('data-wlabel')||(hd.t?hd.i+' '+hd.t:id),hidden:el.classList.contains('w-hidden'),folded:el.classList.contains('chp-off')&&!el.classList.contains('w-hidden'),help:hd});
  });
  return out;
}
/* text i ze sekce, která je zrovna sbalená do kapitoly (innerText by byl prázdný) */
function textBlocks(el){
  var BLK={DIV:1,P:1,LI:1,TR:1,H1:1,H2:1,H3:1,H4:1,H5:1,SECTION:1,TD:1,TH:1,BUTTON:1,LABEL:1,SUMMARY:1,A:1,B:0};
  var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null), n, order=[], map=new Map();
  while((n=w.nextNode())){ var t=n.nodeValue.replace(/\s+/g,' ').trim(); if(!t) continue; var p=n.parentElement; if(!p) continue; var tg=p.tagName; if(tg==='SCRIPT'||tg==='STYLE'||tg==='NOSCRIPT'||tg==='OPTION') continue;
    var b=p; while(b&&b!==el&&!BLK[b.tagName]) b=b.parentElement; if(!b) b=p; if(!map.has(b)){ map.set(b,[]); order.push(b); } map.get(b).push(t); }
  return order.map(function(b){ return map.get(b).join(' '); }).join('\n');
}
function snapshot(el,max){
  if(!el) return []; var txt=''; try{ txt=el.innerText||''; if(txt.trim().length<12) txt=textBlocks(el); }catch(e){}
  var lines=txt.split('\n').map(function(s){ return s.replace(/\s+/g,' ').trim(); }).filter(function(s){ return s.length>=3&&!/^[\W_]+$/.test(s)&&!/^(▾|▴|⌄|✕|×)$/.test(s); });
  var seen={},out=[]; lines.forEach(function(s){ var k=s.toLowerCase(); if(seen[k]) return; seen[k]=1; out.push(s.length>110?s.slice(0,108)+'…':s); });
  /* čísla a hodnoty dopředu — to je to „co v sekci opravdu je“ */
  var num=out.filter(function(s){ return /\d/.test(s)&&s.length<70; }), rest=out.filter(function(s){ return !(/\d/.test(s)&&s.length<70); });
  return num.slice(0,Math.ceil(max*0.65)).concat(rest).slice(0,max);
}
function kindsIn(el){
  var k=[]; try{ var c=el.querySelectorAll('canvas').length, s=el.querySelectorAll('svg').length, i=el.querySelectorAll('img').length, t=el.querySelectorAll('table').length, b=el.querySelectorAll('button').length, f=el.querySelectorAll('iframe').length;
    if(c||s) k.push((c+s)+' '+plur(c+s,'graf/kresba','grafy/kresby','grafů/kreseb')); if(t) k.push(t+' '+plur(t,'tabulka','tabulky','tabulek')); if(i) k.push(i+' '+plur(i,'obrázek','obrázky','obrázků')); if(f) k.push('vložený obsah (mapa/video)'); if(b>3) k.push(b+' tlačítek'); }catch(e){}
  return k;
}

/* ── hledání: která sekce / položka se myslí ── */
function scoreAlias(f,al){ var s=' '+f+' ', best=0; al.forEach(function(a){ if(s.indexOf(' '+a+' ')>=0||s.indexOf(' '+a)>=0&&a.length>=6) best=Math.max(best,a.split(' ').length*3+a.length/10); }); return best; }
function findTarget(f,text){
  var s=' '+f+' ', cands=[];
  Object.keys(SEC_ALIAS).forEach(function(id){ var sc=scoreAlias(f,SEC_ALIAS[id]); if(sc) cands.push({kind:'sec',id:id,score:sc}); });
  var hd=helpData().sections; Object.keys(hd).forEach(function(id){ if(id.indexOf('aiwsf-')===0||SEC_ALIAS[id]) return; var t=fold(hd[id].t||''); if(t&&s.indexOf(' '+t+' ')>=0) cands.push({kind:'sec',id:id,score:4}); });
  EXTRA.forEach(function(x){ var sc=scoreAlias(f,x.names); if(sc) cands.push({kind:'extra',id:x.id,score:sc,x:x}); });
  /* překlepy: zkus slova aspoň 6 znaků proti názvům */
  if(!cands.length){ f.split(' ').filter(function(w){ return w.length>=6; }).forEach(function(w){
    Object.keys(SEC_ALIAS).forEach(function(id){ SEC_ALIAS[id].forEach(function(a){ a.split(' ').forEach(function(p){ if(p.length>=6&&lev(w,p)<=1) cands.push({kind:'sec',id:id,score:2}); }); }); }); }); }
  cands.sort(function(a,b){ return b.score-a.score; });
  return cands[0]||null;
}
function secById(id){ var l=pageSections(); for(var i=0;i<l.length;i++) if(l[i].id===id) return l[i]; return null; }

/* ── odpovědi ── */
function showSection(id){
  try{ window.AIW_CHAPTERS&&AIW_CHAPTERS.reveal&&AIW_CHAPTERS.reveal(id); }catch(e){}
  var el=document.querySelector('.w-wrap[data-widget="'+id+'"]'); if(!el) return false;
  if(el.classList.contains('w-hidden')) return 'hidden';
  try{ window.AIW_ASSISTANT&&AIW_ASSISTANT.close(); }catch(e){}
  setTimeout(function(){ var y=el.getBoundingClientRect().top+(window.pageYOffset||0)-72; window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); el.classList.remove('aiw-flash'); void el.offsetWidth; el.classList.add('aiw-flash'); },260);
  return true;
}
function toggleSection(id,show){ try{ if(window.aiwW&&aiwW.add&&aiwW.remove){ show?aiwW.add(id):aiwW.remove(id); return true; } }catch(e){} var el=document.querySelector('.w-wrap[data-widget="'+id+'"]'); if(el){ el.classList.toggle('w-hidden',!show); return true; } return false; }
function guideButtons(list){ return '<div class="a3-acts">'+list.map(function(b){ return '<button type="button" class="ai2-act" data-a3="'+b[0]+'" data-t="'+esc(b[1])+'">'+b[2]+'</button>'; }).join('')+'</div>'; }

function explainSection(sec,f,D){
  var hd=sec.help||{}, h=[], body=stripTags(hd.b||''), idx=pageSections().filter(function(x){ return !x.hidden; }).map(function(x){ return x.id; }).indexOf(sec.id);
  var title=(hd.i?hd.i+' ':'')+(hd.t||sec.label.replace(/^\S+\s/,''));
  h.push('<h4>'+esc(title)+'</h4>');
  h.push('<div class="ai2-lead a3-lead">'+esc(firstSentences(body,D>=2?3:2)||'Tuhle sekci mám v rejstříku, ale bližší popis nemám.')+'</div>');
  var snap=sec.hidden?[]:snapshot(sec.el,D>=3?12:(D>=2?8:5)), kinds=sec.hidden||sec.folded?[]:kindsIn(sec.el);
  if(sec.hidden) h.push('<div class="ai2-note">Sekce je teď <b>vypnutá</b> (🎛 Co zobrazovat), takže nevidím její obsah — popisuju ji z nápovědy.</div>');
  else if(snap.length){ if(sec.folded) h.push('<div class="ai2-note">Sekce je teď sbalená do kapitoly — nemusíš ji rozbalovat, obsah vidím i tak.</div>'); h.push('<h4>👁 Co v ní právě je</h4><ul class="a3-ins">'+snap.map(function(x){ return '<li><span>•</span><div>'+esc(x)+'</div></li>'; }).join('')+'</ul>'); if(kinds.length) h.push('<div class="ai2-note">Dál obsahuje: '+esc(kinds.join(', '))+'.</div>'); }
  else h.push('<div class="ai2-note">Obsah sekce se ještě načítá nebo je prázdný — zkus to za chvilku.</div>');
  if(D>=2&&body.length>220){ var rest=body.replace(firstSentences(body,D>=2?3:2),'').trim(); if(rest) h.push('<h4>📖 Víc podrobností</h4>'+P(esc(rest.slice(0,D>=3?900:520)+(rest.length>(D>=3?900:520)?'…':'')))); }
  if(hd.h) h.push('<div class="ai2-note">💡 '+esc(stripTags(hd.h))+'</div>');
  h.push('<div class="ai2-note">'+(idx>=0?'Najdeš ji jako '+(idx+1)+'. sekci odshora.':(sec.folded?'Leží v kapitole, která je sbalená — „Ukázat“ ji rozbalí.':'Teď není zobrazená na stránce.'))+' Sbalit ji můžeš tlačítkem ⌄ u nadpisu, vypnout v 🎛 Co zobrazovat.</div>');
  h.push(guideButtons([['show',sec.id,'📍 Ukázat v appce'],[sec.hidden?'on':'off',sec.id,sec.hidden?'👁 Zapnout sekci':'🙈 Vypnout sekci'],['ask','jaké sekce tu jsou?','📋 Všechny sekce']]));
  return {html:'<div class="ai3-guide">'+h.join('')+'</div>',speech:title+'. '+firstSentences(body,2)+(snap.length?' Právě tam vidím: '+snap.slice(0,3).join('; ')+'.':''),kind:'průvodce appkou'};
}
function explainExtra(x,D){
  var hd=x.key?helpData().sections[x.key]:null, body=hd?stripTags(hd.b):(x.d||''), h=[];
  h.push('<h4>'+x.i+' '+esc(x.t)+'</h4>');
  h.push('<div class="ai2-lead a3-lead">'+esc(firstSentences(body,D>=2?3:2))+'</div>');
  h.push('<div class="ai2-note">📍 Kde: '+esc(x.where)+'.</div>');
  var el=x.sel?document.querySelector(x.sel):null, snap=el?snapshot(el,D>=2?8:5):[];
  if(snap.length) h.push('<h4>👁 Co tam právě je</h4><ul class="a3-ins">'+snap.map(function(t){ return '<li><span>•</span><div>'+esc(t)+'</div></li>'; }).join('')+'</ul>');
  if(D>=2&&hd&&body.length>200) h.push(P(esc(body.replace(firstSentences(body,3),'').trim().slice(0,520))));
  var btns=[]; if(x.fn||x.btn||x.sel) btns.push(['open',x.id,'↗ Otevřít / ukázat']); btns.push(['ask','jaké sekce tu jsou?','📋 Všechny sekce']);
  h.push(guideButtons(btns));
  return {html:'<div class="ai3-guide">'+h.join('')+'</div>',speech:x.t+'. '+firstSentences(body,2),kind:'průvodce appkou'};
}
function overviewSections(D){
  var l=pageSections(), rows=l.map(function(s,i){ var hd=s.help||{}, d=firstSentences(stripTags(hd.b||''),1); return {_cls:s.hidden?'a3-off':'',cells:[{t:String(i+1),s:i},{html:'<button type="button" class="a3-chip" data-a3ask="co je v sekci '+esc((hd.t||s.label.replace(/^\S+\s/,'')))+'">'+esc(s.label)+'</button>',s:s.label},{t:d.length>120?d.slice(0,118)+'…':d,s:d},{t:s.hidden?'vypnutá':(s.folded?'sbalená':'zobrazená'),s:s.hidden?0:1}]}; });
  var hidden=l.filter(function(s){ return s.hidden; }).length;
  var h=['<h4>🧭 Sekce stránky shora dolů</h4>',P('Appka má <b>'+l.length+' hlavních sekcí</b>'+(hidden?' ('+hidden+' je teď vypnutých)':'')+'. Klepni na název a vysvětlím ti ji — včetně toho, co v ní právě je.'),tableHTML(['#','Sekce','K čemu je','Stav'],rows,{compact:true,actions:false})];
  var ex=EXTRA.filter(function(x){ return x.id!=='x-ai'; });
  if(D>=2) h.push('<h4>🧩 Mimo sekce</h4><div class="a3-follow">'+ex.map(function(x){ return '<button type="button" class="a3-chip" data-a3ask="co je '+esc(x.names[0])+'">'+x.i+' '+esc(x.t)+'</button>'; }).join('')+'</div>');
  return {html:'<div class="ai3-guide">'+h.join('')+'</div>',speech:'Appka má '+l.length+' hlavních sekcí. Řekni název a vysvětlím ti, co v ní je.',kind:'mapa appky'};
}
function menuList(){
  var d=document.getElementById('usmDrop'), items=[]; if(d) [].forEach.call(d.querySelectorAll('.usm-item'),function(el){ var t=(el.textContent||'').replace(/\s+/g,' ').trim(); if(t&&t.length<80) items.push(t); });
  var h='<h4>☰ Co je v menu</h4>';
  if(items.length) h+=P('V rozbalovacím menu teď vidím '+items.length+' položek:')+'<ul class="a3-ins">'+items.slice(0,24).map(function(t){ return '<li><span>•</span><div>'+esc(t)+'</div></li>'; }).join('')+'</ul>';
  else h+=P('Menu najdeš vpravo nahoře (☰). Je v něm hledání, změna města, hodiny, herní zóna, notifikace, 🎛 Co zobrazovat a odemykání ULTRA.');
  h+='<div class="ai2-note">Menu má nahoře hledání a 🧭 Kde jsem; kteroukoli položku můžeš schovat v 🎛 Co zobrazovat.</div>';
  return {html:'<div class="ai3-guide">'+h+'</div>',speech:items.length?'V menu vidím '+items.length+' položek.':'Menu je vpravo nahoře.',kind:'menu'};
}
function whereIs(t){
  var h='<h4>📍 Kde to najdeš</h4>';
  if(t.kind==='sec'){ var s=secById(t.id), hd=helpData().sections[t.id]||{}; var l=pageSections().filter(function(x){ return !x.hidden; }).map(function(x){ return x.id; }); var i=l.indexOf(t.id);
    h+=P('<b>'+esc((hd.i?hd.i+' ':'')+(hd.t||(s&&s.label)||t.id))+'</b> je '+(i>=0?(i+1)+'. sekce odshora.':'teď vypnutá — zapneš ji v 🎛 Co zobrazovat.')); h+=guideButtons([['show',t.id,'📍 Ukázat'],['ask','co je v sekci '+(hd.t||''),'📖 Co v ní je']]); }
  else { h+=P('<b>'+t.x.i+' '+esc(t.x.t)+'</b> — '+esc(t.x.where)+'.'); h+=guideButtons([['open',t.x.id,'↗ Otevřít'],['ask','co je '+t.x.names[0],'📖 Vysvětlit']]); }
  return {html:'<div class="ai3-guide">'+h+'</div>',speech:'',kind:'kde to je'};
}

var GUIDE_Q=/(\bco je\b|\bco jsou\b|co je to|k cemu|co ukazuje|co zobrazuje|vysvetli|vysvetlete|popis|popiš|rekni mi o|povez mi o|co tam je|co je v|co je ve|co se skryva|co najdu|co obsahuje|co znamena|jak funguje|co dela|co umi|na co je|na co slouzi|k cemu slouzi|ukaz mi co|prozen)/;
var GUIDE_NOUN=/(sekc|panel|okn|kolonk|bublin|zalozk|tlacitk|ikon|karta|karte|kartu|menu|nabidk)/;
function handleGuide(text,f,fromVoice){
  var s=' '+f+' ', D=depthNow();
  /* přehled všech sekcí */
  if(/(jake (jsou )?(tu )?(jsou )?sekce|vsechny sekce|seznam sekci|prehled sekci|mapa stranky|co vsechno (je|tu je) (v|na) (appce|aplikaci|strance)|co je na strance|co vsechno appka umi|jak je appka rozdelena|z ceho se appka sklada|prehled appky|projdi mi appku|provedi me appkou|jake kapitoly|co v appce je)/.test(f)){ respond(text,fromVoice,function(){ var r=overviewSections(D); r.steps=['🔤 Rozumím: přehled celé appky','🧭 Čtu '+pageSections().length+' sekcí přímo ze stránky','📖 Doplňuju popisy z nápovědy','✅ Skládám mapu']; r.think=[['Čemu rozumím',['Chceš vidět všechny sekce a k čemu slouží.']],['Co jsem četl',['Živý seznam sekcí na stránce (jen zobrazené i vypnuté) a nápovědu appky.']]]; return r; }); return true; }
  if(/(co je v menu|co je v nabidce|co je v hamburgeru|jake polozky ma menu|co najdu v menu|obsah menu)/.test(f)){ respond(text,fromVoice,function(){ var r=menuList(); r.steps=['🔤 Rozumím: obsah menu','☰ Čtu položky z rozbaleného menu','✅ Skládám seznam']; return r; }); return true; }
  var explainish=GUIDE_Q.test(text)||GUIDE_Q.test(f), noun=GUIDE_NOUN.test(f);
  /* kde najdu / jak otevřu / jak zapnu */
  var loc=/(kde (je|najdu|mam|se nachazi|mohu najit|zapnu|otevru)|jak (otevru|najdu|zapnu|se dostanu|zobrazim|vypnu|zapnu)|kde to je)/.test(f);
  if(!explainish&&!noun&&!loc) return false;
  if(/(vypni|zapni|schovej|skryj|zobraz)\w* (mi )?(sekci|sekce|panel|okno)/.test(f)){
    var tt=findTarget(f,text); if(tt&&tt.kind==='sec'){ var want=/(zapni|zobraz)/.test(f), ok=toggleSection(tt.id,want); var nm=(helpData().sections[tt.id]||{}).t||tt.id;
      chat(text,fromVoice,P(ok?(want?'👁 Zapnuto — sekce „'+esc(nm)+'“ je zpátky na stránce.':'🙈 Hotovo — sekci „'+esc(nm)+'“ jsem schoval. Vrátíš ji v 🎛 Co zobrazovat nebo když řekneš „zapni sekci '+esc(nm)+'“.'):'Tuhle sekci se mi nepodařilo přepnout.'),{follow:[['📋 Všechny sekce','jaké sekce tu jsou?']]}); return true; } }
  var t=findTarget(f,text);
  if(!t){
    /* zmínka o sekci/panelu bez rozpoznaného názvu → nabídni seznam */
    if(noun&&explainish&&/(sekc|panel)/.test(f)){ respond(text,fromVoice,function(){ var r=overviewSections(D); r.pre='<div class="ai2-lead a3-lead">Nepoznal jsem přesně, kterou sekci myslíš — tady je přehled všech, klepni na tu pravou:</div>'; r.steps=['🔤 Hledám sekci podle názvu','🧭 Procházím seznam sekcí','✅ Nabízím přehled']; return r; }); return true; }
    return false;
  }
  if(t.kind==='sec'&&SEC_UNIQUE[t.id]===undefined&&!noun&&!/(v appce|v aplikaci|v sekci)/.test(f)&&!loc) return false;   /* obecné slovo (vítr, radar…) bez „sekce“ nech původnímu asistentovi */
  if(t.kind==='sec'&&!explainish&&!loc) return false;
  if(t.kind==='extra'&&!explainish&&!loc&&!noun) return false;
  if(loc&&!explainish){ respond(text,fromVoice,function(){ var r=whereIs(t); r.steps=['🔤 Hledám, co myslíš','🧭 Dohledávám jeho místo na stránce','✅ Hotovo']; return r; }); return true; }
  respond(text,fromVoice,function(){
    var r;
    if(t.kind==='sec'){ var sec=secById(t.id); if(!sec){ var hd=helpData().sections[t.id]; sec={id:t.id,el:null,label:(hd&&hd.t)||t.id,hidden:true,help:hd||{}}; } r=explainSection(sec,f,D);
      r.steps=['🔤 Rozumím: vysvětli sekci '+sec.label,'📖 Čtu nápovědu appky k sekci','👁 Čtu, co v ní právě je ('+(sec.hidden?'vypnutá':snapshot(sec.el,40).length+' řádků')+')','🧭 Určuju, kde na stránce leží','✅ Skládám vysvětlení'];
      r.think=[['Čemu rozumím',['Chceš vysvětlit sekci „'+sec.label+'“ a co je v ní.']],['Co jsem četl',['Nápovědu k sekci z appky.','Živý text sekce na stránce (to, co je tam právě teď).']],['Poznámka',['Hodnoty v sekci se mění s počasím — popisuju stav z tohoto okamžiku.']]]; }
    else { r=explainExtra(t.x,D); r.steps=['🔤 Rozumím: vysvětli '+t.x.t,'📖 Beru popis a umístění','✅ Skládám vysvětlení']; r.think=[['Čemu rozumím',['Chceš vědět, k čemu je „'+t.x.t+'“ a kde to najdeš.']]]; }
    return r;
  });
  return true;
}
function actionGuide(kind,el){
  var v=el.getAttribute('data-t');
  if(kind==='show'){ var r=showSection(v); if(r==='hidden') X.note('Sekce je vypnutá — zapni ji tlačítkem „Zapnout sekci“.'); }
  else if(kind==='on'){ toggleSection(v,true); X.note('👁 Sekce je zpátky na stránce.'); }
  else if(kind==='off'){ toggleSection(v,false); X.note('🙈 Sekce je schovaná.'); }
  else if(kind==='ask'){ AIW_ASSISTANT._process(v,false); }
  else if(kind==='open'){ var x=EXTRA.filter(function(e){ return e.id===v; })[0]; if(!x) return; try{ window.AIW_ASSISTANT&&AIW_ASSISTANT.close(); }catch(e){}
    setTimeout(function(){ if(x.fn) x.fn(); else if(x.btn){ var b=document.getElementById(x.btn); if(b) b.click(); } else if(x.sel){ var e2=document.querySelector(x.sel); if(e2) e2.scrollIntoView({behavior:'smooth',block:'center'}); } },260); }
}

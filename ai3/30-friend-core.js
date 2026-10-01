/* ══════════════════════ 7) KAMARÁD: paměť o tobě, vyslechnutí, rady ══════════════════════ */
/* — odpověď bez „přemýšlecí" bubliny: kamarád nepřemýšlí nahlas, jen odpoví — */
function typingOn(){
  var b=$('aiaBody'); if(!b||$('a3Typing')) return;
  var t=document.createElement('div'); t.className='aia-typing'; t.id='a3Typing'; t.innerHTML='<i></i><i></i><i></i>'; b.appendChild(t); b.scrollTop=b.scrollHeight;
}
function typingOff(){ var t=$('a3Typing'); if(t&&t.parentNode) t.parentNode.removeChild(t); }
function plain(h){ try{ return X.stripHTML(h); }catch(e){ return String(h).replace(/<[^>]+>/g,' '); } }
var IMPS='Choď vstávej ztlum odlož vynech vstaň dělej vrať zkoušej zavři vyprávěj rozlož začni zmenši odstraň zapiš pojmenuj vypiš rozděl zjisti připrav nastav zkus řekni napiš pojď oprav vyber ohodnoť klikni vezmi dej nezapomeň dopřej pij ptej povídej mluv dívej buď měj dbej nech zapni vypni přidej přestaň hlídej sleduj zeptej poslouchej odpočívej odpočiň dýchej nadechni vydechni vypij vyraz zavolej poděl uvař poslechni uklid ukliď otevři přečti podívej nauč vyzkoušej piš nepřeháněj netlač nespěchej nehroť nehádej neboj nezkoušej udělej pomoz seď jdi jez spi počkej usmívej zvaž přemýšlej zamysli promluv sdílej měl rozhodni'.split(' ');
function impPlural(w){
  var l=w.toLowerCase(), o;
  if(/ni$/.test(l)) o=l.slice(0,-2)+'něte'; else if(/mi$/.test(l)) o=l.slice(0,-2)+'měte'; else if(/ři$/.test(l)) o=l.slice(0,-1)+'ete'; else if(/[ňťďlš]$/.test(l)||/[bcčdfghjklmnprsštvzž]$/.test(l)) o=l+'te'; else if(/[iíy]$/.test(l)) o=l+'te'; else o=l+'te';
  if(/^(jdi)$/.test(l)) o='jděte'; if(/^(jez)$/.test(l)) o='jezte'; if(/^(buď)$/.test(l)) o='buďte'; if(/^(dej)$/.test(l)) o='dejte'; if(/^(měj)$/.test(l)) o='mějte'; if(/^(pij)$/.test(l)) o='pijte'; if(/^(spi)$/.test(l)) o='spěte';
  return w.charAt(0)===w.charAt(0).toUpperCase()?o.charAt(0).toUpperCase()+o.slice(1):o;
}
var VYW={'tě':'vás','Tě':'Vás','ti':'vám','Ti':'Vám','tobě':'vám','Tobě':'Vám','tvoje':'vaše','tvé':'vaše','tvou':'vaši','tvůj':'váš','tvoji':'vaši','tvého':'vašeho','tvému':'vašemu','tvým':'vašim','tvoje':'vaše','jsi':'jste','Jsi':'Jste','máš':'máte','Máš':'Máte','ses':'jste se','sis':'jste si','víš':'víte','Víš':'Víte','budeš':'budete','nemáš':'nemáte','neřekl(a)':'neřekli'};
function vykej(h){
  var set={}; IMPS.forEach(function(w){ set[w.toLowerCase()]=1; });
  return h.split(/(<[^>]+>)/).map(function(p){
    if(p.charAt(0)==='<') return p;
    p=p.replace(/(^|[^\p{L}])([\p{L}]+)(?![\p{L}])/gu,function(m,pre,w){
      if(VYW[w]) return pre+VYW[w];
      if(set[w.toLowerCase()]) return pre+impPlural(w);
      var mm=w.match(/^(.{3,})(eš|íš|áš)$/); if(mm&&!/^(myš|veš|kříž|zeš)$/.test(w)) return pre+mm[1]+(mm[2]==='eš'?'ete':(mm[2]==='íš'?'íte':'áte'));
      return m; });
    return p.replace(/(^|[^\p{L}])Ty (jste|máte|budete)/gu,'$1Vy $2'); }).join('');
}
function gen(s){ if(PROF.formal) s=vykej(s); if(PROF.gender==='f') return s.replace(/(\p{L})\(a\)/gu,'$1a').replace(/ý\/á/g,'á'); if(PROF.gender==='m') return s.replace(/\(a\)/g,''); return s; }
function chat(text,fromVoice,html,o){
  o=o||{}; html=gen(html); if(!o.noUser) X.addUser(text);
  typingOn();
  var ms=clamp(380+plain(html).length*5,450,1500);
  setTimeout(function(){
    typingOff();
    var h=(o.badge?'<div class="ai2-badge">'+AI2.cur().ic+' '+esc(AI2.cur().name)+' · '+esc(o.badge)+'</div>':'')+'<div class="ai3-fr">'+html+'</div>'+(o.follow?chipBtns(o.follow):'');
    X.addHTML(h);
    try{ if(X.voice()||fromVoice) X.sayText(o.speech||plain(html)); }catch(e){}
    if(o.after) try{ o.after(); }catch(e){}
  },ms);
  return true;
}
function P(s){ return '<p>'+s+'</p>'; }

/* ══ PAMĚŤ: co se o tobě dozvídám z toho, co napíšeš ══ */
var JOBS='student studentka učitel učitelka lékař lékařka doktor doktorka sestra programátor programátorka řidič řidička prodavač prodavačka kuchař kuchařka servírka číšník důchodce důchodkyně ajťák inženýr inženýrka právník právnička účetní policista hasič elektrikář truhlář zedník farmář zahradník fotograf fotografka grafik grafička novinář novinářka manažer manažerka podnikatel podnikatelka školák žák žákyně vědec vědkyně lékárník lékárnice mechanik instalatér pekař řezník'.split(' ');
var NOTNAME=fold('smutny smutna unaveny unavena nastvany nastvana zmateny zmatena vyplaseny stastny stastna rad rada sam sama doma nemocny nemocna v ve na tu zpet ok dobry dobra super fajn vzhuru hotovy hotova pripraveny pripravena studentka student').split(' ');
function capWord(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function learnProfile(text,f){
  var out=[], t=String(text), m;
  function got(k,v,say){ out.push({k:k,v:v,say:say}); }
  /* tykání / vykání */
  if(/\b(můžete|mohl byste|mohla byste|poraďte|řekněte|prosím vás|děkuji vám|dobrý den|přeji|pomozte)\b/i.test(t)&&!PROF.formal){ PROF.formal=true; }
  else if(/\b(tobě|tě|můžeš|poraď mi|řekni mi|ahoj|čau|čus|nazdar|ty\b)/i.test(t)&&PROF.formal&&!/(vás|vám|můžete)/i.test(t)){ PROF.formal=false; }
  m=t.match(/(?:jmenuju se|jmenuji se|jmenuju|moje jm[eé]no je|jm[eé]no m[aá]m)\s+([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]{1,18})/);
  if(!m) m=t.match(/(?:^|[.!?]\s*|,\s*)jsem\s+([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]{2,18})(?:[.,!?]|$)/);
  if(m&&NOTNAME.indexOf(fold(m[1]))<0&&JOBS.map(fold).indexOf(fold(m[1]))<0&&PROF.name!==m[1]){ PROF.name=m[1]; got('name',m[1],'Těší mě, '+voc(m[1])+'! Budu ti tak říkat.'); }
  m=t.match(/(?:říkej mi|říkejte mi|volej mi|oslovuj mě|oslovuj me|dej mi přezdívku)\s+([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]{1,18})/i);
  if(m){ PROF.nick=capWord(m[1]); got('nick',PROF.nick,'Jasně, budu ti říkat '+PROF.nick+'.'); }
  m=t.match(/narodil jsem se.{0,12}?(19\d\d|20[01]\d)|narodila jsem se.{0,12}?(19\d\d|20[01]\d)|ročník (19\d\d|20[01]\d)/i);
  if(m){ var by=+(m[1]||m[2]||m[3]); var ag=new Date().getFullYear()-by; if(ag>=3&&ag<=110&&PROF.age!==ag){ PROF.age=ag; got('age',ag,'Ročník '+by+' — tedy '+ag+' let. Zapsáno.'); } }
  m=t.match(/\bje mi (\d{1,2})\b|\bmám (\d{1,2}) let\b|\bmi je (\d{1,2})\b/i);
  if(m){ var a=+(m[1]||m[2]||m[3]); if(a>=5&&a<=110&&PROF.age!==a){ PROF.age=a; got('age',a,'Dobře, '+a+' let — budu to brát v potaz u rad.'); } }
  m=t.match(/(?:bydlím|bydlim|žiju|ziju|jsem z|pocházím z|pochazim z)\s+(?:v|ve|u|na|z|ze)?\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][A-Za-záčďéěíňóřšťúůýž\-]{2,24}(?: [A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž\-]+)?)/);
  if(m){ var cc=cityIn(m[1]); var cn=cc?cc.name:m[1]; if(PROF.city!==cn){ PROF.city=cn; got('city',cn,'Aha, '+cn+'. Budu na to myslet u počasí.'); } }
  JOBS.forEach(function(j){ if(!PROF.job&&new RegExp('(?:^|[^\\p{L}])(?:jsem|dělám|pracuju jako|pracuji jako|živím se jako)\\s+'+j+'(?![\\p{L}])','iu').test(t)){ PROF.job=j; got('job',j,'Ty jsi '+j+'? Dobrý, zase víc o tobě vím.'); } });
  m=t.match(/pracuj[ui]\s+(?:jako|v|ve|pro|u)\s+([^.,!?]{3,40})/i); if(m&&!PROF.job){ PROF.job=m[1].trim(); got('job',PROF.job,'Prácička '+PROF.job+' — díky, že mi to říkáš.'); }
  m=t.match(/(?:studuju|studuji|chodím do|chodim do)\s+([^.,!?]{3,40})/i); if(m&&!PROF.school){ PROF.school=m[1].trim(); got('school',PROF.school,'Studuješ '+PROF.school+' — držím palce.'); }
  var likeRe=/(?:rád|rada|miluju|miluji|zbožňuju|baví mě|bavi me|mám rád|mam rad|mám ráda|mam rada|baví mě)\s+([^.,!?]{3,60})/gi, lm;
  while((lm=likeRe.exec(t))){ var lv=lm[1].replace(/\s+(a|ale|protože|protoze)\s.*$/,'').trim(); if(!lv||/^(se|to|ho)\b/i.test(lv)) continue;
    var isHob=/\b(fotbal|běh|běhán|kolo|cykl|plav|tenis|hokej|lyž|snowboard|hory|turist|čtení|čtu|hrát|hraní|kreslení|zpěv|vaření|vařit|zahrad|rybař|tanč|jóg|fitko|cvič|fotograf|cestování|cestovat|hudb)/i.test(lv);
    if(isHob){ if(addTo(PROF.hobbies,lv,10)) got('hobby',lv,'Zapsal jsem si, že tě baví: '+lv+'.'); } else { if(addTo(PROF.likes,lv,12)) got('like',lv,'Dobře, zapsáno: '+lv+'.'); } }
  m=t.match(/(?:nemám rád|nemam rad|nemám ráda|nesnáším|nesnasim)\s+([^.,!?]{3,50})/i); if(m&&addTo(PROF.dislikes,m[1].trim(),10)) got('dislike',m[1].trim(),'Rozumím, '+m[1].trim()+' nemusíš.');
  m=t.match(/mám\s+(psa|pejska|kočku|kocoura|králíka|křečka|papouška|rybičky|koně|želvu|morče)(?:\s+(?:jménem|se jmenuje|jmenuje se|co se jmenuje)?\s*([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+))?/i);
  if(m){ var PETN={psa:['pes','ho'],pejska:['pes','ho'],'kočku':['kočka','ji'],kocoura:['kocour','ho'],'králíka':['králík','ho'],'křečka':['křeček','ho'],papouška:['papoušek','ho'],rybičky:['rybičky','je'],koně:['kůň','ho'],'želvu':['želva','ji'],'morče':['morče','ho']}[m[1].toLowerCase()]||[m[1],'ho'];
    var pn=m[2]?(m[2].replace(/(e|a|u|ovi)$/,function(x){ return x; })):''; var pet=PETN[0]+(pn?' '+pn.replace(/e$/,'').replace(/^(.*[^aeiouy])$/,'$1'):'');
    if(addTo(PROF.pets,pet,6)) got('pet',pet,'Ty máš '+m[1]+(pn?' '+pn:'')+'! Pozdravuj '+PETN[1]+' ode mě.'); }
  m=t.match(/mám\s+(syna|dceru|bratra|sestru|přítelkyni|přítele|manželku|manžela|holku|kluka|děti|dítě|vnuky|vnoučata)/i); if(m&&addTo(PROF.family,m[1],8)) got('family',m[1],'Rodina je důležitá — díky, že se se mnou dělíš.');
  m=t.match(/(?:mám|trpím|trápí mě|trapi me)\s+(alergii[^.,!?]{0,25}|astma|migrénu|migrény|bolesti hlavy|nízký tlak|vysoký tlak|cukrovku|bolavá záda|revma|bolí mě klouby|senn[ouí]+ rýmu)/i);
  if(!m) m=t.match(/jsem\s+(alergik|alergička|astmatik|astmatička|diabetik|diabetička)/i);
  if(m&&addTo(PROF.health,m[1].trim(),6)) got('health',m[1].trim(),'Beru na vědomí — u počasí na to budu myslet. (Nejsem lékař, ale rady podle počasí ti přizpůsobím.)');
  m=t.match(/(?:chci|plánuju|plánuji|snažím se|chtěl bych|chtěla bych)\s+(zhubnout|přibrat|se naučit [^.,!?]{3,30}|začít [^.,!?]{3,30}|přestat [^.,!?]{3,30}|uspořit [^.,!?]{0,30}|se zlepšit [^.,!?]{0,30})/i);
  if(m&&addTo(PROF.goals,m[1].trim(),6)) got('goal',m[1].trim(),'Dobrý cíl: '+m[1].trim()+'. Můžu ti s tím pomáhat — stačí říct.');
  m=t.match(/(?:narozeniny mám|mám narozeniny|narodil jsem se|narodila jsem se)\s+(\d{1,2})\.\s*(\d{1,2})\./i); if(m){ PROF.birthday=m[1]+'. '+m[2]+'.'; got('bday',PROF.birthday,'Narozeniny '+PROF.birthday+' si poznamenám.'); }
  if(out.length) saveProf();
  CTX.learned=out;
  return out;
}
function profileCard(){
  var rows=[];
  function add(k,v){ if(v&&(!Array.isArray(v)||v.length)) rows.push([k,Array.isArray(v)?v.join(', '):String(v)]); }
  add('Jméno',PROF.name); add('Oslovení',PROF.nick); add('Věk',PROF.age); add('Bydliště',PROF.city); add('Práce',PROF.job); add('Škola',PROF.school);
  add('Koníčky',PROF.hobbies); add('Rád(a)',PROF.likes); add('Nemusíš',PROF.dislikes); add('Zvířata',PROF.pets); add('Rodina',PROF.family); add('Zdraví',PROF.health); add('Cíle',PROF.goals); add('Narozeniny',PROF.birthday);
  add('Oslovuješ mě',PROF.formal?'vykáš':'tykáš');
  return rows;
}
function mood2(){ var l=PROF.mood.slice(-8); return l; }
function remember(kind){ PROF.lastMood=kind; PROF.lastMoodAt=Date.now(); PROF.mood.push({k:kind,t:Date.now()}); while(PROF.mood.length>40) PROF.mood.shift(); saveProf(); }
function timePart(){ var h=new Date().getHours(); return h<5?'noc':(h<10?'ráno':(h<12?'dopoledne':(h<18?'odpoledne':(h<22?'večer':'noc')))); }
function hello(){
  var n=who(), tp=timePart(), h=new Date().getHours();
  var g=tp==='ráno'?say('gm',['Dobré ráno','Ránko','Krásné ráno','Dobrýtro']):(tp==='večer'?say('ge',['Dobrý večer','Hezký večer','Ahoj do večera']):(tp==='noc'?say('gn',['Ahoj, ještě vzhůru','Noční ptáče, ahoj']):say('gd',['Ahoj','Čau','Hej','Zdravím','Nazdar'])));
  if(PROF.formal) g=tp==='ráno'?'Dobré ráno':(tp==='večer'?'Dobrý večer':'Dobrý den');
  return g+(n?', '+voc(n):'')+(PROF.formal?'.':say('gx',['!','! 👋','! 🙂']));
}
function weatherLine(){
  var m=homeModel(); if(!m) return ''; var S=dayStats(m,m.todayIso); if(!S) return '';
  var c=m.cur, sp=wetSpans(S.hs.filter(function(x){ return x.i>=m.iNow; }));
  var s='Venku je teď '+r0(c.temp)+' °C, '+skyOf(c.code)[1]+'.';
  if(sp.length) s+=' '+spanPhrase(sp[0],m);
  else if(S.tmax!=null) s+=' Dnes to vypadá na '+r0(S.tmin)+' až '+r0(S.tmax)+' °C a bez deště.';
  return s;
}
/* — vyptávání se na minulou náladu: tohle dělá z asistenta kamaráda — */
function moodFollowUp(){
  if(!PROF.lastMood||!PROF.lastMoodAt) return '';
  var age=Date.now()-PROF.lastMoodAt; if(age<20*60*1000||age>5*864e5) return '';
  if(['smutek','stres','unava','zlost','osamelost','strach'].indexOf(PROF.lastMood)<0) return '';
  var tpl={smutek:['Minule ti nebylo moc dobře — je to dnes o trochu lepší?','Myslel jsem na to, jak ti minule nebylo do smíchu. Jak se dnes držíš?'],
    stres:['Minule jsi byl(a) pod tlakem. Uleví se ti trochu?','Jak to dopadlo s tím stresem, o kterém jsi psal(a)?'],
    unava:['Minule jsi byl(a) hodně unavený/á — dospal(a) jsi se trochu?'],zlost:['Doufám, že tě to naštvání pustilo. Jak je ti dnes?'],
    osamelost:['Ptám se jen tak: jak ses měl(a) od posledně? Jsem rád, že jsi tady.'],strach:['Jak se ti daří s tím, čeho ses bál(a)? Chceš si o tom promluvit?']}[PROF.lastMood];
  PROF.lastMoodAt=0; saveProf(); return tpl?say('mfu'+PROF.lastMood,tpl):'';
}

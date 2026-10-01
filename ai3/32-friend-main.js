/* ══════════════════════ 8b) KAMARÁD: hry, vtipy, doporučení, rozhodování, rozcestník ══════════════════════ */
var JOKES=[
 'Proč meteorolog nikdy nevyhraje v loterii? Protože má 70 % šanci, že to nevyjde. 🎲',
 'Přijde mrak do banky: „Chtěl bych si vzít půjčku.“ — „A na co?“ — „Na déšť, zítra ho budu splácet.“ ☁️',
 'Co řekl sníh větru? „Neber mě tak vážně, stejně mě za chvíli někdo odhrabe.“ ❄️',
 'Meteorolog: „Zítra bude pršet.“ Manželka: „Počítám s tím, že mi to vynahradíš.“ — „Co?“ — „Že ses zase spletl.“ 😄',
 'Jaký je rozdíl mezi předpovědí počasí a horoskopem? Horoskop aspoň nepředstírá, že zná tlak. 🔮',
 'Víš, proč mají mraky vždycky pravdu? Protože se vždycky vyjádří „po svém“. ⛅',
 'Dva sněhuláci stojí na poli. Jeden povídá: „Cítíš tu mrkev?“ 🥕',
 'Slunce si stěžuje měsíci: „Ty máš lepší práci, nikdo tě nekritizuje, že jsi moc žhavý.“ 🌙',
 'Co dělá bouřka, když je smutná? Roní hromy. ⚡',
 'Proč je mlha ráda v údolí? Protože tam se nikdo nepodívá, co se děje. 🌫️',
 'Chodí tlaková výše po bytě a říká: „Já tu klidně zůstanu, jen potřebuju, aby nikdo nic neřešil.“ 🧘',
 'Programátor jde do obchodu. Žena říká: „Kup chleba, a když budou vejce, vezmi deset.“ Vrátil se s deseti chleby. „Měly vejce.“ 🥚',
 'Jak se jmenuje nejrychlejší déšť? Slejvák — protože už je pryč, než si vezmeš deštník. ☔',
 'Co řekla jedna kapka druhé? „Pojď, ať se nezmoknem!“ 💧',
 'Doktor: „Máte nízký tlak.“ Pacient: „To mi řekl už meteorolog, ale ten tím myslel venku.“ 🩺',
 'Proč si fotograf bere do deště deštník? Aby měl na fotce čisté nebe. 📸',
 'V zimě mám dva rozumné plány: spát a hibernovat. Zatím jde o to, kdy začít. 🐻',
 'Co je to: nemá nohy, ale pochoduje, nemá ruce, ale buší na okna? Déšť. 🌧️',
 'Proč bylo léto smutné? Protože všichni říkali, že ho „mají nejraději“ — ale jen dvě minuty u zmrzliny. 🍦',
 'Teploměr se ptá teploměru: „Kolik ti je?“ — „Dneska mi je 23.“ — „To je zvláštní, mně 24.“ — „Tak ty máš horečku.“ 🌡️'
];
var RIDDLES=[
 ['Mám města, ale žádné domy; mám řeky, ale žádnou vodu; mám hory, ale žádné stromy. Co jsem?','Mapa. 🗺️'],
 ['Čím víc z toho vezmeš, tím je toho víc. Co to je?','Díra. 🕳️'],
 ['Nemá křídla, a přece letí; nemá oči, a přece pláče. Co to je?','Mrak. ☁️'],
 ['Vždycky přichází, ale nikdy nedorazí. Co je to?','Zítřek. 🌅'],
 ['Padá, ale nikdy se nezraní. Co to je?','Sníh (nebo déšť). ❄️'],
 ['Za dne spí, v noci svítí; bez ohně hoří. Co to je?','Hvězda / světluška. ✨'],
 ['Nemá hlas, ale zpívá, nemá křídla, ale létá. Co to je?','Vítr. 🌬️'],
 ['Čím je větší, tím méně vidíš. Co to je?','Tma (nebo mlha). 🌫️'],
 ['Jaké stromy se nejlépe učí? Smrk. A pro pokročilé?','Hrách — protože to je stonek, který se umí odrazit. 😄 (Hádanku jsem trochu pozměnil, ale smyslu jí neubral.)'],
 ['Mám klíče, ale žádné zámky; mám místo, ale žádný pokoj. Co jsem?','Klávesnice. ⌨️']
];
var FACTS=[
 'Blesk je asi pětkrát žhavější než povrch Slunce — kolem 30 000 °C. ⚡',
 'Každou vteřinu udeří na Zemi zhruba 40–50 blesků. 🌩️',
 'Dešťová kapka padá rychlostí 15–30 km/h, ne tak rychle, jak by se zdálo. 💧',
 'Největší naměřená teplota na Zemi: 56,7 °C v Údolí smrti (1913). 🔥',
 'Nejnižší: −89,2 °C na stanici Vostok v Antarktidě. 🧊',
 'Žádné dvě sněhové vločky nejsou přesně stejné — krystaly rostou v neopakovatelných podmínkách. ❄️',
 'Vůně deště se jmenuje petrichor — pochází z půdy a bakterií, které na ni dešťové kapky „vystřelí“. 🌧️',
 'Duha je ve skutečnosti celý kruh, jen ji ze země vidíme jako půlku. 🌈',
 'Hurikán může uvolnit tolik energie jako desítky tisíc atomových bomb za den. 🌀',
 'Venuše má delší den než rok. 🪐',
 'Tlak vzduchu nás tlačí silou asi 1 kg na každý čtvereční centimetr — jen si toho nevšímáme. 🧭',
 'Chobotnice mají tři srdce a modrou krev. 🐙',
 'Včely umí „tančit“ a ukázat tak ostatním, kde je nektar. 🐝',
 'Med se nikdy nezkazí — v egyptských hrobkách našli jedlý po tisících let. 🍯',
 'Mrak o velikosti malé sněhové vločky může vážit stovky tun — jen je rozprostřený na obrovskou plochu. ☁️',
 'Nejdelší zaznamenaný blesk měl přes 700 km. ⚡',
 'Země se otáčí rychlostí až 1 670 km/h na rovníku — a my nic necítíme. 🌍',
 'V Praze se teplota nad 30 °C dnes objevuje zhruba třikrát častěji než v 50. letech. 🌡️',
 'Mraky se dají „vážit“ podle obsahu vody — běžný kupovitý mrak váží asi jako 100 slonů. 🐘',
 'Kočky tráví spaním až 70 % života. 🐱'
];
var QUOTES=[
 ['Nemusíš vidět celé schodiště, stačí udělat první schod.','— M. L. King'],['Nejtemnější je těsně před úsvitem.','— přísloví'],
 ['I dlouhá cesta začíná jedním krokem.','— Lao-c’'],['Neporovnávej svůj začátek s cizím prostředkem.','— neznámý autor'],
 ['Chyba není selhání; selhání je přestat zkoušet.','— neznámý autor'],['Po dešti vždycky vyjde slunce — někdy jen potřebuje víc času.','— přísloví'],
 ['Hlavně se nepodceňuj. Děláš to nejlíp, jak teď umíš — a to stačí.','— kamarádská rada'],['Jsi na lepší cestě, než si myslíš.','— kamarádská rada']
];
var TF=[
 ['Blesk je žhavější než povrch Slunce.',true,'Blesk dosahuje i 30 000 °C, povrch Slunce je asi 5 500 °C.'],
 ['Sněhové vločky mají vždy šest ramen.',true,'Ledové krystaly mají šesterečnou symetrii.'],
 ['V Česku je nejvyšší naměřená teplota přes 41 °C.',false,'Rekord je 40,4 °C (Dobřichovice, 2012).'],
 ['Tlaková výše většinou přináší hezké počasí.',true,'Sestupné proudění vzduchu rozpouští oblačnost.'],
 ['Hřmění vzniká dřív než blesk.',false,'Blesk a hrom vznikají současně, my světlo vidíme dřív, protože je rychlejší než zvuk.'],
 ['Mlha je vlastně mrak u země.',true,'Je to oblak kapiček ve spodních vrstvách atmosféry.'],
 ['Měsíc má vlastní světlo.',false,'Měsíc jen odráží světlo Slunce.'],
 ['Země je nejblíž Slunci v létě na severní polokouli.',false,'Nejblíž je v lednu; roční období způsobuje sklon osy.'],
 ['Duha je zdánlivě půlkruh, ve skutečnosti kruh.',true,'Ze země vidíme jen její horní část.'],
 ['Déšť padá z oblaků rychlostí přes 100 km/h.',false,'Kapky padají 15–30 km/h; kroupy rychleji.']
];
var RECS={
 film:{veseli:['Pelíšky','Vratné lahve','Marečku, podejte mi pero!','Co je doma, to se počítá, pánové','Pěkně blbě'],dojemne:['Kolja','Zelená míle','Forrest Gump','Nedotknutelní','Hřiště'],napinave:['Vlak do Busanu','Nelítostná noc','Hra o čas','Shutter Island','Sedm'],zamysleni:['Interstellar','Moon','Počátek (Inception)','Ex Machina','Truman Show']},
 serial:{veseli:['Most!','Pětka, to nejhorší','Ulice (netradiční doporučení)','Černá komedie 90. let (Pošta pro tebe)'],napinave:['Mindhunter','Dark','Stranger Things','Dr. House','Zločin'],zamysleni:['Černé zrcadlo','Chernobyl','Westworld','Úsvit planety opic (série)']},
 kniha:{veseli:['Švejk (Jaroslav Hašek)','Saturnin (Zdeněk Jirotka)','Vrchní, prchni (Gaston?)','Stopařův průvodce Galaxií'],napinave:['Da Vinciho kód','Dívka ve vlaku','Hra o trůny','Sherlock Holmes'],zamysleni:['Malý princ','Krátká historie času (Hawking)','Sapiens','Jméno růže'],dojemne:['Spolek mrtvých básníků','Ptáčata za deště?','Ať žije Eragon?']},
 hudba:{veseli:['Rytmus – klasika','Wanastowi Vjecy','Michal David','Lucie – Medvídek','ABBA'],klid:['Pink Floyd – Wish You Were Here','Ludovico Einaudi – Nuvole Bianche','Jan Hammer','Joe Hisaishi','Brian Eno'],energie:['Queen','Kabát','Rammstein','Daft Punk','Imagine Dragons'],dojemne:['Karel Gott – Vzdálená','Adele – Someone Like You','Kryštof – Srdce','Marek Ztracený','Sia']}
};
function chosenMood(f){ if(/(vesel|smich|lehk|zabav|komed)/.test(f)) return 'veseli'; if(/(dojem|smutn|plak|dojim)/.test(f)) return 'dojemne'; if(/(napin|akc|thriller|horor)/.test(f)) return 'napinave'; if(/(zamysl|chytr|filoz|vedecke|sci-?fi)/.test(f)) return 'zamysleni'; if(/(klid|relax|uklid|spani)/.test(f)) return 'klid'; if(/(energi|rock|nabit|sport)/.test(f)) return 'energie'; return null; }
function recCard(kind,mood,text){
  var d=RECS[kind]; if(!d) return null; var k=mood&&d[mood]?mood:Object.keys(d)[Math.floor(Math.random()*Object.keys(d).length)]; var arr=d[k].slice().sort(function(){ return Math.random()-.5; }).slice(0,4);
  var label={film:'Film',serial:'Seriál',kniha:'Kniha',hudba:'Hudba'}[kind], mlabel={veseli:'na dobrou náladu',dojemne:'dojemné',napinave:'napínavé',zamysleni:'k zamyšlení',klid:'k odpočinku',energie:'na nabití energií'}[k];
  var m=homeModel(), wx=''; if(m){ var S=dayStats(m,m.todayIso); if(S&&S.rain>1) wx=' Venku prší, takže ideální večer na tohle.'; }
  return '<h4>🎬 '+label+' '+mlabel+'</h4><ul class="a3-ins">'+arr.map(function(x){ return '<li><span>▸</span><div>'+esc(x)+'</div></li>'; }).join('')+'</ul>'+P(esc((who()?addr()+', ':'')+say('recend',['dej vědět, jestli to sedlo — mám dalších pár tipů.','řekni, jakou náladu chceš, a doladím to.','když nic z toho nezabere, napiš, co máš rád(a), a vyberu přesněji.'])+wx));
}
/* ── rozhodování ── */
var DCRIT=['Radost / chuť','Cena (5 = levné)','Čas a námaha (5 = málo)','Riziko (5 = bezpečné)','Přínos do budoucna'];
function decisionOptions(text){
  var t=String(text), m=t.match(/(?:jestli|jestli bych|mezi|:|zda|—|-)\s*(.+)$/i), body=m?m[1]:t;
  body=body.replace(/[?!.]+$/,'').replace(/^(mám|mam|bych měl(?:a)?|jít|jit)\s+/i,'$&');
  var opts=body.split(/\s+nebo\s+|\s+či\s+|\s+ci\s+|\s*\/\s*|,\s*(?:nebo\s+)?|\s+a\s+(?=(?:radši|raději|spíš))/i).map(function(s){ return s.replace(/^(mezi|jestli|zda|si)\s+/i,'').trim(); }).filter(function(s){ return s.length>=2&&s.length<60; });
  return uniq(opts).slice(0,4);
}
function decisionCard(opts,topicHint){
  var id='a3d'+Math.floor(Math.random()*1e6);
  var h='<h4>⚖️ Rozhodovací tabulka</h4>'+P('Ohodnoť každou možnost 1–5 (5 = nejlepší) a nastav, jak moc je pro tebe kritérium důležité. Pak klikni na <b>Spočítat</b>.');
  h+='<div class="a3-tabwrap"><table class="ai2-tab a3-tab a3-compact a3-dec" id="'+id+'"><thead><tr><th>Kritérium</th><th>Váha</th>'+opts.map(function(o){ return '<th>'+esc(o)+'</th>'; }).join('')+'</tr></thead><tbody>';
  DCRIT.forEach(function(c){ h+='<tr><td>'+esc(c)+'</td><td><input class="a3-in" type="number" min="1" max="5" value="3" data-w="1"></td>'+opts.map(function(){ return '<td><input class="a3-in" type="number" min="1" max="5" value="3" data-s="1"></td>'; }).join('')+'</tr>'; });
  h+='</tbody></table></div><div class="a3-acts"><button type="button" class="ai2-act" data-a3="decide" data-t="'+id+'">🧮 Spočítat</button></div><div class="a3-dres" id="'+id+'r"></div>';
  h+='<div class="ai2-note">Tip: když vychází těsně, ptej se sám sebe, kterou volbu bys za rok víc litoval(a). Pomůže i pravidlo 10-10-10: jak se k tomu budeš cítit za 10 minut, 10 měsíců a 10 let?</div>';
  return h;
}
function decideCompute(id){
  var tb=document.getElementById(id), out=document.getElementById(id+'r'); if(!tb||!out) return;
  var heads=[].slice.call(tb.tHead.rows[0].cells).slice(2).map(function(c){ return c.textContent; }), tot=heads.map(function(){ return 0; }), wsum=0;
  [].forEach.call(tb.tBodies[0].rows,function(r){ var w=clamp(+r.cells[1].querySelector('input').value||3,1,5); wsum+=w; for(var i=0;i<heads.length;i++){ tot[i]+=w*clamp(+r.cells[2+i].querySelector('input').value||3,1,5); } });
  var pct=tot.map(function(t){ return Math.round(t/(wsum*5)*100); }), best=pct.indexOf(Math.max.apply(null,pct)), sorted=pct.slice().sort(function(a,b){ return b-a; });
  var close=sorted.length>1&&sorted[0]-sorted[1]<=6;
  out.innerHTML='<div class="a3c-box">'+svgHBar(heads.map(function(h,i){ return {label:h,value:pct[i],color:i===best?'#22d474':PAL[(i+3)%PAL.length]}; }),{unit:' %',title:'Výsledek'})+'</div>'
   +'<div class="ai2-lead a3-lead">'+(close?'Vychází to <b>velmi těsně</b> — '+esc(heads[best])+' vede jen o '+(sorted[0]-sorted[1])+' %. Zkus si představit, že vyhraje druhá možnost: cítíš úlevu, nebo zklamání? To ti řekne víc než čísla.':'Podle tvých vah vede <b>'+esc(heads[best])+'</b> ('+pct[best]+' %).')+'</div>';
}
/* ── hry ── */
function startGuess(text,fromVoice){
  CTX.pending={kind:'guess',n:1+Math.floor(Math.random()*50),tries:0};
  return chat(text,fromVoice,P('🎯 <b>Hádej číslo!</b> Myslím si číslo od 1 do 50. Zkus ho trefit — řeknu ti „víc“ nebo „míň“. (Napiš <i>končím</i>, kdybys chtěl(a) přestat.)'));
}
function startTF(text,fromVoice){
  var order=TF.map(function(_,i){ return i; }).sort(function(){ return Math.random()-.5; }).slice(0,5);
  CTX.pending={kind:'tf',order:order,i:0,score:0};
  var q=TF[order[0]];
  return chat(text,fromVoice,P('🧠 <b>Pravda, nebo lež?</b> Pět tvrzení o počasí a přírodě. Odpověz „pravda“ nebo „lež“.')+P('<b>1/5:</b> '+esc(q[0])));
}
function pendingGame(text,f,fromVoice){
  var P0=CTX.pending; if(!P0) return false;
  if(/(konc[ií]m|konec|stop|nechci|dost)/.test(f)){ CTX.pending=null; chat(text,fromVoice,P('Jasně, končíme. 🙂 Bylo to fajn — kdykoli znovu.')); return true; }
  if(P0.kind==='forget'){
    CTX.pending=null;
    if(/^(ano|jo|jasne|ok|klidne|potvrzuji|smaz|zapomen|jo prosim)/.test(f)){ var keep=PROF.formal; Object.keys(PROF).forEach(function(k){ delete PROF[k]; }); Object.assign(PROF,{name:null,nick:null,age:null,city:null,job:null,school:null,formal:keep,likes:[],dislikes:[],hobbies:[],pets:[],family:[],health:[],goals:[],facts:[],birthday:null,mood:[],seen:0,first:Date.now(),last:0,lastMood:null,lastMoodAt:0,topics:{}}); saveProf(); chat(text,fromVoice,P('Hotovo. Všechno, co jsem si o tobě pamatoval, je smazané — jsme zase u čistého listu. 🧼')); }
    else chat(text,fromVoice,P('Dobře, nic nemažu. Zůstáváme u toho, co už víme. 🙂'));
    return true;
  }
  if(P0.kind==='guess'){
    var n=toNum(f.replace(/[^\d.,-]/g,' ').trim().split(' ')[0]); if(isNaN(n)){ return false; }
    P0.tries++;
    if(n===P0.n){ CTX.pending=null; chat(text,fromVoice,P('🎉 <b>Trefa!</b> Bylo to '+P0.n+' a trvalo ti to '+P0.tries+' '+plur(P0.tries,'pokus','pokusy','pokusů')+'. '+(P0.tries<=5?'To je výborné!':'Dobrá práce!')+' Dáš ještě jedno kolo?'),{follow:[['🎯 Znovu','hádej číslo'],['🧠 Pravda/lež','pravda nebo lež']]}); }
    else chat(text,fromVoice,P(n<P0.n?'⬆️ <b>Víc.</b> Zkus vyšší číslo.':'⬇️ <b>Míň.</b> Zkus nižší číslo.')+(P0.tries>=7?P('Nápověda: číslo je '+(P0.n%2?'liché':'sudé')+'.'):''));
    return true;
  }
  if(P0.kind==='tf'){
    var yes=/^(pravda|ano|jo|je to pravda|pravdive|true|souhlas)/.test(f), no=/^(lez|ne|nepravda|nepravdive|false|nesouhlas|lhal)/.test(f);
    if(!yes&&!no) return false;
    var q=TF[P0.order[P0.i]], ok=(yes&&q[1])||(no&&!q[1]); if(ok) P0.score++;
    var msg=(ok?'✅ <b>Správně!</b> ':'❌ <b>Ne tak docela.</b> ')+esc(q[2]); P0.i++;
    if(P0.i>=P0.order.length){ CTX.pending=null; chat(text,fromVoice,P(msg)+P('<b>Skóre: '+P0.score+'/5.</b> '+(P0.score>=4?'Skvělé, ty jsi meteorolog! 🌦️':(P0.score>=2?'Slušné — a už víš něco navíc.':'Příště to bude lepší. 😄'))),{follow:[['🧠 Znovu','pravda nebo lež'],['🎯 Hádej číslo','hádej číslo']]}); }
    else chat(text,fromVoice,P(msg)+P('<b>'+(P0.i+1)+'/5:</b> '+esc(TF[P0.order[P0.i]][0])));
    return true;
  }
  return false;
}
/* ── identita a rozcestník ── */
function capabilitiesCard(){
  var rows=[
   ['☀️ Počasí do hloubky','„jaké je počasí“, „bude pršet?“, „jak bude v sobotu večer“, „počasí v Brně“, „je zítra tepleji než dnes?“'],
   ['📈 Grafy a tabulky','„graf srážek na týden“, „tabulka teplot na víkend“, nebo vlož vlastní data: „udělej graf: Praha 5, Brno 7, Ostrava 3“'],
   ['🧭 Průvodce appkou','„co je v sekci Měsíc?“, „vysvětli mi Dvojník počasí“, „jaké sekce tu jsou?“, „kde najdu radar?“'],
   ['🤝 Kamarád','pamatuju si, kdo jsi, umím vyslechnout („potřebuju se vypovídat“), poradit („jak se líp učit?“) a pomoct s rozhodnutím'],
   ['🎮 Zábava','vtipy, hádanky, zajímavosti, „pravda nebo lež“, „hádej číslo“, tipy na film, hudbu a knihy'],
   ['🖼 Obrázky','„vytvoř obrázek podzimního lesa v mlze, akvarel, na výšku“ — rozumím stylům, světlu a počasí'],
   ['🌐 Internet a fakta','Wikipedie, Wikidata, sport, výpočty, převody, kalendář — to ostatní umí AI Weather 3.0 z dřívějška']];
  return '<h4>✨ Co umí AI Weather 3.0</h4><ul class="a3-ins">'+rows.map(function(r){ return '<li><span>'+r[0].split(' ')[0]+'</span><div><b>'+esc(r[0].replace(/^\S+\s/,''))+'</b><br><small>'+esc(r[1])+'</small></div></li>'; }).join('')+'</ul>'
   +P('Vyber si model nahoře: <b>⚡ Flash</b> odpoví stručně a hned, <b>🧠 Ultrathinking</b> přidá rozbor, tabulky a rady, <b>🛰 Ultraagent</b> složí celou zprávu včetně porovnání tří předpovědních modelů.')
   +'<div class="ai2-note">Paměť o tobě (jméno, koníčky…) je jen v tomto zařízení; kdykoli řekni „zapomeň na mě“.</div>';
}
function identityAnswer(f){
  if(/(jsi clovek|jsi zivy|jsi skutecny|mluvim s clovekem)/.test(f)) return P('Ne, jsem umělá inteligence — a nechci ti předstírat opak. Ale poslouchám pozorně a snažím se ti pomoct tak, jak by to udělal dobrý kamarád. 🤝');
  if(/(mas city|citis|mas vedomi|bojis se|jsi stastny|mas rad|mas me rad|mas pocity)/.test(f)) return P('Upřímně: city jako ty nemám a nechci tvrdit, že ano. Co ale mám, je opravdový „zájem“ o to, aby ti moje odpovědi pomohly — a taky se tu s tebou dobře povídá. 🙂');
  if(/(kdo te (vytvoril|udelal|naprogramoval|postavil)|kdo te vymyslel)/.test(f)) return P('Postavil mě autor téhle appky. Jsem součást AI Weather — většinu věcí počítám přímo tady v tvém zařízení (počasí, grafy, paměť o tobě), takže tvoje data zůstávají u tebe. Na fakta ze světa sahám na internet, jen když to zapneš.');
  return P('Jsem <b>AI Weather 3.0</b> — asistent téhle appky. Číst umím živá data počasí, vysvětlím každou sekci, udělám tabulku nebo graf, nakreslím obrázek a hlavně si s tebou rád popovídám a poradím. Nejsem člověk, ale snažím se být dobrý parťák. 🤖☀️');
}
function profileAnswer(text,fromVoice){
  var rows=profileCard();
  var n=who();
  if(!rows.length||rows.length===1&&rows[0][0]==='Oslovuješ mě') return chat(text,fromVoice,P('Zatím o tobě skoro nic nevím — a to je dobrá příležitost se poznat. 🙂')+P('Řekni mi třeba: <i>„Jmenuju se Honza, bydlím v Brně, rád běhám a mám psa Rexe.“</i> Co mi řekneš, si zapamatuju jen v tomhle zařízení.'),{follow:[['👋 Představit se','jmenuju se '],['🧠 Co umíš','co umíš']]});
  var tbl=tableHTML(['Co o tobě vím','Údaj'],rows.map(function(r){ return {cells:[{html:'<b>'+esc(r[0])+'</b>'},r[1]]}; }),{compact:true,actions:false});
  var since=PROF.first?Math.max(1,Math.round((Date.now()-PROF.first)/864e5)):0;
  return chat(text,fromVoice,'<h4>🙋 Co o tobě vím</h4>'+P((n?voc(n)+', t':'T')+'ohle jsem se o tobě dozvěděl'+(since>1?' za posledních '+since+' dní':'')+':')+tbl+P('Je to jen v tomhle zařízení a můžu to kdykoli smazat — stačí říct „zapomeň na mě“. Chybí ti tam něco, nebo je něco špatně? Klidně mi to oprav.'),{follow:[['🧼 Zapomeň na mě','zapomeň na mě'],['💡 Co mi doporučíš','co dnes podniknout']]});
}
/* ── pozdrav / dobré ráno / dobrou noc ── */
function greetReply(text,f,fromVoice){
  var tp=timePart(), parts=[], m=homeModel();
  PROF.seen=(PROF.seen||0)+1; saveProf();
  var fu=moodFollowUp();
  if(/dobrou noc|jdu spat|jdu do postele/.test(f)){
    var tmr=m?dayHeadline(m,addDays(m.todayIso,1)):null;
    parts.push(P(esc(say('gnite',['Dobrou noc','Spi dobře','Hezké sny'])+(who()?', '+addr():'')+'! 🌙')));
    if(tmr) parts.push(P(esc(tmr.lead+' '+tmr.temp)));
    parts.push(P(say('gnite2',['Telefon odlož a vydechni — zítra je nový den.','Ať se ti dobře spí a ráno vstaneš odpočatý.','Nastav si budík a ať ti nic nevrtá hlavou. 😴'])));
    return chat(text,fromVoice,parts.join(''),{follow:[['☀️ Ráno mi řekni počasí','dobré ráno']]});
  }
  parts.push(P(esc(hello())));
  if(/dobre rano|dobryn?o?|rano/.test(f)||tp==='ráno'){
    if(m){ var S=dayStats(m,m.todayIso); var bw=bestWindow(m,m.todayIso); parts.push(P('☀️ <b>Ranní přehled:</b> '+esc(weatherLine())+(bw?' Nejlepší okno ven: '+bw.a+'–'+bw.b+' h.':'')+(S&&S.tmin<=1?' Pozor na ranní námrazu.':''))); }
  } else if(m) parts.push(P(esc(weatherLine())));
  if(fu) parts.push(P(esc(fu))); else parts.push(P(esc(say('gq',['Co děláš, nebo s čím ti můžu pomoct?','Jak se dneska máš?','Něco ti můžu zjistit, nebo si jen popovídáme?']))));
  return chat(text,fromVoice,parts.join(''),{follow:[['☀️ Podrobné počasí','jaké je počasí'],['💡 Co dnes podniknout','co dnes podniknout'],['🧭 Co umíš','co umíš'],['😄 Vtip','řekni mi vtip']]});
}
function friendPending(text,f,fromVoice){
  if(CTX.pending&&pendingGame(text,f,fromVoice)) return true;
  var L=CTX.listen;
  if(L){
    if(Date.now()-L.last>20*60*1000){ CTX.listen=null; return false; }
    var s=' '+f+' ';
    if(isWx(f)||CHART_RE.test(s)||/ (sekci|sekce|panel|menu) /.test(s)){ return false; }
    var r=listenReply(text,f); if(!r){ CTX.listen=null; return false; }
    chat(text,fromVoice,r.html,{follow:r.follow}); return true;
  }
  return false;
}
function handleFriendFirst(text,f,fromVoice){
  var s=' '+f+' ', q=/\?/.test(text);
  learnGender(text);
  if(isWx(f)) return false;
  var learned=CTX.learned||[]; CTX.learned=[];
  if(/(zapomen|smaz|vymaz|vyres)\w* .*(me|mne|o mne|vsechno|profil|co vis|pamet)/.test(f)||/^zapomen na me/.test(f)){ CTX.pending={kind:'forget'}; chat(text,fromVoice,P('Opravdu mám smazat všechno, co si o tobě pamatuju? (jméno, koníčky, zvířata…) Napiš <b>ano</b>, nebo <b>ne</b>.'),{follow:[['Ano, smaž','ano'],['Ne, nech to','ne']]}); return true; }
  if(/(kdo jsem|co o mne vis|co vis o mne|znas me|pamatujes si me|jak se jmenuju|jak mi rikas|kde bydlim|kolik mi je|co mam rad|co me bavi|co si o mne pamatujes|jake mam zvire|jak mi mas rikat)/.test(f)){ profileAnswer(text,fromVoice); return true; }
  if(/(kdo jsi|co jsi zac|co jsi|jak se jmenujes|jsi robot|jsi clovek|jsi umela|jsi ai\b|kdo te (vytvoril|udelal|naprogramoval|postavil|vymyslel)|jsi zivy|mas city|mas vedomi|bojis se|jsi stastny|mas me rad|mas pocity|citis)/.test(f)&&wc(f)<=8){ chat(text,fromVoice,identityAnswer(f),{follow:[['🧭 Co umíš','co umíš'],['🙋 Co o mně víš','co o mně víš']]}); return true; }
  if(/(co umis|co dokazes|s cim mi pomuzes|jak te pouzivat|napoveda|co vsechno umis|jake mas funkce|co je nove|co je noveho|co nove|co ti jde|k cemu jsi)/.test(f)&&wc(f)<=7){ chat(text,fromVoice,capabilitiesCard(),{badge:'přehled schopností',follow:[['☀️ Počasí','jaké je počasí'],['📈 Graf z dat','udělej graf: Praha 5, Brno 7, Ostrava 3'],['🧭 Sekce appky','jaké sekce tu jsou?'],['🤝 Popovídat si','pokecáme']]}); return true; }
  if(/^(ahoj|cau|cus|nazdar|zdravim|dobry den|dobre rano|dobry vecer|dobrou noc|hej|hello|hi|ahojky|cauky|cauky|zdar|dobre odpoledne)\b/.test(f)&&wc(f)<=6&&!q){ greetReply(text,f,fromVoice); return true; }
  if(/^(dik|diky|dekuji|dekuju|dik moc|dekuju moc|super|parada|bezva|skvele|to je dobre|perfekt|dobra prace)\b/.test(f)&&wc(f)<=6){ chat(text,fromVoice,P(esc(say('thx',[(who()?addr()+', ':'')+'rádo se stalo! 😊','Není zač — jsem rád, že to sedlo.','Kdykoli. Ptej se dál. 🙂','To mě těší! Mám pro tebe ještě něco?']))),{follow:[['☀️ Počasí','jaké je počasí'],['😄 Vtip','řekni mi vtip']]}); return true; }
  if(/^(nashledanou|mej se|papa|tak zatim|cau zatim|uvidime se|musim jit|jdu pryc|bye|na shledanou|ahoj zatim)\b/.test(f)){ chat(text,fromVoice,P(esc(say('bye',['Měj se krásně'+(who()?', '+addr():'')+'! Kdyby cokoli, jsem tady. 👋','Tak zatím — a ať ti vyjde počasí! ☀️','Pa! Dávej na sebe pozor. 🙂'])))); return true; }
  if(/(jak se mas|jak se ti dari|jak se vede|co delas|co je noveho|jak jde zivot)/.test(f)&&wc(f)<=6){ var m0=homeModel(), wxs=m0?(' Venku je '+r0(m0.cur.temp)+' °C, tak mi ráno chodí nálada podle počasí. 😄'):''; chat(text,fromVoice,P(esc(say('hru',['Mám se dobře, díky, že se ptáš!','Pořád v pohodě — čtu čísla a hledám souvislosti, což je můj druh zábavy.','Dobře, jsem plný energie (je to digitální, nemusí se dobíjet). 😄']))+wxs)+P(esc(say('hru2',['A ty? Jak se máš doopravdy?','Co ty, jaký máš den?','A co u tebe — něco nového?']))),{follow:[['😊 Mám se dobře','mám se dobře'],['😔 Není mi dobře','není mi dobře'],['☀️ Počasí','jaké je počasí']]}); return true; }
  if(/(potrebuju se vypovidat|potrebuji se vypovidat|chci se vypovidat|vypovidat se|postezovat|potrebuju si promluvit|potrebuju promluvit|vyslechni me|vyslechnes me|poslouchej me|poslechni me|jen poslouchej|chci si povidat|jen si povidat|jen si chci povidat|mas chvilku|mas cas)/.test(f)){ listenStart(emoKind(f),text); chat(text,fromVoice,P(esc(openLine(CTX.listen.emotion)))); return true; }
  if(/^(pokecame|pokec|povidej|pojd si povidat|nudim se|nuda)\b/.test(f)&&wc(f)<=5){ listenStart(null,text); var qs=say('chq',['Tak povídej — jaký jsi měl(a) den? Stalo se něco, co tě pobavilo, nebo naopak?','Pojďme na to. Co tě v poslední době zaměstnává nejvíc?','Rád si popovídám. Co kdybys mi řekl(a), co děláš rád(a), když máš volný čas?']).replace('měl(a)',Gx('měl','měla')).replace('řekl(a)',Gx('řekl','řekla')).replace('rád(a)',Gx('rád','ráda')); chat(text,fromVoice,P(esc(qs)),{follow:[['🎲 Hra','hádej číslo'],['😄 Vtip','řekni mi vtip'],['💡 Nápad na dnes','co dnes podniknout']]}); return true; }
  /* naučené věci o tobě — potvrdím je lidsky (jen u čistého vyprávění, ne u otázek) */
  if(learned.length&&!q&&wc(f)<=22&&!/ (poradi|jak |co |proc |kolik )/.test(s)){
    var say1=learned.map(function(l){ return l.say; }).slice(0,2).join(' '); var nx=say('lrn',['Co ještě mi o sobě řekneš?','A jak se ti v poslední době daří?','Zajímalo by mě víc — třeba co tě baví.']);
    if(!/(mi je|jsem unaven|jsem smutn)/.test(f)){ chat(text,fromVoice,P(esc(say1+' '+nx)),{follow:[['🙋 Co o mně víš','co o mně víš']]}); return true; }
  }
  /* emoce — jen když je to vyprávění o sobě, ne dotaz na fakta */
  var ek=emoKind(f);
  if(!ek&&topicTalk(f)&&/(nadava|nadavaji|vadi mi|trapi me|nejde mi|nezvladam|problem|potiz|hadka|hadali jsme|rozchod|odesel|odesla|vyhodil|vyhodili|ztratil jsem|ztratila jsem|ubližuje|ubliz)/.test(f)&&!wantsAdvice(text,f)) ek=/hadk|hadali|rozchod|odes/.test(f)?'smutek':'stres';
  if(ek&&ek!=='krize'&&!wantsAdvice(text,f)&&!/(co je |proc |jak vznika|kdo je )/.test(f)&&wc(f)<=45){
    if(ek==='radost'){ remember('radost'); chat(text,fromVoice,P(esc(say('joy',['To je skvělé! 🎉 Gratuluju — vypráv, jak to proběhlo!','Paráda! Tohle potěší. Co přesně se povedlo?','Ty jo, to je radost číst! Pověz mi víc. 😊']))),{follow:[['🎉 Oslavit','co dnes podniknout']]}); return true; }
    if(ek==='nuda'){ var ad=adviceFor('nuda co delat'); if(ad){ chat(text,fromVoice,ad.html,{badge:'nápady na dnes',follow:[['😄 Vtip','řekni mi vtip'],['🎲 Hra','hádej číslo']]}); return true; } }
    listenStart(ek,text); CTX.listen.turns=0; var tp=topicTalk(f); if(tp) CTX.listen.topic=tp[0];
    var nameL=addr(); var intro=nameL&&Math.random()<0.6?nameL+', ':'';
    chat(text,fromVoice,P(esc(intro+openLine(ek)))); return true;
  }
  return false;
}
function wantsAdvice(text,f){
  if(/(^|[^\p{L}])(poraď(te)?|poradit|poradíte|poradíš|poradili|poprosím o radu|potřebuju radu|chci radu|nějakou radu|nevím si rady)(?![\p{L}])/iu.test(text)) return true;
  if(/^(jak|co) (se |mam |mám )?(lip |lepe |lepsi |dobre |nejlip )?(zlepsit|naucit|ucit|zvladnout|zacit|prestat|usnout|zhubnout|motivovat|soustredit|uklidnit|zvladat|nebyt|rozjet|stihat|setrit|uspori|cvicit|behat|spat)/.test(f)) return true;
  if(/^jak (na|zvladnu|to zvladnu|se vyrovnat)/.test(f)&&adviceFor(f)) return true;
  if(/(co s tim|co ted|co bych mel delat|co bych mela delat|jak (to )?(resit|reagovat|zvladnout))\??$/.test(f)&&adviceFor(f)) return true;
  return false;
}
function handleFriend(text,f,fromVoice){
  var s=' '+f+' ', q=/\?/.test(text);
  if(/(vtip|zavtipkuj|rozesmej|pobav me|neco vtipneho)/.test(f)){ chat(text,fromVoice,P(esc(say('jk',JOKES))),{follow:[['😄 Další vtip','další vtip'],['🧩 Hádanka','dej mi hádanku'],['🤓 Zajímavost','řekni mi zajímavost']]}); return true; }
  if(/^(dalsi vtip|jeste jeden vtip|dalsi|jeste)\b/.test(f)&&ctxFresh()&&false) return false;
  if(/(hadanku|hadanka|rebus)/.test(f)){ var r=RIDDLES[Math.floor(Math.random()*RIDDLES.length)]; chat(text,fromVoice,P('🧩 '+esc(r[0]))+'<details class="ai3-rev"><summary>Ukázat odpověď</summary><p>'+esc(r[1])+'</p></details>',{follow:[['🧩 Další hádanka','dej mi hádanku'],['😄 Vtip','řekni mi vtip']]}); return true; }
  if(/(zajimavost|vedel jsi|fun fact|zajimave|neco zajimaveho|zajimavou vec)/.test(f)){ chat(text,fromVoice,P('🤓 '+esc(say('ft',FACTS))),{follow:[['🤓 Další','další zajímavost'],['🧠 Pravda/lež','pravda nebo lež']]}); return true; }
  if(/(hadej cislo|zahrajeme si|zahraj si|hrajeme hru|chci hrat hru|pojdme hrat)/.test(f)&&!/(pravda|lez|kviz)/.test(f)) return startGuess(text,fromVoice);
  if(/(pravda nebo lez|kviz o pocasi|zkus me|zkousej me|otestuj me)/.test(f)) return startTF(text,fromVoice);
  if(/(motivuj|povzbud|pochval|rozveselit|dodej mi odvahu|citat|moudro dne|inspiruj)/.test(f)){ var qt=QUOTES[Math.floor(Math.random()*QUOTES.length)]; chat(text,fromVoice,P('💬 <i>„'+esc(qt[0])+'“</i> '+esc(qt[1]))+P(esc((who()?addr()+', ':'')+say('mot',['věřím ti víc, než si možná myslíš.','každý den, kdy to zkusíš, je výhra.','dneska stačí jedna malá věc.']))),{follow:[['🗓 Co dnes podniknout','co dnes podniknout'],['🙂 Jen si povídat','pokecáme']]}); return true; }
  var rk=f.match(/(?:porad\w*|doporuc\w*|vyber\w*|co) (?:mi )?(?:si )?(?:poustet|cist|hrat|poslouchat)?\s*(film|serial|knihu|knizku|hudbu|pisnicku|album|hru)?/);
  if(/(porad|doporuc|tip na|co si pustit|co cist|co poslouchat|co sledovat)\w*/.test(f)&&/(film|serial|knih|knizk|hudb|pisnick|album|poslouchat|cist|pustit|sledovat|koukat)/.test(f)){
    var kind=/(serial)/.test(f)?'serial':(/(knih|knizk|cist)/.test(f)?'kniha':(/(hudb|pisnick|album|poslouchat)/.test(f)?'hudba':'film')); var h=recCard(kind,chosenMood(f),text);
    if(h){ chat(text,fromVoice,h,{follow:[['😄 Veselé','poraď mi '+kind+' veselé'],['😢 Dojemné','poraď mi '+kind+' dojemné'],['🤔 K zamyšlení','poraď mi '+kind+' k zamyšlení']]}); return true; } }
  if(/(co dnes (delat|podniknout|vymyslet)|napad na dnes|co podniknout|kam jit|co delat o vikendu|inspiruj mne|co mam delat dnes)/.test(f)){ var ad2=adviceFor('nuda co delat'); chat(text,fromVoice,ad2.html,{badge:'nápady na dnes',follow:[['😄 Vtip','řekni mi vtip'],['🌡 Počasí','jaké je počasí']]}); return true; }
  if(/(rozhod\w*|nevim jestli|vybrat si|co je lepsi|co mam vybrat|pomoz mi s volbou|mezi .* a )/.test(f)&&/( nebo | ci | mezi |rozhodnout)/.test(s)){
    var opts=decisionOptions(text);
    if(opts.length>=2){ chat(text,fromVoice,decisionCard(opts),{badge:'rozhodovací tabulka'}); return true; }
    chat(text,fromVoice,P('S rozhodováním ti rád pomůžu. Napiš mi, mezi čím se rozhoduješ — třeba <i>„nevím, jestli jít na hory nebo k moři“</i> — a postavím ti rozhodovací tabulku.'),{follow:[['🏔 Hory × moře','nevím jestli jet na hory nebo k moři'],['💼 Práce × studium','nevím jestli zůstat v práci nebo jít studovat']]}); return true; }
  if(wantsAdvice(text,f)){
    var ad3=adviceFor(f);
    if(ad3){ chat(text,fromVoice,ad3.html,{badge:'rada',follow:ad3.follow}); return true; }
    chat(text,fromVoice,P(esc((who()?addr()+', rád':'Rád')+' poradím. Řekni mi trochu víc — o jakou oblast jde?'))+P('Umím třeba: <b>spánek, učení, motivaci, stres, vztahy, práci a pohovory, peníze, pohyb, čas a priority, sebevědomí</b>.'),{follow:[['😴 Spánek','poraď mi se spánkem'],['📚 Učení','jak se líp učit'],['🧘 Stres','jak zvládnout stres'],['🚀 Motivace','nemůžu se rozjet']]}); return true; }
  /* osobní vyprávění, které by jinak spadlo na rešerši z Wikipedie */
  if(!q&&/^(jsem|mam|byl jsem|byla jsem|dneska jsem|dnes jsem|vcera jsem|chci|citim|pripada mi|myslim|asi|nevim|mel jsem|mela jsem|zrovna jsem|prave jsem|zazil jsem|zazila jsem|dostal jsem|dostala jsem|rozhodl jsem|rozhodla jsem)\b/.test(f)&&wc(f)>=3&&!/(co je|kdo je|kolik)/.test(f)){
    var tp2=topicTalk(f); var resp=[];
    resp.push(say('pers',['Aha, díky, že mi to říkáš.','Zajímavé — pokračuj, poslouchám.','Hm, to dává smysl.','No jo, to znám z vyprávění. 🙂','Chápu.']));
    resp.push(tp2?say('pert',['Jak to na tebe působí v tom ohledu — '+tp2[2]+'?','Co kolem toho cítíš nejvíc?','A jak to vnímáš ty sám?']):say('perq',['Jak se z toho cítíš?','A co z toho plyne pro tebe?','Jak to bylo dál?','Co tě na tom zaujalo nejvíc?']));
    chat(text,fromVoice,P(esc(resp.join(' '))),{follow:[['💡 Poraď mi','poraď mi s tím'],['🙂 Jen poslouchej','pokecáme']]}); return true; }
  return false;
}
/* tlačítka uvnitř karet (např. rozhodovací tabulka) */
function actionA3(kind,el){ if(kind==='decide') decideCompute(el.getAttribute('data-t')); else actionGuide(kind,el); }

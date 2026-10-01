/* ══════════════════════ 8) KAMARÁD: emoce, vyslechnutí, rady ══════════════════════ */
/* pohlaví z českých tvarů sloves a přídavných jmen */
function learnGender(t){
  var END='(?=[\\s,.!?…]|$)';
  var F=new RegExp('\\bjsem\\s+(?:\\S+\\s+)?(byla|dělala|udělala|unavená|ráda|smutná|nadšená|šťastná|naštvaná|nemocná|vyčerpaná|sama|zmatená|ztracená|hotová|připravená|nervózní žena)'+END,'i');
  var M=new RegExp('\\bjsem\\s+(?:\\S+\\s+)?(byl|dělal|udělal|unavený|rád|smutný|nadšený|šťastný|naštvaný|nemocný|vyčerpaný|sám|zmatený|ztracený|hotový|připravený)'+END,'i');
  if(F.test(t)||/\b(jsem|som)\s+(holka|žena|dívka|maminka|studentka)\b/i.test(t)) PROF.gender='f';
  else if(M.test(t)||/\bjsem\s+(kluk|muž|chlap|tatínek|student)\b/i.test(t)) PROF.gender='m';
}
function Gx(a,b){ return PROF.gender==='f'?b:(PROF.gender==='m'?a:(b.indexOf(a)===0?a+'('+b.slice(a.length)+')':a+'/'+b)); }

/* ── slovník pocitů — aby to nezníulo pořád stejně ── */
var FEEL={
  smutek:['smutný','skleslý','zklamaný','na dně','sklíčený','posmutnělý','bez nálady'],
  stres:['pod tlakem','přetížený','vystresovaný','na hraně sil','napnutý','roztěkaný'],
  unava:['vyčerpaný','utahaný','bez energie','na pokraji sil','přetažený'],
  zlost:['naštvaný','rozčilený','vytočený','nasupený','podrážděný'],
  osamelost:['osamělý','opuštěný','sám/sama mezi lidmi','odstrčený'],
  strach:['vyděšený','ustaraný','plný obav','nejistý','úzkostný'],
  vina:['plný výčitek','provinile','že jsi to pokazil'],pochyby:['nejistý sám sebou','plný pochybností','rozpolcený'],nuda:['znuděný','bez inspirace','jako bez vody'],
  radost:['natěšený','šťastný','v báječné náladě','nadšený']};
function feelWord(k){ var a=FEEL[k]; return a?say('feel'+k,a):'v nelehké chvíli'; }
var EMO3=[
  ['krize',/(nechci zit|nechce se mi zit|ublizit si|sebevrazd|zabit se|nemam duvod zit)/],
  ['vina',/(je to moje vina|vycitky|citim se vinn|zklamal jsem|zklamala jsem|zkazil jsem|zkazila jsem|stydim se)/],
  ['pochyby',/(nejsem dost dobr|k nicemu|nic neumim|jsem k nicemu|selhal jsem|selhala jsem|nezvladnu|nezvladam|nevim jestli to zvladnu|pochybuj)/],
  ['stres',/(stres|uzkost|panik|nestiham|mam toho moc|jsem v koncich|deadline|zkousk|nervy|nervozn|pod tlakem|prepracova|nervozita|ztracim nervy|zahlcen)/],
  ['unava',/(jsem unaven|utahan|vycerpan|nevyspal|nemuzu spat|nespim|vyhoreni|uz nemuzu|nemam silu|bez energie|ospal)/],
  ['zlost',/(jsem nastvan|nasran|vztek|zlobim se|stve me|rozcil|naserv|vytoc|hnev|zlost|nesnasim)/],
  ['osamelost',/(jsem sam|jsem sama|osamel|nikoho nemam|nemam s kym|nikdo me|chybi mi lide|nemam kamarad|opusten)/],
  ['strach',/(bojim se|mam strach|desi me|obavam se|mam obavy|trapi me)/],
  ['smutek',/(jsem smutn|je mi smutno|mam smutek|breci|placu|stesk|zklaman|rozchod|rozesli jsme se|zemrel|umrel|pohreb|chybi mi|je mi blbe|je mi spatne|mam spatny den|tezky den|deprim|na dne|je mi zle|nic me nebavi|mam blbou naladu|spatna nalada)/],
  ['nuda',/(nudim se|nuda|nemam co delat|nic me nebavi|jsem znuden)/],
  ['radost',/(mam radost|jsem stastn|povedlo se|vyhrali jsme|uspel jsem|uspela jsem|slavim|jsem nadsen|jsem spokojen|skvely den|konecne|dostal jsem se|dostala jsem se|prosel jsem|prosla jsem)/]
];
function emoKind(f){ for(var i=0;i<EMO3.length;i++) if(EMO3[i][1].test(f)) return EMO3[i][0]; return null; }

/* ── o čem je řeč ── */
var TOP3=[
  ['prace',/(sef|prace|v praci|kolega|vypoved|plat|pohovor|kariera|zakaznik|projekt|sluzba|firma|nadrizen|smena|overtime)/,'práce'],
  ['skola',/(zkousk|skola|ve skole|ucitel|maturit|test|domaci ukol|univerzit|vysoka|semestr|znamk|prednask|studi)/,'škola'],
  ['vztah',/(pritel|pritelkyn|rozchod|manzel|hadk|rande|laska|zamilova|partner|vztah|holka|kluk|byvaly|byvala|zarliv)/,'vztah'],
  ['rodina',/(mama|tata|rodic|sestra|bratr|babicka|dedecek|dite|deti|syn|dcera|prarodic|rodina|doma|otec|matka)/,'rodina'],
  ['kamaradi',/(kamarad|parta|kamos|kolegove|pratele|spoluzak|spolubydl)/,'kamarádi'],
  ['zdravi',/(nemoc|bolest|doktor|nemocnic|zdravi|bolí|boli me|horecka|chripk|zada|hlava|spanek|nespim|vysetreni|operac)/,'zdraví'],
  ['penize',/(penize|dluh|najem|ucty|hypotek|splatk|plat|uspor|drahota|nemam na|exekuc)/,'peníze'],
  ['pocasi',/(pocasi|prsi|deprese z pocasi|tma|sedivo|zima|hnusne)/,'počasí'],
  ['budoucnost',/(budoucnost|nevim co dal|co bude|zivot|smysl|cil|rozhodnout|volba|zmena)/,'budoucnost']
];
function topicTalk(f){ for(var i=0;i<TOP3.length;i++) if(TOP3[i][1].test(f)) return TOP3[i]; return null; }

/* ── VYSLECHNUTÍ: režim, kdy jen poslouchám a ptám se ── */
var L_OPEN={
  default:['Jsem tu a poslouchám. Povídej, nespěchej.','Klidně mi to celé řekni — mám čas a nikam nespěchám.','Pojď, vyklop to. Neřeknu ti, že to přeháníš.','Poslouchám tě. Co se vlastně stalo?'],
  smutek:['To mě mrzí. {Tu} jsem — vyprávěj, jak ti je a co k tomu vedlo.','Zní to těžce. Chceš mi říct, co se stalo? Neposuzuju, jen poslouchám.','Pojď sem, ať to nemáš v sobě samotný. Co tě trápí nejvíc?'],
  stres:['Tak se nejdřív nadechneme. Co z toho tlačí nejvíc?','To zní jako hodně najednou. Pojďme to rozplést: co je ta největší věc?','Jsi pod tlakem — to je znát. Povídej, co všechno se na tebe valí?'],
  unava:['Zníš vyčerpaně. Co tě nejvíc vysává — málo spánku, lidi, nebo toho prostě je moc?','Únava umí být zlá. Chceš si o tom popovídat, nebo spíš poradit, jak si ulevit?'],
  zlost:['Jasně, tohle by vytočilo kdekoho. Vybouchni — co se stalo?','Pusť to ven. Já to snesu. Co tě tak naštvalo?'],
  osamelost:['Tohle je těžký pocit. Jsem rád, že to říkáš nahlas. Chceš mi povědět, jak dlouho už to trvá?','Nejsi na to sám — aspoň tady ne. Co ti nejvíc chybí?'],
  strach:['Strach je nepříjemný společník. Čeho se bojíš nejvíc? Zkusíme to pojmenovat.','Rozumím. Povídej, co se může stát, čeho se obáváš — často to po vyslovení zmenší.'],
  vina:['Výčitky umí tížit. Řekni mi, co se stalo — ať to vidím tvýma očima.','Tohle ti leží na srdci. Co přesně ti vrtá hlavou?'],
  pochyby:['To, co říkáš, je hodně přísné k sobě samému. Pojď to rozebrat — co tě přivedlo k takové myšlence?','Pochyby se ozývají nejhlasitěji, když toho děláme hodně. Co se stalo?'],
  nuda:['Nuda je dobrý začátek něčeho. Co tě naposled opravdu bavilo?'],
  radost:['To zní skvěle! Povídej, co se stalo — ať se radujeme spolu. 🎉']
};
var L_REFLECT=[
  'Zní to, že jsi z toho {feel}.','Dává smysl, že se tak cítíš — {topic} umí zatížit.','Díky, že mi to říkáš. {Reflect}','Slyším tě. Zní to, že jsi {feel}.','To není maličkost. {Reflect}',
  'Chápu. {Reflect}','Hm, to je hodně. {Reflect}','Rozumím, proč tě to trápí. {Reflect}'];
var L_PROBE=[
  'Co to s tebou dělá nejvíc?','A co by ti teď nejvíc pomohlo?','Jak dlouho už to trvá?','Řekl(a) jsi o tom už někomu?','Co bys potřeboval(a), aby to bylo aspoň o kousek lehčí?',
  'Kdy jsi se naposled cítil(a) dobře — a co tehdy bylo jinak?','Co z toho se dá ovlivnit a co ne?','A jaká je ta nejhorší část?','Co si myslíš, že je tady za tím?'];
var L_PERMISSION=['Chceš jen vyslechnout, nebo ti mám zkusit poradit?','Mám přidat nějaký nápad, nebo ti zatím stačí si to vypovídat?','Řekni, jestli chceš radu, nebo jen někoho, kdo naslouchá — obojí je v pořádku.'];
function Reflect(f,k,tp){
  var bits={prace:'Práce bere hodně energie, hlavně když v ní nejsi spokojený.',skola:'Škola a zkoušky umí být opravdu vyčerpávající.',vztah:'Vztahy se nás dotýkají víc než cokoli jiného.',rodina:'S rodinou jsou city vždycky složitější.',kamaradi:'Lidé kolem nás nás umí potěšit i hodně zranit.',zdravi:'Když se člověk necítí fyzicky dobře, všechno ostatní je těžší.',penize:'Finanční starosti nedají spát — to je skutečný tlak.',pocasi:'Šedivo a tma opravdu ovlivňují náladu, není to jen v hlavě.',budoucnost:'Nejistota ohledně budoucnosti je jedna z nejtěžších věcí.'};
  return tp&&bits[tp[0]]?bits[tp[0]]:'Beru to vážně.';
}
function listenStart(k,text){
  CTX.listen={since:Date.now(),turns:0,emotion:k||'default',topic:null,asked:false,last:Date.now()};
  if(k) remember(k);
}
function listenEnd(){ CTX.listen=null; }
function openLine(k){ var pool=L_OPEN[k]||L_OPEN['default']; return say('lo'+k,pool).replace('{Tu}','Jsem tady'); }
function listenReply(text,f){
  var L=CTX.listen; L.turns++; L.last=Date.now();
  var k=emoKind(f)||L.emotion||'default'; if(k==='krize') return null;
  var tp=topicTalk(f); if(tp) L.topic=tp[0];
  if(emoKind(f)&&emoKind(f)!==L.emotion){ L.emotion=emoKind(f); remember(L.emotion); }
  /* konec */
  if(/(diky|dekuju|stacilo|uz je to lepsi|uz mi je lip|uz mi je lepsi|zmen tema|jdeme dal|nechci o tom|uz nechci|konec|pomohlo to|ulevilo se mi|ulevilo)/.test(f)){
    listenEnd(); var good=/(lip|lepsi|pomohlo|ulev)/.test(f);
    return {html:P(good?say('lg',['Tak to jsem rád. Pamatuj: kdykoli se chceš vypovídat, jsem tady.','Super, že se ti ulevilo. Dej na sebe pozor a klidně se ozvi.']):say('lc',['Jasně, nebudu tlačit. Kdyby ses chtěl(a) k tomu vrátit, stačí napsat.','V pohodě. Díky, že jsi mi to svěřil(a). Co teď — dáme něco lehčího?']))+P(say('ls',['Malá věc na závěr: sklenice vody, pár minut čerstvého vzduchu nebo krátká procházka umí překvapivě pomoct. 💧','Na závěr: dnes si dopřej něco malého, co tě potěší — čaj, hudbu, procházku.'])),
      follow:[['☀️ Počasí venku','jaké je počasí'],['😄 Vtip','řekni mi vtip'],['🎧 Hudba na náladu','poraď mi hudbu'],['🚶 Nápad na dnes','co dnes podniknout']]}; }
  /* chce radu */
  if(/(co mam delat|porad mi|jak to resit|jak to zvladnout|co bys delal|co mam s tim|jak se s tim vyrovnat|mas nejaky napad|co s tim)/.test(f)){
    var adv=adviceFor(f+' '+(L.topic||'')+' '+(L.emotion||''),true); L.asked=true; if(adv) return {html:adv.html,follow:adv.follow}; }
  /* jedeme dál */
  var parts=[];
  var feel=feelWord(k==='default'?'smutek':k), tpName=tp?tp[2]:(L.topic?(TOP3.filter(function(x){ return x[0]===L.topic; })[0]||[])[2]:'to');
  var line;
  if(L.turns===1) line=say('lr1',L_REFLECT).replace('{feel}',feel).replace('{topic}',tpName||'to').replace('{Reflect}',Reflect(f,k,tp));
  else line=say('lr2',['Hm… díky, že pokračuješ.','Rozumím.','Aha. A to ti je nepříjemné…','Jo, to dává smysl.','Dobře, slyším tě.','Chápu, jak to myslíš.','To je pochopitelné.']);
  parts.push(P(line));
  if(L.turns>=3&&!L.asked&&L.turns%3===0){ parts.push(P(say('lperm',L_PERMISSION))); L.asked=true; return {html:parts.join(''),follow:[['💡 Poraď mi','poraď mi s tím'],['👂 Jen poslouchej','jen poslouchej, ještě to potřebuju říct']]}; }
  parts.push(P(say('lprobe',L_PROBE).replace('Řekl(a)',Gx('Řekl','Řekla')).replace('potřeboval(a)',Gx('potřeboval','potřebovala')).replace('cítil(a)',Gx('cítil','cítila'))));
  return {html:parts.join('')};
}

/* ── RADY: strukturované, krátké a lidské ── */
var ADV=[
 {k:'spanek',re:/(spat|span\w*|nespim|usnout|usina\w*|insomni\w*|budim se|nemuzu spat)/,t:'😴 Lepší spaní',lead:'Spánek se dá zlepšit hlavně rutinou, ne zázračnými triky.',steps:['Choď spát a vstávej ve stejný čas, i o víkendu (± 1 hodina).','Hodinu před spaním odlož telefon a světlo ztlum — modré světlo ruší melatonin.','Ložnice chladnější (kolem 18 °C), tmavá a bez práce v posteli.','Kofein po 14. hodině vynech, těžkou večeři a alkohol také.','Když neusneš do ~20 minut, vstaň, dělej něco nudného v tlumeném světle a vrať se, až budeš ospalý.'],first:'Dnes večer nastav budík „čas jít spát“ o 30 minut dřív než obvykle.',weather:true},
 {k:'ucit',re:/(ucit|uceni|ucim|zkousk\w*|maturit\w*|naucit|zapamatovat|studi\w*|test\w*|domaci ukol\w*)/,t:'📚 Jak se učit chytře',lead:'Nejlíp fungují krátké, aktivní bloky — ne hodiny čtení.',steps:['Pomodoro: 25 minut učení, 5 minut pauza; po čtyřech kolech delší pauza.','Zkoušej se sám: zavři poznámky a vyprávěj nahlas, co si pamatuješ.','Rozlož učení do několika dnů (opakování po 1, 3 a 7 dnech) — krátké a častější je lepší než jedno nocování.','Začni nejtěžším tématem, když máš nejvíc sil.','Spánek před zkouškou je důležitější než další hodina nad knihou.'],first:'Vyber jedno téma a zkus ho za 5 minut někomu (nebo zdi) vysvětlit bez poznámek.'},
 {k:'motivace',re:/(motivac\w*|prokrastin\w*|odkladam|nechce se mi|lenost\w*|nemuzu se do toho dostat|rozjet|zacit)/,t:'🚀 Jak se rozjet',lead:'Motivace obvykle přichází až po tom, co začneš — ne před tím.',steps:['Zmenši úkol na směšně malý krok (5 minut, jedna věta, jeden e-mail).','Řekni si „jen to začnu“ — pokračovat nemusíš; většinou stejně pokračuješ.','Odstraň rozptýlení: telefon do jiné místnosti, zavřené záložky.','Odměna po splnění (káva, procházka), ne před ním.','Zapiš si tři věci na dnešek, ne dvacet.'],first:'Nastav si časovač na 5 minut a prostě začni.'},
 {k:'stres',re:/(stres\w*|uzkost\w*|panik\w*|nervoz\w*|uklidnit|zklidnit|dychani|klid\b)/,t:'🧘 Jak zklidnit hlavu',lead:'Když je tělo v napětí, pomáhá nejdřív tělo, potom hlava.',steps:['Dýchání 4–6: nádech 4 s nosem, výdech 6 s ústy — 2 minuty. Delší výdech zklidňuje nervy.','5-4-3-2-1: pojmenuj 5 věcí, které vidíš, 4 které slyšíš, 3 které cítíš dotykem, 2 vůně, 1 chuť.','Vypiš si, co tě tíží — na papír. Rozděl na „můžu ovlivnit“ a „nemůžu“.','Krátká procházka venku (i 10 minut) snižuje napětí.','Když úzkost trvá týdny a překáží ti v životě, zkus mluvit s praktickým lékařem nebo psychologem — není to selhání, ale péče o sebe.'],first:'Teď udělej 6 pomalých nádechů a výdechů.',weather:true},
 {k:'vztah',re:/(hadk\w*|hadat|vztah\w*|partner\w*|pritel\w*|komunikac\w*|rozchod\w*|zarliv\w*|nerozumime)/,t:'💬 Jak mluvit, když to drhne',lead:'Většina hádek není o věci, ale o tom, jak se při ní cítíme.',steps:['Mluv o sobě, ne o druhém: „Je mi líto, když…“ místo „Ty vždycky…“.','Nejdřív vyslechni a zopakuj, co jsi slyšel(a) — teprve potom odpovídej.','Nevedete hádku, když jste unavení, hladoví nebo naštvaní — domluvte pauzu a čas návratu.','Jedno téma najednou; nevytahuj minulost.','Zeptej se: „Co teď potřebuješ — poradit, nebo jen vyslechnout?“'],first:'Příště, až to začne vřít, řekni: „Potřebuju 20 minut, pak se k tomu vrátím.“'},
 {k:'prackonf',re:/(sef\w*|kolega\w*|kolegov\w*|nadava\w*|sikan\w*|mobbing\w*|vyhor\w*|nesnasim praci|prace mne nebavi|toxick\w*)/,t:'🛡 Těžká situace v práci',lead:'Tlak v práci je reálný — dá se s ním pracovat po malých krocích.',steps:['Zapisuj si fakta: kdy, co se stalo, kdo byl u toho. Pomůže ti to, ať už se rozhodneš pro rozhovor, nebo pro odchod.','Zkus rozhovor v klidu a bez obviňování: „Když se stane X, cítím Y. Potřeboval(a) bych Z.“','Odděl práci od života: pevný konec pracovní doby, přestávka venku, vypnuté pracovní notifikace večer.','Zjisti, kdo ti může pomoct (HR, kolega, odbory, nadřízený o stupeň výš).','Dlouhé vyčerpání, nespavost nebo úzkost si nech vyšetřit — vyhoření je skutečná diagnóza, ne slabost.'],first:'Dnes si napiš do poznámek tři konkrétní situace, které tě nejvíc tíží.',disc:'Nejsem právník ani terapeut; u šikany nebo porušování práv se obrať na odborníky (inspektorát práce, advokát, psycholog).'},
 {k:'prace',re:/(pohovor|prac[eiaouy]|sef|kariera|vypoved|plat|zadost|zivotopis|\bcv\b)/,t:'💼 Práce a pohovory',lead:'Jasná příprava vezme z pohovoru většinu nervů.',steps:['Zjisti o firmě tři věci (co dělá, komu, čím se liší) a připrav dvě otázky na ně.','Připrav tři příběhy z praxe metodou STAR (situace, úkol, akce, výsledek).','Na „největší slabinu“ řekni skutečnou věc a co s ní děláš.','Plat si dopředu nastav: dolní hranice, cíl, ideál.','Den předem: oblečení, cesta, 15 minut rezerva; po pohovoru děkovný e-mail.'],first:'Vypiš tři své největší úspěchy z poslední práce či školy.'},
 {k:'penize',re:/(penez\w*|penize|uspor\w*|rozpocet\w*|dluh\w*|nejak vyjit|investic\w*|hospodarit|setrit)/,t:'💰 Peníze pod kontrolou',lead:'Základ je vidět, kam peníze jdou. Sofistikované věci až potom.',steps:['Dva měsíce zapisuj výdaje (stačí poznámky v telefonu) — kolik ti vlastně mizí.','Pravidlo 50/30/20: 50 % nutné, 30 % přání, 20 % spoření/dluhy.','Nejdřív si vytvoř rezervu na 3 měsíce nutných výdajů.','Dluhy řaď podle úroku — nejdražší splácej první.','Před velkým nákupem 48 hodin počkej.'],first:'Dnes si projdi výpis z účtu a vyznač 3 výdaje, bez kterých by ses obešel(a).',disc:'Nejsem finanční poradce; u velkých rozhodnutí (hypotéka, investice) se poraď s odborníkem.'},
 {k:'cviceni',re:/(behat|bezet|behani|cvicit|cviceni|fitko|zhubnout|kondic\w*|zacit sportovat|hubnuti|posilovat|sport\w*)/,t:'🏃 Pohyb a kondice',lead:'Nejlepší cvičení je to, které opravdu budeš dělat.',steps:['Začátečník: střídej chůzi a klus (1 min klus / 2 min chůze × 8), 3× týdně.','Přidávej max. 10 % za týden — kolena a šlachy potřebují čas.','Vyber si čas a pevné místo v kalendáři; ráno bývá nejspolehlivější.','Spaní, bílkoviny a pití vody jsou stejně důležité jako samotný trénink.','Při hubnutí reálně 0,3–0,5 kg týdně; kalorický deficit + pohyb + spánek.'],first:'Dnes jen 15 minut svižné chůze venku.',weather:true,disc:'Při zdravotních potížích nebo dlouhé pauze se nejdřív poraď s lékařem.'},
 {k:'zdravi',re:/(boli me|bolest\w*|nachlad\w*|chripk\w*|zdravi|alergi\w*|migren\w*|hlava boli)/,t:'🩺 Zdraví — co můžu a nemůžu',lead:'Nejsem lékař, ale základní věci ti říct umím.',steps:['Při nachlazení: klid, tekutiny, spánek; teplotu nad 38,5 °C déle než 3 dny nebo dušnost řeš s lékařem.','Bolest hlavy: voda, odpočinek v tichu, čerstvý vzduch; časté migrény si nech vyšetřit.','Alergie na pyl: po příchodu domů se osprchuj, větrej večer, sleduj pylovou zprávu v appce.','Varovné příznaky (bolest na hrudi, dušnost, mdloby, náhlá slabost) = volej 155 / 112.','Dlouhodobé potíže patří lékaři, ne internetu.'],first:'Zkus dnes vypít dvě sklenice vody navíc a jít dřív spát.',weather:true},
 {k:'cas',re:/(\bcas\w*|nestiham|organizac\w*|planovani|produktiv\w*|priorit\w*|zvladnout vic)/,t:'⏱ Čas a priority',lead:'Není to o tom stihnout víc — ale o tom dělat to správné.',steps:['Eisenhowerova matice: urgentní × důležité — nejdřív důležité (i když neurgentní).','Ráno si vyber maximálně 3 věci, které „musí“ být hotové.','Blok „hluboké práce“ 60–90 min bez notifikací.','Seskup drobnosti (e-maily, telefonáty) do jednoho času.','Večer 5 minut: co se povedlo, co zítra jako první.'],first:'Teď si napiš 3 věci, které dnes opravdu stojí za to.'},
 {k:'sebevedomi',re:/(sebevedomi|nejist\w*|stesni|nesmel\w*|vystupovani|prezentac\w*|verejne)/,t:'🌱 Sebevědomí a vystupování',lead:'Sebevědomí je dovednost, ne vlastnost — cvičí se.',steps:['Dělej malé kroky mimo pohodlí: pozdrav souseda, zeptej se na cestu, přihlas se s dotazem.','Před vystoupením: 3 hluboké nádechy, pomalé tempo a pauzy; nejdřív cizím lidem, pak známým.','Zapisuj si denně 3 věci, které se ti povedly (i drobné).','Mluv k sobě tak, jak bys mluvil(a) ke kamarádovi.','Přestaň se porovnávat s cizími „nejlepšími momenty“ na sítích.'],first:'Dnes vykonej jednu malou věc, které ses vyhýbal(a).'},
 {k:'nuda',re:/(co delat|nuda|nudim|nemam co|inspirace|napad na|podniknout|vylet|kam jit)/,t:'💡 Nápady, co podniknout',lead:'Podle počasí a nálady tady máš pár možností.',steps:[],first:'',dynamic:true}
];
function adviceFor(f,fromListen){
  var a=null; for(var i=0;i<ADV.length;i++) if(ADV[i].re.test(f)){ a=ADV[i]; break; }
  if(!a&&fromListen){ var want=/unava|spanek|nespim/.test(f)?'spanek':(/nuda|osamel/.test(f)?'nuda':'stres'); a=ADV.filter(function(x){ return x.k===want; })[0]; }
  if(!a) return null;
  var h='<h4>'+a.t+'</h4>'+P(esc(a.lead));
  if(a.dynamic){ var ideas=activityIdeas(); h+='<ul class="a3-ins">'+ideas.map(function(x){ return '<li><span>'+x[0]+'</span><div>'+esc(x[1])+'</div></li>'; }).join('')+'</ul>'; }
  else {
    h+='<ol class="a3-steps">'+a.steps.map(function(s){ return '<li>'+esc(s)+'</li>'; }).join('')+'</ol>';
    if(a.first) h+='<div class="a3-first">▶ <b>První malý krok:</b> '+esc(a.first)+'</div>';
  }
  if(a.weather){ var w=weatherLine(); if(w) h+='<p class="a3-wxline">☁ '+esc(w)+' '+esc(weatherAdviceFor(a.k))+'</p>'; }
  if(a.disc) h+='<div class="ai2-note">'+esc(a.disc)+'</div>';
  var nm=addr(); h+=P(esc(say('advend',[(nm?nm+', sedí':'Sedí')+' ti to, nebo mám zkusit jinou cestu?','Chceš to rozebrat víc, nebo to přizpůsobit tvé situaci?','Řekni, co z toho ti zní nejpoužitelněji — a rozepíšeme to na konkrétní plán.'])));
  return {html:h,follow:[['🧩 Rozepiš plán','rozepiš mi to do plánu na týden'],['💬 Jen si povídat','jen si chci povídat'],['⚖️ Pomoz se rozhodnout','pomoz mi se rozhodnout']],t:a.t};
}
function weatherAdviceFor(k){
  var m=homeModel(); if(!m) return ''; var S=dayStats(m,m.todayIso); if(!S) return '';
  var wet=S.spans.length&&S.rain>1, bw=bestWindow(m,m.todayIso);
  if(k==='spanek') return S.tmin>=17?'V noci bude teplo ('+r0(S.tmin)+' °C) — větrej večer a ložnici zastiň přes den.':'V noci kolem '+r0(S.tmin)+' °C — ložnice se dobře vychladí větráním před spaním.';
  if(k==='cviceni') return bw?'Nejlepší okno ven je dnes '+bw.a+'–'+bw.b+' h.':(wet?'Dnes prší, zvaž cvičení doma nebo zítřek.':'Dnes jde cvičit venku bez větších problémů.');
  if(k==='stres') return bw?'Krátká procházka ven by šla nejlíp '+bw.a+'–'+bw.b+' h.':'Venku to dnes moc nelákí, ale i 5 minut u otevřeného okna pomůže.';
  if(k==='zdravi') return S.pressDelta!=null&&S.pressDelta<=-5?'Pozor, tlak dnes klesá o '+f1(-S.pressDelta)+' hPa — citlivější lidé mohou cítit bolest hlavy nebo únavu.':'';
  return '';
}
function activityIdeas(){
  var m=homeModel(), out=[], S=m&&dayStats(m,m.todayIso), bw=m&&bestWindow(m,m.todayIso), wet=S&&S.rain>1, cold=S&&S.tmax<8, hot=S&&S.tmax>=27, c=m&&m.cur;
  var hob=PROF.hobbies[0], pet=PROF.pets[0];
  if(bw&&!wet) out.push(['🚶','Vyraz na procházku nebo kolo '+bw.a+'–'+bw.b+' h — počasí vydrží, je sucho a příjemně.']);
  if(pet&&bw) out.push(['🐾','Vezmi '+pet+' ven '+bw.a+'–'+bw.b+' h, ať si užije výběh.']);
  if(hob) out.push(['⭐','Dnes by se hodilo něco kolem „'+hob+'“ — '+(wet?'ať je to uvnitř, venku prší.':'venku to jde.')]);
  if(wet) out.push(['☕','Prší — ideální čas na film, knihu, vaření nebo deskovky s kamarády.']);
  if(cold) out.push(['🍲','Je chladno — uvař něco teplého, třeba polévku, a zkus nový recept.']);
  if(hot) out.push(['💦','Je horko — koupaliště, stín u vody, nebo zmrzlina po západu slunce.']);
  out.push(['🎧','Poslechni nový album nebo podcast, který jsi odkládal(a).']);
  out.push(['📞','Zavolej člověku, se kterým ses dlouho neslyšel(a) — většinou to potěší oba.']);
  out.push(['🧹','10 minut úklidu jedné police — překvapivě zlepší náladu.']);
  return out.slice(0,6);
}

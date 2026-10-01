/* ══════════════════════ 11) OBRÁZKY: bohatší zadání pro generátor ══════════════════════
   Zasadí se do AI 2.0 přes AIW_AI2.hooks.image — rozpozná styl, formát, světlo, roční dobu,
   náladu i „nakresli dnešní počasí“ a doplní slovník česko → angličtina. */
(function extendCZEN(){
  var add={
   'lipa':'linden tree','briza':'birch','dub':'oak','smrk':'spruce','borovice':'pine','palma':'palm tree','kaktus':'cactus','ruze':'rose','slunecnice':'sunflower','mak':'poppy','tulipan':'tulip','levandule':'lavender','houby':'mushrooms','houba':'mushroom','list':'leaf','listi':'leaves','trava':'grass',
   'potok':'stream','vodopad':'waterfall','plaz':'beach','pobrezi':'coastline','utes':'cliff','udoli':'valley','kopec':'hill','sopka':'volcano','jeskyne':'cave','poust':'desert','dzungle':'jungle','ostrov':'island','ledovec':'glacier','kamenna':'stone','skala':'rock','pisek':'sand',
   'vlna':'wave','vlny':'waves','kapky':'raindrops','kapka':'raindrop','rosa':'dew','jinovatka':'hoarfrost','krupobiti':'hail','vichrice':'storm wind','tornado':'tornado','polarni zare':'northern lights','mlecna draha':'milky way','souhvezdi':'constellation','kometa':'comet','zatmeni':'eclipse','upliek':'full moon','uplnek':'full moon','pulmesic':'half moon',
   'lev':'lion','tygr':'tiger','slon':'elephant','zirafa':'giraffe','zebra':'zebra','opice':'monkey','panda':'panda','kralik':'rabbit','vevericka':'squirrel','jez':'hedgehog','sova':'owl','orel':'eagle','holub':'pigeon','labut':'swan','kachna':'duck','motyl':'butterfly','vcela':'bee','delfin':'dolphin','velryba':'whale','zralok':'shark','ryba':'fish','zaba':'frog','had':'snake','drak':'dragon','jednorozec':'unicorn',
   'kocour':'tomcat','stene':'puppy','kotatko':'kitten','kun':'horse','kráva':'cow','ovce':'sheep','prase':'pig','kure':'chicken',
   'babicka':'grandmother','dedecek':'grandfather','rodina':'family','pratele':'friends','par':'couple','tanecnik':'dancer','hudebnik':'musician','vedec':'scientist','astronaut':'astronaut','rytir':'knight','princezna':'princess','carodej':'wizard','pirat':'pirate','kuchar':'chef','hasic':'firefighter',
   'telefon':'smartphone','pocitac':'computer','notebook':'laptop','kamera':'camera','kniha':'book','hodiny':'clock','lampa':'lamp','svicka':'candle','kridla':'wings','koruna':'crown','mec':'sword','klic':'key','dopis':'letter','balon':'hot air balloon','lod':'ship','plachetnice':'sailboat','ponorka':'submarine','motorka':'motorcycle','traktor':'tractor','tramvaj':'tram','autobus':'bus','kolobezka':'scooter',
   'namesti':'town square','radnice':'town hall','katedrala':'cathedral','zricenina':'ruins','vez':'tower','pevnost':'fortress','chalupa':'cottage','chata':'cabin','mlyn':'mill','stodola':'barn','farma':'farm','hriste':'playground','trh':'market','kavarna':'cafe','hospoda':'pub','nadrazi':'train station','letiste':'airport','pristav':'harbor','maják':'lighthouse','majak':'lighthouse','tunel':'tunnel','schody':'stairs','brana':'gate','fontana':'fountain','socha':'statue',
   'vanoce':'christmas','velikonoce':'easter','narozeniny':'birthday party','svatba':'wedding','karneval':'carnival','ohnostroj':'fireworks','festival':'music festival','piknik':'picnic','kempovani':'camping','tabor':'campfire','ohen':'fire','dym':'smoke','jiskry':'sparks','zrcadleni':'reflection','stin':'shadow','silueta':'silhouette',
   'napjaty':'tense','romanticky':'romantic','strasidelny':'spooky','veseli':'cheerful','epicky':'epic','tajemny':'mysterious','snovy':'dreamy','nostalgicky':'nostalgic','pohadkovy':'fairytale','futuristicky':'futuristic','historicky':'historical','minimalisticky':'minimalist','luxusni':'luxurious','rustikalni':'rustic','industrialni':'industrial',
   'pastelovy':'pastel colors','sytý':'vivid saturated colors','sytý':'vivid saturated colors','cernobily':'black and white','sepie':'sepia','neonovy':'neon','zlata':'golden','medena':'copper','tyrkysovy':'turquoise','bordo':'burgundy','smaragdovy':'emerald',
   'zblizka':'close-up','shora':'top-down view','zdola':'low angle','dalka':'distance','pozadi':'background','popredi':'foreground','symetricky':'symmetrical','makro':'macro photography','dron':'aerial drone shot','letecky':'aerial view',
   'pocasi':'weather','predpoved':'forecast','teplomer':'thermometer','destnik':'umbrella','plastenka':'raincoat','bunda':'jacket','cepice':'beanie','satek':'scarf','rukavice':'gloves','snehulak':'snowman','snehova koule':'snowball','lyzar':'skier','snowboard':'snowboard','brusle':'ice skates','sanky':'sled','vira':'kite','lehatko':'sun lounger'
  };
  try{ var C=X.CZEN; Object.keys(add).forEach(function(k){ if(!C[k]) C[k]=add[k]; }); }catch(e){}
})();

var IMG_STYLES=[
 [/(akvarel|vodovk)/,'watercolor painting, soft washes, visible paper texture, delicate brush strokes'],
 [/(olejomalb|olej na platne|impasto)/,'oil painting, rich impasto brushwork, classical gallery composition'],
 [/(anime|manga)/,'anime illustration, cel shading, expressive, detailed background, studio quality'],
 [/(komiks|comics|pop art)/,'comic book illustration, bold ink outlines, halftone shading, vivid colors'],
 [/(pixel ?art|pixelov|8 ?bit)/,'pixel art, crisp pixels, limited palette, retro video game style'],
 [/(low ?poly|lowpoly)/,'low poly 3d illustration, flat faceted shading, clean geometry'],
 [/(vektor|ikona|ikonka|flat design|plochy)/,'flat vector illustration, clean shapes, simple gradients, balanced layout'],
 [/(cyberpunk)/,'cyberpunk, neon lights, rain-slick streets, futuristic city, cinematic'],
 [/(steampunk)/,'steampunk, brass gears, victorian machinery, warm sepia glow'],
 [/(fantasy|fantasticky|pohadk)/,'high fantasy illustration, magical atmosphere, intricate detail, epic scale'],
 [/(surreal)/,'surrealist artwork, dreamlike, impossible geometry, striking symbolism'],
 [/(cernobil|noir)/,'black and white photography, deep contrast, dramatic shadows, fine grain'],
 [/(kresba|skica|tuz|perokresb|nacrt)/,'detailed pencil and ink drawing, clean linework, cross-hatching'],
 [/(3d|render|blender)/,'3d render, octane, soft studio lighting, clean materials, subsurface scattering'],
 [/(plakat|poster)/,'poster design, bold composition, strong hierarchy, generous negative space'],
 [/(retro|synthwave|80\. let|osmdesat)/,'retro 1980s aesthetic, neon gradients, chrome, synthwave sunset'],
 [/(minimalist|minimal)/,'minimalist composition, large negative space, restrained palette, clean forms'],
 [/(film|filmov|kino)/,'cinematic film still, anamorphic lens, color graded, 35mm grain, dramatic lighting'],
 [/(makro)/,'macro photography, extreme close-up, shallow depth of field, crisp detail'],
 [/(dron|letecky|z ptaci perspektivy)/,'aerial drone photograph, wide perspective, crisp detail'],
 [/(portret)/,'professional portrait photography, soft key light, shallow depth of field, 85mm lens'],
 [/(architektur|interier)/,'architectural photography, straight verticals, balanced exposure, wide angle'],
 [/(produktov)/,'product photography, studio softbox lighting, clean seamless backdrop, crisp reflections'],
 [/(foto|fotograf|realistick)/,'photorealistic, shot on 50mm lens, natural depth of field, true colors']
];
var IMG_LIGHT=[
 [/(svitani|vychod slunce|ranni mlha|rano)/,'soft sunrise light, long gentle shadows, pastel sky'],
 [/(zlata hodink|zapad slunce|podvecer)/,'golden hour light, warm rim light, long shadows'],
 [/(soumrak|modra hodink)/,'blue hour, deep blue sky, first city lights'],
 [/(poledn|tvrde slunce)/,'bright midday sun, crisp shadows, saturated colors'],
 [/(noc|nocni|pod hvezdami)/,'night scene, ambient moonlight, glowing windows, long exposure feel'],
 [/(mlecna draha|hvezdna obloha|hvezdy)/,'milky way across a clear night sky, thousands of stars, astrophotography'],
 [/(mlh|mlz)/,'layered fog, atmospheric depth, diffused light'],
 [/(bourk|blesk)/,'dramatic storm sky, lightning bolt, dark towering clouds'],
 [/(dest|prsi|destiv|slejvak)/,'rain, wet reflective surfaces, moody overcast light'],
 [/(snih|snezi|snehov|zasnez)/,'snow covered, cold blue tones, crisp winter air, soft falling snowflakes'],
 [/(duha)/,'vivid rainbow after rain, clearing storm clouds, glowing light'],
 [/(polarni zare)/,'aurora borealis, green and violet ribbons of light over snowy landscape']
];
var IMG_SEASON=[
 [/(jaro|jarni|rozkvet|kvetouc)/,'spring, fresh green foliage, blossoms, soft light'],
 [/(leto|letni|plaz)/,'summer, warm sunlight, lush colors, clear sky'],
 [/(podzim|podzimni|barevne listi|babi leto)/,'autumn, golden and red foliage, warm low sun, fallen leaves'],
 [/(zima|zimni|vanocn)/,'winter, frost, cold clear air, soft muted palette']
];
var IMG_MOOD=[
 [/(klidn|poklidn|relax)/,'serene, peaceful mood'],[/(dramatick|epick)/,'dramatic, epic scale, intense contrast'],[/(romantick)/,'romantic, warm intimate mood'],
 [/(strasidel|hororov|temn)/,'eerie, ominous atmosphere'],[/(vesel|radostn|barevn)/,'cheerful, joyful, vibrant colors'],[/(tajemn|zahadn)/,'mysterious, enigmatic atmosphere'],[/(snov|sen)/,'dreamy, ethereal glow'],[/(nostalgick)/,'nostalgic, faded warm tones']
];
var IMG_COMP=[
 [/(zblizka|detail|makro)/,'close-up framing'],[/(sirokouhl|panoram)/,'wide-angle panoramic framing'],[/(shora|pohled shora)/,'top-down view'],[/(zdola)/,'low angle, towering perspective'],[/(symetri)/,'perfect symmetry'],[/(tretin)/,'rule-of-thirds composition']
];
function imgFirst(list,f){ for(var i=0;i<list.length;i++) if(list[i][0].test(f)) return list[i][1]; return null; }
function imgAll(list,f){ var o=[]; list.forEach(function(p){ if(p[0].test(f)) o.push(p[1]); }); return o; }
function imgSize(f){
  if(/(na vysku|story|tapeta (do )?(mobil|telefon)|mobiln[ií] tapeta|portrait|plakat)/.test(f)) return [896,1216];
  if(/(na sirku|panoram|sirokouhl|tapeta (na )?(pocitac|monitor|plochu)|krajina)/.test(f)) return [1216,768];
  if(/(ctverec|ctverc|ikon|logo|avatar|profilov)/.test(f)) return [1024,1024];
  if(/(ultra ?sirok|kinematograf)/.test(f)) return [1344,576];
  return null;
}
/* „nakresli dnešní počasí“ — popis z živých dat appky */
function weatherScene(f){
  if(!/(dnesni pocasi|pocasi (dnes|ted|venku)|obloha (dnes|ted|nad)|jak to vypada venku|aktualni pocasi|co je venku|nad mym mestem|pocasi nad)/.test(f)) return null;
  var m=homeModel(); if(!m) return null; var c=m.cur, sk=skyOf(c.code), h=m.hrs[m.iNow]?m.hrs[m.iNow].h:12, S=dayStats(m,m.todayIso);
  var sr=S&&S.sunrise?+S.sunrise.slice(11,13):7, ss=S&&S.sunset?+S.sunset.slice(11,13):19;
  var tod=h<sr?'noc před úsvitem':(h<sr+2?'ráno':(h<12?'dopoledne':(h<ss-2?'odpoledne':(h<ss+1?'západ slunce':'noc'))));
  var mo=+m.todayIso.slice(5,7), season=mo>=3&&mo<=5?'jaro':(mo>=6&&mo<=8?'léto':(mo>=9&&mo<=11?'podzim':'zima'));
  var place='české město';
  var extra=[]; if(c.rain>0||codeKind(c.code)==='déšť'||codeKind(c.code)==='přeháňky') extra.push('déšť'); if(codeKind(c.code)==='sníh') extra.push('sněžení'); if(codeKind(c.code)==='mlha') extra.push('mlha'); if(codeKind(c.code)==='bouře') extra.push('bouřka a blesky'); if(c.wind>=30) extra.push('silný vítr');
  return 'krajina a '+place+' — '+sk[1]+', '+tod+', '+season+', '+r0(c.temp)+' stupňů'+(extra.length?', '+extra.join(', '):'');
}
/* „nakresli kocoura“ bez slova obrázek AI 2.0 nepoznalo — tady se to převede na zadání obrázku */
function imageBridge(text,f){
  var s=' '+f+' '; if(CHART_RE.test(s)||/ (graf|tabulk|diagram|mapu|schema|tabulku) /.test(s)) return null;
  if(/ obrazek | obrazky | obrazku /.test(s)) return null;   /* to už rozumí původní modul */
  var m=f.match(/^(prosim )?(nakresli|namaluj|vykresli|vygeneruj|zkresli|nageneruj|vyfot|vyfotografuj)\s+(mi\s+|nam\s+)?(.{3,})$/);
  if(!m) m=f.match(/^(prosim )?(vytvor|udelej|vyrob|chci|dej mi|navrhni)\s+(mi\s+)?((ilustraci|kresbu|malbu|tapetu|plakat|logo|ikonu|avatar|fotku|fotografii|obraz|pozadi)\b.*)$/);
  if(!m) return null;
  var rest=String(text).replace(/^\s*(prosím\s+)?\S+\s+(mi\s+|nám\s+)?/i,'').trim(); if(rest.length<3) return null;
  return 'Vytvoř obrázek '+rest;
}
AI2.hooks.image=function(text,desc0,rp,M,st){
  var f=fold(text), desc=desc0, add=[];
  var ws=weatherScene(f); if(ws){ desc=ws; f=f+' '+fold(ws); if(st) st.log('☁️ Kreslím podle živého počasí v appce: '+ws); }
  var style=imgFirst(IMG_STYLES,f)||'photorealistic, natural colors, 50mm lens, natural depth of field';
  add.push(style);
  imgAll(IMG_LIGHT,f).slice(0,2).forEach(function(x){ add.push(x); });
  var se=imgFirst(IMG_SEASON,f); if(se) add.push(se);
  imgAll(IMG_MOOD,f).slice(0,2).forEach(function(x){ add.push(x); });
  imgAll(IMG_COMP,f).slice(0,1).forEach(function(x){ add.push(x); });
  if(/(detailn|dokonal|nejlepsi kvalit|hyperrealist)/.test(f)) add.push('extremely detailed, award-winning quality');
  var sz=imgSize(f)||[rp.w,rp.h];
  var r={p:rp.p,w:sz[0],h:sz[1],add:add.join(', ')};
  if(st) st.log('🎨 Styl: '+style.split(',')[0]+(add.length>1?' · +'+(add.length-1)+' doplňků (světlo, nálada, kompozice)':'')+' · '+sz[0]+'×'+sz[1]);
  return {desc:desc,rp:r};
};
/* po vytvoření obrázku nabídnu rychlé změny stylu */
function decorateImageMsg(el){
  try{
    var acts=el.querySelector('.ai2-acts'); if(!acts||acts.getAttribute('data-a3')) return; acts.setAttribute('data-a3','1');
    var prev=el.getAttribute('data-a3q'); var last=null; var msgs=document.querySelectorAll('#aiaBody .aia-msg.user'); if(msgs.length) last=msgs[msgs.length-1].textContent;
    if(!last) return; var base=last.replace(/\s*(,\s*)?(v|ve) (stylu )?(akvarel|olejomalb|anime|komiks|3d|noir|retro|minimal)\w*/i,'');
    [['🎨 Akvarel',' ve stylu akvarel'],['🌸 Anime',' ve stylu anime'],['🌙 V noci',', v noci pod hvězdami'],['📱 Na výšku',', na výšku']].forEach(function(v){
      var b=document.createElement('button'); b.type='button'; b.className='ai2-act'; b.textContent=v[0]; b.setAttribute('data-a3ask',base.replace(/[.!?]+$/,'')+v[1]); acts.appendChild(b); });
  }catch(e){}
}
try{ new MutationObserver(function(ml){ ml.forEach(function(mu){ [].forEach.call(mu.addedNodes,function(n){ if(n.nodeType===1&&n.classList&&n.classList.contains('ai2-msg')) setTimeout(function(){ decorateImageMsg(n); },60); }); }); }).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}

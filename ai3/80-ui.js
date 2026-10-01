/* ══════════════════════ 12) PANEL: pozdrav při otevření, drobnosti ══════════════════════ */
var _greeted=false;
function openGreeting(){
  if(_greeted) return; var ov=$('aiaOverlay'); if(!ov||!ov.classList.contains('open')) return;
  var body=$('aiaBody'); if(!body) return;
  /* jen když je chat prázdný (jen úvodní pozdrav) a o tobě už něco vím */
  var users=body.querySelectorAll('.aia-msg.user').length; if(users) { _greeted=true; return; }
  _greeted=true;
  if(!(PROF.name||PROF.nick||PROF.lastMood||PROF.seen>0)) return;
  var parts=[]; var fu=moodFollowUp();
  parts.push('<div class="ai3-fr">'+P(esc(hello()+' Rád tě zase vidím.'))+(homeModel()?P(esc(weatherLine())):'')+(fu?P(esc(fu)):'')+'</div>');
  setTimeout(function(){ X.addHTML(parts.join(''),true); },500);
}
try{ new MutationObserver(function(){ openGreeting(); }).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['class']}); }catch(e){}
document.addEventListener('input',function(e){ var t=e.target; if(t&&t.classList&&t.classList.contains('a3-in')){ var v=+t.value; if(v>5) t.value=5; if(v<1&&t.value!=='') t.value=1; } },false);

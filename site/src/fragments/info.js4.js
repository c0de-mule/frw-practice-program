/* Arriving from a link such as /infopage/#try: the browser jumps to the
   section before the web fonts and images finish loading, and as they load the
   page above grows, so the reader ends up somewhere else (Safari does not
   correct for this). Re-aim at the section once everything has loaded. */
(function(){
  if(!location.hash || location.hash.length < 2) return;
  var target;
  try { target = document.querySelector(location.hash); } catch(e) { return; }
  if(!target) return;
  function go(){ target.scrollIntoView({behavior:'instant', block:'start'}); }
  window.addEventListener('load', function(){
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(function(){ go(); setTimeout(go, 350); setTimeout(go, 1200); });
  });
})();

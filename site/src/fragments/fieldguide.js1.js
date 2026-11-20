(function(){
  var motionOK = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reveal on scroll
  if('IntersectionObserver' in window && motionOK){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.06});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }
})();

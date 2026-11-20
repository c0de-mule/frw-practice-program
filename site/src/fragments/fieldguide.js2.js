/* Take It Further - reveal the reasoning for all four options in place.
   Clicking any option, or the "see which one fits" link, opens all four so the
   near-misses teach alongside the right answer. With JS off, the link still
   navigates to the sample on the Info Page, exactly as before. */
(function(){
  var ul = document.getElementById('fg-choices');
  if(!ul) return;
  var link = document.querySelector('.cta .fit-link');
  function reveal(picked){
    if(ul.classList.contains('revealed')) return;
    ul.classList.add('revealed');
    if(picked) picked.classList.add('picked');
    ul.querySelectorAll('li').forEach(function(li){
      li.removeAttribute('tabindex'); li.removeAttribute('role');
    });
    if(link) link.style.display='none';
  }
  ul.querySelectorAll('li').forEach(function(li){
    li.addEventListener('click', function(){ reveal(li); });
    li.addEventListener('keydown', function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); reveal(li); }
    });
  });
  if(link) link.addEventListener('click', function(e){ e.preventDefault(); reveal(null); });
})();

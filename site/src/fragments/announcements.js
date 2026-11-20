(function(){
  "use strict";
  // Plain text for pasting anywhere: one paragraph per block, quotes with
  // their attribution on the next line, the Field Guide address left visible.
  function blockText(el){
    if (el.tagName === "UL"){
      return Array.prototype.map.call(el.querySelectorAll("li"), function(li){
        return "• " + li.textContent.replace(/\s+/g," ").trim();
      }).join("\n");
    }
    if (el.classList.contains("q")){
      var q = el.querySelector("i").textContent.trim();
      var who = el.querySelector(".who").textContent.replace(/\s+/g," ").trim();
      return q + "\n" + who;
    }
    return el.textContent.replace(/\s+/g," ").trim();
  }
  function textFor(scope, target){
    var parts = scope === "core" ? ["core"] : ["core","program"];
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll("#" + (target || "ann") + " [data-part]"), function(el){
      if (parts.indexOf(el.getAttribute("data-part")) > -1) out.push(blockText(el));
    });
    return out.join("\n\n");
  }
  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.top="-1000px";
    document.body.appendChild(ta); ta.select();
    var ok=false; try{ ok=document.execCommand("copy"); }catch(e){ ok=false; }
    document.body.removeChild(ta); return ok;
  }
  function flash(btn, msg, good){
    var original = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", original);
    btn.textContent = msg;
    if (good) btn.classList.add("done");
    document.getElementById("live").textContent = good ? "Announcement copied to clipboard." : msg;
    window.setTimeout(function(){ btn.textContent = btn.getAttribute("data-label"); btn.classList.remove("done"); }, 1900);
  }
  Array.prototype.forEach.call(document.querySelectorAll(".copy"), function(btn){
    btn.addEventListener("click", function(){
      var text = textFor(btn.getAttribute("data-scope"), btn.getAttribute("data-target"));
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){ flash(btn,"Copied ✓",true); },
          function(){ var ok=fallbackCopy(text); flash(btn, ok ? "Copied ✓" : "Press Ctrl+C", ok); });
      } else { var ok=fallbackCopy(text); flash(btn, ok ? "Copied ✓" : "Press Ctrl+C", ok); }
    });
  });
  var more = document.getElementById("more-btn"), fuller = document.getElementById("fuller");
  if (more && fuller) more.addEventListener("click", function(){
    var open = fuller.hasAttribute("hidden");
    if (open) fuller.removeAttribute("hidden"); else fuller.setAttribute("hidden","");
    more.setAttribute("aria-expanded", open ? "true" : "false");
    more.querySelector(".more-act").textContent = open ? "Hide the fuller version" : "Show the fuller version";
    if (open) fuller.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"});
  });
  window.__annText = textFor;
})();

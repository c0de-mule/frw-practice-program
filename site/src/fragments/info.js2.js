(function(){
  const card = document.getElementById('try-card');
  const opts = document.querySelectorAll('#try-opts .try-opt');
  const cta = document.getElementById('try-cta');
  opts.forEach(btn => {
    btn.addEventListener('click', function(){
      if (card.classList.contains('answered')) return;
      card.classList.add('answered');
      const correctBtn = document.querySelector('#try-opts .try-opt[data-correct="true"]');
      opts.forEach(b => { b.classList.add('locked'); });
      correctBtn.classList.add('correct');
      if (btn !== correctBtn) btn.classList.add('wrongpick');
      opts.forEach(b => {
        if (b !== correctBtn && b !== btn) b.classList.add('dim');
      });
      lpVerdict(document.getElementById('try-opts'), btn, correctBtn);
      setTimeout(() => cta.classList.add('show'), 250);
    });
  });
})();

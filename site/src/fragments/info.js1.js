// Say in words what the colors show, for the sample scenario and the nine free ones.
function lpVerdict(optsEl, picked, correctBtn){
  if(!optsEl || !correctBtn) return;
  const isC = (picked === correctBtn);
  optsEl.querySelectorAll('.try-opt').forEach(b => {
    const body = b.querySelector('.try-body'); if(!body || body.querySelector('.vtag')) return;
    let t = null;
    if(b === correctBtn) t = '<span class="vtag good">' + (isC ? '\u2713 Correct' : '\u2713 Best answer') + '</span>';
    else if(b === picked) t = '<span class="vtag mine">Your choice</span>';
    if(t) body.insertAdjacentHTML('afterbegin', t);
  });
  if(optsEl.previousElementSibling && optsEl.previousElementSibling.classList.contains('try-verdict')) return;
  const v = document.createElement('p'); v.setAttribute('role','status');
  v.className = 'try-verdict ' + (isC ? 'good' : 'miss');
  const key = (correctBtn.querySelector('.try-key')||{}).textContent || '';
  v.textContent = isC ? '\u2713 Correct.' : 'Not this time. The best answer is ' + key.trim() + '.';
  optsEl.parentNode.insertBefore(v, optsEl);
}

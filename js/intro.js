/* =========================================================
   입장 모션
   1) 상자가 통통 튀며 등장  2) 뚜껑이 열리고 종이 조각이 터짐
   3) 로고 글자가 하나씩 튀어나옴  4) 동그랗게 열리며 페이지 공개
   <head>의 인라인 스크립트가 html에 .intro-pending 을 붙여 첫 화면부터 덮어 둬요.
   ========================================================= */
(() => {
  'use strict';
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('intro-pending')) { if (intro) intro.remove(); return; }

  // 로고 글자를 하나씩 쪼개서 순서대로 튀어오르게
  const logo = document.getElementById('introLogo');
  logo.innerHTML = [...logo.textContent].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('');

  // 상자에서 터져 나오는 종이 조각 · 별 · 하트
  const colors = ['#F5D66C', '#D9C5EE', '#B9DDC7', '#F6D5C5', '#F5D66C', '#403B38'];
  const shapes = ['sq', 'ci', 'tri', 'star', 'heart', 'strip'];
  const burst = document.getElementById('introConfetti');
  const pieces = [];
  for (let i = 0; i < 44; i++) {
    const a = (-90 + (Math.random() * 150 - 75)) * Math.PI / 180;   // 대부분 위쪽으로
    const dist = 140 + Math.random() * 220;
    const p = document.createElement('i');
    p.className = 'ic ic-' + shapes[i % shapes.length];
    p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
    p.style.setProperty('--tx', Math.cos(a) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(a) * dist + 'px');
    p.style.setProperty('--fall', 120 + Math.random() * 160 + 'px');
    p.style.setProperty('--rot', Math.random() * 720 - 360 + 'deg');
    p.style.setProperty('--s', 0.6 + Math.random() * 0.9);
    p.style.setProperty('--delay', 0.85 + Math.random() * 0.25 + 's');
    pieces.push(p);
  }
  burst.append(...pieces);

  intro.classList.add('is-playing');

  let done = false;
  function finish() {
    if (done) return;
    done = true;
    intro.classList.add('is-leaving');
    root.classList.add('intro-reveal');            // 히어로 요소들이 차례로 등장
    setTimeout(() => {
      root.classList.remove('intro-pending');
      intro.remove();
    }, 750);
    setTimeout(() => root.classList.remove('intro-reveal'), 2600);
  }
  const timer = setTimeout(finish, 2700);
  document.getElementById('introSkip').addEventListener('click', () => { clearTimeout(timer); finish(); });
  intro.addEventListener('click', (e) => { if (e.target === intro) { clearTimeout(timer); finish(); } });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { clearTimeout(timer); finish(); document.removeEventListener('keydown', onKey); }
  });
})();

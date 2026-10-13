/* =========================================================
   입장 모션
   1) 수채 번짐 위로 튤립이 천천히 자라고 상자가 안개처럼 스며듦
   2) 뚜껑이 부드럽게 열리며 종이 조각이 둥실 피어오름
   3) 로고 글자가 흐릿함에서 또렷해짐  4) 안개가 걷히듯 페이지 공개
   <head>의 인라인 스크립트가 html에 .intro-pending 을 붙여 첫 화면부터 덮어 둬요.
   ========================================================= */
(() => {
  'use strict';
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('intro-pending')) { if (intro) intro.remove(); return; }

  // 로고 글자를 하나씩 쪼개서 순서대로 또렷해지게
  const logo = document.getElementById('introLogo');
  logo.innerHTML = [...logo.textContent].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('');

  // 상자에서 둥실 피어오르는 종이 조각 · 하트 · 별 (은은하게)
  const colors = ['#F5D66C', '#D9C5EE', '#B9DDC7', '#F6D5C5', '#F4AEBB'];
  const shapes = ['ci', 'sq', 'heart', 'ci', 'star', 'sq'];
  const burst = document.getElementById('introConfetti');
  const pieces = [];
  for (let i = 0; i < 22; i++) {
    const a = (-90 + (Math.random() * 150 - 75)) * Math.PI / 180;   // 대부분 위쪽으로
    const dist = 80 + Math.random() * 130;
    const p = document.createElement('i');
    p.className = 'ic ic-' + shapes[i % shapes.length];
    p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
    p.style.setProperty('--tx', Math.cos(a) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(a) * dist + 'px');
    p.style.setProperty('--fall', 40 + Math.random() * 60 + 'px');
    p.style.setProperty('--rot', Math.random() * 180 - 90 + 'deg');
    p.style.setProperty('--s', 0.6 + Math.random() * 0.5);
    p.style.setProperty('--delay', 1.0 + Math.random() * 0.6 + 's');
    pieces.push(p);
  }
  burst.append(...pieces);

  // 로고 주변에서 반짝이는 별
  const sparkHolder = document.getElementById('introSparkles');
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.setProperty('--s', 8 + Math.random() * 8 + 'px');
    s.style.setProperty('--c', ['#F5D66C', '#D9C5EE', '#F4AEBB', '#B9DDC7'][i % 4]);
    s.style.setProperty('--delay', 0.9 + Math.random() * 1.2 + 's');
    sparkHolder.appendChild(s);
  }

  // 위에서 흩날리는 튤립 꽃잎
  const petalHolder = document.getElementById('introPetals');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--s', 10 + Math.random() * 12 + 'px');
    p.style.setProperty('--c', ['#F4AEBB', '#F6BBC6', '#D9C5EE', '#F5D66C', '#F6D5C5'][i % 5]);
    p.style.setProperty('--t', 4 + Math.random() * 2 + 's');
    p.style.setProperty('--sx', Math.random() * 120 - 60 + 'px');
    p.style.setProperty('--delay', Math.random() * 1.6 + 's');
    petalHolder.appendChild(p);
  }

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
    }, 1000);
    setTimeout(() => root.classList.remove('intro-reveal'), 2600);
  }
  const timer = setTimeout(finish, 3600);
  document.getElementById('introSkip').addEventListener('click', () => { clearTimeout(timer); finish(); });
  intro.addEventListener('click', (e) => { if (e.target === intro) { clearTimeout(timer); finish(); } });
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { clearTimeout(timer); finish(); document.removeEventListener('keydown', onKey); }
  });
})();

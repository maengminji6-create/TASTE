/* =========================================================
   나의 취향 아카이브 — 상자 속 QR로 들어오는 기록 페이지
   기록은 서버 없이 이 브라우저(localStorage)에만 저장돼요.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KEY = 'taste-archive-v1';
  const MAX_STAMPS = 12;
  const box = (new URLSearchParams(location.search).get('box') || '0712').replace(/\D/g, '').slice(0, 6) || '0712';

  const COLOR = {
    butter: { hex: '#F5D66C', label: '버터 옐로' },
    lilac:  { hex: '#D9C5EE', label: '라일락' },
    mint:   { hex: '#B9DDC7', label: '세이지 민트' },
    peach:  { hex: '#F6D5C5', label: '피치' },
  };
  const TODO = { make: '손으로 만들기', see: '무언가 보러 가기', walk: '낯선 곳 걷기', write: '조용히 끄적이기' };
  const NEXT_BOX = {
    '향': '향 블렌딩 키트 · 나만의 향 만들기',
    '도자기': '미니 도자기 컵 · 손으로 빚는 작은 컵',
    '산책': '동네 산책 지도 · 낯선 동네와 작은 가게 쿠폰',
    '전시': '블라인드 전시 티켓 · 무엇을 보러 가는지 모르는 티켓',
    '음악': '음악 한 곡 & 편지지',
    '자수': '자수 책갈피 · 실과 바늘로 만드는 책갈피',
    '사진': '필름 사진 엽서 · 일회용 카메라 한 롤',
    '공연': '블라인드 뮤지컬 티켓',
  };

  /* ---------- 저장소 (사생활 보호 모드 등에서 실패해도 페이지는 동작) ---------- */
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; }
  }
  let records = load();

  $('#boxNo').textContent = `상자 No.${box.padStart(4, '0')}`;

  /* ---------- 스탬프 ---------- */
  function renderStamps() {
    const n = Math.min(records.length, MAX_STAMPS);
    $('#stampRow').innerHTML = Array.from({ length: MAX_STAMPS }, (_, i) => `<li class="${i < n ? 'on' : ''}"></li>`).join('');
    $('#stampCount').textContent = n;
  }

  /* ---------- 폼 ---------- */
  const form = $('#recordForm');
  const today = new Date();
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  form.date.value = iso(today);

  const sentence = form.sentence;
  sentence.addEventListener('input', () => { $('#sentenceCount').textContent = sentence.value.length; });
  const minutes = $('#minutes');
  minutes.addEventListener('input', () => { $('#minutesOut').textContent = `${minutes.value}분`; });

  // 다음 경험은 최대 3개
  const nextBoxes = $$('input[name="next"]');
  nextBoxes.forEach((cb) => cb.addEventListener('change', () => {
    const count = nextBoxes.filter((c) => c.checked).length;
    nextBoxes.forEach((c) => { c.disabled = !c.checked && count >= 3; });
  }));

  // 진행 표시: 단계별 완료 여부 + 지금 보고 있는 단계
  const steps = $$('.a-step');
  const progress = $$('.a-progress li');
  let photoData = '';
  function stepDone(n) {
    if (n === 1) return ['color', 'word', 'todo'].every((k) => form[k].value);
    if (n === 2) return !!photoData;
    if (n === 3) return !!form.title.value.trim();
    return nextBoxes.some((c) => c.checked);
  }
  function updateProgress(active) {
    progress.forEach((li, i) => {
      li.classList.toggle('is-done', stepDone(i + 1));
      if (active) li.classList.toggle('is-on', i + 1 === active);
    });
  }
  form.addEventListener('input', () => updateProgress());
  form.addEventListener('change', () => updateProgress());
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) updateProgress(+e.target.dataset.step); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  steps.forEach((s) => stepObserver.observe(s));

  /* ---------- 사진: 휴대폰 사진을 900px로 줄여서 저장 ---------- */
  const photoInput = $('#photoInput');
  const preview = $('#photoPreview');
  function setPhoto(data) {
    photoData = data;
    preview.hidden = !data;
    preview.src = data || '';
    $('#photoEmpty').hidden = !!data;
    $('#photoClear').hidden = !data;
    updateProgress();
  }
  photoInput.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      setPhoto(c.toDataURL('image/jpeg', 0.8));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { showError('사진을 읽지 못했어요. 다른 사진으로 골라 주세요.'); URL.revokeObjectURL(url); };
    img.src = url;
  });
  $('#photoClear').addEventListener('click', () => { photoInput.value = ''; setPhoto(''); });

  /* ---------- 제출 ---------- */
  const errorEl = $('#formError');
  function showError(msg, focusEl) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    if (focusEl) {
      focusEl.closest('.a-step').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => focusEl.focus({ preventScroll: true }), 400);
    }
  }

  function recommend(r) {
    const pick = r.next.find((k) => NEXT_BOX[k]);
    if (pick) return { box: NEXT_BOX[pick], why: `다음에 '${pick}'을(를) 해 보고 싶다고 남겨 줬어요.` };
    if (r.word === '밖으로' || r.todo === 'walk') return { box: NEXT_BOX['산책'], why: '오늘은 밖으로 나가고 싶은 하루였네요.' };
    if (r.todo === 'see') return { box: NEXT_BOX['전시'], why: '무언가 보러 가고 싶은 마음을 담았어요.' };
    if (r.todo === 'write') return { box: NEXT_BOX['음악'], why: '조용히 끄적이고 싶은 날엔 노래 한 곡과 편지지를.' };
    if (r.word === '반짝이는') return { box: NEXT_BOX['도자기'], why: '반짝이는 하루엔 손으로 빚는 무언가를.' };
    return { box: NEXT_BOX['향'], why: `${COLOR[r.color].label}처럼 ${r.word} 하루를 향으로 남겨 봐요.` };
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.hidden = true;
    if (!form.color.value) return showError('Q1 색을 골라 주세요.', $('input[name="color"]'));
    if (!form.word.value && !form.wordCustom.value.trim()) return showError('Q2 단어를 골라 주세요.', $('input[name="word"]'));
    if (!form.todo.value) return showError('Q3 하고 싶은 일을 골라 주세요.', $('input[name="todo"]'));
    if (!form.title.value.trim()) return showError('작품 제목을 적어 주세요.', form.title);

    const r = {
      id: Date.now(),
      box,
      color: form.color.value,
      word: form.wordCustom.value.trim() || form.word.value,
      todo: form.todo.value,
      title: form.title.value.trim(),
      date: form.date.value || iso(today),
      sentence: sentence.value.trim(),
      materials: $$('input[name="material"]:checked').map((c) => c.value),
      minutes: +minutes.value,
      mood: +(form.mood.value || 3),
      next: nextBoxes.filter((c) => c.checked).map((c) => c.value),
      share: form.share.checked,
      photo: photoData,
    };
    records.unshift(r);
    let stored = save(records);
    if (!stored && r.photo) { // 저장 공간이 부족하면 사진을 빼고 다시 시도
      r.photo = '';
      stored = save(records);
    }
    showResult(r, stored);
  });

  /* ---------- 결과 ---------- */
  function showResult(r, stored) {
    const n = records.length;
    const rec = recommend(r);
    const c = COLOR[r.color];
    $('#popNo').textContent = Math.min(n, MAX_STAMPS);
    $('#resultHead').textContent = stored
      ? (n === 1 ? '첫 번째 취향이 수집됐어요' : `${n}번째 취향이 수집됐어요`)
      : '기록했지만 이 브라우저에는 저장되지 않았어요';
    const photo = $('#cardPhoto');
    photo.style.setProperty('--tone', c.hex);
    photo.innerHTML = r.photo ? `<img src="${r.photo}" alt="${escapeHtml(r.title)} 작품 사진">` : '';
    $('#cardMeta').textContent = `상자 No.${r.box} · ${r.date.replace(/-/g, '. ')} · ${r.minutes}분`;
    $('#cardTitle').textContent = r.title;
    $('#cardTags').innerHTML = [c.label, r.word, TODO[r.todo], ...r.materials].map((t) => `<li>${escapeHtml(t)}</li>`).join('');
    $('#cardQuote').textContent = r.sentence ? `“${r.sentence}”` : '';
    $('#nextBox').textContent = rec.box;
    $('#nextWhy').textContent = rec.why;

    const result = $('#result');
    result.hidden = false;
    form.hidden = true;
    $('.a-progress').hidden = true;
    const pop = $('#stampPop');
    pop.style.animation = 'none'; void pop.offsetWidth; pop.style.animation = '';
    result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    result.focus({ preventScroll: true });
    renderStamps();
    renderHistory();
    confetti();
    lastRecord = r;
  }
  let lastRecord = null;

  $('#newRecord').addEventListener('click', () => {
    form.reset();
    form.date.value = iso(new Date());
    $('#sentenceCount').textContent = '0';
    $('#minutesOut').textContent = '30분';
    nextBoxes.forEach((c) => { c.disabled = false; });
    setPhoto('');
    $('#result').hidden = true;
    form.hidden = false;
    $('.a-progress').hidden = false;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 기록 카드를 이미지로 저장 (canvas) ---------- */
  $('#saveImage').addEventListener('click', async () => {
    if (!lastRecord) return;
    const r = lastRecord;
    const W = 1080, H = 1350;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    try { await document.fonts.ready; } catch { /* 폰트 없이도 그려요 */ }

    g.fillStyle = '#FFF9EF'; g.fillRect(0, 0, W, H);
    g.fillStyle = COLOR[r.color].hex; g.fillRect(60, 60, W - 120, 760);
    if (r.photo) {
      const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = r.photo; });
      if (img) { // cover
        const s = Math.max((W - 120) / img.width, 760 / img.height);
        const w = img.width * s, h = img.height * s;
        g.save(); g.beginPath(); g.rect(60, 60, W - 120, 760); g.clip();
        g.drawImage(img, 60 + (W - 120 - w) / 2, 60 + (760 - h) / 2, w, h); g.restore();
      }
    }
    g.fillStyle = '#746C67'; g.font = '28px "Noto Sans KR", sans-serif';
    g.fillText(`상자 No.${r.box} · ${r.date.replace(/-/g, '. ')} · ${r.minutes}분`, 60, 890);
    g.fillStyle = '#403B38'; g.font = '700 64px "Gowun Batang", serif';
    g.fillText(r.title, 60, 980, W - 120);
    g.font = '30px "Noto Sans KR", sans-serif';
    let x = 60;
    [COLOR[r.color].label, r.word, TODO[r.todo]].forEach((t) => {
      const w = g.measureText(t).width + 40;
      g.strokeStyle = '#D8CDBF'; g.lineWidth = 2; roundRect(g, x, 1020, w, 52, 26); g.stroke();
      g.fillStyle = '#403B38'; g.fillText(t, x + 20, 1057); x += w + 12;
    });
    if (r.sentence) { g.font = '58px "Nanum Pen Script", cursive'; g.fillText(`“${r.sentence}”`, 60, 1160, W - 120); }
    g.fillStyle = '#403B38'; g.fillRect(60, 1230, W - 120, 2);
    g.font = '700 34px "Gowun Batang", serif'; g.fillText('취향수집소', 60, 1290);
    g.font = '24px "Noto Sans KR", sans-serif'; g.fillStyle = '#746C67'; g.textAlign = 'right';
    g.fillText('아직 몰랐던 나를 수집하는 시간', W - 60, 1288);

    const a = document.createElement('a');
    a.download = `취향기록_${r.date}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
  });
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  /* ---------- 지난 기록 (취향 도감) ---------- */
  function renderHistory() {
    $('#historyEmpty').hidden = records.length > 0;
    $('#clearAll').hidden = records.length === 0;
    $('#historyList').innerHTML = records.map((r) => `
      <li>
        <div class="h-photo" style="--tone:${COLOR[r.color].hex}">${r.photo ? `<img src="${r.photo}" alt="" loading="lazy">` : ''}</div>
        <div class="h-body"><b>${escapeHtml(r.title)}</b><small>${r.date.replace(/-/g, '.')} · ${escapeHtml(r.word)}</small></div>
      </li>`).join('');
  }
  $('#clearAll').addEventListener('click', () => {
    if (!confirm('이 휴대폰에 저장된 취향 기록을 모두 지울까요? 되돌릴 수 없어요.')) return;
    records = [];
    save(records);
    renderStamps();
    renderHistory();
  });

  /* ---------- 축하 종이 조각 ---------- */
  function confetti() {
    if (reduceMotion) return;
    const colors = ['#F5D66C', '#D9C5EE', '#B9DDC7', '#F6D5C5', '#403B38'];
    for (let i = 0; i < 46; i++) {
      const p = document.createElement('i');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.borderRadius = i % 3 === 0 ? '50%' : '2px';
      p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      p.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      p.style.setProperty('--d', (1.6 + Math.random() * 1.4) + 's');
      p.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  renderStamps();
  renderHistory();
  updateProgress(1);
})();

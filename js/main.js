/* =========================================================
   취향수집소 · 오늘의 취향 콜라주 상세페이지 스크립트
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.remove('no-js');

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
  }

  /* ---------- Header & mobile nav ---------- */
  const header = $('#siteHeader');
  const navToggle = $('#navToggle');
  const nav = $('#siteNav');

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // 현재 보고 있는 섹션을 메뉴에 표시
  const navLinks = $$('.site-nav a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const target = $(a.getAttribute('href'));
    if (target) sectionObserver.observe(target);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    revealObserver.observe(el);
  });

  /* ---------- 질문 카드 → 기록 카드 ---------- */
  const COLORS = {
    butter: { css: 'var(--butter)', label: '버터 옐로' },
    lilac:  { css: 'var(--lilac)',  label: '라일락' },
    mint:   { css: 'var(--mint)',   label: '세이지 민트' },
    peach:  { css: 'var(--peach)',  label: '피치' },
  };
  const TODO = {
    make:  { phrase: '손끝의',   person: '만드는 사람' },
    see:   { phrase: '눈길의',   person: '보러 가는 사람' },
    walk:  { phrase: '발걸음의', person: '걷는 사람' },
    write: { phrase: '문장의',   person: '끄적이는 사람' },
  };
  const QUOTES = {
    '조용한':   '“오늘은 천천히 해도 되는 날.”',
    '말랑한':   '“오늘은 대충 해도 예쁜 날.”',
    '반짝이는': '“오늘은 조금 더 반짝여도 되는 날.”',
    '밖으로':   '“오늘은 문을 열고 나가 보는 날.”',
  };

  // 브랜드 브리프의 '취향 엔진' 규칙을 단순화한 추천
  function nextBox(color, word, todo) {
    if (word === '밖으로' || todo === 'walk') return '산책 지도 · 낯선 동네와 작은 가게 쿠폰';
    if (todo === 'see') return '블라인드 전시 티켓 · 무엇을 보러 가는지 모르는 티켓';
    if (todo === 'write') return '음악 한 곡 · 노래와 함께 오는 편지지';
    if (word === '조용한' || color === 'lilac') return '향 블렌딩 키트 · 나만의 향 만들기';
    if (word === '반짝이는') return '미니 도자기 · 손으로 빚는 작은 컵';
    return '향 블렌딩 키트 · 나만의 향 만들기';
  }

  const quiz = $('#quiz');
  const recordCard = $('.record-card');
  function updateRecord() {
    const color = $('input[name="color"]:checked', quiz).value;
    const word = $('input[name="word"]:checked', quiz).value;
    const todo = $('input[name="todo"]:checked', quiz).value;
    const c = COLORS[color];

    const art = $('#recordArt');
    art.style.setProperty('--main', c.css);
    art.style.setProperty('--sub', color === 'peach' ? 'var(--butter)' : 'var(--peach)');
    art.style.setProperty('--accent', color === 'mint' ? 'var(--lilac)' : 'var(--mint)');

    $('#recordTitle').textContent = `${word} ${TODO[todo].phrase} ${c.label}`;
    $('#recordTags').innerHTML = [c.label, word, TODO[todo].person].map((t) => `<li>${t}</li>`).join('');
    $('#recordQuote').textContent = QUOTES[word];
    $('#recordNext').textContent = nextBox(color, word, todo);

    recordCard.classList.remove('is-bump');
    void recordCard.offsetWidth; // 애니메이션 재시작
    recordCard.classList.add('is-bump');
  }
  quiz.addEventListener('change', updateRecord);
  updateRecord();
  recordCard.classList.remove('is-bump');

  /* ---------- Gallery filter & lightbox ---------- */
  const tabs = $$('.tab');
  const items = $$('.g-item');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    const f = tab.dataset.filter;
    items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
  }));

  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  $$('.g-btn').forEach((btn) => btn.addEventListener('click', () => {
    const img = $('img', btn);
    lbImg.src = btn.dataset.full;
    lbImg.alt = img.alt;
    lbCap.textContent = $('.g-cap', btn).textContent.replace(/\s+/g, ' ').trim();
    lightbox.showModal();
  }));
  $('#lbClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- 실제로 찍히는 QR 코드 → archive.html ---------- */
  const cfg = window.TASTE_CONFIG || {};
  const boxNo = cfg.boxNo || '0712';
  const archiveUrl = new URL(`archive.html?box=${boxNo}`, cfg.archiveBaseUrl || location.href).href;

  function renderQR() {
    const holder = $('#qrCode');
    if (!holder || typeof window.qrcode !== 'function') return;
    const qr = window.qrcode(0, 'M');         // 버전 자동, 오류 정정 M(15%)
    qr.addData(archiveUrl);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
    const q = 4; // 인식에 필요한 여백(quiet zone)
    holder.innerHTML = `<svg viewBox="${-q} ${-q} ${n + q * 2} ${n + q * 2}" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="${-q}" y="${-q}" width="${n + q * 2}" height="${n + q * 2}" fill="#FFFFFF"/><path d="${d}" fill="#403B38"/></svg>`;
  }
  renderQR();
  $('#qrLink').textContent = archiveUrl;
  $('#qrLink').href = archiveUrl;
  $('#qrOpen').href = archiveUrl;

  // 휴대폰이 접속할 수 없는 주소(PC 파일 · localhost)라면 안내
  const unreachable = location.protocol === 'file:' && !cfg.archiveBaseUrl
    || (!cfg.archiveBaseUrl && /^(localhost|127\.|\[::1\])/.test(location.hostname));
  if (unreachable) {
    const n = $('#qrNotice');
    n.hidden = false;
    n.innerHTML = '지금은 PC에서 파일로 열려 있어서 휴대폰이 이 주소에 들어올 수 없어요. 폴더의 <b>serve.bat</b>을 실행해 같은 Wi-Fi 주소로 열거나, <b>js/config.js</b>에 배포한 사이트 주소를 적으면 QR이 휴대폰에서 바로 열려요.';
  }

  /* ---------- 키트 구성품: 번호 핀 ↔ 목록 ---------- */
  const kitPins = $$('.kit-pin');
  const kitItems = $$('.kit-list li');
  function kitFocus(k) {
    kitPins.forEach((p) => p.classList.toggle('is-on', p.dataset.k === k));
    kitItems.forEach((li) => li.classList.toggle('is-on', li.dataset.k === k));
  }
  [...kitPins, ...kitItems].forEach((el) => {
    el.addEventListener('mouseenter', () => kitFocus(el.dataset.k));
    el.addEventListener('focus', () => kitFocus(el.dataset.k));
    el.addEventListener('click', () => kitFocus(el.dataset.k));
  });
  kitPins.forEach((p) => p.setAttribute('aria-label', `${p.dataset.k}번 ${$(`.kit-list li[data-k="${p.dataset.k}"] b`).textContent}`));
  kitItems.forEach((li) => li.setAttribute('tabindex', '0'));
  $('.kit-body').addEventListener('mouseleave', () => kitFocus(null));

  /* ---------- 12달 캘린더: 월 시트 뒤집기 ---------- */
  const MONTHS = [
    { box: '오늘의 취향 콜라주', hint: 'butter', hintWord: '노랑 · 시작', event: '새해 첫 기록 주간', detail: '1월에 QR 기록을 남기면 스탬프 2배', date: '1.1 – 1.31' },
    { box: '향 블렌딩 키트', hint: 'lilac', hintWord: '보라 · 조용한', event: '향 편지 선물전', detail: '선물 포장과 손글씨 카드 무료', date: '2.1 – 2.14' },
    { box: '동네 산책 지도', hint: 'mint', hintWord: '초록 · 밖으로', event: '봄 산책 인증', detail: '산책 릴스 올리면 20명에게 동네 가게 쿠폰', date: '3.10 – 3.31' },
    { box: '미니 도자기 컵', hint: 'peach', hintWord: '흙 · 말랑한', event: '원데이 클래스 초대', detail: '성수 공방에서 물레 체험 1회', date: '4.19 (토)', plus: true },
    { box: '블라인드 전시 티켓', hint: 'lilac', hintWord: '보라 · 반짝이는', event: '가정의 달 동행권', detail: '전시 티켓을 2인권으로 업그레이드', date: '5.1 – 5.31', plus: true },
    { box: '음악 한 곡 & 편지지', hint: 'butter', hintWord: '노랑 · 듣는', event: '상반기 취향 리포트', detail: '6개월 기록으로 만든 나만의 취향 카드 발송', date: '6.30' },
    { box: '여름 판화 스탬프', hint: 'mint', hintWord: '민트 · 시원한', event: '여름 한정 스탬프', detail: '7월에만 받는 세이지 민트 스탬프 스티커', date: '7.1 – 7.31' },
    { box: '블라인드 뮤지컬 티켓', hint: 'peach', hintWord: '피치 · 두근대는', event: '분기 공연 티켓', detail: '무엇을 보는지 모르는 뮤지컬 1매', date: '8월 중 공연', plus: true },
    { box: '자수 책갈피', hint: 'lilac', hintWord: '보라 · 차분한', event: '친구 초대 주간', detail: '초대한 친구와 나 모두 다음 상자 3,000원 할인', date: '9.1 – 9.21' },
    { box: '소이 캔들 만들기', hint: 'butter', hintWord: '노랑 · 따뜻한', event: '취향수집소 1주년', detail: '지난 상자 중 하나를 다시 고를 수 있어요', date: '10.13 – 10.31' },
    { box: '필름 사진 엽서', hint: 'peach', hintWord: '피치 · 기억하는', event: '취향 도감 사진전', detail: '기록 사진 공모, 뽑히면 온라인 전시', date: '11.1 – 11.24' },
    { box: '연말 취향 도감', hint: 'mint', hintWord: '초록 · 돌아보는', event: '스탬프 12개 완성 선물', detail: '1년 기록을 엮은 실물 도감 제작', date: '12.20 발송', plus: true },
  ];
  const ROT = [-2, 1.5, -1, 2, 1, -1.5, 2, -2, -1, 1.5, -1.5, 1];
  const calGrid = $('#calGrid');
  const thisMonth = new Date().getMonth();
  calGrid.innerHTML = MONTHS.map((m, i) => `
    <li class="cal-item" style="--r:${ROT[i]}deg;--tone:var(--${m.hint})">
      <button type="button" class="cal-card" aria-pressed="false">
        <span class="cal-inner">
          <span class="cal-face cal-front" aria-hidden="false">
            ${i === thisMonth ? '<span class="cal-now">이번 달</span>' : ''}
            <span class="cal-sheet"><span class="cal-q">?</span><span class="cal-month">${i + 1}<small>월</small></span></span>
            <span class="cal-front-foot"><span>No.${String(i + 1).padStart(2, '0')}</span><span class="flip-hint">눌러서 뒤집기</span></span>
          </span>
          <span class="cal-face cal-back" aria-hidden="true">
            <span class="cal-back-top"><b>${i + 1}월</b><span class="cal-tag${m.plus ? ' plus' : ''}">${m.plus ? '플러스 한정' : '탐험대'}</span></span>
            <span class="cal-box">${m.box}</span>
            <span class="cal-hint"><i></i>1일 힌트 · ${m.hintWord}</span>
            <span class="cal-event"><em>${m.event}</em>${m.detail}</span>
            <span class="cal-date">${m.date}</span>
          </span>
        </span>
      </button>
    </li>`).join('');

  function setFlip(card, on) {
    card.setAttribute('aria-pressed', String(on));
    $('.cal-front', card).setAttribute('aria-hidden', String(on));
    $('.cal-back', card).setAttribute('aria-hidden', String(!on));
  }
  const calCards = $$('.cal-card', calGrid);
  const flipAll = $('#calFlipAll');
  calCards.forEach((card) => card.addEventListener('click', () => {
    setFlip(card, card.getAttribute('aria-pressed') !== 'true');
    const allOn = calCards.every((c) => c.getAttribute('aria-pressed') === 'true');
    flipAll.setAttribute('aria-pressed', String(allOn));
    flipAll.textContent = allOn ? '다시 덮기' : '전부 뒤집어 보기';
  }));
  flipAll.addEventListener('click', () => {
    const on = flipAll.getAttribute('aria-pressed') !== 'true';
    calCards.forEach((c, i) => setTimeout(() => setFlip(c, on), reduceMotion ? 0 : i * 70));
    flipAll.setAttribute('aria-pressed', String(on));
    flipAll.textContent = on ? '다시 덮기' : '전부 뒤집어 보기';
  });

  /* ---------- 홍보 영상 (실제 mp4 또는 스토리보드) ---------- */
  const DURATION = 24;
  const reel = $('#reel');
  const video = $('#reelVideo');
  const board = $('#reelBoard');
  const clips = $$('.clip', board);
  const playBtn = $('#reelPlay');
  const progressBar = $('#reelProgress span');
  const timeEl = $('#reelTime');
  const sceneItems = $$('#sceneList li');

  let useVideo = false;
  let playing = false;
  let t = 0;
  let last = 0;
  let raf = 0;

  // assets/video/promo.mp4 가 있으면 실제 영상으로 전환
  video.addEventListener('loadedmetadata', () => {
    useVideo = true;
    video.hidden = false;
    board.hidden = true;
  });
  video.load();

  const fmt = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`;

  function render(time) {
    const dur = useVideo ? (video.duration || DURATION) : DURATION;
    progressBar.style.width = Math.min(100, (time / dur) * 100) + '%';
    timeEl.textContent = `${fmt(time)} / ${fmt(dur)}`;
    if (!useVideo) {
      clips.forEach((c) => {
        const on = time >= +c.dataset.start && time < +c.dataset.end;
        if (on && !c.classList.contains('is-active')) {
          // Ken Burns 애니메이션 재시작
          const img = $('img', c);
          img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
        }
        c.classList.toggle('is-active', on);
      });
    }
    // 장면 목록 하이라이트
    let idx = 0;
    sceneItems.forEach((li, i) => { if (time >= +li.dataset.at) idx = i; });
    sceneItems.forEach((li, i) => li.classList.toggle('is-active', playing && i === idx));
  }

  function tick(now) {
    t += (now - last) / 1000;
    last = now;
    if (t >= DURATION) { t = DURATION; render(t); stop(true); return; }
    render(t);
    raf = requestAnimationFrame(tick);
  }

  function play() {
    playing = true;
    reel.classList.add('is-playing');
    playBtn.setAttribute('aria-label', '영상 일시정지');
    if (useVideo) { video.play(); return; }
    if (t >= DURATION) t = 0;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop(ended = false) {
    playing = false;
    reel.classList.remove('is-playing');
    playBtn.setAttribute('aria-label', '영상 재생');
    if (useVideo) { video.pause(); return; }
    cancelAnimationFrame(raf);
    if (ended) { t = 0; setTimeout(() => render(0), 1200); }
    render(t);
  }
  function seek(sec) {
    if (useVideo) { video.currentTime = sec; return; }
    t = Math.max(0, Math.min(DURATION - 0.01, sec));
    render(t);
  }

  playBtn.addEventListener('click', () => (playing ? stop() : play()));
  board.addEventListener('click', () => (playing ? stop() : play()));
  video.addEventListener('click', () => (playing ? stop() : play()));
  video.addEventListener('timeupdate', () => render(video.currentTime));
  video.addEventListener('ended', () => stop());

  $('#reelProgress').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dur = useVideo ? video.duration : DURATION;
    seek(((e.clientX - rect.left) / rect.width) * dur);
  });
  sceneItems.forEach((li) => li.addEventListener('click', () => {
    seek(+li.dataset.at);
    if (!playing) play();
  }));

  // 화면 밖으로 나가면 자동 일시정지
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && playing) stop();
  }, { threshold: 0.2 }).observe(reel);
  render(0);

  /* ---------- 카드뉴스 점 표시 ---------- */
  const cardnews = $('#cardnews');
  const dots = $$('#cnDots span');
  cardnews.addEventListener('scroll', () => {
    const i = Math.round(cardnews.scrollLeft / cardnews.clientWidth);
    dots.forEach((d, j) => d.classList.toggle('on', i === j));
  }, { passive: true });
  cardnews.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    cardnews.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * cardnews.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 구매 ---------- */
  const form = $('#buyForm');
  const qtyOut = $('#qty');
  const qtyMinus = $('#qtyMinus');
  const qtyPlus = $('#qtyPlus');
  const qtyWrap = $('#qtyWrap');
  const giftWrap = $('#giftWrap');
  const GIFT_PRICE = 1000;
  const MAX_QTY = 10;
  let qty = 1;

  const selectedPlan = () => $('input[name="plan"]:checked', form);

  function calc() {
    const plan = selectedPlan();
    const isSubscription = plan.value !== 'sampler';
    if (isSubscription) qty = 1;

    qtyWrap.classList.toggle('is-disabled', isSubscription);
    qtyMinus.disabled = isSubscription || qty <= 1;
    qtyPlus.disabled = isSubscription || qty >= MAX_QTY;
    qtyOut.textContent = qty;

    const unit = +plan.dataset.price + (giftWrap.checked ? GIFT_PRICE : 0);
    const total = unit * qty;
    const label = won(total) + plan.dataset.unit;
    $('#totalPrice').textContent = label;
    $('#stickyPrice').textContent = label;
    $('#stickyName').textContent = plan.dataset.name;
    return { plan, total, label };
  }

  form.addEventListener('change', calc);
  qtyMinus.addEventListener('click', () => { qty = Math.max(1, qty - 1); calc(); });
  qtyPlus.addEventListener('click', () => { qty = Math.min(MAX_QTY, qty + 1); calc(); });
  calc();

  $('#cartBtn').addEventListener('click', () => {
    const { plan } = calc();
    toast(`장바구니에 ${plan.dataset.name}을(를) 담았어요`);
  });

  const orderDialog = $('#orderDialog');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { plan, label } = calc();
    $('#orderSummary').innerHTML = `
      <dt>상품</dt><dd>${plan.dataset.name}</dd>
      <dt>수량</dt><dd>${qty}개</dd>
      <dt>선물 포장</dt><dd>${giftWrap.checked ? '추가' : '없음'}</dd>
      <dt>결제 금액</dt><dd class="total-dd">${label}</dd>`;
    orderDialog.showModal();
  });
  $('#orderCancel').addEventListener('click', () => orderDialog.close());
  $('#orderOk').addEventListener('click', () => {
    orderDialog.close();
    toast('주문이 접수됐어요. 곧 첫 번째 상자가 도착해요!');
  });
  orderDialog.addEventListener('click', (e) => { if (e.target === orderDialog) orderDialog.close(); });

  /* ---------- 모바일 하단 구매 바 ---------- */
  const sticky = $('#stickyBuy');
  const seen = { hero: true, buy: false };
  const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => { seen[en.target.id === 'top' ? 'hero' : 'buy'] = en.isIntersecting; });
    sticky.classList.toggle('is-visible', !seen.hero && !seen.buy);
  }, { threshold: 0 });
  stickyObserver.observe($('#top'));
  stickyObserver.observe($('#buy'));
})();

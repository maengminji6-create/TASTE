/* =========================================================
   사용자 리뷰 (콘셉트용 예시 데이터)
   평점 4.8 · 리뷰 5,127개 — 요약 수치는 index.html에 고정, 아래는 노출용 예시 리뷰
   ========================================================= */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // tags: photo(사진 첨부) · gift(선물) · sub(구독)
  const REVIEWS = [
    { name: '지*우', age: '20대', plan: '취향 샘플러', rate: 5, date: '2026.10.09', helpful: 214, tags: ['photo'], photo: 'assets/images/photo-desk.svg',
      text: '재료 사러 갈 필요 없이 열자마자 시작할 수 있어서 좋았어요. 색종이가 다 잘려 있어서 가위도 안 썼고, 30분 조금 넘게 걸렸어요. 완성하고 QR로 기록 남기니까 스탬프가 찍히는 게 은근 뿌듯해요.' },
    { name: '하*린', age: '20대', plan: '취향 샘플러', rate: 5, date: '2026.10.06', helpful: 187, tags: ['gift', 'photo'], photo: 'assets/images/photo-gift.svg',
      text: '친구 생일 선물로 보냈는데 손글씨 카드까지 같이 와서 반응이 너무 좋았어요. 친구가 만든 콜라주 사진을 보내 줘서 저도 하나 더 주문했습니다 ㅎㅎ' },
    { name: '서*연', age: '30대', plan: '취향 탐험대', rate: 5, date: '2026.10.02', helpful: 163, tags: ['sub'],
      text: '구독 3개월째예요. 매달 1일에 색이랑 키워드 힌트만 오는데 그게 은근 설레요. 지난달엔 향 블렌딩 키트였는데 기록에 "조용한"을 많이 골라서 그런가 봐요. 진짜 나를 닮아 가는 느낌.' },
    { name: '민*호', age: '20대', plan: '취향 샘플러', rate: 4, date: '2026.09.28', helpful: 96, tags: ['photo'], photo: 'assets/images/kit-real.svg',
      text: '구성은 알차고 설명 카드도 쉬워요. 다만 딱풀이 작아서 큰 조각 붙일 땐 조금 아쉬웠어요. 패턴지 종류가 다양해서 고르는 재미는 확실히 있습니다.' },
    { name: '유*나', age: '10대', plan: '취향 샘플러', rate: 5, date: '2026.09.25', helpful: 88, tags: [],
      text: '시험 끝나고 머리 식히려고 샀는데 딱 좋았어요. 질문 카드에 답하다 보니까 오늘 제 기분이 어땠는지 처음으로 생각해 봤어요.' },
    { name: '김*은', age: '30대', plan: '탐험대 플러스', rate: 5, date: '2026.09.21', helpful: 142, tags: ['sub'],
      text: '플러스 구독하면 분기마다 블라인드 티켓이 오는데, 이번엔 처음 들어보는 작은 전시였어요. 혼자 갔는데 생각보다 너무 좋았어요. 그 기록도 아카이브에 같이 남길 수 있어서 좋아요.' },
    { name: '정*아', age: '20대', plan: '취향 샘플러', rate: 5, date: '2026.09.17', helpful: 75, tags: ['photo'], photo: 'assets/images/photo-wall.svg',
      text: '완성한 엽서를 벽에 붙여 두었어요. 다음 달 상자 오면 옆에 하나씩 붙일 예정! 패키지가 예뻐서 상자도 못 버리고 소품함으로 쓰는 중이에요.' },
    { name: '오*경', age: '40대', plan: '취향 샘플러', rate: 4, date: '2026.09.12', helpful: 51, tags: ['gift'],
      text: '조카 선물로 샀어요. 어른인 제가 봐도 재밌어 보여서 하나 더 살까 고민 중이에요. 배송이 하루 늦어서 별 하나 뺐어요.' },
    { name: '이*준', age: '20대', plan: '취향 탐험대', rate: 5, date: '2026.09.08', helpful: 69, tags: ['sub', 'photo'], photo: 'assets/images/photo-record.svg',
      text: '앱 깔 필요 없이 QR 찍으면 바로 기록 페이지가 떠서 편해요. 기록 카드 이미지로 저장해서 인스타에 올렸더니 친구들이 어디서 샀냐고 물어봤어요.' },
    { name: '최*빈', age: '20대', plan: '취향 샘플러', rate: 3, date: '2026.09.03', helpful: 33, tags: [],
      text: '만드는 건 재밌었는데 저는 손이 빨라서 15분 만에 끝났어요. 조각이 조금 더 많았으면 좋겠어요. 그래도 기록 남기는 건 새로웠어요.' },
    { name: '한*솔', age: '30대', plan: '취향 샘플러', rate: 5, date: '2026.08.29', helpful: 58, tags: ['gift'],
      text: '회사 동료들 연말 선물로 5개 샀어요. 각자 만든 걸 사무실 파티션에 붙여 놨는데 다 달라서 신기했어요. 서로 취향 얘기하는 계기가 됐어요.' },
    { name: '박*희', age: '20대', plan: '취향 탐험대', rate: 5, date: '2026.08.24', helpful: 47, tags: ['sub'],
      text: '무엇이 올지 모른다는 게 이 구독의 매력. 마음에 안 드는 달은 건너뛰기도 돼서 부담이 없어요. 스탬프 12개 모아서 연말 도감 받는 게 목표!' },
  ];

  const list = $('#rvList');
  const moreBtn = $('#rvMore');
  const PAGE = 4;
  let filter = 'all';
  let sort = 'best';
  let shown = PAGE;
  const liked = new Set();

  const sorters = {
    best: (a, b) => b.helpful - a.helpful,
    new: (a, b) => b.date.localeCompare(a.date),
    high: (a, b) => b.rate - a.rate || b.helpful - a.helpful,
    low: (a, b) => a.rate - b.rate || b.helpful - a.helpful,
  };

  function current() {
    return REVIEWS
      .filter((r) => filter === 'all' || r.tags.includes(filter))
      .sort(sorters[sort]);
  }

  function render() {
    const items = current();
    list.innerHTML = items.slice(0, shown).map((r) => {
      const i = REVIEWS.indexOf(r);
      const on = liked.has(i);
      return `
      <li class="rv-item">
        <div class="rv-head">
          <span class="rv-avatar" style="--c:var(--${['butter', 'lilac', 'mint', 'peach'][i % 4]})">${r.name[0]}</span>
          <div class="rv-who"><b>${r.name}</b><span>${r.age} · ${r.date}</span></div>
          <span class="rv-plan">${r.plan}</span>
        </div>
        <p class="rv-stars"><span class="stars" style="--rate:${r.rate * 20}%" aria-hidden="true"></span><span class="sr-only">5점 만점에 ${r.rate}점</span>
          ${r.tags.includes('gift') ? '<em class="rv-tag">선물</em>' : ''}${r.tags.includes('sub') ? '<em class="rv-tag">구독</em>' : ''}</p>
        <div class="rv-content">
          <p>${r.text}</p>
          ${r.photo ? `<img src="${r.photo}" alt="${r.name} 님이 올린 사진" loading="lazy">` : ''}
        </div>
        <button type="button" class="rv-helpful${on ? ' is-on' : ''}" data-i="${i}" aria-pressed="${on}">
          도움돼요 <b>${r.helpful + (on ? 1 : 0)}</b>
        </button>
      </li>`;
    }).join('');
    const left = items.length - shown;
    moreBtn.hidden = left <= 0;
    moreBtn.textContent = `리뷰 더 보기 (${Math.min(PAGE, Math.max(left, 0))})`;
  }

  $$('[data-rv]').forEach((btn) => btn.addEventListener('click', () => {
    filter = btn.dataset.rv;
    shown = PAGE;
    $$('[data-rv]').forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    render();
  }));
  $('#rvSort').addEventListener('change', (e) => { sort = e.target.value; render(); });
  moreBtn.addEventListener('click', () => { shown += PAGE; render(); });
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.rv-helpful');
    if (!btn) return;
    const i = +btn.dataset.i;
    liked.has(i) ? liked.delete(i) : liked.add(i);
    render();
  });

  render();
})();

# 취향수집소 · 오늘의 취향 콜라주 상세페이지

`index.html`을 브라우저로 열면 바로 보여요. 빌드 과정은 없어요.

## 폴더 구조

```
TASTE/
├─ index.html            ⑤ 상세 페이지 (메인 이미지 → 특징 3 → 사용 방법 → 상황별 사진 → 영상 → 광고 시안 → 구매)
├─ css/
│  ├─ style.css          상세페이지 스타일 (반응형, 브랜드 7색)
│  └─ plan.css           기획서 스타일 (A4 인쇄 대응)
├─ js/
│  └─ main.js            메뉴, 질문 카드, 구성품 번호 안내, 12달 캘린더 뒤집기, 갤러리, 영상, 구매 금액 계산
├─ docs/
│  └─ plan.html          ① 기획서 (화면의 'PDF로 저장' 버튼 → PDF)
└─ assets/
   ├─ images/            ② 제품 이미지 (SVG 일러스트)
   │  ├─ hero.svg, product-box.svg, kit-real.svg(실사형 구성품)   제품
   │  ├─ scene-desk.svg, scene-record.svg, scene-gift.svg, scene-wall.svg   상황별
   │  ├─ model.svg                                         모델
   │  └─ favicon.svg
   └─ video/             ④ promo.mp4를 넣으면 실제 영상으로 자동 전환 (README 참고)
```

③ 포스터·광고 시안(인스타 피드, 스토리, 카드뉴스), ④ 24초 메리트 홍보 영상(스토리보드), 월 시트를 뒤집어 보는 12달 이벤트 캘린더는 `index.html` 안의 `#ads`, `#video`, `#calendar` 섹션에 있어요.

## 사진을 실제 촬영본으로 바꾸려면

`assets/images/`에 같은 이름의 파일을 넣거나, `index.html`의 `src`를 `.jpg`/`.png` 경로로 바꾸면 돼요.

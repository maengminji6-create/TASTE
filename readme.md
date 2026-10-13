# 취향수집소 · 오늘의 취향 콜라주 상세페이지

`index.html`을 브라우저로 열면 바로 보여요. 빌드 과정은 없어요.

## 폴더 구조

```
TASTE/
├─ index.html            ⑤ 상세 페이지 (입장 모션 → 메인 이미지 → 특징 3 → 사용 방법·QR → 상황별 사진 → 캘린더 → 영상 → 광고 시안 → 리뷰 → 구매)
├─ archive.html          QR로 열리는 '나의 취향 아카이브' 기록 페이지
├─ .nojekyll             GitHub Pages가 파일을 그대로 쓰도록 하는 빈 파일
├─ css/
│  ├─ style.css          상세페이지 스타일 (반응형, 브랜드 7색, 모션)
│  ├─ archive.css        기록 페이지 스타일
│  ├─ plan.css           기획서 스타일 (A4 인쇄 대응)
│  └─ guide.css          코드 안내서 스타일
├─ js/
│  ├─ config.js          QR 주소(archiveBaseUrl) · 상자 번호
│  ├─ intro.js           입장 모션
│  ├─ main.js            메뉴, 질문 카드, QR 생성, 구성품 번호 안내, 12달 캘린더, 갤러리, 영상, 구매
│  ├─ reviews.js         리뷰 목록·필터·정렬 (예시 데이터)
│  ├─ archive.js         기록 저장·스탬프·기록 카드 이미지 저장
│  └─ vendor/qrcode.min.js  QR 생성 라이브러리 (qrcode-generator 1.4.4, MIT)
├─ docs/
│  ├─ plan.html          ① 기획서 (화면의 'PDF로 저장' 버튼 → PDF)
│  └─ code-guide.html    코드 안내서 (어떤 코드가 화면 어디를 만드는지)
└─ assets/
   ├─ images/            ② 제품 이미지
   │  ├─ kit-real.svg, photo-box.svg                     제품 (실사형)
   │  ├─ photo-desk/gift/record/wall.svg                 상황별 (실사형)
   │  ├─ photo-model.svg                                 모델 (실사형)
   │  ├─ hero.svg, tulip*.svg                            배너 손그림 · 튤립 4색
   │  └─ favicon.svg
   └─ video/             ④ promo.mp4를 넣으면 실제 영상으로 자동 전환 (README 참고)
```

③ 포스터·광고 시안(인스타 피드, 스토리, 카드뉴스), ④ 24초 메리트 홍보 영상(스토리보드), 월 시트를 뒤집어 보는 12달 이벤트 캘린더는 `index.html` 안의 `#ads`, `#video`, `#calendar` 섹션에 있어요.

## 사진을 실제 촬영본으로 바꾸려면

`assets/images/`에 같은 이름의 파일을 넣거나, `index.html`의 `src`를 `.jpg`/`.png` 경로로 바꾸면 돼요.

## 휴대폰으로 QR 찍어 보기 — GitHub Pages에 올리기

QR은 **인터넷 주소**로 열려 있어야 휴대폰에서 기록 페이지가 열려요. GitHub Pages에 올리면 무료로 계속 유지되는 주소가 생기고, 그 주소로 연 페이지의 QR은 자동으로 그 주소를 가리켜요.

### 방법 A. 웹에서 올리기 (Git 몰라도 OK)

1. github.com 로그인 → 오른쪽 위 **+ → New repository**
2. Repository name: `TASTE`, **Public** 선택 → **Create repository**
3. 새 저장소 화면에서 **uploading an existing file** 클릭
4. 이 `TASTE` 폴더 **안의 파일과 폴더 전부**를 끌어다 놓기 → 아래 **Commit changes**
5. 저장소 **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main / (root)** → **Save**
6. 1~2분 뒤 `https://내아이디.github.io/TASTE/` 가 열려요. 이 주소에서 **사용 방법 → QR 기록 체험**의 QR을 휴대폰 카메라로 찍으면 기록 페이지가 열려요.

### 방법 B. Git으로 올리기

이 폴더는 이미 Git 저장소로 준비돼 있어요. GitHub에서 빈 `TASTE` 저장소(Public)를 만든 뒤:

```
git remote add origin https://github.com/내아이디/TASTE.git
git push -u origin main
```

그다음 위 5번(Settings → Pages)만 하면 돼요.

### PC에서 파일로 열 때도 휴대폰용 QR을 보이려면

`js/config.js`의 `archiveBaseUrl`에 `'https://내아이디.github.io/TASTE/'`를 적어 주세요.

기록은 서버로 전송되지 않고 각 휴대폰 브라우저에만 저장돼요.

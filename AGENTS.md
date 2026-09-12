# Newtine Frontend — 프로젝트 규칙

## 제품과 레이아웃

- 모바일 전용 웹 앱이다. 모든 화면과 인터랙션은 모바일 앱 사용 경험을 기준으로 구현한다.
- 데스크톱 전용 화면이나 다단 레이아웃을 추가하지 않는다. 큰 화면에서도 동일한 모바일 화면을 중앙에 표시한다.
- 공통 레이아웃은 `src/app/layout.tsx`에서 관리한다. 너비는 `w-full max-w-app`이며, 최대 너비는 `src/app/globals.css`의 `--container-app: 480px` 한곳에서 관리한다.
- 높이는 `min-h-dvh`를 기준으로 한다. 콘텐츠가 길어지면 문서 전체가 세로 스크롤되도록 하고, 기본적으로 body 스크롤 잠금이나 중첩 스크롤을 추가하지 않는다.
- 노치와 홈 인디케이터는 공통 컨테이너의 `env(safe-area-inset-*)` 패딩과 `viewportFit: "cover"`로 대응한다. 페이지에서 안전 영역 패딩을 중복 적용하지 않는다.
- 헤더·하단 내비게이션이 필요하면 공통 컨테이너 너비 안에 배치한다. 문서 스크롤을 유지하는 `sticky`를 우선 고려하고, `fixed` 사용 시 화면 가림과 안전 영역을 별도로 확인한다.
- 루트 레이아웃이 `<main>`을 제공하므로 페이지에서 `<main>`을 중첩하지 않는다.
- 터치 대상은 최소 44×44px을 확보한다. hover에만 의존하지 않고 키보드 포커스와 접근 가능한 이름을 제공한다.
- 사용자의 확대/축소를 막지 않는다. 입력 필드는 기본 16px 이상으로 구성한다.
- 가로 스크롤이 생기지 않도록 좁은 화면에서도 콘텐츠가 줄바꿈·축소되게 한다. 전역 `overflow-x: hidden`으로 레이아웃 오류를 숨기지 않는다.
- 기본 `/` 화면은 아직 비어 있다. 공용 컴포넌트 사용 예시는 개발 전용 `/components`에 모으며 제품 화면과 분리한다. 임의의 제품 메뉴, 다크 모드, PWA 설정은 요청이나 기능 요구사항이 있을 때 추가한다.

## 기술 스택과 코드

- Next.js App Router와 TypeScript를 사용한다. `strict` 설정을 유지하고 불필요한 `any`를 피한다.
- 스타일링은 Tailwind CSS 4 유틸리티를 우선 사용한다. 디자인 토큰은 `src/design-system/tokens.css`, 앱 최대 너비는 `globals.css`에서 관리하고, 별도의 스타일 라이브러리를 임의로 추가하지 않는다.
- 전역 클라이언트 상태는 Zustand, API 통신은 Axios를 사용한다. 실제 기능에 필요한 시점에 스토어와 공통 API 클라이언트를 추가한다.
- 지역 상태는 컴포넌트 내부에서 관리한다. Zustand 스토어에 서버 요청 간 공유되는 사용자 상태를 저장하지 않는다.
- Server Component를 기본으로 유지하고, 상태·이벤트·브라우저 API가 필요한 최소 경계에만 `"use client"`를 지정한다.
- 소스는 `src/` 아래에 두고 `@/*` 별칭을 사용한다. 현재 규모에 맞게 구성하며 사용하지 않는 추상화나 예제 코드를 추가하지 않는다.
- 패키지 관리자는 npm이다. 의존성을 변경할 때 `package-lock.json`을 함께 갱신한다. Node.js 버전은 `.nvmrc`를 따른다.

## 디자인 시스템과 공용 컴포넌트 — 필수

- 제품 UI 구현 전 `src/components/ui/index.ts`의 공용 컴포넌트를 확인하고 반드시 재사용한다. 페이지/기능 폴더에 같은 버튼·칩·행·카드·모달을 별도로 구현하지 않는다.
- 기본 import 경로는 `@/components/ui`다. 기존 컴포넌트가 요구사항을 충족하지 않으면 공용 컴포넌트에 타입이 명확한 prop 또는 variant를 추가한다. 새로운 재사용 패턴은 `src/components/ui/`에 먼저 구현하고 공개 export에 등록한다.
- `Button`/`ButtonLink`, `TopicChip`, `Pill`, `NumberBadge`, `NavBar`, `ListRow`, `ActionBar`, `IssueCard`, `Toast`, `OverlayLabel`, `BottomSheet`, `Dialog`, `SheetHandle`, `Icon`을 공통 기준으로 사용한다. `className`은 배치·폭 등 외부 레이아웃 보완에 사용하고 색·크기·상태를 화면마다 덮어쓰지 않는다.

### `tokens.css` 사용 규칙

- 디자인의 최신 기준은 프로젝트 루트 `design.pen`의 `02_디자인 시스템`이다. UI를 수정하기 전에 Pen과 `src/design-system/tokens.css`를 함께 확인하며, 둘이 다르면 임의로 결정하지 말고 사용자에게 확인한다.
- `tokens.css`는 공용 시각 역할만 관리한다. `@theme`에는 여러 컴포넌트가 공유하는 radius·타이포그래피·애니메이션을, `@theme inline`에는 색상을, `@utility`에는 폰트와 공용 동작 유틸리티를 둔다.
- 색상은 다음 역할에 맞는 기존 토큰을 먼저 사용한다.
  - 브랜드: `primary`, `primary-foreground`, `accent`
  - 타이포그래피: `foreground`, `foreground-body`, `foreground-secondary`, `muted`, `muted-light`, `subtle`
  - 표면: `background`, `canvas`, `surface`, `surface-muted`
  - 테두리: `border`, `divider`
  - 상태: `positive`, `danger`, `disabled`
  - 오버레이: `scrim`
- 제품 코드에서는 `bg-primary`, `text-foreground-body`, `border-divider`처럼 역할 기반 Tailwind 클래스를 사용한다. HEX/RGB/HSL 직접 입력, Tailwind 기본 색상(`zinc`, `gray`, `red`, `blue` 등), 컴포넌트별 임의 색상 변수는 사용하지 않는다.
- 같은 색상값이어도 의미가 다르면 역할 토큰을 구분한다. 예를 들어 `accent`는 브랜드 CTA이고 `positive`는 성공·선택 상태다. 현재 값이 같다는 이유로 서로 바꾸어 쓰지 않는다.
- 중간 변수를 만들어 `--ds-foo: #000`을 `--color-foo: var(--ds-foo)`로 다시 감싸지 않는다. 다중 테마처럼 실제 요구사항이 생기기 전에는 `--color-*`에 값을 직접 정의한다.
- 기존 토큰으로 표현할 수 있으면 새 토큰을 만들지 않는다. 새 토큰은 Pen에 근거가 있고 둘 이상의 공용 컴포넌트에서 반복되는 역할일 때만 추가한다. 한 화면이나 한 컴포넌트만의 장식값은 해당 구현 가까이에 둔다.
- 토큰을 추가하거나 값을 바꿀 때는 같은 줄 오른쪽에 한국어 인라인 주석으로 구체적인 사용처를 작성한다. 예: `--color-divider: #dddddd; /* 카드·목록 내부의 1px 구분선 */`.
- 타이포그래피는 `text-display`, `text-card-title`, `text-heading`, `text-nav`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-hint` 중 의미가 맞는 클래스를 사용한다. 반복되는 역할에 `text-[15px]` 같은 임의값을 사용하지 않는다.
- 새 타이포그래피 토큰이 정말 필요하면 글자 크기와 `--text-이름--line-height`를 한 쌍으로 추가하고 둘 다 사용처를 주석으로 남긴다. 특정 화면의 장식용 글자 하나 때문에 전역 타이포그래피 토큰을 추가하지 않는다.
- 폰트는 `font-display`을 영문 워드마크·영문 레이블·날짜·숫자에, `font-heading`을 한글 헤드라인에, `font-app`을 일반 한글 본문과 컨트롤에 사용한다. 같은 역할에 다른 폰트를 임의로 지정하지 않는다.
- radius는 기존 `rounded-control-*`, `rounded-card`, `rounded-sheet`, `rounded-overlay`를 먼저 사용한다. Pen의 직각 요소에는 관성적으로 radius를 넣지 않으며, 새로운 radius 단계는 여러 공용 컴포넌트가 함께 필요할 때만 추가한다.
- `animate-summary-in`과 `animate-skeleton`은 현재 `IssueCard` 전용이다. 다른 컴포넌트에 이름만 보고 재사용하지 않는다. 새로운 애니메이션은 공용 동작일 때만 `tokens.css`에 추가하고, 그 외에는 해당 컴포넌트 가까이에 둔다.
- `className`으로 공용 컴포넌트의 색상·폰트·radius를 화면마다 덮어쓰지 않는다. Pen과 차이가 있으면 공용 토큰이나 공용 컴포넌트 variant를 수정해 모든 사용처가 함께 반영되게 한다.
- 주제 이름과 순서의 단일 원본은 `src/design-system/topics.ts`의 12종 분류다. 최신 Pen은 주제별 배경색 tone을 사용하지 않으므로 `sage`, `olive`, `moss`, `neutral` 같은 색상 분류를 다시 추가하지 않는다.
- 상호작용은 실제 버튼/링크와 명시적 콜백으로 연결한다. disabled는 시각적 투명도뿐 아니라 실제 입력 차단을 포함해야 한다. 선택 상태에는 `aria-pressed`, 알림에는 live region, 모달에는 접근 가능한 제목을 제공한다.
- `IssueCard`의 3줄 요약은 정확히 3개를 전달한다. `revealing` 상태는 500ms 후 200ms 간격으로 각 250ms 페이드인을 적용하고, 모션 감소 설정을 존중한다. 새 카드의 애니메이션을 재생할 때 카드 ID를 React `key`로 사용한다.
- `Toast`는 기본 1500ms 후 닫히는 controlled 컴포넌트다. 연속 알림은 알림 ID를 React `key`로 사용해 타이머를 새로 시작한다. 스와이프·API·라우팅 등 기능 동작은 소비하는 화면에서 연결한다.
- `BottomSheet`/`Dialog`는 네이티브 `<dialog>` 기반으로 포커스 이동·모달 접근성을 처리한다. 모달을 열 때에만 배경 스크롤을 잠근다. 취소와 닫힘 상태는 `onOpenChange`로 관리한다.
- `.pen`의 `_Marker`는 주석이므로 제품 UI로 구현하지 않는다. Status Bar와 Home Indicator는 `src/components/preview/device-chrome.tsx`의 디자인 참고용이며 실제 화면에는 추가하지 않는다. 실제 기기의 OS UI와 safe-area를 사용한다.
- 사용 예시는 `/components`에서 사용자가 직접 확인한다. 프로덕션에서는 이 경로가 404를 반환한다. 에이전트는 이를 열거나 화면 검증을 수행하지 않는다.

## 확인과 문서

- 변경에 맞춰 `npm run check`를 실행한다. 포맷·린트·프로덕션 빌드를 검사하며, 빌드는 TypeScript 검사도 포함한다. 타입만 확인할 때는 `npm run typecheck`를 사용한다.
- 화면 검증은 사용자가 직접 수행한다. 사용자가 별도로 요청하지 않는 한 브라우저 실행·조작, 스크린샷, 뷰포트별 렌더링 등 시각적 검증을 수행하지 않는다. 에이전트는 린트·타입 검사·빌드 등 코드 검증만 수행한다.
- 프로젝트 구조나 실행 방법이 바뀌면 `README.md`도 갱신한다.
- 에이전트 규칙의 단일 원본은 이 파일이다. `CLAUDE.md`는 `@AGENTS.md` 참조를 유지하며 규칙을 중복 작성하지 않는다.
- 아래 Next.js 자동 관리 블록을 유지한다. 프로젝트 규칙은 블록 밖에서 수정한다.

## 포맷과 Git 훅

- Prettier로 포맷을 통일한다. 2칸 들여쓰기, 큰따옴표, 세미콜론, LF 개행을 사용하며 Tailwind 클래스 순서는 플러그인에 맡긴다.
- 전체 자동 포맷은 `npm run format`, 전체 린트 자동 수정은 `npm run lint:fix`를 사용한다. ESLint 경고도 검사 실패로 취급한다.
- `npm ci` 또는 `npm install` 시 `prepare` 스크립트가 Husky 훅을 설정한다.
- `pre-commit`: lint-staged가 스테이징한 파일에 Prettier를 적용하고 JS/TS 파일에는 ESLint 자동 수정과 검사를 수행한다. 수정 결과는 커밋에 포함되므로 커밋 결과를 확인한다.
- `commit-msg`: commitlint가 Conventional Commits 형식을 검사한다.
- `pre-push`: `npm run check`로 전체 포맷·린트·타입·빌드를 검사한다. 실패하면 문제를 수정하고 다시 실행한다.
- `--no-verify`나 `HUSKY=0`으로 검사를 임의로 우회하지 않는다.

## 커밋과 푸시

- 커밋은 사용자가 요청한 범위에서 수행한다. 커밋 요청만으로 푸시까지 수행하지 않으며, 푸시는 사용자가 명시적으로 요청했을 때 수행한다.
- 커밋 메시지는 `type: 설명` 또는 `type(scope): 설명` 형식으로 작성한다. 설명은 한국어를 기본으로 하고 변경 결과를 구체적으로 적는다.
- 타입은 `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`를 사용한다. 제목은 100자 이내로 작성하고 끝에 마침표를 붙이지 않는다.
- 예: `feat: 모바일 공통 레이아웃 추가`, `fix(dev): 로컬 HMR 요청 허용`, `chore: 코드 품질 검사 설정`.
- 하나의 커밋은 하나의 논리적 변경 단위로 구성한다. 초기 프로젝트 구성처럼 함께 동작해야 하는 설정은 한 커밋에 묶을 수 있다.
- 커밋 전 변경 파일과 스테이징 내용을 확인한다. 비밀값, `.env` 실파일, `node_modules`, 빌드 결과는 커밋하지 않는다.
- 푸시 전 현재 브랜치·원격 저장소·전송할 커밋을 확인하고 대상 브랜치를 명시한다. 최초 푸시는 `git push -u origin <브랜치>`를 사용한다.
- 원격 변경으로 푸시가 거절되면 먼저 변경 내용을 확인한다. 강제 푸시, 기존 커밋 수정, 브랜치 삭제는 명시적 요청 없이 수행하지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

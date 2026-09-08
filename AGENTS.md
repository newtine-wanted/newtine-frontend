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
- 현재는 라이트 테마의 빈 초기 화면이다. 샘플 UI, 임의의 메뉴, 다크 모드, PWA 설정은 요청이나 기능 요구사항이 있을 때 추가한다.

## 기술 스택과 코드

- Next.js App Router와 TypeScript를 사용한다. `strict` 설정을 유지하고 불필요한 `any`를 피한다.
- 스타일링은 Tailwind CSS 4 유틸리티를 우선 사용한다. 공통 디자인 토큰은 `globals.css`의 `@theme`에서 관리하고, 별도의 스타일 라이브러리를 임의로 추가하지 않는다.
- 전역 클라이언트 상태는 Zustand, API 통신은 Axios를 사용한다. 실제 기능에 필요한 시점에 스토어와 공통 API 클라이언트를 추가한다.
- 지역 상태는 컴포넌트 내부에서 관리한다. Zustand 스토어에 서버 요청 간 공유되는 사용자 상태를 저장하지 않는다.
- Server Component를 기본으로 유지하고, 상태·이벤트·브라우저 API가 필요한 최소 경계에만 `"use client"`를 지정한다.
- 소스는 `src/` 아래에 두고 `@/*` 별칭을 사용한다. 현재 규모에 맞게 구성하며 사용하지 않는 추상화나 예제 코드를 추가하지 않는다.
- 패키지 관리자는 npm이다. 의존성을 변경할 때 `package-lock.json`을 함께 갱신한다. Node.js 버전은 `.nvmrc`를 따른다.

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

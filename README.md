# Newtine Frontend

Next.js App Router 기반 프런트엔드 프로젝트입니다.

## 개발 환경

- Node.js 24 LTS (`.nvmrc` 참고)
- npm
- Next.js 16.3.4 / React 19.2.8
- TypeScript / Tailwind CSS 4 / ESLint
- Zustand (전역 상태 관리) / Axios (API 통신)
- Prettier / Husky / lint-staged / commitlint

## 시작하기

```bash
git clone https://github.com/newtine-wanted/newtine-frontend.git
cd newtine-frontend
nvm use
npm ci
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다. 기본 샘플 화면을 제거한 상태이므로 빈 화면이 표시됩니다.
첫 화면은 `src/app/page.tsx`, 공통 레이아웃은 `src/app/layout.tsx`에서 수정합니다.
`@/*` 경로 별칭은 `src/*`를 가리킵니다.

## 명령어

```bash
npm run dev          # 개발 서버 (Turbopack)
npm run lint         # ESLint 검사 (경고도 실패 처리)
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 및 Tailwind 클래스 정렬
npm run format:check # 포맷 검사
npm run typecheck    # Next.js 라우트 타입 생성 및 TypeScript 검사
npm run build        # 프로덕션 빌드 및 타입 검사
npm run check        # 포맷 → 린트 → 빌드 (타입 검사 포함)
npm start            # 빌드된 프로덕션 서버 실행
```

스타일은 Tailwind CSS의 `className` 유틸리티로 작성합니다.
`src/app/globals.css`에는 Tailwind import와 공통 레이아웃 토큰을 관리합니다. 샘플 폰트·이미지는 제거했습니다.
Zustand와 Axios는 설치되어 있으며, 스토어와 API 설정은 기능 구현 시 추가합니다.

## 모바일 레이아웃

- 모바일에서는 전체 너비, 큰 화면에서는 최대 480px 너비로 중앙 정렬합니다.
- 최대 너비는 `src/app/globals.css`의 `--container-app`에서 변경합니다.
- `min-h-dvh`로 화면 높이를 채우고, 긴 콘텐츠는 문서 전체에서 세로 스크롤합니다.
- 공통 컨테이너가 노치·홈 인디케이터 안전 영역을 처리합니다.
- 루트 레이아웃에서 `<main>`을 제공하므로 각 페이지에는 콘텐츠만 작성합니다.
- 프로젝트 개발 규칙은 `AGENTS.md`에서 관리하며, `CLAUDE.md`도 같은 파일을 참조합니다.

## 커밋과 푸시

`npm ci` 또는 `npm install` 시 Husky 훅이 자동으로 등록됩니다.

| 시점                | 자동 실행                                                      |
| ------------------- | -------------------------------------------------------------- |
| 커밋 전             | 스테이징한 파일의 Prettier 포맷, JS/TS 파일의 ESLint 수정·검사 |
| 커밋 메시지 작성 후 | commitlint로 Conventional Commits 형식 검사                    |
| 푸시 전             | 전체 포맷·린트·프로덕션 빌드 검사 (타입 검사 포함)             |

커밋 메시지는 `type: 설명` 또는 `type(scope): 설명`으로 작성합니다. 설명은 한국어를 기본으로 하며 제목은 100자 이내, 끝에 마침표 없이 작성합니다.

```bash
git add <변경한 파일>
git commit -m "feat: 모바일 공통 레이아웃 추가"
git push -u origin <브랜치>
```

사용 가능한 타입과 에이전트의 커밋·푸시 규칙은 [AGENTS.md](./AGENTS.md)에 정리되어 있습니다.
검사가 실패하면 오류를 수정한 뒤 다시 실행합니다. 훅에서 자동 수정된 파일은 커밋에 함께 포함됩니다.
화면 검증은 개발자가 직접 수행합니다.

## 참고

- [Next.js 공식 문서](https://nextjs.org/docs)
- [저장소](https://github.com/newtine-wanted/newtine-frontend)
- [Husky 공식 문서](https://typicode.github.io/husky/get-started.html)
- [Prettier 공식 문서](https://prettier.io/docs/install)

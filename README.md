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

API 요청은 Next.js의 `/api/*` 프록시를 통해 전달됩니다. API 서버 주소는 프로젝트 루트의 커밋되지 않는 `.env`에서 관리합니다.

[http://localhost:3000](http://localhost:3000)에서 앱을 확인할 수 있습니다. 기본 샘플 화면을 제거한 상태이므로 빈 화면이 표시됩니다.
첫 화면은 `src/app/page.tsx`, 공통 레이아웃은 `src/app/layout.tsx`에서 수정합니다.
`@/*` 경로 별칭은 `src/*`를 가리킵니다.

## 코드 구조

Pen의 화면 그룹은 온보딩, 피드, 이슈 상세 시트, 마이페이지, 진단보고서의 다섯 사용자 흐름으로 봅니다. 화면 이름을 그대로 라우트로 만들기보다 다음 책임으로 나눕니다.

```text
src/
├── app/              # URL 진입점, 레이아웃, 기능 조합
├── components/ui/    # 제품 의미를 모르는 공용 UI
├── domain/           # 여러 기능이 공유하는 제품 개념과 도메인 UI
├── features/         # onboarding, feed, issue-detail, my-page, report
└── lib/              # 도메인과 무관한 유틸리티와 기반 코드
```

- `app`의 `page.tsx`는 라우팅과 기능 조합만 담당합니다.
- 여러 화면에서 공유하는 제품 개념은 `domain`, 한 흐름에만 필요한 상태·API·컴포넌트는 `features`에 둡니다.
- `components/ui`에는 도메인 데이터나 제품 문구를 넣지 않습니다.
- `features` 아래의 폴더와 `api`, `store`, `types` 파일은 실제 구현이 생길 때만 추가합니다.
- 상세 화면은 별도 페이지가 아니라 피드와 관심 뉴스 목록에서 공유하는 이슈 상세 시트 기능으로 다룹니다.

## 로그인과 토큰 관리

### 인증 API

API 경로는 `API_BASE_URL`을 제외한 상대 경로만 코드와 문서에 작성합니다. 모든 요청은 Next.js의 `/api/*` 프록시를 거쳐 전달됩니다.

| 용도             | 메서드와 경로            | 요청값              | 성공 응답               |
| ---------------- | ------------------------ | ------------------- | ----------------------- |
| 이메일 로그인    | `POST /api/auth/login`   | `email`, `password` | `AuthSessionResponse`   |
| 세션 갱신        | `POST /api/auth/refresh` | 없음                | `AuthSessionResponse`   |
| 로그아웃         | `POST /api/auth/logout`  | 없음                | `204 No Content`        |
| 온보딩 상태 조회 | `GET /api/me/onboarding` | 없음                | `OnboardingStateResult` |

API 타입은 전달받은 OpenAPI JSON의 `components.schemas`를 `src/domain/auth/types.ts`에 수동 반영합니다. 로그인과 세션 갱신은 다음 형태의 동일한 응답을 사용합니다.

```ts
interface AuthSessionResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: "ADMIN" | "USER";
  };
}
```

### 로그인 흐름

1. 로그인 폼에서 이메일과 비밀번호를 검증합니다.
2. `POST /api/auth/login`을 호출합니다.
3. 성공 응답의 액세스 토큰과 사용자 정보를 메모리 전용 Zustand 스토어에 저장합니다.
4. 저장된 액세스 토큰으로 `GET /api/me/onboarding`을 호출합니다.
5. 온보딩 상태가 `PENDING`이면 `/onboarding`, `COMPLETED` 또는 `SKIPPED`이면 `/`로 이동합니다.

로그인 성공과 온보딩 조회는 별개의 단계입니다. 로그인이 성공한 뒤 온보딩 조회가 실패하면 인증 실패 메시지로 바꾸지 않고, 사용자 상태를 불러오지 못했다는 별도의 오류를 표시합니다.

### 앱 시작 시 세션 복구

루트 레이아웃의 `AuthSessionProvider`가 클라이언트에서 한 번 `POST /api/auth/refresh`를 호출합니다.

- 유효한 리프레시 쿠키가 있으면 새로운 `AuthSessionResponse`를 메모리에 저장하고 인증 상태를 `authenticated`로 변경합니다.
- 쿠키가 없거나 만료됐으면 인증 정보를 비우고 상태를 `guest`로 변경합니다.
- 초기 복구 도중 로그인 또는 로그아웃 상태가 바뀌면 이전 복구 응답이 새로운 세션을 덮어쓰지 않도록 세션 revision을 비교합니다.

### 토큰 저장 위치와 사용 방법

| 값              | 저장 위치                     | 프런트엔드 접근           | 용도                            |
| --------------- | ----------------------------- | ------------------------- | ------------------------------- |
| 액세스 토큰     | 메모리 전용 Zustand 스토어    | 가능                      | 보호 API의 `Authorization` 헤더 |
| 리프레시 토큰   | 백엔드가 설정한 브라우저 쿠키 | 직접 읽거나 저장하지 않음 | 액세스 토큰 재발급              |
| 이메일·비밀번호 | 저장하지 않음                 | 로그인 요청 중에만 사용   | 사용자 인증                     |

액세스 토큰은 `localStorage`, `sessionStorage` 또는 프런트엔드에서 생성한 쿠키에 저장하지 않습니다. 새로고침하면 메모리의 액세스 토큰은 사라지며, 리프레시 쿠키를 이용해 세션을 다시 복구합니다.

Axios 공용 클라이언트에는 `withCredentials: true`가 설정되어 있어 브라우저 쿠키가 필요한 요청에 포함됩니다. 인증 인터셉터는 세션에 액세스 토큰이 있고 호출부에서 `Authorization`을 직접 지정하지 않은 경우 다음 헤더를 자동으로 추가합니다.

```http
Authorization: Bearer <accessToken>
```

새로운 보호 API를 연결할 때는 컴포넌트가 아니라 해당 도메인 또는 기능의 `api.ts`에서 공용 `apiClient`를 사용합니다. 토큰 헤더는 직접 조립하지 않습니다.

```ts
import { apiClient } from "@/lib/api-client";

export async function getExample() {
  const response = await apiClient.get<ExampleResponse>("/api/example");
  return response.data;
}
```

### 액세스 토큰 만료와 자동 갱신

보호 API가 `401`을 반환하면 인증 인터셉터가 다음 순서로 처리합니다.

1. `POST /api/auth/refresh`를 호출합니다.
2. 새 액세스 토큰을 메모리 세션에 저장합니다.
3. 실패했던 요청의 `Authorization` 헤더를 교체합니다.
4. 원래 요청을 한 번만 재시도합니다.

동시에 여러 요청이 `401`을 반환해도 리프레시 요청은 하나만 보내고 결과를 공유합니다. 리프레시가 실패하거나 재시도도 `401`이면 세션을 만료 상태로 변경하고 `/login`으로 이동합니다. 로그인·로그아웃·리프레시 요청 자체는 자동 갱신 대상에서 제외해 무한 재시도를 방지합니다.

현재 `expiresIn`은 응답 타입으로 보관하지만 사전 갱신 타이머에는 사용하지 않습니다. 토큰 갱신은 앱 시작과 보호 API의 `401` 응답을 기준으로 수행합니다.

### 로그아웃

`POST /api/auth/logout`이 성공한 뒤에만 메모리의 액세스 토큰과 사용자 정보를 제거합니다. 서버 로그아웃이 실패하면 로컬 세션을 유지하고 오류를 호출부에 전달해, 서버의 리프레시 쿠키가 남아 있는데 화면만 로그아웃된 것처럼 보이는 상태를 방지합니다.

### 인증 관련 코드 경로

| 경로                                    | 책임                                       |
| --------------------------------------- | ------------------------------------------ |
| `src/lib/api-client.ts`                 | 도메인과 무관한 Axios 공용 설정            |
| `src/domain/auth/api.ts`                | 로그인·갱신·로그아웃·온보딩 API 호출       |
| `src/domain/auth/types.ts`              | OpenAPI 기반 요청·응답 타입                |
| `src/domain/auth/store.ts`              | 메모리 전용 인증 세션과 상태               |
| `src/domain/auth/session.ts`            | 세션 저장·복구·갱신·로그아웃 흐름          |
| `src/domain/auth/interceptors.ts`       | 액세스 토큰 주입과 `401` 자동 복구         |
| `src/features/auth-session/`            | 앱 시작 시 세션 복구와 만료 시 로그인 이동 |
| `src/features/login/use-email-login.ts` | 로그인 폼의 인증·온보딩 분기 흐름          |

리프레시 API 명세에는 요청 본문과 별도 리프레시 토큰 타입이 없습니다. 현재 구현은 백엔드가 로그인 성공 시 리프레시 토큰 쿠키를 설정하고 갱신·로그아웃 요청에서 해당 쿠키를 사용한다는 전제입니다. 쿠키 이름과 `HttpOnly`, `Secure`, `SameSite`, `Path` 속성은 OpenAPI JSON에 명시되어 있지 않으므로 백엔드 설정을 별도로 확인해야 합니다.

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
`src/app/globals.css`에는 Tailwind import, 공용 색상, 폰트 크기를 관리합니다. 샘플 폰트·이미지는 제거했습니다.
Zustand와 Axios는 설치되어 있으며, 스토어와 API 설정은 기능 구현 시 추가합니다.

## 모바일 레이아웃

- 페이지 배경은 화면 전체에 동일하게 적용하고, 실제 콘텐츠만 큰 화면에서 최대 480px 너비로 중앙 정렬합니다.
- 콘텐츠 최대 너비는 `src/app/layout.tsx`에서 변경합니다.
- `min-h-dvh`로 화면 높이를 채우고, 긴 콘텐츠는 문서 전체에서 세로 스크롤합니다.
- 공통 레이아웃이 노치·홈 인디케이터 안전 영역을 처리합니다.
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

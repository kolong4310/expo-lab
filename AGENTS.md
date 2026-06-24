# 프로젝트 작업 규칙

## 적용 범위

- 이 저장소는 React Native, Expo, TypeScript 앱 개발을 기준으로 한다.
- 작업 전 요청과 관련된 설정, 화면, 컴포넌트, 타입, 네비게이션, 테스트 파일을 먼저 읽는다.
- 기존 앱 구조와 동작을 우선 보존한다.
- 이 파일의 규칙은 저장소 전체에 적용한다. 하위 디렉터리에 별도 `AGENTS.md`가 있으면 해당 범위에서 그 지침도 함께 적용한다.

## Expo 기준

- Expo 기준 버전은 `package.json`에 선언된 SDK를 우선한다.
- 현재 프로젝트는 `expo: ~54.0.0`이므로 Expo SDK 54 공식 문서(https://docs.expo.dev/versions/v54.0.0/)를 기준으로 구현한다.
- 기존 Expo SDK 56 지침은 현재 의존성과 충돌하므로 적용하지 않는다.
- Expo 또는 React Native 버전을 변경하는 작업은 일반 기능 구현과 분리하고, 영향과 마이그레이션 근거를 먼저 제시한다.

## 작업 방식

- 바로 수정하지 말고 먼저 짧은 작업 계획을 제시한다.
- 큰 변경은 독립적으로 검증 가능한 작은 단계로 나눈다.
- 기존 동작을 깨뜨릴 수 있는 변경은 사전에 이유, 영향 범위, 대안을 설명한다.
- 요청 범위를 벗어난 정리나 대규모 리팩터링을 수행하지 않는다.
- 불필요한 라이브러리 추가를 피한다. 새 패키지가 필요하면 기존 도구로 해결할 수 없는 이유, 선택 근거, 번들 및 유지보수 영향을 먼저 제시한다.
- 민감정보, API 키, 토큰, 인증서, `.env` 값을 코드나 문서에 직접 넣지 않는다.

## 기본 작업 오케스트레이션

- 사용자의 요청을 먼저 기능 구현, 버그 진단·수정, 리팩터링, QA, 릴리스 점검, 문서 작업 또는 Git 정리로 분류한다.
- 분류 후 `workflow-orchestrator`와 해당 전문 skill을 선택하고 필요한 역할만 순서대로 적용한다.
- 기능 또는 화면 구현은 관련 skill → planner → implementer → reviewer → qa-tester → git-commit-helper 순서를 기본으로 한다.
- 버그 진단만 요청하면 bug-fix-helper → planner 순서로 조사하며 코드를 수정하지 않는다.
- 버그 수정을 요청하면 bug-fix-helper → planner → implementer → reviewer → qa-tester → git-commit-helper 순서를 적용한다.
- 리팩터링은 refactor-helper → planner → implementer → reviewer → qa-tester → git-commit-helper 순서를 적용한다.
- QA는 qa-checker → qa-tester, 릴리스 점검은 release-checker → release-manager 순서를 적용하며 코드를 수정하지 않는다.
- 문서 검토는 doc-writer만 사용하며 수정하지 않는다. 문서 작성·갱신은 doc-writer 후 필요한 경우 implementer와 reviewer를 적용한다.
- 단순하거나 영향이 작은 작업은 불필요한 역할을 생략할 수 있으며 생략 이유를 결과에 기록한다.
- 변경이 없으면 git-commit-helper를 생략한다.
- custom agent 실행이 지원되고 사용자가 agent 위임을 명시한 경우 해당 agent를 사용한다. 그렇지 않으면 주 에이전트가 동일한 역할 규칙을 순차적으로 적용한다.
- planner, reviewer, qa-tester 및 read-only 요청은 절대 파일을 수정하지 않는다.
- implementer는 사용자가 변경을 요청한 경우에만 최소 범위로 구현한다.
- git-commit-helper는 상태와 diff를 정리하고 메시지만 제안한다. 명시적 승인 전에는 stage 또는 commit하지 않는다.

## React Native / Expo / TypeScript

- 타입 안정성을 우선하고 `any` 사용을 피한다. 불가피하면 범위를 최소화하고 이유를 남긴다.
- 현재 라우팅, 상태관리, 스타일 패턴을 확인한 뒤 구현한다.
- 화면 작업은 UI, 상태관리, 네비게이션, 데이터 흐름 순서로 점검한다.
- 빈 상태, 로딩 상태, 오류 상태와 뒤로가기 및 재진입 동작을 고려한다.
- 임시 mock 데이터와 실제 API 연동 코드를 명확히 구분하고 교체 지점을 표시한다.
- 플랫폼별 차이가 있으면 Android와 iOS 영향을 각각 확인한다.

## 검증 및 보고

- 프로젝트에 정의된 typecheck, lint, test, build 명령을 우선 사용한다.
- 작업 후 변경 파일 목록, 테스트 방법, 실행한 검증, 남은 리스크를 정리한다.
- 실행하지 못한 검증은 성공한 것처럼 표현하지 않고 이유를 명시한다.

## Git

- Git 관련 지침이 다른 문서, 프로젝트 메모 또는 자동화 스크립트와 충돌하면 이 파일의 사용자 승인 규칙을 최우선으로 적용한다.
- 커밋 메시지는 한국어로 작성한다.
- 하나의 커밋에는 하나의 의도만 담는다.
- 커밋 전에 `git status`와 `git diff`를 확인하고 관련 없는 파일을 포함하지 않는다.
- 사용자의 명시적 승인 전에는 커밋하지 않는다.
- 사용자가 명시하기 전에는 push하지 않는다.
- `push.js`처럼 stage, commit, push를 연속 수행하는 스크립트도 사용자가 해당 작업을 명시적으로 승인한 뒤에만 실행한다.

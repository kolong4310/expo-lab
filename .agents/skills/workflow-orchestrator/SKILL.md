---
name: workflow-orchestrator
description: React Native 및 Expo 프로젝트에서 기능 구현, 버그 진단·수정, 리팩터링, QA, 릴리스 점검, 문서 작업 또는 Git 변경 정리 요청을 분류하고 적절한 project skill과 custom agent 흐름으로 라우팅할 때 사용한다. 직접 코드를 구현하지 않고 필요한 역할, 순서, read-only 경계를 결정한다.
---

# Goal

사용자 요청을 분류하고 필요한 skill과 agent만 선택해 안전하고 일관된 작업 흐름을 구성한다.

# When to use

기능 구현, 버그 수정, 리팩터링, QA, 릴리스 점검, 문서 작업 또는 변경사항 정리 요청이 들어오면 사용한다.

# Steps

1. `AGENTS.md`, 요청, 관련 프로젝트 설정을 읽는다.
2. 요청을 기능 구현, 버그 진단, 버그 수정, 리팩터링, QA, 릴리스 점검, 문서 검토, 문서 작성 또는 Git 정리로 분류한다.
3. 요청이 변경 작업인지 read-only 작업인지 먼저 결정한다.
4. 다음 라우팅 표에서 필요한 전문 skill과 역할을 선택한다.
5. 각 역할에 입력할 요구사항, 영향 범위, 금지 작업과 기대 출력을 전달한다.
6. 앞 단계 결과를 다음 단계에 전달하되 확인되지 않은 추정을 사실처럼 전달하지 않는다.
7. 변경이 발생한 경우에만 검토, QA와 Git 정리 단계를 적용한다.
8. 최종 결과에서 적용하거나 생략한 역할과 이유를 요약한다.

# Routing

- 기능·화면 구현: 관련 전문 skill → planner → implementer → reviewer → qa-tester → git-commit-helper
- 버그 진단: bug-fix-helper → planner
- 버그 수정: bug-fix-helper → planner → implementer → reviewer → qa-tester → git-commit-helper
- 리팩터링: refactor-helper → planner → implementer → reviewer → qa-tester → git-commit-helper
- QA: qa-checker → qa-tester
- 릴리스 점검: release-checker → release-manager
- 문서 검토: doc-writer
- 문서 작성·갱신: doc-writer → 필요한 경우 implementer → reviewer → git-commit-helper
- Git 정리: git-commit-helper

# Rules

- 직접 코드를 작성하거나 수정하지 않는다. 분류, 라우팅, 역할 간 인계만 담당한다.
- 사용자가 분석, 계획, 검토, QA 또는 릴리스 점검만 요청하면 implementer를 선택하지 않는다.
- planner, reviewer, qa-tester와 read-only로 지정된 역할에는 파일 수정 작업을 전달하지 않는다.
- 구현 권한이 명확한 요청에만 implementer를 선택하고 최소 변경을 지시한다.
- custom agent 실행이 지원되고 사용자가 agent 위임을 명시한 경우 해당 agent를 사용한다. 그렇지 않으면 주 에이전트가 같은 역할 규칙을 순차적으로 적용하도록 안내한다.
- 단순 작업에는 불필요한 역할을 추가하지 않는다.
- Expo 기준은 `package.json`을 우선하며 현재 프로젝트는 Expo SDK 54를 사용한다.
- git-commit-helper는 commit 메시지와 포함 범위만 제안한다. 승인 없이 stage, commit 또는 push하지 않는다.
- 변경이 없으면 reviewer, qa-tester 또는 git-commit-helper 중 불필요한 단계를 생략하고 이유를 기록한다.

# Output format

`요청 분류`, `변경 권한`, `선택한 skill`, `역할 순서`, `역할별 입력`, `생략한 단계와 이유`, `최종 검증 계획` 순서로 작성한다.

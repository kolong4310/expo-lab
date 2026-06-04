# "오늘 뭐 했지?" 앱 구조 제안

## 1. 폴더 구조 (Simple & Scalable)
```text
my-expo-app/
├── src/
│   ├── components/      # 공통 UI 컴포넌트 (버튼, 카드 등)
│   ├── screens/         # 주요 화면 (목록, 작성, 상세, 검색)
│   ├── database/        # SQLite 설정 및 쿼리 관리
│   ├── types/           # TypeScript 타입 정의
│   └── hooks/           # 비즈니스 로직 (데이터 가져오기 등)
├── App.tsx              # 엔트리 포인트 (네비게이션 설정)
└── push.js              # 자동 푸시 스크립트
```

## 2. 주요 화면 및 파일 구성
- **Home.tsx (첫 화면)**: 날짜별 업무 로그 리스트 표시.
- **Write.tsx (작성 화면)**: 오늘 한 일, 배운 것 등 입력 폼.
- **Detail.tsx (상세 화면)**: 기록된 내용 상세 보기 및 삭제/수정.
- **Search.tsx (검색 화면)**: 키워드로 과거 기록 검색.

## 3. 데이터 모델 (SQLite)
- `id`: 고유 ID
- `title`: 제목 (오늘 한 일 요약)
- `content`: 상세 내용 (한 일, 배운 것 등 통합 또는 분리)
- `issue`: 이슈 사항
- `solution`: 해결 방법
- `memo`: 메모
- `date`: 작성 날짜 (ISO 형식)

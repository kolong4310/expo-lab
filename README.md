# 🌱 Tiny Growth

> 매일의 작은 기록을 모아 나만의 성장 흐름을 만드는 로컬 성장 기록 앱

**Tiny Growth**는 하루 동안 한 일, 배운 것, 이슈, 해결 방법, 메모, 목표 달성 여부를 기록하고 돌아볼 수 있는 React Native 기반 모바일 앱입니다.

반복 목표와 오늘만 목표를 나누어 관리할 수 있고, 기록은 캘린더·검색·리포트 화면을 통해 다시 확인할 수 있습니다.

---

## ✨ Features

### 📝 Daily Growth Log

오늘 한 일, 배운 점, 이슈, 해결 방법, 메모를 기록할 수 있습니다.

* 오늘의 기록 작성
* 기록 수정 및 삭제
* 상세 화면에서 기록 확인
* 날짜별 기록 관리

---

### ✅ Goal Management

매일 반복되는 목표와 오늘만 필요한 목표를 분리해서 관리합니다.

* 반복 목표 등록
* 날짜별 목표 체크
* 오늘만 목표 추가
* 완료 / 미완료 상태 관리

---

### 📅 Archive

날짜별로 작성한 성장 기록을 확인할 수 있습니다.

* 캘린더 기반 기록 조회
* 특정 날짜의 기록 확인
* 과거 기록 회고

---

### 🔍 Search

작성한 기록을 키워드로 검색할 수 있습니다.

* 기록 내용 검색
* 태그 기반 탐색
* 상세 화면 이동

---

### 📊 Report

기록 데이터를 기반으로 성장 흐름을 확인합니다.

* 이번 달 기록 수
* 이번 주 기록 수
* 연속 기록 일수
* 최근 7일 목표 완료율
* 태그 통계
* 기분 통계
* 월별 기록 그래프
* 성장 인사이트 문장

---

## 🧱 Tech Stack

| Category   | Tech                 |
| ---------- | -------------------- |
| Framework  | Expo SDK 54          |
| Mobile     | React Native         |
| Language   | TypeScript           |
| Database   | SQLite / expo-sqlite |
| Navigation | React Navigation     |
| Build      | EAS Build            |
| Platform   | Android 중심 테스트       |

---

## 📱 Screens

| Screen   | Description            |
| -------- | ---------------------- |
| Today    | 오늘의 기록과 목표를 관리하는 메인 화면 |
| Write    | 성장 기록 작성 / 수정 화면       |
| Detail   | 기록 상세 확인 화면            |
| Archive  | 날짜별 기록 확인 화면           |
| Search   | 기록 검색 화면               |
| Report   | 통계와 성장 인사이트 화면         |
| Settings | 언어 및 앱 설정 화면           |

---

## 🗂 Project Structure

```txt
expo-lab/
├── app/
│   └── Expo Router / navigation entry files
├── src/
│   ├── components/
│   ├── database/
│   │   ├── migrations/
│   │   └── repositories/
│   ├── screens/
│   ├── theme/
│   ├── translations/
│   └── types/
├── app.json
├── eas.json
├── package.json
└── README.md
```

---

## 🗄 Database

Tiny Growth는 로컬 SQLite를 사용합니다.

앱의 주요 데이터는 사용자의 기기 안에 저장되며, 별도의 계정 로그인이나 서버 동기화 없이 동작합니다.

### Migration Structure

```txt
src/database/migrations/
├── 001_initialSchema.ts
├── 002_addLogMetadataFields.ts
├── 003_addTodayOnlyGoalFields.ts
├── index.ts
├── types.ts
└── utils.ts
```

### Main Tables

| Table             | Description     |
| ----------------- | --------------- |
| logs              | 성장 기록 데이터       |
| goal_templates    | 반복 목표 템플릿       |
| daily_goal_checks | 날짜별 반복 목표 체크 상태 |
| today_only_goals  | 오늘만 사용하는 일회성 목표 |
| schema_migrations | DB 마이그레이션 실행 이력 |

---

## 🎨 Design Concept

Tiny Growth는 작은 성장을 부담 없이 기록할 수 있도록 밝고 부드러운 디자인을 지향합니다.

* Light mode first
* Pastel tone
* Soft cards
* Rounded UI
* Calm and friendly mood
* Simple daily flow

---

## 🌍 Language

앱 내 다국어 구조를 지원합니다.

현재 번역 리소스는 다음 언어 기준으로 관리됩니다.

* 한국어
* 영어
* 일본어
* 중국어

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npx expo start
```

### 3. Run on Android

```bash
npx expo run:android
```

또는 Expo 개발 서버에서 Android 기기로 실행할 수 있습니다.

---

## 📦 Build

### Android Preview Build

```bash
npm run build:android:preview
```

### Android Production Build

```bash
npm run build:android:production
```

---

## 🔐 Privacy

Tiny Growth는 사용자의 기록을 로컬 기기에 저장하는 방식으로 설계되었습니다.

* 계정 로그인 없음
* 외부 서버 전송 없음
* 로컬 SQLite 저장
* 앱 삭제 시 로컬 데이터가 함께 삭제될 수 있음
* 현재 버전 기준 백업 / 동기화 기능 없음

---

## 🧭 Roadmap

* [x] 오늘 기록 작성
* [x] 기록 수정 / 삭제
* [x] 반복 목표 관리
* [x] 오늘만 목표 관리
* [x] 날짜별 기록 조회
* [x] 검색 기능
* [x] 리포트 통계
* [x] 성장 인사이트
* [x] 다국어 설정
* [x] Android Preview APK 테스트
* [ ] Play Console 등록
* [ ] 스토어 스크린샷 정리
* [ ] 개인정보처리방침 공개
* [ ] 정식 배포

---

## 🧪 Development Notes

이 프로젝트는 개인 학습과 실제 출시 경험을 함께 쌓기 위한 Expo 기반 모바일 앱 프로젝트입니다.

주요 목표는 다음과 같습니다.

* React Native 앱 구조 학습
* SQLite 기반 로컬 데이터 관리
* 모바일 UX 흐름 개선
* EAS Build 기반 Android 배포 경험
* 작은 앱을 실제 출시 단계까지 완성

---

## 📌 Repository

```txt
https://github.com/kolong4310/expo-lab
```

---

## 👤 Author

**뚝딱 김**

* GitHub: `@kolong4310`
* Email: `kolong4310@gmail.com`

---

## 📄 License

This project is licensed under the MIT License.

# 🏠 싸이월드 감성 미니룸 꾸미기 (Miniroom Maker)

[![English](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.md)

Next.js와 TypeScript로 구현한 **드래그 앤 드롭 방 꾸미기** 프로젝트입니다.
추억의 싸이월드 감성을 살려 나만의 미니룸을 꾸며보세요!

🔗 **데모 사이트 (Live Demo)**: [https://miniroom-demo.vercel.app](https://miniroom-demo.vercel.app)

>### v1.8.0 (2026-01-09)
- **모바일 반응형 디자인**: 모바일 화면에서 세로 레이아웃(캔버스 상단, 인벤토리 하단) 자동 전환
- **반응형 캔버스**: 화면 너비에 맞춰 룸 캔버스가 자동으로 크기 조절
- **인벤토리 최적화**: 모바일 환경에서 인벤토리가 하단에 배치되어 사용성 개선

>### v1.7.0 (2026-01-09)
> *   **Tight Bounding Box**: 이미지의 투명 여백을 제외한 실제 콘텐츠 영역이 선택됩니다.
> *   **Scalable Selection**: 확대/축소 시에도 선택 박스와 툴바가 깨지지 않습니다.
> *   **Boundary Collision**: 아이템 크기를 줄여도 벽에 딱 붙여서 배치할 수 있습니다.

![Miniroom Demo](public/miniroom-preview.png)

## ✨ 주요 기능

*   **🖱️ 드래그 앤 드롭 (Drag & Drop)**: 인벤토리에서 아이템을 꺼내 원하는 위치에 자유롭게 배치할 수 있습니다.
*   **🎨 픽셀 아트 스타일 (Pixel Art)**: 고품질 픽셀 아트로 제작된 가구(의자, 테이블 등)를 제공합니다.
*   **🛠️ 아이템 변형 (Transformation)**:
    *   **회전 (Rotate)**: 선택된 아이템을 시계 방향으로 90도씩 회전시킵니다.
    *   **반전 (Flip)**: 좌우 대칭으로 반전시킬 수 있습니다.
    *   **크기 조절 (Resize)**: 툴바의 `+`, `-` 버튼으로 아이템 크기를 조절합니다 (0.5배 ~ 2.0배).
    *   **순서 변경 (Ordering)**: `⬆` (앞으로), `⬇` (뒤로) 버튼으로 아이템 겹침 순서를 조정합니다.
*   **💾 아이템 관리 & 자동 저장**:
    *   **정교한 선택**: 이미지의 실제 모양(투명도 기반)에 맞춰 선택 영역이 잡힙니다.
    *   **삭제**: 더블 클릭하거나 선택 후 삭제 버튼을 눌러 제거합니다.
    *   **자동 저장**: 변경 사항은 실시간으로 자동 저장됩니다 (Simulation).

## 🛠️ 기술 스택 (Tech Stack)

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Deploy**: Vercel (CI/CD Automated)

## 🚀 실행 방법 (Getting Started)

로컬 환경에서 프로젝트를 실행하려면 다음 단계를 따르세요.

1.  **저장소 복제 (Clone)**
    ```bash
    git clone https://github.com/WoojinAhn/miniroom-demo.git
    cd miniroom-demo
    ```

2.  **패키지 설치**
    ```bash
    npm install
    ```

3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

4.  **브라우저 확인**
    `http://localhost:3000`으로 접속하여 확인합니다.

## 🎨 아이템 추가 방법 (Adding New Items)

`public/items/` 폴더에 이미지를 추가하고 푸시하면 **자동으로 인벤토리에 등록**됩니다!

1. 이미지를 `public/items/`에 추가 (PNG 권장)
2. 파일명은 `snake_case` 사용 (예: `shin_ramen.png`)
3. 커밋 & 푸시
4. 빌드 시 자동으로 인벤토리에 반영! 🎉

## 🌟 스페셜 아이템 추가 (Special Items)

`public/special/` 폴더에 이미지를 추가하면 **상단 스페셜 섹션**에 별도로 표시됩니다.

1. 이미지를 `public/special/`에 추가 (예: `rocket.png`)
2. 자동으로 'Special Items' 카테고리로 분류되어 인벤토리 최상단에 노출됩니다.



## 📂 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx               # 메인 페이지 (미니룸)
│   └── miniroom/
│       ├── components/        # UI 컴포넌트
│       │   ├── RoomCanvas.tsx     # 메인 캔버스
│       │   ├── DraggableItem.tsx  # 개별 아이템 (드래그/회전 로직)
│       │   └── Inventory.tsx      # 아이템 목록
│       └── hooks/
│           └── useMiniroom.ts     # 핵심 로직 (상태 관리, 이동, 삭제)
├── types/                     # 타입 정의 (Room, Item, Transformation)
└── data/                      # 목업 데이터 (초기 아이템 등)
```

## 📝 라이선스

MIT License

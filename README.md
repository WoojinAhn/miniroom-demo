# 🏠 싸이월드 감성 미니룸 꾸미기 (Miniroom Maker)

Next.js와 TypeScript로 구현한 **드래그 앤 드롭 방 꾸미기** 프로젝트입니다.
추억의 싸이월드 감성을 살려 나만의 미니룸을 꾸며보세요!

🔗 **데모 사이트 (Live Demo)**: [https://miniroom-demo.vercel.app](https://miniroom-demo.vercel.app)

> **(2025.12.17 업데이트 v1.4.0)**: 픽셀 아트, 스마트 툴바(동적 위치), 무한 크기 조절, 변경 내역 시스템 추가!

![Miniroom Demo](public/miniroom-preview.png)

## ✨ 주요 기능

*   **🖱️ 드래그 앤 드롭 (Drag & Drop)**: 인벤토리에서 아이템을 꺼내 원하는 위치에 자유롭게 배치할 수 있습니다.
*   **🎨 픽셀 아트 스타일 (Pixel Art)**: 고품질 픽셀 아트로 제작된 가구(의자, 테이블 등)를 제공합니다.
*   **🛠️ 아이템 변형 (Transformation)**:
    *   **회전 (Rotate)**: 선택된 아이템을 시계 방향으로 90도씩 회전시킵니다.
    *   **반전 (Flip)**: 좌우 대칭으로 반전시킬 수 있습니다.
    *   **크기 조절 (Resize)**: 툴바의 `+`, `-` 버튼으로 아이템 크기를 조절합니다 (0.5배 ~ 2.0배).
*   **💾 아이템 관리 & 자동 저장**:
    *   **선택 시스템**: 클릭하여 아이템을 선택하고, 배경을 클릭하여 해제합니다.
    *   **삭제**: 선택 후 삭제 버튼을 누르거나 더블 클릭하여 삭제합니다.
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

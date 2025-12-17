# 🏠 싸이월드 감성 미니룸 꾸미기 (Miniroom Maker)

Next.js와 TypeScript로 구현한 **드래그 앤 드롭 방 꾸미기** 프로젝트입니다.
추억의 싸이월드 감성을 살려 나만의 미니룸을 꾸며보세요!

🔗 **데모 사이트**: [https://miniroom-demo.vercel.app](https://miniroom-demo.vercel.app)

![Miniroom Demo](public/miniroom-preview.png)

## ✨ 주요 기능

*   **🖱️ 드래그 앤 드롭 (Drag & Drop)**: 인벤토리에서 아이템을 꺼내 원하는 위치에 자유롭게 배치할 수 있습니다.
*   **🛠️ 아이템 관리**:
    *   **생성**: 인벤토리 클릭 시 아이템이 생성됩니다.
    *   **이동**: 마우스로 드래그하여 위치를 조정합니다 (방 밖으로 나가지 않도록 자동 보정).
    *   **삭제**: 아이템을 더블 클릭하면 삭제됩니다.
*   **💾 자동 저장 (Auto-Save)**: 별도의 저장 버튼 없이, 변경 사항이 생기면 자동으로 상태가 저장됩니다 (Simulation).
*   **🎨 레이어 시스템**: 나중에 놓은 아이템이 위에 쌓이는 자연스러운 레이어 순서를 지원합니다.

## 🛠️ 기술 스택 (Tech Stack)

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Deploy**: Vercel

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
│       ├── components/        # UI 컴포넌트 (캔버스, 인벤토리, 아이템)
│       └── hooks/             # 로직 훅 (드래그, 상태 관리)
├── types/                     # 타입 정의 (Room, Item)
└── data/                      # 목업 데이터 (초기 아이템 등)
```

## 📝 라이선스

MIT License

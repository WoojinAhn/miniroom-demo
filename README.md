# 🏠 🌰 Miniroom Maker (Dotori World Style)

[![Korean](https://img.shields.io/badge/Language-Korean-red?style=flat-square)](README.ko.md)

A **Drag & Drop Room Decorator** project built with Next.js and TypeScript.
Create your own retro **Dotori World** style miniroom!

🔗 **Live Demo**: [https://miniroom-demo.vercel.app](https://miniroom-demo.vercel.app)



![Miniroom Demo](public/miniroom-preview.png)

## ✨ Key Features

*   **🖱️ Drag & Drop**: Freely place items from the inventory anywhere in the room.
*   **🎨 Pixel Art Style**: High-quality pixel art furniture (chairs, tables, etc.).
*   **🛠️ Item Transformation**:
    *   **Rotate**: Rotate selected items 90 degrees clockwise.
    *   **Flip**: Flip items horizontally.
    *   **Resize**: Use `+`/`-` buttons in the toolbar to scale items (min 0.2x, no upper limit).
    *   **Layering**: Adjust Z-order with `⬆` (Bring Forward) and `⬇` (Send Backward) buttons.
*   **📱 Mobile Support**:
    *   **Touch-friendly Control Panel**: Fixed bottom toolbar for easy item manipulation on mobile.
    *   **Pinch to Resize**: Two-finger pinch gesture to scale selected items.
    *   **Responsive Layout**: Canvas and inventory adapt to screen size.
*   **🎲 Random Placement**: Items are placed at random positions to avoid overlap confusion.
*   **💾 Item Management**:
    *   **Precise Selection**: Selection outlines strictly follow the visible pixels of the item.
    *   **Delete**: Remove items by double-clicking or using the delete button.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Deploy**: Vercel (CI/CD Automated)

## 🚀 Getting Started

Follow these steps to run the project locally.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/WoojinAhn/miniroom-demo.git
    cd miniroom-demo
    ```

2.  **Install Packages**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Open Browser**
    Visit `http://localhost:3000` to see the app.

## 🎨 Adding New Items

Simply add images to the `public/items/` folder and push. They will be **automatically registered** in the inventory!

1. Add image to `public/items/` (PNG recommended).
2. Use `snake_case` for filenames (e.g., `shin_ramen.png`).
3. Commit & Push.
4. It will appear in the inventory automatically upon build! 🎉

## 🌟 Adding Special Items

Images added to `public/special/` will appear in the **Special Items** section at the top.

1. Add image to `public/special/` (e.g., `rocket.png`).
2. It will be categorized as a 'Special Item' and shown at the top of the inventory.



## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main Page (Miniroom)
│   └── miniroom/
│       ├── components/
│       │   ├── RoomCanvas.tsx          # Responsive Canvas
│       │   ├── DraggableItem.tsx       # Draggable Item + Toolbar
│       │   ├── Inventory.tsx           # Item Picker
│       │   ├── MobileControlPanel.tsx  # Touch Controls (<768px)
│       │   └── ChangelogModal.tsx      # Version History
│       └── hooks/
│           ├── useMiniroom.ts          # Core State & Actions
│           ├── usePointerDrag.tsx      # Pointer Drag Handling
│           └── useItemPinchScale.ts    # Mobile Pinch-to-Scale
├── config/                         # App Version & Changelog
├── types/                          # Type Definitions
└── data/                           # Item Data & Backgrounds
```

## 📝 License

MIT License

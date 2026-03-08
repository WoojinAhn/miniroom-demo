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
*   **🖼️ Background Selection**: Choose from multiple backgrounds (Grass Field, My Room, Universe).
*   **🧑 Characters**: A default character is placed in the room. Characters cannot be deleted and are hidden from the inventory.
*   **🎲 Random Placement**: Items are placed at random positions to avoid overlap confusion.
*   **💾 Auto-save**: Room state is automatically saved to LocalStorage (debounced 500ms) and restored on page load.
*   **📸 Screenshot & Share**: Download your room as PNG or share via Web Share API (mobile) / clipboard (desktop).
*   **↩️ Undo / Redo**: Ctrl+Z / Ctrl+Shift+Z (Cmd on Mac) with header buttons on desktop and mobile control panel.
*   **🏠 Preset Templates**: 4 pre-decorated room templates (Cozy Bedroom, Camping Outdoor, Minimalist Studio, Ramen Kitchen) to get started quickly.
*   **💾 Item Management**:
    *   **Precise Selection**: Selection outlines strictly follow the visible pixels of the item.
    *   **Delete**: Remove items by double-clicking or using the delete button.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Testing**: Playwright (E2E)
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
│       │   ├── ChangelogModal.tsx      # Version History
│       │   └── TemplateModal.tsx       # Preset Room Templates
│       └── hooks/
│           ├── useMiniroom.ts          # Core State & Actions
│           ├── usePointerDrag.tsx      # Pointer Drag Handling
│           └── useItemPinchScale.ts    # Mobile Pinch-to-Scale
├── config/                         # App Version & Changelog
├── types/                          # Type Definitions
└── data/                           # Item Data, Backgrounds & Templates
e2e/
└── miniroom.spec.ts                # E2E Tests (Playwright)
```

## 📝 License

MIT License

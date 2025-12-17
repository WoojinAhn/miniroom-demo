"use client";

import { useState } from "react";
import { useMiniroom } from "@/app/miniroom/hooks/useMiniroom";
import { RoomCanvas } from "@/app/miniroom/components/RoomCanvas";
import { Inventory } from "@/app/miniroom/components/Inventory";
import { ChangelogModal } from "@/app/miniroom/components/ChangelogModal";
import { APP_VERSION, CHANGELOG } from "@/config/appVersion";
import { AVAILABLE_ITEMS } from "@/data/mockMiniroom";
import { BACKGROUNDS } from "@/data/backgrounds";

export default function MiniroomPage() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const {
    room,
    placeItem,
    moveItem,
    deleteItem,
    selectedItemId,
    selectItem,
    rotateItem,
    flipItem,
    scaleItem,
    setBackground,
    currentBackground,
  } = useMiniroom();

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-6 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Miniroom Maker
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition"
              title="Click to see what's new"
            >
              {APP_VERSION}
            </button>
          </h1>
          <p className="text-gray-500">
            Drag to move • Double click to remove • Auto-saving...
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-save ref removed for now */}
          <span className="text-gray-400">All changes saved</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 p-2 bg-gray-50 border-b">
            <span className="text-sm font-bold text-gray-700 flex items-center pr-2">
              Background:
            </span>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${room.backgroundId === bg.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
                  }`}
              >
                {bg.name}
              </button>
            ))}
          </div>
          <RoomCanvas
            room={room}
            availableItems={AVAILABLE_ITEMS}
            onUpdateItem={moveItem}
            onDeleteItem={deleteItem}
            selectedItemId={selectedItemId}
            onSelectItem={selectItem}
            onRotateItem={rotateItem}
            onFlipItem={flipItem}
            onScaleItem={scaleItem}
            onBackgroundClick={() => selectItem(null)}
            width={currentBackground.width}
            height={currentBackground.height}
          />
        </div>
        <Inventory items={AVAILABLE_ITEMS} onAddItem={placeItem} />
      </main>

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
        changelog={CHANGELOG}
      />
    </div>
  );
}

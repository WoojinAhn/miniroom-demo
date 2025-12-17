"use client";

import { useMiniroom } from "@/app/miniroom/hooks/useMiniroom";
import { RoomCanvas } from "@/app/miniroom/components/RoomCanvas";
import { Inventory } from "@/app/miniroom/components/Inventory";

export default function MiniroomPage() {
  const {
    room,
    addItem,
    moveItem,
    removeItem,
    isSaving,
    AVAILABLE_ITEMS,
    selectedItemId,
    setSelectedItemId,
    rotateItem,
    flipItem,
  } = useMiniroom();

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <header className="mb-6 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Miniroom Maker <span className="text-sm text-blue-600">(Pixel Art!)</span>
          </h1>
          <p className="text-gray-500">
            Drag to move • Double click to remove • Auto-saving...
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="text-blue-600 font-medium animate-pulse">
              Saving...
            </span>
          ) : (
            <span className="text-gray-400">All changes saved</span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex shadow-xl rounded-xl overflow-hidden bg-white">
        <RoomCanvas
          room={room}
          availableItems={AVAILABLE_ITEMS}
          onUpdateItem={moveItem}
          onDeleteItem={removeItem}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onRotateItem={rotateItem}
          onFlipItem={flipItem}
          onBackgroundClick={() => setSelectedItemId(null)}
        />
        <Inventory items={AVAILABLE_ITEMS} onAddItem={addItem} />
      </main>
    </div>
  );
}

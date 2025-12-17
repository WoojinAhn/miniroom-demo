"use client";

import { useMiniroom } from "@/app/miniroom/hooks/useMiniroom";
import { RoomCanvas } from "@/app/miniroom/components/RoomCanvas";
import { Inventory } from "@/app/miniroom/components/Inventory";
import { ChangelogModal } from "@/app/miniroom/components/ChangelogModal";
import { APP_VERSION, CHANGELOG } from "@/config/appVersion";

export default function MiniroomPage() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
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
    scaleItem,
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
          onScaleItem={scaleItem}
          onBackgroundClick={() => setSelectedItemId(null)}
        />
        <Inventory items={AVAILABLE_ITEMS} onAddItem={addItem} />
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

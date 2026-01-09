"use client";

import { useState, useEffect } from "react";
import { useMiniroom } from "@/app/miniroom/hooks/useMiniroom";
import { RoomCanvas } from "@/app/miniroom/components/RoomCanvas";
import { Inventory } from "@/app/miniroom/components/Inventory";
import { ChangelogModal } from "@/app/miniroom/components/ChangelogModal";
import { MobileControlPanel } from "@/app/miniroom/components/MobileControlPanel";
import { usePinchZoom } from "@/app/miniroom/hooks/usePinchZoom";
import { APP_VERSION, CHANGELOG } from "@/config/appVersion";
import { AVAILABLE_ITEMS } from "@/data/mockMiniroom";
import { BACKGROUNDS } from "@/data/backgrounds";

export default function MiniroomPage() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    bringForward,
    sendBackward,
    setBackground,
    currentBackground,
  } = useMiniroom();

  // Pinch Zoom - only enabled on mobile
  const { scale: pinchScale, translateX, translateY, containerRef, resetZoom, isZoomed } = usePinchZoom({
    minScale: 1,
    maxScale: 3,
    enabled: isMobile,
  });

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile control panel handlers
  const handleMobileRotate = () => {
    if (selectedItemId) rotateItem(selectedItemId);
  };
  const handleMobileFlip = () => {
    if (selectedItemId) flipItem(selectedItemId);
  };
  const handleMobileScaleUp = () => {
    if (selectedItemId) scaleItem(selectedItemId, 0.1);
  };
  const handleMobileScaleDown = () => {
    if (selectedItemId) scaleItem(selectedItemId, -0.1);
  };
  const handleMobileBringForward = () => {
    if (selectedItemId) bringForward(selectedItemId);
  };
  const handleMobileSendBackward = () => {
    if (selectedItemId) sendBackward(selectedItemId);
  };
  const handleMobileDelete = () => {
    if (selectedItemId) {
      deleteItem(selectedItemId);
      selectItem(null);
    }
  };
  const handleDeselect = () => {
    selectItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <header className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center max-w-5xl mx-auto gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            Miniroom Maker
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition"
              title="Click to see what's new"
            >
              {APP_VERSION}
            </button>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {isMobile ? "Tap to select • Pinch to zoom" : "Drag to move • Double click to remove"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isZoomed && isMobile && (
            <button
              onClick={resetZoom}
              className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 transition"
            >
              Reset Zoom
            </button>
          )}
          <span className="text-gray-400 text-sm">All changes saved</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="flex flex-col gap-4 w-full">
          {/* Background Selector - Horizontal scroll on mobile */}
          <div className="flex gap-2 p-2 bg-gray-50 border-b overflow-x-auto">
            <span className="text-sm font-bold text-gray-700 flex items-center pr-2 flex-shrink-0">
              BG:
            </span>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition flex-shrink-0 ${room.backgroundId === bg.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
                  }`}
              >
                {bg.name}
              </button>
            ))}
          </div>

          {/* Pinch Zoom Container - wraps RoomCanvas on mobile */}
          <div
            ref={containerRef}
            className="relative overflow-hidden touch-none"
            style={{
              // Only apply pinch zoom transform on mobile
              transform: isMobile ? `scale(${pinchScale}) translate(${translateX / pinchScale}px, ${translateY / pinchScale}px)` : undefined,
              transformOrigin: "center center",
              transition: pinchScale === 1 ? "transform 0.2s ease-out" : undefined,
            }}
          >
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
              onBringForward={bringForward}
              onSendBackward={sendBackward}
              onBackgroundClick={() => selectItem(null)}
              width={currentBackground.width}
              height={currentBackground.height}
            />
          </div>

          {/* Mobile Control Panel - Right below the canvas */}
          <MobileControlPanel
            isVisible={isMobile && selectedItemId !== null}
            onRotate={handleMobileRotate}
            onFlip={handleMobileFlip}
            onScaleUp={handleMobileScaleUp}
            onScaleDown={handleMobileScaleDown}
            onBringForward={handleMobileBringForward}
            onSendBackward={handleMobileSendBackward}
            onDelete={handleMobileDelete}
            onDeselect={handleDeselect}
          />
        </div>
        <Inventory
          items={AVAILABLE_ITEMS.filter((i) => i.type !== "character")}
          onAddItem={placeItem}
        />
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

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMiniroom } from "@/app/miniroom/hooks/useMiniroom";
import { RoomCanvas } from "@/app/miniroom/components/RoomCanvas";
import { Inventory } from "@/app/miniroom/components/Inventory";
import { ChangelogModal } from "@/app/miniroom/components/ChangelogModal";
import { MobileControlPanel } from "@/app/miniroom/components/MobileControlPanel";
import { useItemPinchScale } from "@/app/miniroom/hooks/useItemPinchScale";
import { APP_VERSION, CHANGELOG } from "@/config/appVersion";
import { AVAILABLE_ITEMS } from "@/data/mockMiniroom";
import { BACKGROUNDS } from "@/data/backgrounds";

export default function MiniroomPage() {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const canvasInnerRef = useRef<HTMLDivElement | null>(null);

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

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pinch to scale selected item (mobile only)
  const handlePinchScale = useCallback((itemId: string, delta: number) => {
    scaleItem(itemId, delta);
  }, [scaleItem]);

  const { containerRef: pinchContainerRef } = useItemPinchScale({
    enabled: isMobile,
    selectedItemId,
    onScale: handlePinchScale,
  });

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

  const captureCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!canvasInnerRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(canvasInnerRef.current, {
      useCORS: true,
      allowTaint: true,
      scale: 1,
      // The inner div is rendered at full canvas resolution (not scaled),
      // so we capture at native resolution regardless of screen zoom.
      width: canvasInnerRef.current.offsetWidth,
      height: canvasInnerRef.current.offsetHeight,
    });
  };

  const handleDownload = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    // Deselect and wait for React to re-render (clear selection outline & toolbar)
    selectItem(null);
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "miniroom.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    selectItem(null);
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        }, "image/png");
      });

      // Try Web Share API (mobile / modern desktop)
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "miniroom.png", { type: "image/png" })] })) {
        const file = new File([blob], "miniroom.png", { type: "image/png" });
        await navigator.share({ files: [file], title: "My Miniroom" });
        return;
      }

      // Fallback: copy image to clipboard
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Room image copied to clipboard!");
        return;
      }

      // Final fallback: download
      const link = document.createElement("a");
      link.download = "miniroom.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsCapturing(false);
    }
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
            {isMobile ? "Tap to select • Pinch to resize" : "Drag to move • Double click to remove"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Download as PNG"
          >
            {isCapturing ? "..." : "Download"}
          </button>
          <button
            onClick={handleShare}
            disabled={isCapturing}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Share room"
          >
            {isCapturing ? "..." : "Share"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden bg-white">
        <div className="flex flex-col w-full">
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

          {/* Room Canvas with Pinch-to-Scale support */}
          <div ref={pinchContainerRef} className="touch-none">
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
            innerRef={canvasInnerRef}
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

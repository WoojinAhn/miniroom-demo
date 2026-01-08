"use client";

import { Room, Item } from "@/types/miniroom";
import { DraggableItem } from "./DraggableItem";
import { useEffect, useRef, useState } from "react";

interface RoomCanvasProps {
    room: Room;
    availableItems: Item[];
    onUpdateItem: (id: string, x: number, y: number) => void;
    onDeleteItem: (id: string) => void;
    selectedItemId: string | null;
    onSelectItem: (id: string) => void;
    onRotateItem: (id: string) => void;
    onFlipItem: (id: string) => void;
    onScaleItem: (id: string, delta: number) => void;
    onBringForward: (id: string) => void;
    onSendBackward: (id: string) => void;
    onBackgroundClick: () => void;
    width: number;
    height: number;
}

export const RoomCanvas = ({
    room,
    availableItems,
    onUpdateItem,
    onDeleteItem,
    selectedItemId,
    onSelectItem,
    onRotateItem,
    onFlipItem,
    onScaleItem,
    onBringForward,
    onSendBackward,
    onBackgroundClick,
    width,
    height,
}: RoomCanvasProps) => {
    // Responsive Scaling Logic
    const containerRef = useRef<HTMLDivElement>(null);
    const [globalScale, setGlobalScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Calculate scale to fit. Max scale 1 (don't upscale on huge screens if not needed, or maybe do?)
                // Let's allow upscale if user has huge screen, but mostly we care about downscale.
                // Actually, usually we limit max-width.
                // Let's just scale to fit width.
                const newScale = containerWidth / width;
                setGlobalScale(newScale);
            }
        };

        // Initial check
        updateScale();

        // Resize observer
        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [width]);

    return (
        <div
            ref={containerRef}
            className="w-full relative overflow-hidden"
            style={{
                // Reserve height based on aspect ratio to prevent layout shift
                height: height * globalScale
            }}
        >
            <div
                onPointerDown={(e) => {
                    // Only trigger if clicking the background itself, not a child
                    if (e.target === e.currentTarget) {
                        onBackgroundClick();
                    }
                }}
                style={{
                    width: width,
                    height: height,
                    backgroundImage: `url(${room.background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#f0f0f0", // Fallback
                    position: "absolute", // Absolute within the responsive container
                    top: 0,
                    left: 0,
                    transform: `scale(${globalScale})`,
                    transformOrigin: "top left",
                    border: "1px solid #ccc",
                    transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
                    // overflow: "hidden", // Removed to allow unlimited scaling without clipping
                }}
            >
                {room.items.map((item) => {
                    const itemDef = availableItems.find((d) => d.id === item.itemId);
                    if (!itemDef) return null;
                    return (
                        <DraggableItem
                            key={item.instanceId}
                            item={item}
                            itemDef={itemDef}
                            onUpdate={onUpdateItem}
                            onDelete={onDeleteItem}
                            bounds={{ width, height }}
                            isSelected={selectedItemId === item.instanceId}
                            onSelect={() => onSelectItem(item.instanceId)}
                            onRotate={() => onRotateItem(item.instanceId)}
                            onFlip={() => onFlipItem(item.instanceId)}
                            onScale={(delta) => onScaleItem(item.instanceId, delta)}
                            onBringForward={() => onBringForward(item.instanceId)}
                            onSendBackward={() => onSendBackward(item.instanceId)}
                            globalScale={globalScale}
                        // zIndex={Math.floor(item.posY + (itemDef.height * (item.scale || 1)))}
                        />
                    );
                })}
            </div>
        </div>
    );
};

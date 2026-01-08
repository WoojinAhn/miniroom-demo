"use client";

import { useEffect, useRef, useState } from "react";
import { Room, Item } from "@/types/miniroom";
import { DraggableItem } from "./DraggableItem";

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [measuredWidth, setMeasuredWidth] = useState(width);
    const [measuredHeight, setMeasuredHeight] = useState(height);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const resize = () => {
            const rect = el.getBoundingClientRect();
            setMeasuredWidth(rect.width || width);
            setMeasuredHeight(rect.height || height);
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(el);
        return () => observer.disconnect();
    }, [width, height]);

    return (
        <div
            ref={containerRef}
            onPointerDown={(e) => {
                // Only trigger if clicking the background itself, not a child
                if (e.target === e.currentTarget) {
                    onBackgroundClick();
                }
            }}
            style={{
                width,
                height,
                backgroundImage: `url(${room.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f0f0f0", // Fallback
                position: "relative",
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
                        bounds={{ width: measuredWidth, height: measuredHeight }}
                        isSelected={selectedItemId === item.instanceId}
                        onSelect={() => onSelectItem(item.instanceId)}
                        onRotate={() => onRotateItem(item.instanceId)}
                        onFlip={() => onFlipItem(item.instanceId)}
                        onScale={(delta) => onScaleItem(item.instanceId, delta)}
                        onBringForward={() => onBringForward(item.instanceId)}
                        onSendBackward={() => onSendBackward(item.instanceId)}
                        // Depth Sorting: use bbox bottom with scale
                        zIndex={Math.floor(
                            item.posY +
                                (itemDef.bboxY ?? itemDef.paddingTop ?? 0) * (item.scale || 1) +
                                (itemDef.bboxHeight ??
                                    Math.max(
                                        1,
                                        (itemDef.height - (itemDef.paddingTop || 0) - (itemDef.paddingBottom || 0)) *
                                            (item.scale || 1)
                                    ))
                        )}
                    />
                );
            })}
        </div>
    );
};

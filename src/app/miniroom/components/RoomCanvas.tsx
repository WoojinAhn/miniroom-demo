"use client";

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
    onBackgroundClick,
    width,
    height,
}: RoomCanvasProps) => {
    return (
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
                position: "relative",
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
                        // Depth Sorting: Lower Y (higher up) = Background. Higher Y (lower down) = Foreground.
                        // We use (posY + height) to align by the "feet" of the item.
                        zIndex={Math.floor(item.posY + (itemDef.height * (item.scale || 1)))}
                    />
                );
            })}
        </div>
    );
};

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
    onBackgroundClick: () => void;
}

export const ROOM_WIDTH = 800;
export const ROOM_HEIGHT = 600;

export const RoomCanvas = ({
    room,
    availableItems,
    onUpdateItem,
    onDeleteItem,
    selectedItemId,
    onSelectItem,
    onRotateItem,
    onFlipItem,
    onBackgroundClick,
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
                width: ROOM_WIDTH,
                height: ROOM_HEIGHT,
                backgroundColor: room.background,
                position: "relative",
                border: "1px solid #ccc",
                overflow: "hidden", // Clip items
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
                        bounds={{ width: ROOM_WIDTH, height: ROOM_HEIGHT }}
                        isSelected={selectedItemId === item.instanceId}
                        onSelect={() => onSelectItem(item.instanceId)}
                        onRotate={() => onRotateItem(item.instanceId)}
                        onFlip={() => onFlipItem(item.instanceId)}
                    />
                );
            })}
        </div>
    );
};

"use client";

import { Room, Item } from "@/types/miniroom";
import { DraggableItem } from "./DraggableItem";

interface RoomCanvasProps {
    room: Room;
    availableItems: Item[];
    onUpdateItem: (id: string, x: number, y: number) => void;
    onDeleteItem: (id: string) => void;
}

export const ROOM_WIDTH = 800;
export const ROOM_HEIGHT = 600;

export const RoomCanvas = ({
    room,
    availableItems,
    onUpdateItem,
    onDeleteItem,
}: RoomCanvasProps) => {
    return (
        <div
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
                    />
                );
            })}
        </div>
    );
};

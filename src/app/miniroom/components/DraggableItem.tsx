"use client";

import { usePointerDrag } from "@/app/miniroom/hooks/usePointerDrag";
import { PlacedItem, Item } from "@/types/miniroom";
import { useMemo } from "react";

interface DraggableItemProps {
    item: PlacedItem;
    itemDef: Item;
    onUpdate: (id: string, x: number, y: number) => void;
    onDelete: (id: string) => void;
    bounds: { width: number; height: number };
}

export const DraggableItem = ({
    item,
    itemDef,
    onUpdate,
    onDelete,
    bounds,
}: DraggableItemProps) => {
    const handleDrag = (dx: number, dy: number) => {
        let newX = item.posX + dx;
        let newY = item.posY + dy;

        // Clamping / Boundary Check
        newX = Math.max(0, Math.min(newX, bounds.width - itemDef.width));
        newY = Math.max(0, Math.min(newY, bounds.height - itemDef.height));

        onUpdate(item.instanceId, newX, newY);
    };

    const { onPointerDown } = usePointerDrag(handleDrag);

    return (
        <div
            onPointerDown={onPointerDown}
            onDoubleClick={() => onDelete(item.instanceId)}
            style={{
                position: "absolute",
                left: item.posX,
                top: item.posY,
                width: itemDef.width,
                height: itemDef.height,
                backgroundColor: itemDef.imageUrl ? "transparent" : itemDef.color,
                cursor: "move",
                userSelect: "none",
                touchAction: "none", // Critical for pointer events
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
        >
            {itemDef.imageUrl ? (
                <img
                    src={itemDef.imageUrl}
                    alt={itemDef.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        pointerEvents: "none", // Prevent image dragging interference
                    }}
                />
            ) : (
                itemDef.name
            )}
        </div>
    );
};

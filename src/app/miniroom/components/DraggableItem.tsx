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
    isSelected: boolean;
    onSelect: () => void;
    onRotate: () => void;
    onFlip: () => void;
}

export const DraggableItem = ({
    item,
    itemDef,
    onUpdate,
    onDelete,
    bounds,
    isSelected,
    onSelect,
    onRotate,
    onFlip,
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
            onPointerDown={(e) => {
                onSelect();
                onPointerDown(e);
            }}
            onDoubleClick={() => onDelete(item.instanceId)}
            style={{
                position: "absolute",
                left: item.posX,
                top: item.posY,
                width: itemDef.width,
                height: itemDef.height,
                backgroundColor: itemDef.imageUrl ? "transparent" : itemDef.color,
                // Apply transforms
                transform: `rotate(${item.rotation}deg) scaleX(${item.isFlipped ? -1 : 1
                    })`,
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
                // Highlight when selected
                outline: isSelected ? "2px solid #3b82f6" : "none",
                zIndex: isSelected ? 10 : 1, // Bring to front when selected
                // Use standard CSS transitions for smooth rotation
                transition: "transform 0.2s ease-in-out",
            }}
        >
            {/* Toolbar for selected item */}
            {isSelected && (
                <div
                    style={{
                        position: "absolute",
                        top: -40,
                        left: "50%",
                        transform: "translateX(-50%)", // Undo parent transform not needed because absolute? Wait. 
                        // Parent has transform. Standard buttons will rotate/flip with parent. 
                        // We need to counteract specific transforms or place outside.
                        // Actually, simpler to just put controls. If they rotate, it's fine for now (quirky but functional).
                        // Better: Use a fixed overlay or Portal? 
                        // Let's simpler: Just let it rotate.
                        display: "flex",
                        gap: "4px",
                        backgroundColor: "white",
                        padding: "4px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 20,
                    }}
                    onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking buttons
                >
                    <button
                        onClick={onRotate}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Rotate"
                    >
                        ↻
                    </button>
                    <button
                        onClick={onFlip}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Flip"
                    >
                        ⇄
                    </button>
                    <button
                        onClick={() => onDelete(item.instanceId)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 font-bold"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            )}

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

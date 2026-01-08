"use client";

import { usePointerDrag } from "@/app/miniroom/hooks/usePointerDrag";
import { PlacedItem, Item } from "@/types/miniroom";
import { useMemo } from "react";

// Helper to prevent event bubbling
const stopPropagation = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
};

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
    onScale: (delta: number) => void;
    onBringForward: () => void;
    onSendBackward: () => void;
    zIndex?: number;
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
    onScale,
    onBringForward,
    onSendBackward,
    zIndex,
}: DraggableItemProps) => {
    // Visible content box after trimming transparent padding
    const paddingLeft = itemDef.paddingLeft || 0;
    const paddingRight = itemDef.paddingRight || 0;
    const paddingTop = itemDef.paddingTop || 0;
    const paddingBottom = itemDef.paddingBottom || 0;
    const contentWidth = Math.max(1, itemDef.width - paddingLeft - paddingRight);
    const contentHeight = Math.max(1, itemDef.height - paddingTop - paddingBottom);
    const bboxX = itemDef.bboxX ?? paddingLeft;
    const bboxY = itemDef.bboxY ?? paddingTop;
    const bboxWidth = itemDef.bboxWidth ?? contentWidth;
    const bboxHeight = itemDef.bboxHeight ?? contentHeight;
    const scale = item.scale || 1;

    const handleDrag = (dx: number, dy: number) => {
        let newX = item.posX + dx;
        let newY = item.posY + dy;

        // Clamp using visual box (ignore transparent padding)
        const minX = bboxX;
        const minY = bboxY;
        const maxX = bounds.width - bboxWidth + bboxX;
        const maxY = bounds.height - bboxHeight + bboxY;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

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
                // Outer container: Handles Position & Rotation ONLY
                // This ensures the generic bounding box rotates, but we don't scale the toolbar here
                transform: `rotate(${item.rotation}deg)`,
                cursor: "move",
                userSelect: "none",
                touchAction: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Outline is strictly on the visual bounds? 
                // Actually, if we scale the inner, the outline on Outer is wrong size.
                // We should move outline to Inner? Or scale Outer's width/height?
                // If we scale Outer width/height, the toolbar position relative to it is fine, 
                // but then we must counter-scale toolbar.
                // Let's stick to the Plan: Sibling.
                // but then we must counter-scale toolbar.
                // Let's stick to the Plan: Sibling.
                zIndex: isSelected ? 9999 : (zIndex || 1),
                transition: "transform 0.2s ease-in-out",
            }}
        >
            {/* Inner Content: Handles Scale & Flip & Visuals */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: itemDef.imageUrl ? "transparent" : itemDef.color,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    transform: `translate(${-bboxX}px, ${-bboxY}px) scale(${scale}) scaleX(${item.isFlipped ? -1 : 1})`,
                    transformOrigin: `${bboxX + bboxWidth / 2}px ${bboxY + bboxHeight}px`,
                    transition: "transform 0.2s ease-in-out",
                    // Outline only for non-image items (text placeholders)
                    outline: isSelected && !itemDef.imageUrl ? "2px solid #3b82f6" : "none",
                    boxShadow: isSelected && !itemDef.imageUrl ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
                }}
            >
                {itemDef.imageUrl ? (
                    <img
                        src={itemDef.imageUrl}
                        alt={itemDef.name}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            pointerEvents: "none",
                            // Use drop-shadow for selection to contour the pixel art shape
                            filter: isSelected ? "drop-shadow(0 0 4px #3b82f6) drop-shadow(0 0 2px #3b82f6)" : "none",
                        }}
                    />
                ) : (
                    <span>{itemDef.name}</span>
                )}
            </div>

            {/* Toolbar: Separated from scaling context */}
            {isSelected && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%", // Anchor to the center of the item (rotation pivot)
                        left: "50%",
                        marginTop: "0",
                        transformOrigin: "0 0",
                        transform: `rotate(${-item.rotation}deg) translate(-50%, ${contentHeight / 2 + 10}px)`, // Cancel rotation and push down to screen bottom
                        display: "flex",
                        gap: "4px",
                        backgroundColor: "white",
                        padding: "4px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 20,
                        whiteSpace: "nowrap", // Prevent wrapping
                        transition: "transform 0.2s ease-in-out",
                    }}
                    onPointerDown={stopPropagation}
                    onClick={stopPropagation}
                    onDoubleClick={(e) => e.stopPropagation()} // Prevent double-click on toolbar from deleting the item
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
                        onClick={() => onScale(0.1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Zoom In"
                    >
                        +
                    </button>
                    <button
                        onClick={() => onScale(-0.1)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Zoom Out"
                    >
                        -
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" /> {/* Divider */}
                    <button
                        onClick={onBringForward}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Bring Forward"
                    >
                        ⬆
                    </button>
                    <button
                        onClick={onSendBackward}
                        className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                        title="Send Backward"
                    >
                        ⬇
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1" /> {/* Divider */}
                    <button
                        onClick={() => onDelete(item.instanceId)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 font-bold"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Image/Content moved to inner div above */}
        </div>
    );
};

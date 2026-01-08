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
    // Calculate visual dimensions (Tight Bounding Box)
    const paddingTop = itemDef.paddingTop || 0;
    const paddingBottom = itemDef.paddingBottom || 0;
    const paddingLeft = itemDef.paddingLeft || 0;
    const paddingRight = itemDef.paddingRight || 0;

    const visualWidth = itemDef.width - paddingLeft - paddingRight;
    const visualHeight = itemDef.height - paddingTop - paddingBottom;

    // Safety check for scale
    const scaleVal = Math.max(0.1, item.scale || 1);

    const handleDrag = (dx: number, dy: number) => {
        let newX = item.posX + dx;
        let newY = item.posY + dy;

        // Clamping / Boundary Check
        // We must account for the transformOrigin: "center bottom"
        // When scaled down, the visual box shrinks towards the bottom-center.
        // This means the "physical" left/top (posX, posY) can actually go outside the boundaries
        // to keep the "visual" box inside.

        // Visual offsets caused by scale with "center bottom" origin:
        // Visual Left = posX + (Visual Width * (1 - scaleVal)) / 2
        // Visual Top  = posY + (Visual Height * (1 - scaleVal))

        // Constraints:
        // Visual Left >= 0
        // Visual Right <= bounds.width  => Visual Left + (Visual Width * scaleVal) <= bounds.width
        // Visual Top >= 0
        // Visual Bottom <= bounds.height => posY + Visual Height <= bounds.height (Bottom is fixed)

        const minX = - (visualWidth * (1 - scaleVal)) / 2;
        const maxX = bounds.width - (visualWidth * (1 + scaleVal)) / 2;

        const minY = - (visualHeight * (1 - scaleVal));
        const maxY = bounds.height - visualHeight;

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
                width: visualWidth,
                height: visualHeight,
                // Outer container: Handles Position, Rotation AND Scale
                // Rotates around the bottom center of the VISUAL box
                transform: `rotate(${item.rotation}deg) scale(${scaleVal})`,
                transformOrigin: "center bottom",
                cursor: "move",
                userSelect: "none",
                touchAction: "none",
                zIndex: isSelected ? 9999 : (zIndex || 1),
                transition: "transform 0.2s ease-in-out",
                // Outline matches visual box (Outer container) - now scales with it!
                outline: isSelected ? "2px solid #3b82f6" : "none",
                // Box shadow needs to be inversely scaled? 
                // A shadow usually fuzzes in screen space. If we scale the box, the shadow scales too.
                // If we want consistent shadow size, we might need a child div for shadow?
                // For now, scaling shadow is acceptable (smaller item = smaller shadow).
                boxShadow: isSelected ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
            }}
        >
            {/* Inner Content: Handles Flip & Visuals */}
            <div
                style={{
                    position: "absolute",
                    left: -paddingLeft,
                    top: -paddingTop,
                    width: itemDef.width,
                    height: itemDef.height,
                    backgroundColor: itemDef.imageUrl ? "transparent" : itemDef.color,
                    borderRadius: "4px",
                    display: itemDef.imageUrl ? "block" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    // Content Scaling: ONLY Flip. Size is handled by Outer.
                    transform: `scaleX(${item.isFlipped ? -1 : 1})`,
                    // Pivot for Inner Content Flip: Center of the image? 
                    // Visual Feet Center relative to inner: (paddingLeft + visualWidth/2, paddingTop + visualHeight)
                    // If we flip, we want to flip around the visual horizontal center.
                    transformOrigin: `${paddingLeft + visualWidth / 2}px ${paddingTop + visualHeight}px`,
                    transition: "transform 0.2s ease-in-out",
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
                            filter: "none",
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
                        top: "50%",
                        left: "50%",
                        marginTop: "0",
                        transformOrigin: "0 0",
                        // Toolbar positioning:
                        // 1. Counter-rotate (-rotation)
                        // 2. Counter-scale (1/scaleVal) so it stays same screen size
                        // 3. Translate to bottom of item.
                        // visualHeight/2 is local pixels to bottom.
                        // We want 10 SCREEN pixels gap.
                        // In local pixels, that gap is 10 / scaleVal.
                        // Wait. Translate applies in the local coordinate system of the ELEMENT being transformed?
                        // Or the coordinate system resultant from the previous transforms?
                        // Standard CSS transform order: right to left application visually, but left to right in string?
                        // "transform functions are applied in order from left to right"
                        // 1. rotate: axes rotate.
                        // 2. scale(big): axes grow. everything drawn is big.
                        // 3. translate: move along the rotated, BIG axes.

                        // If I used scale(1/val) FIRST: axes shrink.

                        // Let's rethink.
                        // Outer is Scaled(S).
                        // Toolbar inherits Scale(S).
                        // Toolbar Transform: scale(1/S). Now Toolbar is Size(1). Axes are Size(1) relative to screen (ignoring rotation).
                        // I want to move it to the bottom of the Item.
                        // Item Bottom is at +visualHeight/2 relative to center (in Outer's scaled space).
                        // In "Screen Screen" (relative to center), that is (visualHeight/2 * S).
                        // So I need to move (visualHeight/2 * S) pixels down.
                        // Plus 10 screen pixels gap.
                        // Total Screen Y Offset = (visualHeight/2 * S) + 10.
                        // Because I scaled axes to 1/S (back to 1.0), 1 unit translate = 1 screen pixel.
                        // So translate value should be: (visualHeight/2 * S) + 10.

                        // BUT: rotate is involved.
                        // rotate(-deg) -> scale(1/S) -> translate(...)
                        // If I rotate first, axes rotate.
                        // If I scale next, axes scale to 1.0.
                        // If I translate next, I move along rotated, 1.0 axes.
                        // So translate(0, Y) moves "down" relative to the un-rotated orientation (because we counter-rotated).
                        // Yes.
                        // And the distance is in screen pixels because scale is 1.0.
                        // So: translate(-50%, (visualHeight/2 * S) + 10 px).

                        transform: `rotate(${-item.rotation}deg) scale(${1 / scaleVal}) translate(-50%, ${(visualHeight / 2) * scaleVal + 10}px)`,

                        display: "flex",
                        gap: "4px",
                        backgroundColor: "white",
                        padding: "4px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 20,
                        whiteSpace: "nowrap",
                        transition: "transform 0.2s ease-in-out",
                    }}
                    onPointerDown={stopPropagation}
                    onClick={stopPropagation}
                    onDoubleClick={(e) => e.stopPropagation()}
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
        </div>
    );
};

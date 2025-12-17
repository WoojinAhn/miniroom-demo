"use client";

import { useRef, useCallback, useEffect } from "react";

export const usePointerDrag = (onDrag: (dx: number, dy: number) => void) => {
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const onDragRef = useRef(onDrag);

    // Update the ref whenever onDrag changes
    useEffect(() => {
        onDragRef.current = onDrag;
    }, [onDrag]);

    const handlePointerUp = useCallback(() => {
        isDragging.current = false;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
    }, []);

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!isDragging.current) return;
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;

            lastPos.current = { x: e.clientX, y: e.clientY };
            onDragRef.current(dx, dy);
        },
        []
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging.current = true;
            lastPos.current = { x: e.clientX, y: e.clientY };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
        },
        [handlePointerMove, handlePointerUp]
    );

    return { onPointerDown };
};

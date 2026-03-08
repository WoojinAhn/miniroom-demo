"use client";

import { useRef, useCallback, useEffect } from "react";

export const usePointerDrag = (
    onDrag: (dx: number, dy: number) => void,
    onDragEnd?: () => void
) => {
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const onDragRef = useRef(onDrag);
    const onDragEndRef = useRef(onDragEnd);

    // Update the refs whenever callbacks change
    useEffect(() => {
        onDragRef.current = onDrag;
    }, [onDrag]);

    useEffect(() => {
        onDragEndRef.current = onDragEnd;
    }, [onDragEnd]);

    const handlePointerUp = useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false;
            onDragEndRef.current?.();
        }
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

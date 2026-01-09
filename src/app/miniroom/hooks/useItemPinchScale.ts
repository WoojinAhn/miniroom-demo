"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseItemPinchScaleOptions {
    enabled: boolean;
    selectedItemId: string | null;
    onScale: (itemId: string, delta: number) => void;
}

export const useItemPinchScale = ({
    enabled,
    selectedItemId,
    onScale,
}: UseItemPinchScaleOptions) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const initialDistance = useRef<number>(0);
    const lastScale = useRef<number>(1);
    const isPinching = useRef<boolean>(false);

    const getDistance = (touch1: Touch, touch2: Touch): number => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled || !selectedItemId) return;

        if (e.touches.length === 2) {
            isPinching.current = true;
            initialDistance.current = getDistance(e.touches[0], e.touches[1]);
            lastScale.current = 1;
        }
    }, [enabled, selectedItemId]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!enabled || !selectedItemId || !isPinching.current) return;

        if (e.touches.length === 2) {
            e.preventDefault(); // Prevent page scroll during pinch

            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleChange = currentDistance / initialDistance.current;

            // Calculate delta from last scale
            const delta = (scaleChange - lastScale.current) * 0.5; // Sensitivity adjustment

            // Only trigger if significant change
            if (Math.abs(delta) > 0.02) {
                onScale(selectedItemId, delta);
                lastScale.current = scaleChange;
            }
        }
    }, [enabled, selectedItemId, onScale]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (e.touches.length < 2) {
            isPinching.current = false;
            lastScale.current = 1;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return { containerRef };
};

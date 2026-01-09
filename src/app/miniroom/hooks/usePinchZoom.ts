"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface PinchZoomState {
    scale: number;
    translateX: number;
    translateY: number;
}

interface UsePinchZoomOptions {
    minScale?: number;
    maxScale?: number;
    enabled?: boolean;
}

interface UsePinchZoomReturn {
    scale: number;
    translateX: number;
    translateY: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    resetZoom: () => void;
    isZoomed: boolean;
}

export const usePinchZoom = (options: UsePinchZoomOptions = {}): UsePinchZoomReturn => {
    const { minScale = 1, maxScale = 3, enabled = true } = options;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState<PinchZoomState>({
        scale: 1,
        translateX: 0,
        translateY: 0,
    });

    // Touch state refs (not reactive, for gesture tracking)
    const initialDistance = useRef<number>(0);
    const initialScale = useRef<number>(1);
    const initialCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const initialTranslate = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isPinching = useRef<boolean>(false);
    const isPanning = useRef<boolean>(false);
    const lastTouchPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const getDistance = (touch1: Touch, touch2: Touch): number => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (touch1: Touch, touch2: Touch): { x: number; y: number } => {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        };
    };

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        if (e.touches.length === 2) {
            // Pinch start
            isPinching.current = true;
            isPanning.current = false;
            initialDistance.current = getDistance(e.touches[0], e.touches[1]);
            initialScale.current = state.scale;
            initialCenter.current = getCenter(e.touches[0], e.touches[1]);
            initialTranslate.current = { x: state.translateX, y: state.translateY };
        } else if (e.touches.length === 1 && state.scale > 1) {
            // Pan start (only when zoomed in)
            isPanning.current = true;
            isPinching.current = false;
            lastTouchPos.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        }
    }, [enabled, state.scale, state.translateX, state.translateY]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        if (isPinching.current && e.touches.length === 2) {
            e.preventDefault(); // Prevent page scroll during pinch

            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const currentCenter = getCenter(e.touches[0], e.touches[1]);

            // Calculate new scale
            const scaleChange = currentDistance / initialDistance.current;
            let newScale = initialScale.current * scaleChange;
            newScale = Math.max(minScale, Math.min(maxScale, newScale));

            // Calculate translation to keep pinch center in place
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                const containerCenterX = rect.left + rect.width / 2;
                const containerCenterY = rect.top + rect.height / 2;

                // How much the center moved
                const centerDeltaX = currentCenter.x - initialCenter.current.x;
                const centerDeltaY = currentCenter.y - initialCenter.current.y;

                // New translate
                let newTranslateX = initialTranslate.current.x + centerDeltaX;
                let newTranslateY = initialTranslate.current.y + centerDeltaY;

                // Clamp translation to prevent excessive panning
                const maxTranslateX = (rect.width * (newScale - 1)) / 2;
                const maxTranslateY = (rect.height * (newScale - 1)) / 2;
                newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX));
                newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY));

                setState({
                    scale: newScale,
                    translateX: newTranslateX,
                    translateY: newTranslateY,
                });
            }
        } else if (isPanning.current && e.touches.length === 1 && state.scale > 1) {
            e.preventDefault(); // Prevent page scroll during pan

            const deltaX = e.touches[0].clientX - lastTouchPos.current.x;
            const deltaY = e.touches[0].clientY - lastTouchPos.current.y;

            lastTouchPos.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };

            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                const maxTranslateX = (rect.width * (state.scale - 1)) / 2;
                const maxTranslateY = (rect.height * (state.scale - 1)) / 2;

                setState((prev) => ({
                    ...prev,
                    translateX: Math.max(-maxTranslateX, Math.min(maxTranslateX, prev.translateX + deltaX)),
                    translateY: Math.max(-maxTranslateY, Math.min(maxTranslateY, prev.translateY + deltaY)),
                }));
            }
        }
    }, [enabled, minScale, maxScale, state.scale]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (e.touches.length < 2) {
            isPinching.current = false;
        }
        if (e.touches.length === 0) {
            isPanning.current = false;
        }

        // Reset to scale 1 if very close
        if (state.scale < 1.05) {
            setState({ scale: 1, translateX: 0, translateY: 0 });
        }
    }, [state.scale]);

    const resetZoom = useCallback(() => {
        setState({ scale: 1, translateX: 0, translateY: 0 });
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

    return {
        scale: state.scale,
        translateX: state.translateX,
        translateY: state.translateY,
        containerRef,
        resetZoom,
        isZoomed: state.scale > 1,
    };
};

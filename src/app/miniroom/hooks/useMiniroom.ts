import { useState, useCallback, useMemo } from "react";
import { Room, PlacedItem } from "@/types/miniroom";
import { AVAILABLE_ITEMS, INITIAL_ROOM } from "@/data/mockMiniroom";
import { BACKGROUNDS, DEFAULT_BACKGROUND_ID } from "@/data/backgrounds";
import { v4 as uuidv4 } from "uuid";

export const useMiniroom = () => {
    const [room, setRoom] = useState<Room>(() => {
        const initialBgId = INITIAL_ROOM.backgroundId || DEFAULT_BACKGROUND_ID;
        const initialBackground = BACKGROUNDS.find((b) => b.id === initialBgId) || BACKGROUNDS[0];
        return {
            ...INITIAL_ROOM,
            backgroundId: initialBgId,
            background: initialBackground.url,
        };
    });
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const currentBackground = useMemo(
        () => BACKGROUNDS.find((b) => b.id === room.backgroundId) || BACKGROUNDS[0],
        [room.backgroundId]
    );

    const placeItem = useCallback(
        (itemId: string) => {
            const itemDef = AVAILABLE_ITEMS.find((i) => i.id === itemId);
            if (!itemDef) return;

            // Random position within canvas bounds (with some padding)
            const padding = 50;
            const maxX = currentBackground.width - itemDef.width - padding;
            const maxY = currentBackground.height - itemDef.height - padding;
            const randomX = padding + Math.random() * Math.max(0, maxX - padding);
            const randomY = padding + Math.random() * Math.max(0, maxY - padding);

            const newItem: PlacedItem = {
                instanceId: uuidv4(),
                itemId: itemId,
                posX: randomX,
                posY: randomY,
                rotation: 0,
                isFlipped: false,
                scale: 1,
            };

            setRoom((prev) => ({
                ...prev,
                items: [...prev.items, newItem], // Push to end (top layer)
            }));
            setSelectedItemId(newItem.instanceId);
        },
        [currentBackground]
    );

    const moveItem = useCallback((instanceId: string, x: number, y: number) => {
        setRoom((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId ? { ...item, posX: x, posY: y } : item
            ),
        }));
    }, []);

    const deleteItem = useCallback((instanceId: string) => {
        setRoom((prev) => {
            const itemToDelete = prev.items.find((i) => i.instanceId === instanceId);
            if (!itemToDelete) return prev;

            const itemDef = AVAILABLE_ITEMS.find((def) => def.id === itemToDelete.itemId);
            if (itemDef?.type === "character") {
                // Characters cannot be deleted
                return prev;
            }

            return {
                ...prev,
                items: prev.items.filter((item) => item.instanceId !== instanceId),
            };
        });
        // Clear selection if deleted
        if (selectedItemId === instanceId) {
            setSelectedItemId(null);
        }
    }, [selectedItemId]);

    const rotateItem = useCallback((instanceId: string) => {
        setRoom((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId
                    ? { ...item, rotation: (item.rotation + 90) % 360 }
                    : item
            ),
        }));
    }, []);

    const flipItem = useCallback((instanceId: string) => {
        setRoom((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId
                    ? { ...item, isFlipped: !item.isFlipped }
                    : item
            ),
        }));
    }, []);

    const scaleItem = useCallback(
        (instanceId: string, delta: number) => {
            setRoom((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    item.instanceId === instanceId
                        ? {
                            ...item,
                            scale: Math.max(0.2, item.scale + delta), // Limit min 0.2x, No Max Limit
                        }
                        : item
                ),
            }));
        },
        []
    );

    const setBackground = useCallback((bgId: string) => {
        const bgDef = BACKGROUNDS.find((b) => b.id === bgId);
        if (!bgDef) return;

        setRoom((prev) => ({
            ...prev,
            backgroundId: bgId,
            background: bgDef.url, // Sync URL for canvas
        }));
    }, []);

    const selectItem = useCallback((instanceId: string | null) => {
        setSelectedItemId(instanceId);
    }, []);

    const bringForward = useCallback((instanceId: string) => {
        setRoom((prev) => {
            const items = [...prev.items];
            const index = items.findIndex((i) => i.instanceId === instanceId);
            if (index === -1 || index === items.length - 1) return prev; // Already at top
            // Swap with next item
            [items[index], items[index + 1]] = [items[index + 1], items[index]];
            return { ...prev, items };
        });
    }, []);

    const sendBackward = useCallback((instanceId: string) => {
        setRoom((prev) => {
            const items = [...prev.items];
            const index = items.findIndex((i) => i.instanceId === instanceId);
            if (index <= 0) return prev; // Already at bottom
            // Swap with previous item
            [items[index - 1], items[index]] = [items[index], items[index - 1]];
            return { ...prev, items };
        });
    }, []);

    return {
        room,
        selectedItemId,
        selectItem,
        placeItem,
        moveItem,
        rotateItem,
        flipItem,
        scaleItem,
        deleteItem,
        bringForward,
        sendBackward,
        setBackground,
        currentBackground,
    };
};

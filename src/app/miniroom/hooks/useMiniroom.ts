"use client";

import { useState, useCallback, useEffect } from "react";
import { Room, PlacedItem, Item } from "@/types/miniroom";
import { INITIAL_ROOM, AVAILABLE_ITEMS } from "@/data/mockMiniroom";
import { v4 as uuidv4 } from "uuid";

// Debounce helper
const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

export const useMiniroom = () => {
    const [room, setRoom] = useState<Room>(INITIAL_ROOM);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-save trigger
    const debouncedRoom = useDebounce(room, 500);

    useEffect(() => {
        if (debouncedRoom !== INITIAL_ROOM) {
            saveRoom(debouncedRoom);
        }
    }, [debouncedRoom]);

    const saveRoom = async (data: Room) => {
        setIsSaving(true);
        console.log("Saving Miniroom Data...", JSON.stringify(data, null, 2));
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
        }, 500);
    };

    const addItem = useCallback((itemId: string) => {
        const itemDef = AVAILABLE_ITEMS.find((i) => i.id === itemId);
        if (!itemDef) return;

        const newItem: PlacedItem = {
            instanceId: uuidv4(),
            itemId: itemId,
            posX: 400 - itemDef.width / 2, // Center X (assuming 800 width)
            posY: 300 - itemDef.height / 2, // Center Y (assuming 600 height)
            rotation: 0,
            isFlipped: false,
        };

        setRoom((prev) => ({
            ...prev,
            items: [...prev.items, newItem], // Push to end (top layer)
        }));
        setSelectedItemId(newItem.instanceId);
    }, []);

    const moveItem = useCallback((instanceId: string, x: number, y: number) => {
        setRoom((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId ? { ...item, posX: x, posY: y } : item
            ),
        }));
    }, []);

    const removeItem = useCallback((instanceId: string) => {
        setRoom((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.instanceId !== instanceId),
        }));
    }, []);

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

    return {
        room,
        addItem,
        moveItem,
        removeItem,
        isSaving,
        AVAILABLE_ITEMS,
        selectedItemId,
        setSelectedItemId,
        rotateItem,
        flipItem,
    };
};

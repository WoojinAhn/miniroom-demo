import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Room, PlacedItem } from "@/types/miniroom";
import { AVAILABLE_ITEMS, INITIAL_ROOM } from "@/data/mockMiniroom";
import { BACKGROUNDS, DEFAULT_BACKGROUND_ID } from "@/data/backgrounds";
import { APP_VERSION } from "@/config/appVersion";
import { PresetTemplate } from "@/data/presetTemplates";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "miniroom_room_state";
const HISTORY_LIMIT = 50;

interface PersistedState {
    version: string;
    room: Room;
}

function loadRoomFromStorage(): Room | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed: PersistedState = JSON.parse(raw);
        if (!parsed.room || !parsed.version) return null;
        return parsed.room;
    } catch {
        return null;
    }
}

function buildInitialRoom(): Room {
    const saved = loadRoomFromStorage();
    if (saved) {
        // Ensure background URL is in sync with the background definition
        const bgId = saved.backgroundId || DEFAULT_BACKGROUND_ID;
        const bg = BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[0];
        return { ...saved, backgroundId: bgId, background: bg.url };
    }

    const initialBgId = INITIAL_ROOM.backgroundId || DEFAULT_BACKGROUND_ID;
    const initialBackground = BACKGROUNDS.find((b) => b.id === initialBgId) || BACKGROUNDS[0];
    return {
        ...INITIAL_ROOM,
        backgroundId: initialBgId,
        background: initialBackground.url,
    };
}

export const useMiniroom = () => {
    const [room, setRoom] = useState<Room>(buildInitialRoom);

    // History stack — useRef to avoid re-renders on history changes
    const historyRef = useRef<Room[]>([]);
    const historyIndexRef = useRef<number>(-1);
    // Tracks whether canUndo/canRedo should trigger a re-render
    const [historySize, setHistorySize] = useState(0);

    // Push current room to history before applying a new state
    const pushHistory = useCallback((snapshot: Room) => {
        const history = historyRef.current;
        const index = historyIndexRef.current;

        // Drop any redo states beyond current index
        const trimmed = history.slice(0, index + 1);
        trimmed.push(snapshot);

        // Cap at HISTORY_LIMIT
        if (trimmed.length > HISTORY_LIMIT) {
            trimmed.shift();
        }

        historyRef.current = trimmed;
        historyIndexRef.current = trimmed.length - 1;
        setHistorySize(trimmed.length);
    }, []);

    // Wrap setRoom for discrete actions (non-drag)
    const setRoomWithHistory = useCallback(
        (updater: (prev: Room) => Room) => {
            setRoom((prev) => {
                pushHistory(prev);
                return updater(prev);
            });
        },
        [pushHistory]
    );

    // Debounced save to localStorage on every room change
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            try {
                const state: PersistedState = { version: APP_VERSION, room };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            } catch {
                // localStorage may be unavailable (e.g., private browsing quota exceeded)
            }
        }, 500);
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [room]);

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const currentBackground = useMemo(
        () => BACKGROUNDS.find((b) => b.id === room.backgroundId) || BACKGROUNDS[0],
        [room.backgroundId]
    );

    // Drag snapshot: snapshot taken at drag start, not on every move
    const dragSnapshotRef = useRef<Room | null>(null);

    const beginDrag = useCallback((snapshot: Room) => {
        // Only record once per drag gesture
        if (dragSnapshotRef.current === null) {
            dragSnapshotRef.current = snapshot;
        }
    }, []);

    const commitDrag = useCallback(() => {
        if (dragSnapshotRef.current !== null) {
            pushHistory(dragSnapshotRef.current);
            dragSnapshotRef.current = null;
        }
    }, [pushHistory]);

    const undo = useCallback(() => {
        const index = historyIndexRef.current;
        if (index < 0) return;

        const snapshot = historyRef.current[index];
        historyIndexRef.current = index - 1;
        setHistorySize(historyRef.current.length); // trigger re-render for canUndo/canRedo
        setRoom(snapshot);
    }, []);

    const redo = useCallback(() => {
        const history = historyRef.current;
        const index = historyIndexRef.current;
        if (index >= history.length - 1) return;

        const snapshot = history[index + 1];
        historyIndexRef.current = index + 1;
        setHistorySize(history.length);
        setRoom(snapshot);
    }, []);

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

            setRoomWithHistory((prev) => ({
                ...prev,
                items: [...prev.items, newItem], // Push to end (top layer)
            }));
            setSelectedItemId(newItem.instanceId);
        },
        [currentBackground, setRoomWithHistory]
    );

    const moveItem = useCallback((instanceId: string, x: number, y: number) => {
        setRoom((prev) => {
            // Snapshot before the drag begins (only first call per drag)
            beginDrag(prev);
            return {
                ...prev,
                items: prev.items.map((item) =>
                    item.instanceId === instanceId ? { ...item, posX: x, posY: y } : item
                ),
            };
        });
    }, [beginDrag]);

    const endDrag = useCallback(() => {
        commitDrag();
    }, [commitDrag]);

    const deleteItem = useCallback((instanceId: string) => {
        setRoomWithHistory((prev) => {
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
    }, [selectedItemId, setRoomWithHistory]);

    const rotateItem = useCallback((instanceId: string) => {
        setRoomWithHistory((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId
                    ? { ...item, rotation: (item.rotation + 90) % 360 }
                    : item
            ),
        }));
    }, [setRoomWithHistory]);

    const flipItem = useCallback((instanceId: string) => {
        setRoomWithHistory((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.instanceId === instanceId
                    ? { ...item, isFlipped: !item.isFlipped }
                    : item
            ),
        }));
    }, [setRoomWithHistory]);

    const scaleItem = useCallback(
        (instanceId: string, delta: number) => {
            setRoomWithHistory((prev) => ({
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
        [setRoomWithHistory]
    );

    const setBackground = useCallback((bgId: string) => {
        const bgDef = BACKGROUNDS.find((b) => b.id === bgId);
        if (!bgDef) return;

        setRoomWithHistory((prev) => ({
            ...prev,
            backgroundId: bgId,
            background: bgDef.url, // Sync URL for canvas
        }));
    }, [setRoomWithHistory]);

    const selectItem = useCallback((instanceId: string | null) => {
        setSelectedItemId(instanceId);
    }, []);

    const bringForward = useCallback((instanceId: string) => {
        setRoomWithHistory((prev) => {
            const items = [...prev.items];
            const index = items.findIndex((i) => i.instanceId === instanceId);
            if (index === -1 || index === items.length - 1) return prev; // Already at top
            // Swap with next item
            [items[index], items[index + 1]] = [items[index + 1], items[index]];
            return { ...prev, items };
        });
    }, [setRoomWithHistory]);

    const sendBackward = useCallback((instanceId: string) => {
        setRoomWithHistory((prev) => {
            const items = [...prev.items];
            const index = items.findIndex((i) => i.instanceId === instanceId);
            if (index <= 0) return prev; // Already at bottom
            // Swap with previous item
            [items[index - 1], items[index]] = [items[index], items[index - 1]];
            return { ...prev, items };
        });
    }, [setRoomWithHistory]);

    // canUndo/canRedo depend on historySize (updated on each push/undo/redo)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _historySize = historySize; // keep reactive dependency
    const undoAvailable = historyIndexRef.current >= 0;
    const redoAvailable = historyIndexRef.current < historyRef.current.length - 1;

    const loadTemplate = useCallback((template: PresetTemplate) => {
        const bgDef = BACKGROUNDS.find((b) => b.id === template.backgroundId) || BACKGROUNDS[0];
        const newItems: PlacedItem[] = template.items.map((item) => ({
            instanceId: uuidv4(),
            itemId: item.itemId,
            posX: item.posX,
            posY: item.posY,
            rotation: item.rotation,
            isFlipped: item.isFlipped,
            scale: item.scale,
        }));
        setRoomWithHistory((prev) => ({
            ...prev,
            backgroundId: bgDef.id,
            background: bgDef.url,
            items: newItems,
            lastUpdated: new Date().toISOString(),
        }));
        setSelectedItemId(null);
    }, [setRoomWithHistory]);

    return {
        room,
        selectedItemId,
        selectItem,
        placeItem,
        moveItem,
        endDrag,
        rotateItem,
        flipItem,
        scaleItem,
        deleteItem,
        bringForward,
        sendBackward,
        setBackground,
        currentBackground,
        loadTemplate,
        undo,
        redo,
        canUndo: undoAvailable,
        canRedo: redoAvailable,
    };
};

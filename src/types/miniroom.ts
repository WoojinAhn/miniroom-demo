export interface Item {
    id: string; // "item_chair_01"
    name: string;
    type: 'furniture' | 'decoration' | 'electronics' | 'character' | 'special';
    width: number; // in pixels
    height: number; // in pixels
    color?: string; // CSS color for placeholder
    imageUrl?: string; // Path to pixel art asset
    paddingTop?: number; // Visual padding from top in pixels
    paddingBottom?: number; // Visual padding from bottom in pixels
    paddingLeft?: number; // Visual padding from left in pixels
    paddingRight?: number; // Visual padding from right in pixels
}

export interface PlacedItem {
    instanceId: string; // "uuid_v4_..."
    itemId: string; // Refers to Item.id
    posX: number;
    posY: number;
    rotation: number; // 0, 90, 180, 270
    isFlipped: boolean;
    scale: number; // 1.0 = 100%
}

export interface Room {
    id: string;
    userId: string;
    name: string;
    background: string; // Keep for color fallback? Or maybe remove later.
    backgroundId: string; // ID from BACKGROUNDS
    items: PlacedItem[]; // Render order = Array order
    lastUpdated: string; // ISO Date
}

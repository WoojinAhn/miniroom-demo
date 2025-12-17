export interface Item {
    id: string; // "item_chair_01"
    name: string;
    type: 'furniture' | 'decoration' | 'electronics';
    width: number; // in pixels
    height: number; // in pixels
    color: string; // CSS color for placeholder
}

export interface PlacedItem {
    instanceId: string; // "uuid_v4_..."
    itemId: string; // Refers to Item.id
    posX: number;
    posY: number;
}

export interface Room {
    id: string;
    userId: string;
    name: string;
    background: string; // CSS color or image URL
    items: PlacedItem[]; // Render order = Array order
    lastUpdated: string; // ISO Date
}

import { Item, Room } from "@/types/miniroom";

export const AVAILABLE_ITEMS: Item[] = [
    {
        id: "item_chair_red",
        name: "Red Chair",
        type: "furniture",
        width: 60, // Adjusted width for pixel art
        height: 60,
        color: "#e74c3c",
        imageUrl: "/items/chair.png",
    },
    {
        id: "item_table_wood",
        name: "Wooden Table",
        type: "furniture",
        width: 100,
        height: 60,
        color: "#d35400",
        imageUrl: "/items/table.png",
    },
    {
        id: "item_rug_blue",
        name: "Blue Rug",
        type: "decoration",
        width: 120,
        height: 80,
        color: "#3498db",
    },
    {
        id: "item_plant",
        name: "Potted Plant",
        type: "decoration",
        width: 30,
        height: 60,
        color: "#2ecc71",
    },
    {
        id: "item_tv",
        name: "Retro TV",
        type: "electronics",
        width: 60,
        height: 50,
        color: "#34495e",
    },
];

export const INITIAL_ROOM: Room = {
    id: "room_001",
    userId: "user_choco",
    name: "My Sweet Miniroom",
    background: "#ecf0f1", // Light gray background
    lastUpdated: new Date().toISOString(),
    items: [
        {
            instanceId: "inst_1",
            itemId: "item_rug_blue",
            posX: 100,
            posY: 400,
            rotation: 0,
            isFlipped: false,
        },
        {
            instanceId: "inst_2",
            itemId: "item_plant_pot",
            posX: 600,
            posY: 100,
            rotation: 0,
            isFlipped: false,
        },
    ],
};

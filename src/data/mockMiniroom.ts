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
        id: "item_rug_striped",
        name: "Striped Rug",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/rug_striped.png",
    },
    {
        id: "item_plant",
        name: "Potted Plant",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/potted_plant.png",
    },
    {
        id: "item_tv",
        name: "Retro TV",
        type: "electronics",
        width: 126,
        height: 126,
        imageUrl: "/items/tv_monitor.png",
    },
    {
        id: "item_sofa_blue",
        name: "Blue Sofa",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/sofa_blue.png",
    },
    {
        id: "item_coffee_table",
        name: "Oval Coffee Table",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/coffee_table_oval.png",
    },
    {
        id: "item_camping_table",
        name: "Camping Table",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/camping_table.png",
    },
    {
        id: "item_camping_chair",
        name: "Camping Chair",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/camping_chair.png",
    },
    {
        id: "item_shelf_wood",
        name: "Wooden Shelf",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/shelf_wood.png",
    },
    {
        id: "item_drawer_chest",
        name: "Drawer Chest",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/drawer_chest.png",
    },
    {
        id: "item_display_fridge",
        name: "Display Fridge",
        type: "electronics",
        width: 126,
        height: 126,
        imageUrl: "/items/display_refrigerator.png",
    },
    {
        id: "item_induction",
        name: "Induction Cooktop",
        type: "electronics",
        width: 126,
        height: 126,
        imageUrl: "/items/induction_cooktop.png",
    },
    {
        id: "item_pendant_light",
        name: "Pendant Light",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/pendant_light_round.png",
    },
    {
        id: "item_floor_lamp",
        name: "Floor Lamp",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/floor_lamp_orange.png",
    },
    {
        id: "item_wall_frame",
        name: "Wall Frame",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/wall_frame_leaf.png",
    },
    {
        id: "item_bed_blue",
        name: "Blue Bed",
        type: "furniture",
        width: 126,
        height: 126,
        imageUrl: "/items/bed_blue_dots.png",
    },
    {
        id: "item_mirror_gold",
        name: "Standing Mirror",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/mirror_full_gold.png",
    },
    {
        id: "item_clock_wall",
        name: "Wall Clock",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/clock_wall_simple.png",
    },
    {
        id: "item_cup_black",
        name: "Black Cup",
        type: "decoration",
        width: 126,
        height: 126,
        imageUrl: "/items/cup_black.png",
    },
    {
        id: "item_rice_cooker",
        name: "Rice Cooker",
        type: "electronics",
        width: 126,
        height: 126,
        imageUrl: "/items/rice_cooker.png",
    },
    {
        id: "item_cha01",
        name: "Character 01",
        type: "character",
        width: 60,
        height: 120,
        color: "#transparent",
        imageUrl: "/characters/cha01.png",
    },
    {
        id: "item_cha02",
        name: "Character 02",
        type: "character",
        width: 60,
        height: 120,
        color: "#transparent",
        imageUrl: "/characters/cha02.png",
    },
    {
        id: "item_cha03",
        name: "Character 03",
        type: "character",
        width: 60,
        height: 120,
        color: "#transparent",
        imageUrl: "/characters/cha03.png",
    },
];

// Import generated items
import generatedItems from "./generated-inventory.json";

// Merge generated items into AVAILABLE_ITEMS, avoiding duplicates
// Hardcoded items take precedence
generatedItems.forEach((genItem: any) => {
    const exists = AVAILABLE_ITEMS.some((i) => i.id === genItem.id);
    if (!exists) {
        AVAILABLE_ITEMS.push(genItem as Item);
    }
});

export const INITIAL_ROOM: Room = {
    id: "room_001",
    userId: "user_choco",
    name: "My Sweet Miniroom",
    backgroundId: "bg_room",
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
            scale: 1,
        },
        {
            instanceId: "inst_2",
            itemId: "item_plant_pot",
            posX: 600,
            posY: 100,
            rotation: 0,
            isFlipped: false,
            scale: 1,
        },
        {
            instanceId: "inst_cha01_default",
            itemId: "item_cha01",
            posX: 345, // (750-60)/2
            posY: 243, // (606-120)/2
            rotation: 0,
            isFlipped: false,
            scale: 1,
        },
    ],
};

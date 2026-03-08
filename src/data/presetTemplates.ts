// Preset room templates for new users.
// Item positions are based on bg_room canvas (750 x 606) and bg_grass (750 x 612).
// Characters are included but users may see their own character replaced on load.

export interface PresetItem {
    itemId: string;
    posX: number;
    posY: number;
    rotation: number;
    isFlipped: boolean;
    scale: number;
}

export interface PresetTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string; // text/emoji placeholder
    backgroundId: string;
    items: PresetItem[];
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
    {
        id: "preset_cozy_bedroom",
        name: "Cozy Bedroom",
        description: "A warm bedroom with a bed, shelf, and soft lighting.",
        thumbnail: "🛏️",
        backgroundId: "bg_room",
        items: [
            // Bed on the left
            { itemId: "item_bed_blue_dots", posX: 80,  posY: 330, rotation: 0, isFlipped: false, scale: 1.3 },
            // Wooden shelf top-right
            { itemId: "item_shelf_wood",    posX: 560, posY: 100, rotation: 0, isFlipped: false, scale: 1.1 },
            // Floor lamp right corner
            { itemId: "item_floor_lamp_orange", posX: 590, posY: 250, rotation: 0, isFlipped: false, scale: 1.0 },
            // Drawer chest left wall
            { itemId: "item_drawer_chest",  posX: 60,  posY: 180, rotation: 0, isFlipped: false, scale: 1.0 },
            // Wall clock center-top
            { itemId: "item_clock_wall_simple", posX: 310, posY: 80,  rotation: 0, isFlipped: false, scale: 0.8 },
            // Wall frame next to shelf
            { itemId: "item_wall_frame_leaf", posX: 430, posY: 110, rotation: 0, isFlipped: false, scale: 0.9 },
            // Potted plant bottom-right
            { itemId: "item_potted_plant",  posX: 590, posY: 400, rotation: 0, isFlipped: false, scale: 1.0 },
            // Striped rug center floor
            { itemId: "item_rug_striped",   posX: 260, posY: 400, rotation: 0, isFlipped: false, scale: 1.2 },
            // Character center
            { itemId: "item_cha01",         posX: 345, posY: 350, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_camping_outdoor",
        name: "Camping Outdoor",
        description: "An outdoor scene with a tent, campfire, and nature.",
        thumbnail: "⛺",
        backgroundId: "bg_grass",
        items: [
            // Tent left side
            { itemId: "special_camping_tent_orange", posX: 80,  posY: 250, rotation: 0, isFlipped: false, scale: 1.4 },
            // Camping table center
            { itemId: "item_camping_table", posX: 310, posY: 370, rotation: 0, isFlipped: false, scale: 1.1 },
            // Camping chair left of table
            { itemId: "item_camping_chair", posX: 185, posY: 400, rotation: 0, isFlipped: false, scale: 1.0 },
            // Camping chair right of table
            { itemId: "item_camping_chair", posX: 490, posY: 400, rotation: 0, isFlipped: true,  scale: 1.0 },
            // Cup on table
            { itemId: "item_cup_black",     posX: 345, posY: 345, rotation: 0, isFlipped: false, scale: 0.6 },
            // Potted plant right side
            { itemId: "item_potted_plant",  posX: 580, posY: 260, rotation: 0, isFlipped: false, scale: 1.0 },
            // White rabbit as nature companion
            { itemId: "special_rabbit_white", posX: 580, posY: 410, rotation: 0, isFlipped: true,  scale: 1.0 },
            // Character by the tent
            { itemId: "item_cha01",         posX: 260, posY: 360, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_minimalist_studio",
        name: "Minimalist Studio",
        description: "A clean, modern workspace with just the essentials.",
        thumbnail: "🖥️",
        backgroundId: "bg_room",
        items: [
            // iMac desk center
            { itemId: "item_아이맥",         posX: 280, posY: 160, rotation: 0, isFlipped: false, scale: 1.1 },
            // Shelf left
            { itemId: "item_shelf_wood",    posX: 80,  posY: 130, rotation: 0, isFlipped: false, scale: 1.0 },
            // Plant on shelf (small)
            { itemId: "item_potted_plant",  posX: 95,  posY: 160, rotation: 0, isFlipped: false, scale: 0.5 },
            // Chair in front of desk
            { itemId: "item_chair_red",     posX: 345, posY: 360, rotation: 0, isFlipped: false, scale: 1.2 },
            // Cup on desk
            { itemId: "item_cup_black",     posX: 460, posY: 200, rotation: 0, isFlipped: false, scale: 0.6 },
            // Floor lamp right
            { itemId: "item_floor_lamp_orange", posX: 590, posY: 200, rotation: 0, isFlipped: false, scale: 1.0 },
            // Character sitting at desk area
            { itemId: "item_cha01",         posX: 330, posY: 340, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_ramen_kitchen",
        name: "Ramen Kitchen",
        description: "A cozy kitchen corner with ramen and cooking vibes.",
        thumbnail: "🍜",
        backgroundId: "bg_room",
        items: [
            // Display fridge left
            { itemId: "item_display_refrigerator", posX: 60,  posY: 150, rotation: 0, isFlipped: false, scale: 1.1 },
            // Induction cooktop on counter area
            { itemId: "item_induction_cooktop", posX: 250, posY: 230, rotation: 0, isFlipped: false, scale: 1.0 },
            // Rice cooker next to induction
            { itemId: "item_rice_cooker",   posX: 410, posY: 240, rotation: 0, isFlipped: false, scale: 1.0 },
            // Shin ramen on the side
            { itemId: "item_shin_ramen",    posX: 530, posY: 280, rotation: 0, isFlipped: false, scale: 0.9 },
            // Buldak ramen next to shin ramen
            { itemId: "item_buldak_ramen",  posX: 600, posY: 270, rotation: 0, isFlipped: true,  scale: 0.9 },
            // Pendant light overhead
            { itemId: "item_pendant_light_round", posX: 295, posY: 80,  rotation: 0, isFlipped: false, scale: 1.0 },
            // Cup on counter
            { itemId: "item_cup_black",     posX: 195, posY: 240, rotation: 0, isFlipped: false, scale: 0.7 },
            // Character cooking
            { itemId: "item_cha01",         posX: 300, posY: 370, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
];

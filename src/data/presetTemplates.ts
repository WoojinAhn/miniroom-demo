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

// Position reference for bg_room (750x606):
//   Wall zone: y 50–280 (hung items: clocks, frames, pendant lights)
//   Against-wall furniture: bottom edge y 300–400 (shelves, dressers, fridges)
//   Floor zone: bottom edge y 400–540 (beds, rugs, chairs, characters)
//   transformOrigin is "center bottom", so posY + originalHeight = visual bottom at any scale.
//
// Position reference for bg_grass (750x612):
//   Open field. "Further" items at y ~300–380, "closer" items at y ~400–520.

export const PRESET_TEMPLATES: PresetTemplate[] = [
    {
        id: "preset_cozy_bedroom",
        name: "Cozy Bedroom",
        description: "A warm bedroom with a bed, shelf, and soft lighting.",
        thumbnail: "🛏️",
        backgroundId: "bg_room",
        items: [
            // --- Wall-hung items ---
            // Wall clock (78x83) — centered on back wall
            { itemId: "item_clock_wall_simple", posX: 330, posY: 70,  rotation: 0, isFlipped: false, scale: 0.7 },
            // Wall frame (72x57) — right of clock
            { itemId: "item_wall_frame_leaf",   posX: 460, posY: 100, rotation: 0, isFlipped: false, scale: 0.8 },

            // --- Against-wall furniture ---
            // Wooden shelf (73x67) — upper-right wall, bottom ~y:270
            { itemId: "item_shelf_wood",    posX: 540, posY: 203, rotation: 0, isFlipped: false, scale: 1.3 },
            // Drawer chest (60x77) — left wall, bottom ~y:340
            { itemId: "item_drawer_chest",  posX: 80,  posY: 263, rotation: 0, isFlipped: false, scale: 1.3 },

            // --- Floor items ---
            // Bed (91x69) — left side, scale 2.2 for furniture-sized, bottom ~y:460
            { itemId: "item_bed_blue_dots", posX: 50,  posY: 391, rotation: 0, isFlipped: false, scale: 2.2 },
            // Striped rug (95x45) — center floor, scale 2.5 for area-rug size, bottom ~y:500
            { itemId: "item_rug_striped",   posX: 250, posY: 455, rotation: 0, isFlipped: false, scale: 2.5 },
            // Floor lamp (24x89) — right side, scale 1.3 ≈ character height, bottom ~y:440
            { itemId: "item_floor_lamp_orange", posX: 620, posY: 351, rotation: 0, isFlipped: false, scale: 1.3 },
            // Potted plant (32x92) — right of lamp, scale 0.9, bottom ~y:460
            { itemId: "item_potted_plant",  posX: 580, posY: 368, rotation: 0, isFlipped: false, scale: 0.9 },
            // Character (60x120) — center floor, bottom ~y:490
            { itemId: "item_cha01",         posX: 340, posY: 370, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_camping_outdoor",
        name: "Camping Outdoor",
        description: "An outdoor scene with a tent, campfire, and nature.",
        thumbnail: "⛺",
        backgroundId: "bg_grass",
        items: [
            // --- Back row (further away) ---
            // Tent (97x58) — left side, scale 2.5 for shelter-sized, bottom ~y:380
            { itemId: "special_camping_tent_orange", posX: 80,  posY: 322, rotation: 0, isFlipped: false, scale: 2.5 },
            // Potted plant (32x92) — far right, scale 0.9, bottom ~y:390
            { itemId: "item_potted_plant",  posX: 610, posY: 298, rotation: 0, isFlipped: false, scale: 0.9 },

            // --- Middle row ---
            // Camping table (83x66) — center, scale 1.5, bottom ~y:440
            { itemId: "item_camping_table", posX: 300, posY: 374, rotation: 0, isFlipped: false, scale: 1.5 },
            // Cup on table (50x70) — on table, scale 0.35 for small cup, bottom ~y:410
            { itemId: "item_cup_black",     posX: 340, posY: 340, rotation: 0, isFlipped: false, scale: 0.35 },

            // --- Front row (closer to viewer) ---
            // Camping chair left (58x82) — left of table, scale 1.2, bottom ~y:480
            { itemId: "item_camping_chair", posX: 180, posY: 398, rotation: 0, isFlipped: false, scale: 1.2 },
            // Camping chair right (58x82) — right of table, flipped, scale 1.2, bottom ~y:480
            { itemId: "item_camping_chair", posX: 470, posY: 398, rotation: 0, isFlipped: true,  scale: 1.2 },
            // White rabbit (53x85) — right side, scale 0.8 small animal, bottom ~y:490
            { itemId: "special_rabbit_white", posX: 580, posY: 405, rotation: 0, isFlipped: true,  scale: 0.8 },
            // Character (60x120) — by tent, bottom ~y:470
            { itemId: "item_cha01",         posX: 260, posY: 350, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_minimalist_studio",
        name: "Minimalist Studio",
        description: "A clean, modern workspace with just the essentials.",
        thumbnail: "🖥️",
        backgroundId: "bg_room",
        items: [
            // --- Wall ---
            // Wooden shelf (73x67) — left wall, scale 1.2, bottom ~y:250
            { itemId: "item_shelf_wood",    posX: 100, posY: 183, rotation: 0, isFlipped: false, scale: 1.2 },
            // Small potted plant (32x92) — on shelf, scale 0.5, bottom ~y:220
            { itemId: "item_potted_plant",  posX: 115, posY: 128, rotation: 0, isFlipped: false, scale: 0.5 },

            // --- Against-wall desk area ---
            // iMac (236x190) — center desk, scale 0.55 for monitor-sized, bottom ~y:370
            { itemId: "item_아이맥",         posX: 260, posY: 180, rotation: 0, isFlipped: false, scale: 0.55 },
            // Cup on desk (50x70) — right of iMac, scale 0.35, bottom ~y:340
            { itemId: "item_cup_black",     posX: 430, posY: 270, rotation: 0, isFlipped: false, scale: 0.35 },
            // Floor lamp (24x89) — right corner, scale 1.3, bottom ~y:420
            { itemId: "item_floor_lamp_orange", posX: 600, posY: 331, rotation: 0, isFlipped: false, scale: 1.3 },

            // --- Floor ---
            // Red chair (60x60) — in front of desk, scale 1.3, bottom ~y:470
            { itemId: "item_chair_red",     posX: 340, posY: 410, rotation: 0, isFlipped: false, scale: 1.3 },
            // Character (60x120) — at desk, bottom ~y:490
            { itemId: "item_cha01",         posX: 320, posY: 370, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_ramen_kitchen",
        name: "Ramen Kitchen",
        description: "A cozy kitchen corner with ramen and cooking vibes.",
        thumbnail: "🍜",
        backgroundId: "bg_room",
        items: [
            // --- Wall ---
            // Pendant light (44x84) — hanging from ceiling center, scale 0.9, bottom ~y:150
            { itemId: "item_pendant_light_round", posX: 310, posY: 66,  rotation: 0, isFlipped: false, scale: 0.9 },

            // --- Counter area (against back wall) ---
            // Display fridge (62x78) — left wall, scale 1.5 ≈ character height, bottom ~y:370
            { itemId: "item_display_refrigerator", posX: 80,  posY: 292, rotation: 0, isFlipped: false, scale: 1.5 },
            // Induction cooktop (91x53) — center counter, scale 1.2, bottom ~y:350
            { itemId: "item_induction_cooktop", posX: 240, posY: 297, rotation: 0, isFlipped: false, scale: 1.2 },
            // Rice cooker (192x235) — scale 0.3 for appliance-sized, bottom ~y:345
            { itemId: "item_rice_cooker",   posX: 390, posY: 110, rotation: 0, isFlipped: false, scale: 0.3 },
            // Cup (50x70) — on counter, scale 0.4, bottom ~y:340
            { itemId: "item_cup_black",     posX: 210, posY: 270, rotation: 0, isFlipped: false, scale: 0.4 },
            // Shin ramen (236x198) — scale 0.25 for packet-sized, bottom ~y:350
            { itemId: "item_shin_ramen",    posX: 490, posY: 152, rotation: 0, isFlipped: false, scale: 0.25 },
            // Buldak ramen (236x208) — next to shin ramen, scale 0.25, bottom ~y:345
            { itemId: "item_buldak_ramen",  posX: 560, posY: 137, rotation: 0, isFlipped: true,  scale: 0.25 },

            // --- Floor ---
            // Character (60x120) — in front of counter, bottom ~y:490
            { itemId: "item_cha01",         posX: 300, posY: 370, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
];

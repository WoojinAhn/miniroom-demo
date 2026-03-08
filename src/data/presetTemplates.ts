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

// Position reference for bg_room (750x606) — isometric corner room:
//   Wall zone: y 60–200 (ONLY for hung items: clocks, frames, pendant lights)
//   Floor boundary: approx y≈350 at edges, y≈400 at center corner
//   ALL standing furniture/items must have visual bottom >= y:420 (clearly on floor)
//   Back row (against wall): bottom ≈ y:430
//   Middle row: bottom ≈ y:470–480
//   Front row: bottom ≈ y:510–530
//   transformOrigin is "center bottom", so visual bottom = posY + originalHeight.
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
            // --- Wall-hung items (only these may be on the wall) ---
            // Wall clock (78x83, scale 0.7) — hung on back wall
            { itemId: "item_clock_wall_simple", posX: 340, posY: 80,  rotation: 0, isFlipped: false, scale: 0.7 },
            // Wall frame (72x57, scale 0.8) — hung right of clock
            { itemId: "item_wall_frame_leaf",   posX: 470, posY: 110, rotation: 0, isFlipped: false, scale: 0.8 },

            // --- Floor back row (feet on floor, against wall, bottom ≈ y:430) ---
            // Drawer chest (60x77, scale 1.3) — left side
            { itemId: "item_drawer_chest",  posX: 100, posY: 353, rotation: 0, isFlipped: false, scale: 1.3 },
            // Wooden shelf (73x67, scale 1.3) — right side
            { itemId: "item_shelf_wood",    posX: 520, posY: 363, rotation: 0, isFlipped: false, scale: 1.3 },

            // --- Floor middle row (bottom ≈ y:470–480) ---
            // Bed (91x69, scale 2.2) — left
            { itemId: "item_bed_blue_dots", posX: 60,  posY: 411, rotation: 0, isFlipped: false, scale: 2.2 },
            // Floor lamp (24x89, scale 1.2) — right
            { itemId: "item_floor_lamp_orange", posX: 630, posY: 381, rotation: 0, isFlipped: false, scale: 1.2 },
            // Potted plant (32x92, scale 0.8) — right of shelf
            { itemId: "item_potted_plant",  posX: 580, posY: 378, rotation: 0, isFlipped: false, scale: 0.8 },

            // --- Floor front row (bottom ≈ y:510–530) ---
            // Striped rug (95x45, scale 2.5) — center floor
            { itemId: "item_rug_striped",   posX: 260, posY: 475, rotation: 0, isFlipped: false, scale: 2.5 },
            // Character (60x120, scale 1.0) — standing on rug
            { itemId: "item_cha01",         posX: 340, posY: 400, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_camping_outdoor",
        name: "Camping Outdoor",
        description: "An outdoor scene with a tent, campfire, and nature.",
        thumbnail: "⛺",
        backgroundId: "bg_grass",
        items: [
            // --- Back row (further away, bottom ≈ y:380) ---
            // Tent (97x58, scale 2.5)
            { itemId: "special_camping_tent_orange", posX: 80,  posY: 322, rotation: 0, isFlipped: false, scale: 2.5 },
            // Potted plant (32x92, scale 0.9) — far right
            { itemId: "item_potted_plant",  posX: 610, posY: 298, rotation: 0, isFlipped: false, scale: 0.9 },

            // --- Middle row (bottom ≈ y:440) ---
            // Camping table (83x66, scale 1.5)
            { itemId: "item_camping_table", posX: 300, posY: 374, rotation: 0, isFlipped: false, scale: 1.5 },
            // Cup on table (50x70, scale 0.35)
            { itemId: "item_cup_black",     posX: 340, posY: 340, rotation: 0, isFlipped: false, scale: 0.35 },

            // --- Front row (closer, bottom ≈ y:480–490) ---
            // Camping chair left (58x82, scale 1.2)
            { itemId: "item_camping_chair", posX: 180, posY: 398, rotation: 0, isFlipped: false, scale: 1.2 },
            // Camping chair right (58x82, scale 1.2, flipped)
            { itemId: "item_camping_chair", posX: 470, posY: 398, rotation: 0, isFlipped: true,  scale: 1.2 },
            // White rabbit (53x85, scale 0.8)
            { itemId: "special_rabbit_white", posX: 580, posY: 405, rotation: 0, isFlipped: true,  scale: 0.8 },
            // Character (60x120, scale 1.0) — by tent
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
            // --- Floor back row (against wall, bottom ≈ y:430) ---
            // Wooden shelf (73x67, scale 1.2) — left side, standing on floor
            { itemId: "item_shelf_wood",    posX: 90,  posY: 363, rotation: 0, isFlipped: false, scale: 1.2 },
            // Potted plant (32x92, scale 0.6) — next to shelf on floor
            { itemId: "item_potted_plant",  posX: 170, posY: 338, rotation: 0, isFlipped: false, scale: 0.6 },
            // iMac (236x190, scale 0.5) — on floor (includes its own stand/desk), bottom y:430
            { itemId: "item_아이맥",         posX: 260, posY: 240, rotation: 0, isFlipped: false, scale: 0.5 },
            // Cup (50x70, scale 0.35) — next to iMac on floor, bottom y:430
            { itemId: "item_cup_black",     posX: 420, posY: 360, rotation: 0, isFlipped: false, scale: 0.35 },
            // Floor lamp (24x89, scale 1.2) — right side, bottom y:430
            { itemId: "item_floor_lamp_orange", posX: 600, posY: 341, rotation: 0, isFlipped: false, scale: 1.2 },

            // --- Floor front row (bottom ≈ y:510–520) ---
            // Red chair (60x60, scale 1.3) — in front of desk area
            { itemId: "item_chair_red",     posX: 330, posY: 450, rotation: 0, isFlipped: false, scale: 1.3 },
            // Character (60x120, scale 1.0) — at desk
            { itemId: "item_cha01",         posX: 310, posY: 400, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
    {
        id: "preset_ramen_kitchen",
        name: "Ramen Kitchen",
        description: "A cozy kitchen corner with ramen and cooking vibes.",
        thumbnail: "🍜",
        backgroundId: "bg_room",
        items: [
            // --- Wall-hung (only pendant light) ---
            // Pendant light (44x84, scale 0.9) — hanging from ceiling
            { itemId: "item_pendant_light_round", posX: 310, posY: 66,  rotation: 0, isFlipped: false, scale: 0.9 },

            // --- Floor back row (all standing on floor, bottom ≈ y:430) ---
            // Display fridge (62x78, scale 1.5) — left side
            { itemId: "item_display_refrigerator", posX: 70,  posY: 352, rotation: 0, isFlipped: false, scale: 1.5 },
            // Camping table as kitchen counter (83x66, scale 1.8) — center
            { itemId: "item_camping_table", posX: 220, posY: 364, rotation: 0, isFlipped: false, scale: 1.8 },
            // Induction cooktop (91x53, scale 0.7) — on table surface (bottom ≈ y:360)
            { itemId: "item_induction_cooktop", posX: 230, posY: 307, rotation: 0, isFlipped: false, scale: 0.7 },
            // Rice cooker (192x235, scale 0.2) — on table (bottom ≈ y:360)
            { itemId: "item_rice_cooker",   posX: 210, posY: 125, rotation: 0, isFlipped: false, scale: 0.2 },
            // Cup (50x70, scale 0.3) — on table (bottom ≈ y:360)
            { itemId: "item_cup_black",     posX: 310, posY: 290, rotation: 0, isFlipped: false, scale: 0.3 },

            // --- Floor middle row (bottom ≈ y:460) ---
            // Shin ramen (236x198, scale 0.3) — on floor right of table
            { itemId: "item_shin_ramen",    posX: 370, posY: 262, rotation: 0, isFlipped: false, scale: 0.3 },
            // Buldak ramen (236x208, scale 0.3) — next to shin ramen
            { itemId: "item_buldak_ramen",  posX: 440, posY: 252, rotation: 0, isFlipped: true,  scale: 0.3 },

            // --- Floor front row (bottom ≈ y:520) ---
            // Character (60x120, scale 1.0) — cooking in front of counter
            { itemId: "item_cha01",         posX: 300, posY: 400, rotation: 0, isFlipped: false, scale: 1.0 },
        ],
    },
];

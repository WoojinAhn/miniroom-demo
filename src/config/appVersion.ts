export interface ReleaseNote {
    version: string;
    date: string;
    features: string[];
    fixes?: string[];
}

export const APP_VERSION = "v1.9.1";

export const CHANGELOG: ReleaseNote[] = [
    {
        version: "v1.9.1",
        date: "2026-01-09",
        features: [],
        fixes: [
            "Removed Wooden Table item (missing image file)",
            "Reduced spacing between Special Items and General Items sections",
            "Tighter padding on mobile inventory for better space usage",
        ],
    },
    {
        version: "v1.9.0",
        date: "2026-01-09",
        features: [
            "Mobile Control Panel: Fixed bottom toolbar for easy item manipulation on mobile",
            "Pinch to Zoom: Two-finger zoom and pan on mobile devices",
            "Mobile UX: Hidden inline toolbar on mobile, replaced with larger touch-friendly controls",
            "Reset Zoom: Quick button to reset pinch zoom to default",
        ],
        fixes: [],
    },
    {
        version: "v1.8.0",
        date: "2026-01-09",
        features: [
            "Mobile Responsive Design: Vertical layout for mobile screens",
            "Responsive Canvas: Room canvas now scales to fit the screen width",
            "Inventory Optimization: Inventory stacks below the canvas on mobile for better usability",
        ],
        fixes: ["Internal: Improved type safety for 'Character' items"],
    },
    {
        version: "v1.7.0",
        date: "2026-01-09",
        features: [
            "Tight Bounding Box: Selection outline now hugs the actual visual content of the item",
            "Scalable Selection: Selection box and toolbar now scale correctly with the item",
            "Improved Boundary Collision: Items can be placed tightly against walls even when scaled",
            "Auto-Padding Detection: Automatically calculates visual padding for accurate selection",
        ],
        fixes: ["Restored 'Double Click to Remove' functionality"],
    },
    {
        version: "v1.6.3",
        date: "2025-12-18",
        features: ["Added 6 new Special items (Cat, Tent, Crown, Hamster, Book, Rose Dome)"],
        fixes: [],
    },
    {
        version: "v1.6.2",
        date: "2025-12-18",
        features: ["Added 'Special Items' category above Inventory", "Implemented 'Rocket' special item functionality"],
        fixes: [],
    },
    {
        version: "v1.6.1",
        date: "2025-12-18",
        features: ["Added new item: Rice Cooker"],
        fixes: [],
    },
    {
        version: "v1.6.0",
        date: "2025-12-18",
        features: ["Automated inventory registration: Assets in public/items are now auto-detected"],
        fixes: [],
    },
    {
        version: "v1.5.1",
        date: "2025-12-18",
        features: ["Added 3 new inventory items: Blue Bed, Standing Mirror, Wall Clock"],
        fixes: [],
    },
    {
        version: "v1.5.0",
        date: "2025-12-18",
        features: [
            "Added layer order controls: Bring Forward (⬆) / Send Backward (⬇) buttons in toolbar",
            "Added new 'Universe' background",
        ],
        fixes: [],
    },
    {
        version: "v1.4.9",
        date: "2025-12-18",
        features: ["Moved character assets to dedicated folder", "Prevented deletion of character items"],
        fixes: [],
    },
    {
        version: "v1.4.8",
        date: "2025-12-18",
        features: ["Registered 15+ new inventory items from public assets"],
        fixes: [],
    },
    {
        version: "v1.4.7",
        date: "2025-12-18",
        features: ["Added 3 Character assets", "Set default character placement in room center"],
        fixes: [],
    },
    {
        version: "v1.4.6",
        date: "2025-12-17",
        features: [],
        fixes: ["Fixed Z-Index layering issue: Items now sort naturally by depth (Y-position)"],
    },
    {
        version: "v1.4.5",
        date: "2025-12-17",
        features: ["Asset Update: Updated Red Chair image with user-provided asset"],
        fixes: [],
    },
    {
        version: "v1.4.4",
        date: "2025-12-17",
        features: ["Asset Update: Replaced chair and table assets with truly transparent PNGs (removed fake checkerboard background)"],
        fixes: [],
    },
    {
        version: "v1.4.3",
        date: "2025-12-17",
        features: ["Visual Refinement: Replaced rectangular selection box with shape-conforming drop-shadow for images"],
        fixes: [],
    },
    {
        version: "v1.4.2",
        date: "2025-12-17",
        features: [],
        fixes: ["Fixed critical bug where rapid clicking on toolbar buttons triggered item deletion"],
    },
    {
        version: "v1.4.1",
        date: "2025-12-17",
        features: [],
        fixes: ["Fixed issue where items disappeared when zoomed in too much (removed overflow clipping)"],
    },
    {
        version: "v1.4.0",
        date: "2025-12-17",
        features: [
            "UX Refinement: Removed Item Scale Limit (Unlimited Grow)",
            "UX Refinement: Smart Toolbar (Fixed size & Dynamic positioning)",
        ],
    },
    {
        version: "v1.3.0",
        date: "2025-12-17",
        features: [
            "Added Item Resize functionality (Scale 0.5x - 2.0x)",
            "Implemented Zoom In/Out buttons in toolbar",
        ],
    },
    {
        version: "v1.2.0",
        date: "2025-12-17",
        features: [
            "Added Item Rotation (90 degrees)",
            "Added Item Flip (Mirror effect)",
            "Updated visual style to Pixel Art (Chair, Table)",
        ],
        fixes: [
            "Fixed selection sensitivity (prevent accidental deselect on drag)",
            "Added background click to deselect",
        ],
    },
    {
        version: "v1.1.0",
        date: "2025-12-17",
        features: ["Deployed to Vercel", "Implemented CI/CD pipeline"],
    },
    {
        version: "v1.0.0",
        date: "2025-12-17",
        features: [
            "Initial Release",
            "Drag and Drop",
            "Auto-save simulation",
            "Inventory system",
        ],
    },
];

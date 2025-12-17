export interface ReleaseNote {
    version: string;
    date: string;
    features: string[];
    fixes?: string[];
}

export const APP_VERSION = "v1.4.6";

export const CHANGELOG: ReleaseNote[] = [
    {
        version: "v1.4.6",
        date: "2025-12-17",
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

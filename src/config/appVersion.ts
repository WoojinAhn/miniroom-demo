export interface ReleaseNote {
    version: string;
    date: string;
    features: string[];
    fixes?: string[];
}

export const APP_VERSION = "v1.4.0";

export const CHANGELOG: ReleaseNote[] = [
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

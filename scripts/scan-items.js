const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

const ITEMS_DIR = path.join(__dirname, '../public/items');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated-inventory.json');

// Ensure output directory exists (src/data should exist, but good to be safe)
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function toTitleCase(str) {
    return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function scanItems() {
    if (!fs.existsSync(ITEMS_DIR)) {
        console.warn(`[Scan] Items directory not found: ${ITEMS_DIR}`);
        return;
    }

    const files = fs.readdirSync(ITEMS_DIR);
    const items = [];

    files.forEach(file => {
        if (!file.match(/\.(png|jpg|jpeg|gif)$/i)) return;

        const filePath = path.join(ITEMS_DIR, file);
        try {
            const buffer = fs.readFileSync(filePath);
            const dimensions = imageSize(buffer);
            const id = `item_${path.parse(file).name}`;
            const name = toTitleCase(path.parse(file).name);

            // Heuristic: If filename contains specific keywords, verify type?
            // For now, default everything to 'furniture' or 'decoration' based on simple rules or just default to furniture.
            // Let's refine based on keywords if possible, else 'furniture'.
            let type = 'furniture';
            if (file.includes('rug') || file.includes('plant') || file.includes('frame') || file.includes('clock') || file.includes('mirror') || file.includes('light') || file.includes('lamp') || file.includes('cup')) {
                type = 'decoration';
            } else if (file.includes('tv') || file.includes('fridge') || file.includes('induction') || file.includes('monitor') || file.includes('cooker')) {
                type = 'electronics';
            }

            items.push({
                id: id,
                name: name,
                type: type, // Auto-detected type
                width: dimensions.width,
                height: dimensions.height,
                imageUrl: `/items/${file}`,
                generated: true // Flag to indicate auto-generated
            });
        } catch (err) {
            console.error(`[Scan] Error processing ${file}:`, err.message);
        }
    });

    // Scan Special Items
    const SPECIAL_DIR = path.join(__dirname, '../public/special');
    if (fs.existsSync(SPECIAL_DIR)) {
        const specialFiles = fs.readdirSync(SPECIAL_DIR);
        const { PNG } = require('pngjs');

        specialFiles.forEach(file => {
            if (!file.match(/\.(png|jpg|jpeg|gif)$/i)) return;

            const filePath = path.join(SPECIAL_DIR, file);
            try {
                const buffer = fs.readFileSync(filePath);
                const dimensions = imageSize(buffer);
                const id = `special_${path.parse(file).name}`;
                const name = toTitleCase(path.parse(file).name);

                let paddingTop = 0;
                // Only calculate padding for PNGs
                if (file.toLowerCase().endsWith('.png')) {
                    try {
                        const png = PNG.sync.read(buffer);
                        // Scan rows from top
                        for (let y = 0; y < png.height; y++) {
                            let rowHasPixels = false;
                            for (let x = 0; x < png.width; x++) {
                                const idx = (png.width * y + x) << 2;
                                const alpha = png.data[idx + 3];
                                if (alpha > 0) {
                                    rowHasPixels = true;
                                    break;
                                }
                            }
                            if (rowHasPixels) {
                                paddingTop = y;
                                break;
                            }
                        }
                    } catch (e) {
                        console.warn(`[Scan] Could not calculate padding for ${file}:`, e.message);
                    }
                }

                items.push({
                    id: id,
                    name: name,
                    type: 'special',
                    width: dimensions.width,
                    height: dimensions.height,
                    paddingTop: paddingTop,
                    imageUrl: `/special/${file}`,
                    generated: true
                });
            } catch (err) {
                console.error(`[Scan] Error processing special item ${file}:`, err.message);
            }
        });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 4));
    console.log(`[Scan] Successfully registered ${items.length} items to ${OUTPUT_FILE}`);
}

scanItems();

const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const { PNG } = require('pngjs');

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

function sanitizePngBuffer(buffer) {
    const marker = Buffer.from('IEND');
    const idx = buffer.lastIndexOf(marker);
    if (idx === -1 || idx < 4) return buffer;
    const endPos = idx + 8; // 4 bytes for "IEND" + 4 bytes CRC
    if (endPos >= buffer.length) return buffer;
    return buffer.slice(0, endPos);
}

function computePadding(buffer, width, height, fileName) {
    try {
        const target = sanitizePngBuffer(buffer);
        const png = PNG.sync.read(target, { checkCRC: false });
        // Early return if fully opaque (common for trimmed assets)
        let minX = width, minY = height, maxX = -1, maxY = -1;
        for (let y = 0; y < png.height; y++) {
            for (let x = 0; x < png.width; x++) {
                const idx = (png.width * y + x) << 2;
                const alpha = png.data[idx + 3];
                if (alpha > 0) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX === -1) {
            // fully transparent fallback
            return { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 };
        }
        return {
            paddingTop: minY,
            paddingBottom: height - 1 - maxY,
            paddingLeft: minX,
            paddingRight: width - 1 - maxX,
        };
    } catch (e) {
        console.warn(`[Scan] Could not calculate padding for ${fileName || 'unknown'} (using defaults): ${e.message}`);
        return { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 };
    }
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

            const padding =
                file.toLowerCase().endsWith('.png')
                    ? computePadding(buffer, dimensions.width, dimensions.height, file)
                    : { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 };

            items.push({
                id: id,
                name: name,
                type: type, // Auto-detected type
                width: dimensions.width,
                height: dimensions.height,
                ...padding,
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
        specialFiles.forEach(file => {
            if (!file.match(/\.(png|jpg|jpeg|gif)$/i)) return;

            const filePath = path.join(SPECIAL_DIR, file);
            try {
            const buffer = fs.readFileSync(filePath);
            const dimensions = imageSize(buffer);
                const id = `special_${path.parse(file).name}`;
                const name = toTitleCase(path.parse(file).name);

                const padding =
                    file.toLowerCase().endsWith('.png')
                        ? computePadding(buffer, dimensions.width, dimensions.height, file)
                        : { paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 };

                items.push({
                    id: id,
                    name: name,
                    type: 'special',
                    width: dimensions.width,
                    height: dimensions.height,
                    ...padding,
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

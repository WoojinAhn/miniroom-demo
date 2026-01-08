const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const { PNG } = require('pngjs');

const ITEMS_DIR = path.join(__dirname, '../public/items');
const OUTPUT_FILE = path.join(__dirname, '../src/data/generated-inventory.json');
const TRIM_BASE = path.join(__dirname, '../public/trimmed');
const TRIM_ITEMS_DIR = path.join(TRIM_BASE, 'items');
const TRIM_SPECIAL_DIR = path.join(TRIM_BASE, 'special');

// Ensure output directories exist
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
// Trimmed directories
[TRIM_ITEMS_DIR, TRIM_SPECIAL_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

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
            return {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                bboxX: 0,
                bboxY: 0,
                bboxWidth: 0,
                bboxHeight: 0,
            };
        }
        const bboxWidth = maxX - minX + 1;
        const bboxHeight = maxY - minY + 1;
        return {
            paddingTop: minY,
            paddingBottom: height - 1 - maxY,
            paddingLeft: minX,
            paddingRight: width - 1 - maxX,
            bboxX: minX,
            bboxY: minY,
            bboxWidth,
            bboxHeight,
        };
    } catch (e) {
        console.warn(`[Scan] Could not calculate padding for ${fileName || 'unknown'} (using defaults): ${e.message}`);
        return {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            bboxX: 0,
            bboxY: 0,
            bboxWidth: width,
            bboxHeight: height,
        };
    }
}

function trimPng(buffer, targetPath, fileName) {
    try {
        const target = sanitizePngBuffer(buffer);
        const png = PNG.sync.read(target, { checkCRC: false });
        let minX = png.width, minY = png.height, maxX = -1, maxY = -1;
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
            // fully transparent, return original
            return { buffer, bbox: { x: 0, y: 0, width: png.width, height: png.height } };
        }
        const bboxW = maxX - minX + 1;
        const bboxH = maxY - minY + 1;
        const out = new PNG({ width: bboxW, height: bboxH });
        PNG.bitblt(png, out, minX, minY, bboxW, bboxH, 0, 0);
        const trimmedBuffer = PNG.sync.write(out, { colorType: 6 });
        fs.writeFileSync(targetPath, trimmedBuffer);
        return { buffer: trimmedBuffer, bbox: { x: minX, y: minY, width: bboxW, height: bboxH } };
    } catch (e) {
        console.warn(`[Trim] Failed to trim ${fileName || 'unknown'}: ${e.message}`);
        // Fallback: write original buffer to target
        fs.writeFileSync(targetPath, buffer);
        const dim = imageSize(buffer);
        return { buffer, bbox: { x: 0, y: 0, width: dim.width, height: dim.height } };
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
            let imageBuffer = buffer;
            let dimensions;
            let padding;
            let imageUrl = `/items/${file}`;

            if (file.toLowerCase().endsWith('.png')) {
                const trimmedPath = path.join(TRIM_ITEMS_DIR, file);
                const { buffer: tBuffer, bbox } = trimPng(buffer, trimmedPath, file);
                imageBuffer = tBuffer;
                dimensions = imageSize(tBuffer);
                padding = {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    bboxX: 0,
                    bboxY: 0,
                    bboxWidth: dimensions.width,
                    bboxHeight: dimensions.height,
                };
                imageUrl = `/trimmed/items/${file}`;
            } else {
                dimensions = imageSize(buffer);
                padding = {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    bboxX: 0,
                    bboxY: 0,
                    bboxWidth: dimensions.width,
                    bboxHeight: dimensions.height,
                };
            }
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
                ...padding,
                imageUrl: imageUrl,
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
            let imageBuffer = buffer;
            let dimensions;
            let padding;
            let imageUrl = `/special/${file}`;

            if (file.toLowerCase().endsWith('.png')) {
                const trimmedPath = path.join(TRIM_SPECIAL_DIR, file);
                const { buffer: tBuffer, bbox } = trimPng(buffer, trimmedPath, file);
                imageBuffer = tBuffer;
                dimensions = imageSize(tBuffer);
                padding = {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    bboxX: 0,
                    bboxY: 0,
                    bboxWidth: dimensions.width,
                    bboxHeight: dimensions.height,
                };
                imageUrl = `/trimmed/special/${file}`;
            } else {
                dimensions = imageSize(buffer);
                padding = {
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    bboxX: 0,
                    bboxY: 0,
                    bboxWidth: dimensions.width,
                    bboxHeight: dimensions.height,
                };
            }
                const id = `special_${path.parse(file).name}`;
                const name = toTitleCase(path.parse(file).name);

                items.push({
                    id: id,
                    name: name,
                    type: 'special',
                    width: dimensions.width,
                    height: dimensions.height,
                    ...padding,
                    imageUrl,
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

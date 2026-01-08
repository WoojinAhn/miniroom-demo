const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const roots = [path.join(__dirname, '../public/items'), path.join(__dirname, '../public/special')];

function sanitize(buffer) {
  const marker = Buffer.from('IEND');
  const idx = buffer.lastIndexOf(marker);
  if (idx === -1 || idx < 4) return buffer;
  const endPos = idx + 8;
  if (endPos >= buffer.length) return buffer;
  return buffer.slice(0, endPos);
}

function trimPng(file) {
  const buf = fs.readFileSync(file);
  const cleaned = sanitize(buf);
  const png = PNG.sync.read(cleaned, { checkCRC: false });
  let minX = png.width, minY = png.height, maxX = -1, maxY = -1;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      if (png.data[idx + 3] > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX === -1) return; // fully transparent, skip
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, minX, minY, w, h, 0, 0);
  const trimmed = PNG.sync.write(out, { colorType: 6 });
  fs.writeFileSync(file, trimmed);
}

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const f of fs.readdirSync(root)) {
    if (!f.toLowerCase().endsWith('.png')) continue;
    const p = path.join(root, f);
    try {
      trimPng(p);
      console.log('trimmed', p);
    } catch (e) {
      console.warn('skip', p, e.message);
    }
  }
}

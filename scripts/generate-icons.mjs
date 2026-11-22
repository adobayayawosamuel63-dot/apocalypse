import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/icons');
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

const clamp = (value) => Math.min(255, Math.max(0, Math.round(value)));
const mix = (a, b, t) => a + (b - a) * t;

function smoothstep(edge0, edge1, value) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function roundedRectDistance(x, y, cx, cy, halfW, halfH, radius) {
  const qx = Math.abs(x - cx) - (halfW - radius);
  const qy = Math.abs(y - cy) - (halfH - radius);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

function shade(x, y) {
  const vertical = clamp(mix(16, 7, y));
  const radial = Math.max(0, 1 - Math.hypot(x - 0.5, y - 0.32) / 0.85) ** 2;

  let r = vertical + 20 * radial;
  let g = mix(27, 11, y) + 15 * radial;
  let b = mix(48, 20, y) + 7 * radial;

  const border = Math.abs(roundedRectDistance(x, y, 0.5, 0.5, 0.46, 0.46, 0.19));
  const borderAlpha = 1 - smoothstep(0.002, 0.009, border);
  const borderStrength = smoothstep(0.34, 0.56, 1 - Math.hypot(x - 0.5, y - 0.5) * 1.7) * 0.32;
  if (borderAlpha > 0) {
    r = mix(r, 230, borderAlpha * borderStrength);
    g = mix(g, 191, borderAlpha * borderStrength);
    b = mix(b, 116, borderAlpha * borderStrength);
  }

  const verticalBar = roundedRectDistance(x, y, 0.5, 0.525, 0.045, 0.255, 0.028);
  const horizontalBar = roundedRectDistance(x, y, 0.5, 0.42, 0.225, 0.045, 0.028);
  const crossAlpha = 1 - smoothstep(-0.003, 0.003, Math.min(verticalBar, horizontalBar));
  if (crossAlpha > 0) {
    r = mix(r, 240, crossAlpha);
    g = mix(g, 214, crossAlpha);
    b = mix(b, 154, crossAlpha);
  }

  const glow = Math.max(0, 1 - Math.hypot(x - 0.5, y - 0.72) / 0.13);
  if (glow > 0) {
    r = mix(r, 52, glow * 0.9);
    g = mix(g, 211, glow * 0.9);
    b = mix(b, 153, glow * 0.9);
  }

  return [clamp(r), clamp(g), clamp(b), 255];
}

function encodePng(size, pixelFn, samples = 3) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const total = samples * samples;
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < size; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const [pr, pg, pb, pa] = pixelFn((x + (sx + 0.5) / samples) / size, (y + (sy + 0.5) / samples) / size);
          r += pr;
          g += pg;
          b += pb;
          a += pa;
        }
      }
      const offset = rowStart + 1 + x * 4;
      raw[offset] = clamp(r / total);
      raw[offset + 1] = clamp(g / total);
      raw[offset + 2] = clamp(b / total);
      raw[offset + 3] = clamp(a / total);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const outputs = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of outputs) {
  writeFileSync(resolve(outDir, name), encodePng(size, shade));
  console.log(`✓ ${name} (${size}×${size})`);
}

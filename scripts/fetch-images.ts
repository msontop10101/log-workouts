/**
 * Downloads both frames (0.jpg start, 1.jpg end) for every exercise from
 * free-exercise-db, resizes to max 480px wide, and saves them as WebP under
 * public/exercises/<id>/{0,1}.webp. Run: npx tsx scripts/fetch-images.ts
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { EXERCISES } from '../src/data/exercises';

const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
const OUT = path.join(process.cwd(), 'public', 'exercises');

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchFrame(slug: string, frame: 0 | 1, outDir: string) {
  const out = path.join(outDir, `${frame}.webp`);
  if (await exists(out)) return 'skip';
  const url = `${BASE}/${slug}/${frame}.jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const webp = await sharp(buf)
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  await writeFile(out, webp);
  return 'ok';
}

let failures = 0;
const queue = [...EXERCISES];
const CONCURRENCY = 6;

async function worker() {
  for (let ex = queue.shift(); ex; ex = queue.shift()) {
    const dir = path.join(OUT, ex.id);
    await mkdir(dir, { recursive: true });
    for (const frame of [0, 1] as const) {
      try {
        const r = await fetchFrame(ex.slug, frame, dir);
        if (r === 'ok') console.log(`ok   ${ex.id}/${frame}`);
      } catch (err) {
        failures++;
        console.error(`FAIL ${ex.id}/${frame}: ${(err as Error).message}`);
      }
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(failures ? `${failures} failures` : 'all images fetched');
process.exit(failures ? 1 : 0);

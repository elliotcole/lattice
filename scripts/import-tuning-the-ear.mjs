#!/usr/bin/env node
/**
 * Sync the Tuning the Ear deck.
 *
 * Reads diagram JSONs from the source Dropbox folder, copies them to
 * src/tuning-the-ear/diagrams/, and rebuilds the manifest. Deck-level fields
 * (slug, title, subtitle, defaultInteractions) and per-slide `interactions`
 * overrides are preserved from the existing manifest on re-import.
 *
 * Usage:
 *   node scripts/import-tuning-the-ear.mjs [sourceDir]
 *   (or set TUNING_THE_EAR_SRC; defaults to the Dropbox "Diagrams v2" folder)
 *
 * Fails, without touching src/tuning-the-ear/, if any source file is not
 * valid JSON, lacks a leading number, or would collide with another slug.
 */

import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SRC_DIR =
  "/Users/elliot/Library/CloudStorage/Dropbox/_Projects/Tuning the Ear/Diagrams v2";
const SRC_DIR = process.argv[2] || process.env.TUNING_THE_EAR_SRC || DEFAULT_SRC_DIR;
const DECK_DIR = join(__dirname, "..", "src", "tuning-the-ear");
const DIAGRAMS_DIR = join(DECK_DIR, "diagrams");
const MANIFEST_PATH = join(DECK_DIR, "manifest.json");

const DEFAULT_DECK = {
  version: 1,
  slug: "tuning-the-ear",
  title: "Tuning the Ear",
  subtitle: "Diagrams from Alec Goldfarb’s",
  intro:
    "Each diagram is a playable tuning lattice that accompanies a section of the book. Click any node to hear its pitch, and explore the just-intonation relationships the chapter describes.",
  defaultInteractions: {
    playNotes: true,
    sustain: true,
    keyboardMode: true,
    lfo: true,
    patternPlay: true,
    looper: true,
    pan: false,
    zoom: false,
    rotate3d: false,
    addNodes: false,
  },
};

function loadExistingManifest() {
  if (!existsSync(MANIFEST_PATH)) return null;
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  } catch (err) {
    console.warn("Existing manifest unreadable, starting fresh:", err.message);
    return null;
  }
}

function slugifyTitlePart(s) {
  return s
    .toLowerCase()
    .replace(/[‘’“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildSlide(srcFile) {
  const raw = readFileSync(join(SRC_DIR, srcFile), "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`  skip (bad JSON): ${srcFile} — ${err.message}`);
    return null;
  }
  const m = srcFile.match(/^(\d+)\s+(.+?)\.json$/);
  if (!m) {
    console.error(`  skip (no leading number): ${srcFile}`);
    return null;
  }
  const sourceNum = m[1];
  const titlePart = m[2]
    .replace(/\s*-\s*Creator\s*\[tuninglattice\.com\]\s*$/, "")
    .replace(/\s*-\s*Harry Partch\s*\[tuninglattice\.com\]\s*$/, "")
    .replace(/\s*\[tuninglattice\.com\]\s*$/, "")
    .trim();
  const layoutTitle = parsed.layout && parsed.layout.title;
  const displayTitle = layoutTitle && layoutTitle.trim() ? layoutTitle.trim() : titlePart;
  return {
    slug: `${sourceNum}-${slugifyTitlePart(titlePart)}`,
    number: sourceNum,
    title: displayTitle,
    raw,
  };
}

function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source folder not found: ${SRC_DIR}`);
    process.exit(1);
  }

  const existing = loadExistingManifest();
  const overridesBySlug = new Map();
  if (existing && Array.isArray(existing.slides)) {
    for (const slide of existing.slides) {
      if (slide && slide.slug && slide.interactions) {
        overridesBySlug.set(slide.slug, slide.interactions);
      }
    }
  }

  const files = readdirSync(SRC_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  // Parse and validate everything before touching the deck directory, so a
  // bad source file can never leave a half-imported deck behind.
  const built = [];
  const problems = [];
  const seenSlugs = new Map();
  for (const f of files) {
    const slide = buildSlide(f);
    if (!slide) {
      problems.push(f);
      continue;
    }
    if (seenSlugs.has(slide.slug)) {
      problems.push(`${f} (slug "${slide.slug}" collides with ${seenSlugs.get(slide.slug)})`);
      continue;
    }
    seenSlugs.set(slide.slug, f);
    built.push(slide);
  }
  if (problems.length) {
    console.error(`\n${problems.length} source file(s) rejected; nothing written:`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }

  rmSync(DIAGRAMS_DIR, { recursive: true, force: true });
  mkdirSync(DIAGRAMS_DIR, { recursive: true });

  const slides = [];
  for (const entry of built) {
    const outName = `${entry.slug}.json`;
    writeFileSync(join(DIAGRAMS_DIR, outName), entry.raw);
    const slug = entry.slug;
    const slide = {
      slug,
      number: entry.number,
      title: entry.title,
      file: outName,
    };
    if (overridesBySlug.has(slug)) {
      slide.interactions = overridesBySlug.get(slug);
    }
    slides.push(slide);
  }

  const manifest = {
    ...(existing && existing.version
      ? { version: existing.version }
      : { version: DEFAULT_DECK.version }),
    slug: (existing && existing.slug) || DEFAULT_DECK.slug,
    title: (existing && existing.title) || DEFAULT_DECK.title,
    subtitle: existing && "subtitle" in existing ? existing.subtitle : DEFAULT_DECK.subtitle,
    intro: existing && "intro" in existing ? existing.intro : DEFAULT_DECK.intro,
    defaultInteractions:
      (existing && existing.defaultInteractions) || DEFAULT_DECK.defaultInteractions,
    slides,
  };

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${slides.length} slides to ${basename(MANIFEST_PATH)}`);
  if (overridesBySlug.size) {
    console.log(`Preserved ${overridesBySlug.size} per-slide override(s).`);
  }
  for (const s of slides) {
    const tag = s.interactions ? " (overrides)" : "";
    console.log(`  ${s.number} - ${s.title}${tag}`);
  }
}

main();

// Keep src/presets.json as readable state documents.
//
// Each library entry is { title, creator, tags, state }. To add a preset,
// paste an entry with a lattice link instead of a state, e.g.
//   { "title": "…", "creator": "…", "tags": [], "uri": "#s=lz:…" }
// (a full https://tuninglattice.com/#s=… link works too) and run
//   npm run presets:normalize
// which decodes every `uri` entry into a `state` and refuses to write if a
// state wouldn't re-encode to the same link.
import { readFileSync, writeFileSync } from "node:fs";
import { decodePresetState, encodePresetState } from "../src/serialization.js";

const path = new URL("../src/presets.json", import.meta.url);
const entries = JSON.parse(readFileSync(path, "utf8"));
let converted = 0;
const out = entries.map((entry) => {
  if (entry.state || !entry.uri) {
    return entry;
  }
  // The app reads the first state in a link and ignores anything after it.
  const match = String(entry.uri).match(/#s=([^&#]+)(.*)$/);
  if (!match) {
    throw new Error(`"${entry.title}": uri has no #s= state`);
  }
  if (match[2]) {
    console.warn(
      `"${entry.title}": ignoring text after the first state (${match[2].length} chars)`,
    );
  }
  const encoded = decodeURIComponent(match[1]);
  const state = decodePresetState(encoded);
  if (!state || typeof state !== "object") {
    throw new Error(`"${entry.title}": uri does not decode`);
  }
  if (encoded.startsWith("lz:") && encodePresetState(state) !== encoded) {
    throw new Error(`"${entry.title}": decoded state does not re-encode to the same link`);
  }
  converted += 1;
  const rest = { ...entry };
  delete rest.uri;
  return { title: rest.title, creator: rest.creator, tags: rest.tags || [], ...rest, state };
});
writeFileSync(path, `${stringify(out, "")}\n`);
console.log(`presets: ${converted} converted, ${out.length} total`);

// JSON with two-space indents, except that an array of plain values (a node
// coordinate, a tag list) stays on one line.
function stringify(value, indent) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return "[]";
    }
    if (value.every((item) => item === null || typeof item !== "object")) {
      return `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
    }
    const inner = `${indent}  `;
    return `[\n${value.map((item) => inner + stringify(item, inner)).join(",\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).filter((key) => value[key] !== undefined);
    if (!keys.length) {
      return "{}";
    }
    const inner = `${indent}  `;
    return `{\n${keys
      .map((key) => `${inner}${JSON.stringify(key)}: ${stringify(value[key], inner)}`)
      .join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

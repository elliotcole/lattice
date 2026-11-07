// Preset state codec — pure functions, no DOM.
// One encoded shape serves URLs (#s=...), preset library URIs, and share links.
// Two wire formats: "lz:" + LZ-compressed URI component (preferred), or
// URL-safe base64 JSON (legacy fallback, still readable).
// Extracted verbatim from main.js in Phase 1 of the staged rebuild; the LZ
// codec is the npm `lz-string` package (Phase 4.2), byte-identical to the
// copy that used to be vendored here (tests pin the encodings).

import LZString from "lz-string";

export function encodePresetState(state) {
  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);
  if (compressed) {
    return `lz:${compressed.replace(/\+/g, ".")}`;
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodePresetState(encoded) {
  if (typeof encoded !== "string") {
    return null;
  }
  if (encoded.startsWith("lz:")) {
    const payload = encoded.slice(3).replace(/ /g, "+").replace(/\./g, "+");
    let json = null;
    try {
      json = LZString.decompressFromEncodedURIComponent(payload);
    } catch {
      return null;
    }
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

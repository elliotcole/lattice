// Preset state codec — pure functions, no DOM.
// One encoded shape serves URLs (#s=...), preset library URIs, and share links.
// Two wire formats: "lz:" + LZ-compressed URI component (preferred), or
// URL-safe base64 JSON (legacy fallback, still readable).
// Extracted verbatim from main.js in Phase 1 of the staged rebuild.

function lzCompressToEncodedURIComponent(input) {
  if (input == null) {
    return "";
  }
  return lzCompress(input, 6, (a) =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".charAt(a)
  );
}

function lzDecompressFromEncodedURIComponent(input) {
  if (input == null || input === "") {
    return "";
  }
  return lzDecompress(input, 32, (index) =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$".indexOf(input.charAt(index))
  );
}

function lzCompress(uncompressed, bitsPerChar, getCharFromInt) {
  if (uncompressed == null) {
    return "";
  }
  let i;
  let value;
  const contextDictionary = new Map();
  const contextDictionaryToCreate = new Set();
  let contextC = "";
  let contextW = "";
  let contextWC = "";
  let contextEnlargeIn = 2;
  let contextDictSize = 3;
  let contextNumBits = 2;
  let contextData = [];
  let contextDataVal = 0;
  let contextDataPosition = 0;

  const contextAppendBits = (numBits, dataVal) => {
    for (let j = 0; j < numBits; j += 1) {
      contextDataVal = (contextDataVal << 1) | (dataVal & 1);
      if (contextDataPosition === bitsPerChar - 1) {
        contextDataPosition = 0;
        contextData.push(getCharFromInt(contextDataVal));
        contextDataVal = 0;
      } else {
        contextDataPosition += 1;
      }
      dataVal >>= 1;
    }
  };

  for (i = 0; i < uncompressed.length; i += 1) {
    contextC = uncompressed.charAt(i);
    if (!contextDictionary.has(contextC)) {
      contextDictionary.set(contextC, contextDictSize++);
      contextDictionaryToCreate.add(contextC);
    }

    contextWC = contextW + contextC;
    if (contextDictionary.has(contextWC)) {
      contextW = contextWC;
    } else {
      if (contextDictionaryToCreate.has(contextW)) {
        if (contextW.charCodeAt(0) < 256) {
          contextAppendBits(contextNumBits, 0);
          contextAppendBits(8, contextW.charCodeAt(0));
        } else {
          contextAppendBits(contextNumBits, 1);
          contextAppendBits(16, contextW.charCodeAt(0));
        }
        contextEnlargeIn -= 1;
        if (contextEnlargeIn === 0) {
          contextEnlargeIn = 2 ** contextNumBits;
          contextNumBits += 1;
        }
        contextDictionaryToCreate.delete(contextW);
      } else {
        value = contextDictionary.get(contextW);
        contextAppendBits(contextNumBits, value);
      }
      contextEnlargeIn -= 1;
      if (contextEnlargeIn === 0) {
        contextEnlargeIn = 2 ** contextNumBits;
        contextNumBits += 1;
      }
      contextDictionary.set(contextWC, contextDictSize++);
      contextW = String(contextC);
    }
  }

  if (contextW !== "") {
    if (contextDictionaryToCreate.has(contextW)) {
      if (contextW.charCodeAt(0) < 256) {
        contextAppendBits(contextNumBits, 0);
        contextAppendBits(8, contextW.charCodeAt(0));
      } else {
        contextAppendBits(contextNumBits, 1);
        contextAppendBits(16, contextW.charCodeAt(0));
      }
      contextEnlargeIn -= 1;
      if (contextEnlargeIn === 0) {
        contextEnlargeIn = 2 ** contextNumBits;
        contextNumBits += 1;
      }
      contextDictionaryToCreate.delete(contextW);
    } else {
      value = contextDictionary.get(contextW);
      contextAppendBits(contextNumBits, value);
    }
    contextEnlargeIn -= 1;
    if (contextEnlargeIn === 0) {
      contextEnlargeIn = 2 ** contextNumBits;
      contextNumBits += 1;
    }
  }

  contextAppendBits(contextNumBits, 2);

  while (true) {
    contextDataVal <<= 1;
    if (contextDataPosition === bitsPerChar - 1) {
      contextData.push(getCharFromInt(contextDataVal));
      break;
    } else {
      contextDataPosition += 1;
    }
  }
  return contextData.join("");
}

function lzDecompress(compressed, bitsPerChar, getNextValue) {
  if (compressed == null) {
    return "";
  }
  if (compressed === "") {
    return null;
  }
  const dictionary = [];
  let enlargeIn = 4;
  let dictSize = 4;
  let numBits = 3;
  let entry = "";
  let result = [];
  let i;
  let w;
  let bits;
  let resb;
  let maxpower;
  let power;
  let c;

  const data = {
    value: getNextValue(0),
    position: bitsPerChar,
    index: 1,
  };

  const dataReadBits = (nBits) => {
    let bitsVal = 0;
    let maxPower = 2 ** nBits;
    let powerVal = 1;
    while (powerVal !== maxPower) {
      resb = data.value & data.position;
      data.position >>= 1;
      if (data.position === 0) {
        data.position = bitsPerChar;
        data.value = getNextValue(data.index++);
      }
      bitsVal |= (resb > 0 ? 1 : 0) * powerVal;
      powerVal <<= 1;
    }
    return bitsVal;
  };

  for (i = 0; i < 3; i += 1) {
    dictionary[i] = i;
  }

  bits = dataReadBits(2);
  switch (bits) {
    case 0:
      c = String.fromCharCode(dataReadBits(8));
      break;
    case 1:
      c = String.fromCharCode(dataReadBits(16));
      break;
    default:
      return "";
  }
  dictionary[3] = c;
  w = c;
  result.push(c);

  while (true) {
    if (data.index > compressed.length) {
      return "";
    }
    bits = dataReadBits(numBits);
    switch (bits) {
      case 0:
        c = String.fromCharCode(dataReadBits(8));
        dictionary[dictSize++] = c;
        bits = dictSize - 1;
        enlargeIn -= 1;
        break;
      case 1:
        c = String.fromCharCode(dataReadBits(16));
        dictionary[dictSize++] = c;
        bits = dictSize - 1;
        enlargeIn -= 1;
        break;
      case 2:
        return result.join("");
      default:
        break;
    }

    if (enlargeIn === 0) {
      enlargeIn = 2 ** numBits;
      numBits += 1;
    }

    if (dictionary[bits]) {
      entry = dictionary[bits];
    } else if (bits === dictSize) {
      entry = w + w.charAt(0);
    } else {
      return null;
    }
    result.push(entry);

    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn -= 1;
    w = entry;

    if (enlargeIn === 0) {
      enlargeIn = 2 ** numBits;
      numBits += 1;
    }
  }
}

export function encodePresetState(state) {
  const json = JSON.stringify(state);
  const compressed = lzCompressToEncodedURIComponent(json);
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
    const json = lzDecompressFromEncodedURIComponent(payload);
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

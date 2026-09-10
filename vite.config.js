import { resolve } from "node:path";

const root = import.meta.dirname;

export default {
  base: "./",
  build: {
    // AudioWorklet modules must be real files: they are fetched by the audio
    // thread via addModule(), and under Vite's default 4 kB threshold they
    // would be inlined as data: URLs, which some browsers reject.
    assetsInlineLimit: (filePath) => (filePath.endsWith("-worklet.js") ? false : undefined),
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        docs: resolve(root, "docs/index.html"),
        tuner: resolve(root, "tuner/index.html"),
        tunerMobile: resolve(root, "tuner/mobile/index.html"),
        overtones: resolve(root, "overtones/index.html"),
        tuningTheEar: resolve(root, "tuning-the-ear/index.html"),
      },
    },
  },
};

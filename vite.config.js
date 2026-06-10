import { resolve } from "node:path";

const root = import.meta.dirname;

export default {
  base: "./",
  build: {
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

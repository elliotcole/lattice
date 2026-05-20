import { resolve } from "node:path";

export default {
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        docs: resolve(__dirname, "docs/index.html"),
        tuner: resolve(__dirname, "tuner/index.html"),
        tunerMobile: resolve(__dirname, "tuner/mobile/index.html"),
        overtones: resolve(__dirname, "overtones/index.html"),
        tuningTheEar: resolve(__dirname, "tuning-the-ear/index.html"),
      },
    },
  },
};

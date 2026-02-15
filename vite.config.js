import { resolve } from "node:path";

export default {
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        tuner: resolve(__dirname, "tuner/index.html"),
      },
    },
  },
};

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  root: "./",
  publicDir: "public",
  plugins: [vue(), eslintPlugin()],
  server: {
    origin: "http://0.0.0.0:9000",
    port: 9000,
  },
});

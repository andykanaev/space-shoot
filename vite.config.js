import { defineConfig } from "vite";

export default defineConfig({
  base: "/space-shoot/", // Имя вашего репозитория
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
});

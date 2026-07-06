import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : null;
const supabaseUrlPattern = supabaseHost ? new RegExp(`^https://${supabaseHost}/.*`, "i") : undefined;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "sitemap.xml"],
      manifest: false, // Use external manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          ...(supabaseUrlPattern
            ? [{
                urlPattern: supabaseUrlPattern,
                handler: "NetworkFirst" as const,
                options: {
                  cacheName: "supabase-cache",
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24, // 24 hours
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              }]
            : []),
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

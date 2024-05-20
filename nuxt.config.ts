// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt", "@nuxt/image"],
  image: {
    provider: "netlify",
    domains: ["raw.githubusercontent.com"],
  },
  pwa: {
    manifest: {
      name: "Yet Another Pokédex",
      short_name: "YaP",
      description: "A Pokedex application built with Nuxt.js",
      theme_color: "#00DC82",
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      screenshots: [
        {
          src: "Screenshot-desktop.png",
          sizes: "2406x1672",
          type: "image/png",
          form_factor: "wide",
          label: "Homescreen Desktop",
        },
        {
          src: "Screenshot-mobile.png",
          sizes: "698x1506",
          type: "image/webp",
          label: "Homescreen Mobile",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
  },
  $development: {
    image: {
      provider: "ipx",
    },
  },
});

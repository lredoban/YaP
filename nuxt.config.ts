// https://nuxt.com/docs/api/configuration/nuxt-config
const maxPokemon = Number(process.env.NUXT_PUBLIC_MAX_POKEMON ?? 151);
const localeCodes = ["en", "fr", "es", "ko", "ja", "it", "de"];

export default defineNuxtConfig({
  compatibilityDate: "2026-06-01",
  runtimeConfig: {
    public: {
      maxPokemon,
    },
  },
  app: {
    head: {
      meta: [{ name: "theme-color", content: "#00DC82" }],
      link: [
        { rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png" },
      ],
    },
  },
  nitro: {
    prerender: {
      ignore: ["/.netlify"],
      // Emit the Pokémon API as real static JSON files: client-side
      // navigations (e.g. the i18n root redirect) re-run useFetch in the
      // browser, which would 404 on a static host without these files
      routes: localeCodes.flatMap((locale) => [
        `/api/pokemon/${locale}/list.json`,
        ...Array.from(
          { length: maxPokemon },
          (_, i) => `/api/pokemon/${locale}/${i + 1}.json`
        ),
      ]),
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
    "@nuxt/image",
    "@nuxtjs/i18n",
  ],
  image: {
    provider: "netlify",
    domains: ["raw.githubusercontent.com"],
  },
  i18n: {
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        language: "en-US",
        flag: "🇬🇧",
      },
      {
        code: "fr",
        language: "fr-FR",
        flag: "🇫🇷",
      },
      {
        code: "es",
        language: "es-ES",
        flag: "🇪🇸",
      },
      {
        code: "ko",
        language: "ko-KR",
        flag: "🇰🇷",
      },
      {
        code: "ja",
        language: "ja-JP",
        flag: "🇯🇵",
      },
      {
        code: "it",
        language: "it-IT",
        flag: "🇮🇹",
      },
      {
        code: "de",
        language: "de-DE",
        flag: "🇩🇪",
      },
    ],
  },
  pwa: {
    registerType: "autoUpdate",
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
      // Only precache the app shell (scripts, styles, type icons): the
      // Pokémon data of the current language is fetched lazily by the
      // prefetch-locale plugin and cached at runtime, so installing the
      // app stays lightweight.
      globPatterns: ["_nuxt/**/*.{js,css}", "types/*.svg"],
      // The module force-adds "**/_payload.json" to globPatterns, which would
      // precache the data of every Pokémon in every language on install
      globIgnores: ["**/_payload.json"],
      navigateFallback: undefined,
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          // Visited pages (HTML) keep working offline
          urlPattern: ({ request }) => request.mode === "navigate",
          handler: "NetworkFirst",
          options: {
            cacheName: "pages",
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 100 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Pokémon data (static JSON API) — served instantly from cache,
          // refreshed in the background; the prefetch-locale plugin fills
          // this cache for the current language
          urlPattern: ({ url }) => url.pathname.startsWith("/api/pokemon/"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "pokemon-data",
            expiration: { maxEntries: 1300, purgeOnQuotaError: true },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Route payloads (client-side navigation priming)
          urlPattern: ({ url }) => url.pathname.endsWith("/_payload.json"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "payloads",
            expiration: { maxEntries: 1300, purgeOnQuotaError: true },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Pokémon cries — cached once played, not downloaded by default
          urlPattern: ({ url }) =>
            url.hostname === "raw.githubusercontent.com" &&
            url.pathname.endsWith(".ogg"),
          handler: "CacheFirst",
          options: {
            cacheName: "pokemon-cries",
            expiration: { maxEntries: 200, purgeOnQuotaError: true },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Artwork & sprites — cached as they are displayed
          urlPattern: ({ request, url }) =>
            request.destination === "image" &&
            (url.pathname.startsWith("/.netlify/images") ||
              url.hostname === "raw.githubusercontent.com"),
          handler: "CacheFirst",
          options: {
            cacheName: "pokemon-images",
            expiration: {
              maxEntries: 600,
              maxAgeSeconds: 60 * 60 * 24 * 60,
              purgeOnQuotaError: true,
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
  },
  $development: {
    devtools: { enabled: true },
    image: {
      provider: "ipx",
    },
  },
});

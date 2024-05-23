// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      maxPokemon: 151,
    },
  },
  nitro: {
    prerender: {
      ignore: ["/.netlify"],
    },
  },
  experimental: {
    defaults: {
      useAsyncData: {
        deep: false,
      },
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
        iso: "en-US",
        flag: "🇬🇧",
      },
      {
        code: "fr",
        iso: "fr-FR",
        flag: "🇫🇷",
      },
      {
        code: "es",
        iso: "es-ES",
        flag: "🇪🇸",
      },
      {
        code: "ko",
        iso: "ko-KR",
        flag: "🇰🇷",
      },
      {
        code: "ja",
        iso: "ja-JP",
        flag: "🇯🇵",
      },
      {
        code: "it",
        iso: "it-IT",
        flag: "🇮🇹",
      },
      {
        code: "de",
        iso: "de-DE",
        flag: "🇩🇪",
      },
    ],
  },
  pwa: {
    registerType: "autoUpdate",
    injectRegister: false,
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
      globPatterns: [],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
    registerWebManifestInRouteRules: true,
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

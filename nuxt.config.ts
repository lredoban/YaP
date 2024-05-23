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
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@nuxtjs/i18n"],
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
  $development: {
    devtools: { enabled: true },
    image: {
      provider: "ipx",
    },
  },
});

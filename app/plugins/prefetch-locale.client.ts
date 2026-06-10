/**
 * Makes the Pokédex available offline for the current language only.
 *
 * Once the page is idle, the static JSON of every Pokémon (in the active
 * locale) is prefetched. The service worker picks the responses up through
 * its "pokemon-data" runtime cache, so the installed PWA works offline
 * without downloading the data of every language.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev) return;

  const { $i18n } = useNuxtApp();
  const maxPokemon = Number(useRuntimeConfig().public.maxPokemon);

  const warmup = async () => {
    const locale = $i18n.locale.value;
    const urls = [
      `/api/pokemon/${locale}/list.json`,
      `/api/pokemon/${locale}/types.json`,
      ...Array.from(
        { length: maxPokemon },
        (_, i) => `/api/pokemon/${locale}/${i + 1}.json`
      ),
    ];

    const batchSize = 8;
    for (let i = 0; i < urls.length; i += batchSize) {
      if (!navigator.onLine) return;
      await Promise.all(
        urls.slice(i, i + batchSize).map((url) => fetch(url).catch(() => {}))
      );
    }
  };

  const start = () => {
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => setTimeout(cb, 2000));
    idle(() => {
      // Wait for the service worker to control the page so the prefetched
      // data lands in its runtime cache (with a fallback timeout in case
      // service workers are unavailable).
      Promise.race([
        navigator.serviceWorker?.ready,
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ])
        .catch(() => {})
        .then(warmup);
    });
  };

  onNuxtReady(() => {
    if (navigator.onLine) start();
    else window.addEventListener("online", start, { once: true });
  });
});

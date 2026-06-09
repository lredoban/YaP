/**
 * Makes the Pokédex available offline for the current language only.
 *
 * Once the page is idle, the route payloads of every Pokémon (in the active
 * locale) are prefetched. The service worker picks them up through its
 * runtime cache, so the installed PWA works offline without downloading
 * the data of every language. It also makes client-side navigation instant.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev) return;

  const { $i18n } = useNuxtApp();
  const maxPokemon = Number(useRuntimeConfig().public.maxPokemon);

  const warmup = async () => {
    const prefix =
      $i18n.locale.value === $i18n.defaultLocale ? "" : `/${$i18n.locale.value}`;
    const routes = [
      "/",
      ...Array.from({ length: maxPokemon }, (_, i) => `/pokemon/${i + 1}`),
    ].map((route) => prefix + route);

    const batchSize = 8;
    for (let i = 0; i < routes.length; i += batchSize) {
      if (!navigator.onLine) return;
      await Promise.all(
        routes
          .slice(i, i + batchSize)
          .map((route) => preloadPayload(route).catch(() => {}))
      );
    }
  };

  const start = () => {
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => setTimeout(cb, 2000));
    idle(() => {
      // Wait for the service worker to control the page so the prefetched
      // payloads land in its runtime cache (with a fallback timeout in case
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

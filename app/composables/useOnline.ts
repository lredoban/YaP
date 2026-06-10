const online = ref(true);
let initialized = false;

export function useOnline() {
  if (import.meta.client && !initialized) {
    initialized = true;
    online.value = navigator.onLine;
    window.addEventListener("online", () => (online.value = true));
    window.addEventListener("offline", () => (online.value = false));
  }
  return readonly(online);
}

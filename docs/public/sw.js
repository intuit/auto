// The old docs site installed a service worker that cached its pages. Browsers
// that still have it fetch this file as its update, which clears those caches,
// unregisters itself and reloads open pages from the network.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((client) => client.navigate(client.url));
    })()
  );
});

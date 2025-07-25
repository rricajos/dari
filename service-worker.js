const CACHE = "darink-cache-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./ui.js",
  "./storage.js",
  "./sw-register.js",
  "./manifest.json",
  "./service-worker.js",
];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
);
self.addEventListener("fetch", (e) =>
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)))
);

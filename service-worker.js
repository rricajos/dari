const CACHE = "darink-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./ui.js",
  "./storage.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
);

// Chrome exige que el SW intercepte navegaciones y devuelva 200.

self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("./index.html").then((r) => r || fetch(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});

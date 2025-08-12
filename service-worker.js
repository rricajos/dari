// Este archivo debe ser regenerado al cambiar la versión
const APP_VERSION = "8";
const CACHE = `darink-cache-v${APP_VERSION}`;

// Archivos esenciales para que la app funcione offline.
const ASSETS = [
  "./",
  "./index.html",
  "./storage.js",
  "./manifest.json",
  "./js/main.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

// Evento de instalación: guarda en caché los archivos esenciales.
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  -self.skipWaiting(); // fuerza la activación del nuevo SW sin esperar reload
  self.clients.claim(); // toma el control de todas las pestañas inmediatamente
});

// Evento de activación: elimina cachés antiguos que no coincidan con el nombre actual.
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim(); // toma el control de todas las pestañas inmediatamente
});

// Evento de fetch: maneja todas las peticiones (HTML y otros recursos)
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    // Si es navegación (página HTML), devolver index.html del caché
    e.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(e.request))
    );
  } else {
    // Para imágenes, scripts, estilos, etc.
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});

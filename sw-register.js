// registra SW solo en origen seguro
if (
  ["http:", "https:"].includes(location.protocol) ||
  location.hostname === "localhost"
) {
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.register("./service-worker.js");
}

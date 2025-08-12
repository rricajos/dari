// sync-version.js (Node.js script)
import fs from "fs";

// 1. Leer la versión desde version.js
const versionSource = fs.readFileSync("./version.js", "utf-8");
const match = versionSource.match(/APP_VERSION\s*=\s*["'](.+?)["']/);
if (!match) throw new Error("No se encontró APP_VERSION en version.js");
const version = match[1];

// 2. Actualizar manifest.json
const manifestPath = "manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ manifest.json actualizado a v${version}`);

// 3. Actualizar service-worker.js
const swPath = "service-worker.js";
let swCode = fs.readFileSync(swPath, "utf-8");
swCode = swCode.replace(
  /const CACHE = "darink-cache-v[^"]+"/,
  `const CACHE = "darink-cache-v${version}"`
);
fs.writeFileSync(swPath, swCode);
console.log(`✅ service-worker.js actualizado a v${version}`);
console.log(`📦 Versión sincronizada: ${version}`);
console.log("📝 Archivos actualizados:");
console.log(" - manifest.json");
console.log(" - service-worker.js");
console.log("✅ Recuerda subir todos los cambios y refrescar la app.");

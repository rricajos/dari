// /main.js
import EntryController from "./controllers/EntryController.js";
import TabController from "./controllers/TabController.js";
import { APP_VERSION } from "./version.js";

// version de la aplicación dinámica
const el = document.getElementById("appVersion");
if (el) el.textContent = `versión ${APP_VERSION}`;
document.addEventListener("DOMContentLoaded", () => {
  TabController.init();
  EntryController.init();
});

// Registrar Service Worker y mostrar snackbar si hay una nueva versión
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/darink/service-worker.js", { scope: "/darink/" })
    .then((reg) => {
      console.log("✔️ SW registrado correctamente");

      reg.onupdatefound = () => {
        console.log("🆕 Nueva versión detectada");
        const newWorker = reg.installing;

        newWorker.onstatechange = () => {
          console.log("🔄 Estado SW:", newWorker.state);
          if (newWorker.state === "installed") {
            console.log("🎉 Nuevo SW instalado");

            showUpdateSnackbar(); // ← debe ejecutarse aquí
          }
        };
      };
    })
    .catch((err) => console.error("❌ Error registrando SW:", err));
}

// Mostrar barra visual para actualizar
function showUpdateSnackbar() {
  const snackbar = document.createElement("div");
  snackbar.id = "updateSnackbar";
  snackbar.innerHTML = `
    <span>Hay una nueva versión de Darink App.</span>
    <div style="display: flex; gap: 0.5rem;">
      <button id="btnUpdateNow">Actualizar</button>
      <button id="btnDismissUpdate">Ignorar</button>
    </div>
  `;

  snackbar.querySelector("#btnUpdateNow").onclick = () => {
    window.location.reload();
  };

  snackbar.querySelector("#btnDismissUpdate").onclick = () => {
    snackbar.remove();
  };

  document.body.appendChild(snackbar);
}

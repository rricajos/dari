// /js/controllers/InstallController.js

const InstallController = {
  deferredPrompt: null,
  installBtn: null,
  uninstallBtn: null,

  init() {
    this.installBtn = document.getElementById("installBtn");
    this.uninstallBtn = document.getElementById("uninstallBtn");

    if (this.installBtn) {
      this.installBtn.onclick = () => this.promptInstall();
    }

    if (this.uninstallBtn) {
      this.uninstallBtn.onclick = () => this.showUninstallGuide();
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installBtn.hidden = false;
      this.uninstallBtn.hidden = true;
    });

    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
      this.installBtn.hidden = true;
      this.uninstallBtn.hidden = false;
    });

    this.detectInstalled();
  },

  detectInstalled() {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      this.installBtn.hidden = true;
      this.uninstallBtn.hidden = false;
    }
  },

  async promptInstall() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.installBtn.hidden = true;
    this.uninstallBtn.hidden = false;
  },

  showUninstallGuide() {
    alert(
      "Para desinstalar esta app:\n\n" +
        "- En Android: mantén pulsado el icono y elige 'Desinstalar'.\n" +
        "- En escritorio: haz clic derecho sobre el icono y elige 'Eliminar'."
    );
  },
};

export default InstallController;

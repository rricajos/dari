// /js/controllers/TabController.js

const TabController = {
  tabs: [],
  sections: [],

  init() {
    this.tabs = [...document.querySelectorAll("#mainTabs button")];
    this.sections = [...document.querySelectorAll("[data-tab]")];

    this.tabs.forEach((b) => {
      b.onclick = () => this.showTab(b.dataset.go);
    });

    this.showTab("add"); // inicial
  },

  showTab(name) {
    this.sections.forEach(
      (s) => (s.style.display = s.dataset.tab === name ? "block" : "none")
    );
    this.tabs.forEach((b) =>
      b.classList.toggle("active", b.dataset.go === name)
    );
  },
};

export default TabController;

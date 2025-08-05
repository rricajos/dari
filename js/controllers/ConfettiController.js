// /js/controllers/ConfettiController.js

const ConfettiController = {
  fire() {
    const colors = ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32", "#FF6347"];
    for (let i = 0; i < 120; i++) {
      const d = document.createElement("div");
      d.className = "confetti-piece";
      d.style.left = Math.random() * 100 + "vw";
      d.style.color = colors[Math.floor(Math.random() * colors.length)];
      d.style.animationDelay = Math.random() * 0.4 + "s";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 1600);
    }
  },
};

export default ConfettiController;

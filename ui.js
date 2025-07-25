import { loadDB, saveDB, addEntry, deleteEntry, clearDB } from "./storage.js";

/* ─ Tabs ─ */
const tabButtons = [...document.querySelectorAll("#mainTabs button")];
const tabSections = [...document.querySelectorAll("[data-tab]")];
const showTab = (name) => {
  tabSections.forEach(
    (s) => (s.style.display = s.dataset.tab === name ? "block" : "none")
  );
  tabButtons.forEach((b) =>
    b.classList.toggle("active", b.dataset.go === name)
  );
};
tabButtons.forEach((b) => (b.onclick = () => showTab(b.dataset.go)));
showTab("add"); // inicial

/* ─ Referencias generales ─ */
const nav = [...document.querySelectorAll("#progressNav button")];
const steps = [...document.querySelectorAll("form section")];
const bar = document.getElementById("progressBar");
const form = document.getElementById("entryForm");
const entriesUl = document.getElementById("entries");
const cancelBtn = document.getElementById("cancelEdit");
const searchTxt = document.getElementById("searchTxt");
const fFrom = document.getElementById("fFrom");
const fTo = document.getElementById("fTo");
const fMood = document.getElementById("fMood");
const swapBtn = document.getElementById("swapDates");
const whenStart = document.getElementById("whenStart");
const whenEnd = document.getElementById("whenEnd");
const delSelBtn = document.getElementById("delSelBtn");

swapBtn.onclick = () => {
  const tmp = whenStart.value;
  whenStart.value = whenEnd.value;
  whenEnd.value = tmp;
};

let editIdx = null;

/* ─ Barra progreso ─ */
const updateBar = (i) =>
  (bar.style.width = (i / (steps.length - 1)) * 100 + "%");
const showStep = (i) => {
  steps.forEach((s, idx) => (s.hidden = idx !== i));
  nav.forEach((b, idx) => {
    b.classList.toggle("active", idx === i);
    b.classList.toggle("done", idx < i);
  });
  updateBar(i);
  window.scrollTo({ top: 0 });
};
nav.forEach((b) => (b.onclick = () => showStep(Number(b.dataset.step))));
document.getElementById("next0").onclick = () => showStep(1);
document.getElementById("back1").onclick = () => showStep(0);
document.getElementById("next1").onclick = () => showStep(2);
document.getElementById("back2").onclick = () => showStep(1);

/* ─ Formulario / edición ─ */
const fillForm = (data, idx) => {
  Object.entries(data).forEach(([k, v]) => {
    if (form.elements[k]) {
      let v = (v_orig = v);
      if (k === "whenStart" || k === "whenEnd")
        v = v.replace("T", " ").split(".")[0].replace("Z", "");
      form.elements[k].value = v;
    }
  });
  editIdx = idx;
  cancelBtn.hidden = false;
  showTab("add");
  showStep(0);
};
cancelBtn.onclick = () => {
  form.reset();
  setDefaultTimes();
  editIdx = null;
  cancelBtn.hidden = true;
  showStep(0);
};

/* ─ Filtros / búsqueda ─ */
document.getElementById("applyFilter").onclick = () => render();
document.getElementById("clearFilter").onclick = () => {
  fFrom.value = fTo.value = fMood.value = "";
  render();
};
searchTxt.oninput = () => render();
document.getElementById("clearBtn").onclick = () => {
  if (confirm("¿Borrar toda la base de datos?")) {
    clearDB();
    render();
  }
};

const passesFilter = (e) => {
  const d = e.whenStart.slice(0, 10);
  if (fFrom.value && d < fFrom.value) return false;
  if (fTo.value && d > fTo.value) return false;
  if (fMood.value && e.mood !== fMood.value) return false;
  if (searchTxt.value.trim()) {
    const q = searchTxt.value.toLowerCase();
    if (!Object.values(e).some((v) => String(v).toLowerCase().includes(q)))
      return false;
  }
  return true;
};

/* ─ Selección múltiple ─ */
let selected = new Set();

const toggleSelect = (li) => {
  const idx = Number(li.dataset.dbidx); // índice real
  if (selected.has(idx)) {
    selected.delete(idx);
    li.classList.remove("selected");
  } else {
    selected.add(idx);
    li.classList.add("selected");
  }
  delSelBtn.disabled = selected.size === 0;
};

delSelBtn.onclick = () => {
  if (!selected.size) return;
  if (!confirm("¿Eliminar los seleccionados?")) return;
  const db = loadDB();
  [...selected].sort((a, b) => b - a).forEach((i) => db.splice(i, 1));
  saveDB(db);
  selected.clear();
  delSelBtn.disabled = true;
  render();
};

/* ─ Render listado ─ */
const render = () => {
  entriesUl.innerHTML = "";
  selected.clear();
  delSelBtn.disabled = true;

  const db = loadDB();
  const list = db
    .map((e, idx) => ({ e, idx }))
    .filter(({ e }) => passesFilter(e))
    .sort((a, b) => b.e.whenStart.localeCompare(a.e.whenStart));

  list.forEach(({ e, idx }) => {
    const li = document.createElement("li");
    li.dataset.dbidx = idx;

    /* esfera cantidad + emoción */
    const ball = document.createElement("span");
    ball.className = `ball ${
      e.amount === "poco" ? "small" : e.amount === "normal" ? "medium" : "large"
    } ${e.mood}`;

    /* fecha y horas */
    const [dStart, tStart] = e.whenStart.replace("T", " ").split(" ");
    const [, tEnd] = e.whenEnd.replace("T", " ").split(" ");

    const date = Object.assign(document.createElement("span"), {
      className: "date",
      textContent: dStart,
    });
    const timeFull = document.createElement("span");
    timeFull.className = "timeFull";
    timeFull.textContent = `${tStart} – ${tEnd}`;

    /* texto principal sin (poco / normal / mucho) */
    const txt = Object.assign(document.createElement("span"), {
      className: "txt",
      textContent: e.what || "–",
    });

    const edit = Object.assign(document.createElement("button"), {
      className: "editBtn",
      textContent: "✏️",
    });
    edit.onclick = (ev) => {
      ev.stopPropagation();
      fillForm(e, idx);
    };

    li.append(ball, date, timeFull, txt, edit);
    li.onclick = () => toggleSelect(li);
    entriesUl.appendChild(li);
  });
};

/* ─ Confeti ─ */
const fireConfetti = () => {
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
};

/* ─ Resaltar fila creada / editada ─ */
const focusRow = (idx) => {
  const li = document.querySelector(`li[data-dbidx='${idx}']`);
  if (li) {
    li.classList.add("highlight");
    li.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => li.classList.remove("highlight"), 2000);
  }
};

/* ─ Guardar ─ */
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  if (!data.whenStart) data.whenStart = toLocalISO(new Date());
  if (!data.whenEnd) data.whenEnd = toLocalISO(new Date());

  let targetIdx;
  if (editIdx === null) {
    addEntry(data);
    targetIdx = loadDB().length - 1;
  } else {
    const db = loadDB();
    db[editIdx] = data;
    saveDB(db);
    targetIdx = editIdx;
  }

  form.reset();
  setDefaultTimes();
  editIdx = null;
  cancelBtn.hidden = true;
  showStep(0);
  render();
  fireConfetti();

  setTimeout(() => {
    showTab("list");
    setTimeout(() => focusRow(targetIdx), 50);
  }, 1200);
});

/* ─ Export / import ─ */
document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([JSON.stringify(loadDB(), null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "database.json";
  a.click();
};
document.getElementById("importInput").onchange = async () => {
  const f = document.getElementById("importInput").files[0];
  if (!f) return;
  try {
    const arr = JSON.parse(await f.text());
    if (Array.isArray(arr)) {
      arr.forEach((o) => addEntry(o));
      render();
    }
  } catch {
    alert("Archivo no válido");
  }
};

/* ─ util: ISO local sin segundos ─ */
/* helpers */
const pad = (n) => String(n).padStart(2, "0");
const toLocalISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/* redondeo a :00 / :30  (dir = "floor" | "ceil") */
const roundHalfHour = (date, dir) => {
  const res = new Date(date);
  const m = res.getMinutes();
  if (dir === "floor") {
    res.setMinutes(m < 30 ? 0 : 30, 0, 0);
  } else {
    // ceil
    if (m === 0 || m === 30) {
      res.setSeconds(0, 0);
    } else if (m < 30) {
      res.setMinutes(30, 0, 0);
    } else {
      res.setHours(res.getHours() + 1, 0, 0, 0);
    }
  }
  return res;
};

/* ─ establecer valores por defecto ─ */
const setDefaultTimes = () => {
  const now = new Date();
  const start = roundHalfHour(
    new Date(now.getTime() - 30 * 60 * 1000),
    "floor"
  );
  const end = roundHalfHour(new Date(now.getTime() + 30 * 60 * 1000), "ceil");
  whenStart.value = toLocalISO(start);
  whenEnd.value = toLocalISO(end);
};

/* ─ Inicio ─ */
setDefaultTimes();

showStep(0);
render();

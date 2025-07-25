/* picker básico: clic en input .dp abre calendario flotante */
const tpl = `
  <div class="calHead">
    <button class="prev">‹</button>
    <span class="month"></span>
    <button class="next">›</button>
  </div>
  <div class="calGrid"></div>
  <div class="calTime" hidden>
    <input type="time">
    <button class="set">✔︎</button>
  </div>`;
const months = "Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic".split(" ");

let picker, activeInput;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("dp")) {
    e.preventDefault();
    openPicker(e.target);
  } else if (!e.target.closest(".datepicker")) {
    closePicker();
  }
});

function openPicker(inp) {
  activeInput = inp;
  if (!picker) {
    picker = document.createElement("div");
    picker.className = "datepicker";
    picker.innerHTML = tpl;
    document.body.appendChild(picker);
    picker.querySelector(".prev").onclick = () => move(-1);
    picker.querySelector(".next").onclick = () => move(1);
    picker.querySelector(".set").onclick = setDateTime;
  }
  const rect = inp.getBoundingClientRect();
  picker.style.top = rect.bottom + window.scrollY + 4 + "px";
  picker.style.left = rect.left + window.scrollX + "px";
  picker.dataset.monthOffset = 0;
  buildGrid();
  const timeBox = picker.querySelector(".calTime");
  timeBox.hidden = inp.dataset.format !== "datetime";
  picker.querySelector("input[type=time]").value = "";
  picker.style.display = "block";
}

function closePicker() {
  if (picker) picker.style.display = "none";
}

function move(n) {
  picker.dataset.monthOffset = +picker.dataset.monthOffset + n;
  buildGrid();
}

function buildGrid() {
  const grid = picker.querySelector(".calGrid");
  grid.innerHTML = "";
  const head = picker.querySelector(".month");

  const base = activeInput.value
    ? new Date(activeInput.value.replace(" ", "T"))
    : new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(1);
  base.setMonth(base.getMonth() + (+picker.dataset.monthOffset || 0));

  head.textContent = months[base.getMonth()] + " " + base.getFullYear();

  const start = new Date(base);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // lunes
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const b = document.createElement("button");
    b.textContent = d.getDate();
    b.dataset.time = d.toISOString().slice(0, 10);
    if (d.getMonth() !== base.getMonth()) b.classList.add("off");
    b.onclick = pickDate;
    grid.appendChild(b);
  }
}

function pickDate(ev) {
  const date = ev.target.dataset.time;
  if (activeInput.dataset.format === "datetime") {
    picker.querySelector("input[type=time]").dataset.date = date;
  } else {
    activeInput.value = date; // date-only
    closePicker();
  }
}
function setDateTime() {
  const t = picker.querySelector("input[type=time]");
  if (t.value) {
    activeInput.value = t.dataset.date + " " + t.value;
    closePicker();
  }
}

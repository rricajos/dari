// /js/views/EntryView.js
import { toLocalISO } from "../utils.js";

const EntryView = {
  render(entries, controller) {
    const ul = document.getElementById("entries");
    const delBtn = document.getElementById("delSelBtn");

    ul.innerHTML = "";
    this.selected = new Set();
    delBtn.disabled = true;

    entries
      .map((e, idx) => ({ e, idx }))
      .sort((a, b) => b.e.whenStart.localeCompare(a.e.whenStart))
      .forEach(({ e, idx }) => {
        const li = document.createElement("li");
        li.dataset.dbidx = idx;

        const ball = document.createElement("span");
        ball.className = `ball ${
          e.amount === "poco"
            ? "small"
            : e.amount === "normal"
            ? "medium"
            : "large"
        } ${e.mood}`;

        const [dStart, tStart] = e.whenStart.split(" ");
        const [, tEnd] = e.whenEnd.split(" ");

        const date = Object.assign(document.createElement("span"), {
          className: "date",
          textContent: dStart,
        });
        const timeFull = Object.assign(document.createElement("span"), {
          className: "timeFull",
          textContent: `${tStart} – ${tEnd}`,
        });

        const txt = Object.assign(document.createElement("span"), {
          className: "txt",
          textContent: e.what || "–",
        });

        const edit = document.createElement("button");
        edit.className = "editBtn";
        edit.innerHTML =
          '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
        edit.onclick = (ev) => {
          ev.stopPropagation();
          controller.edit(e, idx);
        };

        li.append(ball, date, timeFull, txt, edit);
        li.onclick = () => this.toggleSelect(li, controller);
        ul.appendChild(li);
      });

    delBtn.onclick = () => {
      if (!this.selected.size) return;
      if (!confirm("¿Eliminar los seleccionados?")) return;
      controller.deleteSelected([...this.selected]);
      this.selected.clear();
      delBtn.disabled = true;
    };
  },

  toggleSelect(li, controller) {
    const idx = Number(li.dataset.dbidx);
    const delBtn = document.getElementById("delSelBtn");

    if (this.selected.has(idx)) {
      this.selected.delete(idx);
      li.classList.remove("selected");
    } else {
      this.selected.add(idx);
      li.classList.add("selected");
    }
    delBtn.disabled = this.selected.size === 0;
  },

  bindEvents(controller) {
    const form = document.getElementById("entryForm");
    const clearBtn = document.getElementById("clearBtn");

    form.onsubmit = (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const dStart = form.dateStart.value;
      const tStart = form.timeStart.value;
      const dEnd = form.dateEnd.value;
      const tEnd = form.timeEnd.value;

      data.whenStart = `${dStart} ${tStart}`;
      data.whenEnd = `${dEnd} ${tEnd}`;

      delete data.dateStart;
      delete data.timeStart;
      delete data.dateEnd;
      delete data.timeEnd;

      controller.save(data);
    };

    clearBtn.onclick = () => controller.clearAll();
  },
};

export default EntryView;

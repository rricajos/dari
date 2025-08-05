// /js/utils.js

export const pad = (n) => String(n).padStart(2, "0");

export const toLocalISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/**
 * Redondea a media hora: "floor" (pasado) o "ceil" (futuro)
 */
export const roundHalfHour = (date, dir = "floor") => {
  const res = new Date(date);
  const m = res.getMinutes();
  if (dir === "floor") {
    res.setMinutes(m < 30 ? 0 : 30, 0, 0);
  } else {
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

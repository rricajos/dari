export const dbKey = "darinkDB";
export const loadDB = () => JSON.parse(localStorage.getItem(dbKey) || "[]");
export const saveDB = (db) => localStorage.setItem(dbKey, JSON.stringify(db));
export const clearDB = () => localStorage.removeItem(dbKey);
export const addEntry = (e) => {
  const db = loadDB();
  db.push(e);
  saveDB(db);
};
export const deleteEntry = (i) => {
  const db = loadDB();
  db.splice(i, 1);
  saveDB(db);
};

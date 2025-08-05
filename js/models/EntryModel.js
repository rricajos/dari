// /js/models/EntryModel.js
import {
  loadDB,
  saveDB,
  addEntry,
  deleteEntry,
  clearDB,
} from "../../storage.js";

const EntryModel = {
  getAll() {
    return loadDB();
  },
  add(data) {
    addEntry(data);
  },
  update(index, data) {
    const db = loadDB();
    db[index] = data;
    saveDB(db);
  },
  remove(index) {
    deleteEntry(index);
  },
  clear() {
    clearDB();
  },
};

export default EntryModel;

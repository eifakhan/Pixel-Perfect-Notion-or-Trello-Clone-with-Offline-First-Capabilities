import { openDB } from "idb";

const DB_NAME = "taskflow-db";
const DB_VERSION = 1;

let dbPromise = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("boards")) {
          db.createObjectStore("boards", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("columns")) {
          const colStore = db.createObjectStore("columns", { keyPath: "id" });
          colStore.createIndex("boardId", "boardId");
        }
        if (!db.objectStoreNames.contains("cards")) {
          const cardStore = db.createObjectStore("cards", { keyPath: "id" });
          cardStore.createIndex("columnId", "columnId");
        }
      },
    });
  }
  return dbPromise;
}

// Boards
export async function getAllBoards() {
  const db = await getDB();
  return db.getAll("boards");
}

export async function saveBoard(board) {
  const db = await getDB();
  return db.put("boards", board);
}

export async function deleteBoard(id) {
  const db = await getDB();
  return db.delete("boards", id);
}

// Columns
export async function getColumnsForBoard(boardId) {
  const db = await getDB();
  return db.getAllFromIndex("columns", "boardId", boardId);
}

export async function saveColumn(column) {
  const db = await getDB();
  return db.put("columns", column);
}

export async function deleteColumn(id) {
  const db = await getDB();
  return db.delete("columns", id);
}

// Cards
export async function getCardsForColumn(columnId) {
  const db = await getDB();
  return db.getAllFromIndex("cards", "columnId", columnId);
}

export async function saveCard(card) {
  const db = await getDB();
  return db.put("cards", card);
}

export async function deleteCard(id) {
  const db = await getDB();
  return db.delete("cards", id);
}

export async function getAllCardsForBoard(boardId) {
  // Get all columns for this board, then all cards for those columns
  const columns = await getColumnsForBoard(boardId);
  const columnIds = columns.map((c) => c.id);
  const db = await getDB();
  const allCards = await db.getAll("cards");
  return allCards.filter((card) => columnIds.includes(card.columnId));
}

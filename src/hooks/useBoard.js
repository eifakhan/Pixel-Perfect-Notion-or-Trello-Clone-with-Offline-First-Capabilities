import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getAllBoards,
  saveBoard,
  deleteBoard as dbDeleteBoard,
  getColumnsForBoard,
  saveColumn,
  deleteColumn as dbDeleteColumn,
  getAllCardsForBoard,
  saveCard,
  deleteCard as dbDeleteCard,
} from "../utils/db";
import { seedDemoData } from "../utils/seed";

export function useBoard() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use ref to always have fresh cards in callbacks without stale closure
  const cardsRef = useRef(cards);
  const columnsRef = useRef(columns);
  useEffect(() => { cardsRef.current = cards; }, [cards]);
  useEffect(() => { columnsRef.current = columns; }, [columns]);

  // ── INIT ─────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      let allBoards = await getAllBoards();
      if (allBoards.length === 0) {
        const id = await seedDemoData();
        allBoards = await getAllBoards();
        setActiveBoardId(id);
      } else {
        setActiveBoardId(allBoards[0].id);
      }
      setBoards(allBoards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setLoading(false);
    }
    init();
  }, []);

  // ── LOAD BOARD DATA ──────────────────────────────────────
  useEffect(() => {
    if (!activeBoardId) {
      setColumns([]);
      setCards([]);
      return;
    }
    async function loadBoard() {
      const cols = await getColumnsForBoard(activeBoardId);
      setColumns(cols.sort((a, b) => a.order - b.order));
      const allCards = await getAllCardsForBoard(activeBoardId);
      setCards(allCards);
    }
    loadBoard();
  }, [activeBoardId]);

  // ── BOARDS ───────────────────────────────────────────────
  const createBoard = useCallback(async (title, emoji = "📋", color = "#e85d2f") => {
    const board = {
      id: uuidv4(),
      title,
      emoji,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveBoard(board);
    setBoards((prev) => [...prev, board]);
    setActiveBoardId(board.id);
    return board;
  }, []);

  const deleteBoardById = useCallback(async (id) => {
    await dbDeleteBoard(id);
    setBoards((prev) => {
      const remaining = prev.filter((b) => b.id !== id);
      setActiveBoardId((cur) => (cur === id ? remaining[0]?.id || null : cur));
      return remaining;
    });
  }, []);

  // ── COLUMNS ──────────────────────────────────────────────
  const createColumn = useCallback(async (title) => {
    if (!activeBoardId) return;
    const col = {
      id: uuidv4(),
      boardId: activeBoardId,
      title,
      order: columnsRef.current.length,
      color: "#78716c",
      createdAt: new Date().toISOString(),
    };
    await saveColumn(col);
    setColumns((prev) => [...prev, col]);
  }, [activeBoardId]);

  const renameColumn = useCallback(async (id, title) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    const col = columnsRef.current.find((c) => c.id === id);
    if (col) await saveColumn({ ...col, title });
  }, []);

  const deleteColumn = useCallback(async (id) => {
    await dbDeleteColumn(id);
    const colCards = cardsRef.current.filter((c) => c.columnId === id);
    for (const card of colCards) await dbDeleteCard(card.id);
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setCards((prev) => prev.filter((c) => c.columnId !== id));
  }, []);

  // ── CARDS ────────────────────────────────────────────────
  const createCard = useCallback(async (columnId, title) => {
    const colCards = cardsRef.current.filter((c) => c.columnId === columnId);
    const card = {
      id: uuidv4(),
      columnId,
      title,
      description: "",
      priority: "medium",
      tags: [],
      order: colCards.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: null,
      checklist: [],
    };
    await saveCard(card);
    setCards((prev) => [...prev, card]);
    return card;
  }, []);

  const updateCard = useCallback(async (id, updates) => {
    const now = new Date().toISOString();
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c))
    );
    const card = cardsRef.current.find((c) => c.id === id);
    if (card) await saveCard({ ...card, ...updates, updatedAt: now });
  }, []);

  const deleteCard = useCallback(async (id) => {
    await dbDeleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Key fix: use functional updater so we never read stale state
  const reorderCards = useCallback(async (newCards) => {
    setCards((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      newCards.forEach((nc) => {
        const existing = map.get(nc.id);
        if (existing) map.set(nc.id, { ...existing, ...nc });
      });
      return Array.from(map.values());
    });

    // Persist to IndexedDB using latest ref
    for (const nc of newCards) {
      const existing = cardsRef.current.find((c) => c.id === nc.id);
      if (existing) await saveCard({ ...existing, ...nc });
    }
  }, []);

  return {
    boards,
    activeBoardId,
    setActiveBoardId,
    activeBoard: boards.find((b) => b.id === activeBoardId),
    columns,
    cards,
    loading,
    createBoard,
    deleteBoardById,
    createColumn,
    renameColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
  };
}

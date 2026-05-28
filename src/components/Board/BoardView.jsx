import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { CardItem } from "../Card/CardItem";
import { CardDetail } from "../Card/CardDetail";
import { Plus, Search} from "lucide-react";

export function BoardView({ board, columns, cards, actions }) {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCardsForColumn = (colId) => {
    let filtered = cards.filter((c) => c.columnId === colId);

    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((c) => c.priority === filterPriority);
    }

    return filtered.sort((a, b) => a.order - b.order);
  };

  const handleDragStart = ({ active }) => {
    const card = cards.find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const card = cards.find((c) => c.id === active.id);
    if (!card) return;

    const overId = over.id;
    const isOverColumn = columns.some((col) => col.id === overId);

    if (isOverColumn && card.columnId !== overId) {
      const colCards = cards.filter((c) => c.columnId === overId).sort((a, b) => a.order - b.order);
      actions.reorderCards([{ id: card.id, columnId: overId, order: colCards.length }]);
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over) return;

    const card = cards.find((c) => c.id === active.id);
    if (!card) return;

    const overId = over.id;
    const isColumn = columns.some((col) => col.id === overId);

    if (isColumn) {
      const colCards = cards.filter((c) => c.columnId === overId).sort((a, b) => a.order - b.order);
      actions.reorderCards([{ id: card.id, columnId: overId, order: colCards.length }]);
      return;
    }

    const overCard = cards.find((c) => c.id === overId);
    if (!overCard) return;

    if (card.columnId === overCard.columnId) {
      const colCards = cards
        .filter((c) => c.columnId === card.columnId)
        .sort((a, b) => a.order - b.order);
      const oldIdx = colCards.findIndex((c) => c.id === card.id);
      const newIdx = colCards.findIndex((c) => c.id === overCard.id);
      if (oldIdx === newIdx) return;
      const reordered = arrayMove(colCards, oldIdx, newIdx);
      const updates = reordered.map((c, i) => ({ id: c.id, columnId: c.columnId, order: i }));
      actions.reorderCards(updates);
    } else {
      const destCards = cards
        .filter((c) => c.columnId === overCard.columnId)
        .sort((a, b) => a.order - b.order);
      const insertIdx = destCards.findIndex((c) => c.id === overCard.id);
      const newDestCards = destCards.filter((c) => c.id !== card.id);
      newDestCards.splice(insertIdx, 0, { ...card, columnId: overCard.columnId });
      const updates = newDestCards.map((c, i) => ({
        id: c.id,
        columnId: overCard.columnId,
        order: i,
      }));
      actions.reorderCards(updates);
    }
  };

  const handleAddColumn = () => {
    if (!newColTitle.trim()) {
      setAddingColumn(false);
      return;
    }
    actions.createColumn(newColTitle.trim());
    setNewColTitle("");
    setAddingColumn(false);
  };

  const totalCards = cards.length;
  const isFiltered = searchQuery.trim() || filterPriority !== "all";

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* Board header */}
      <div className="px-8 pt-6 pb-4 border-b border-surface-100 bg-surface-50 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{board?.emoji}</span>
            <div>
              <h1 className="text-lg font-semibold text-surface-800 leading-tight">{board?.title}</h1>
              <p className="text-xs text-surface-400 mt-0.5">
                {columns.length} columns · {totalCards} cards
              </p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards…"
                className="pl-7 pr-3 py-1.5 text-xs border border-surface-200 rounded-lg outline-none focus:border-accent bg-white w-40 placeholder:text-surface-300 transition-all focus:w-52"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs border border-surface-200 rounded-lg px-2.5 py-1.5 bg-white text-surface-600 outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            {isFiltered && (
              <button
                onClick={() => { setSearchQuery(""); setFilterPriority("all"); }}
                className="text-xs text-accent hover:text-accent-dark font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Kanban columns - scrollable area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 px-8 py-6 items-start" style={{ minHeight: "100%", width: "max-content", minWidth: "100%" }}>
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={getCardsForColumn(col.id)}
                onAddCard={actions.createCard}
                onCardClick={(card) => setSelectedCard(card)}
                onDelete={actions.deleteColumn}
                onRename={actions.renameColumn}
              />
            ))}

            {/* Add column button */}
            <div className="flex-shrink-0 w-72">
              {addingColumn ? (
                <div className="bg-white rounded-xl border border-surface-200 shadow-card p-3.5">
                  <input
                    autoFocus
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setAddingColumn(false);
                    }}
                    placeholder="Column name…"
                    className="w-full text-sm font-medium text-surface-800 outline-none placeholder:text-surface-300 mb-3 border-b border-surface-100 pb-2"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleAddColumn}
                      className="px-3 py-1.5 bg-surface-800 text-white text-xs font-medium rounded-lg hover:bg-surface-700 transition-colors"
                    >
                      Add column
                    </button>
                    <button
                      onClick={() => setAddingColumn(false)}
                      className="px-3 py-1.5 text-surface-400 text-xs hover:text-surface-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingColumn(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-surface-200 text-sm text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all group"
                >
                  <Plus size={15} className="group-hover:text-accent transition-colors" />
                  Add column
                </button>
              )}
            </div>
          </div>

          <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {activeCard ? (
              <div className="rotate-1 shadow-modal opacity-95 w-72">
                <CardItem card={activeCard} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card detail modal */}
      <CardDetail
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={(id, updates) => {
          actions.updateCard(id, updates);
          setSelectedCard((prev) => (prev ? { ...prev, ...updates } : prev));
        }}
        onDelete={(id) => {
          actions.deleteCard(id);
          setSelectedCard(null);
        }}
        columns={columns}
      />
    </div>
  );
}

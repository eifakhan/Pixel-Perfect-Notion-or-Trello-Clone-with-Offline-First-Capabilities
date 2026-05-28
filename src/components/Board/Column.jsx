import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CardItem } from "../Card/CardItem";
import { MoreHorizontal, Plus, Trash2, Edit2, Check, X } from "lucide-react";

export function Column({ column, cards, onAddCard, onCardClick, onDelete, onRename }) {
  const [showMenu, setShowMenu] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleAddCard = () => {
    const trimmed = newCardTitle.trim();
    if (!trimmed) {
      setAddingCard(false);
      return;
    }
    onAddCard(column.id, trimmed);
    setNewCardTitle("");
    // keep adding form open for quick multi-add
    setAddingCard(false);
  };

  const handleRename = () => {
    const trimmed = tempTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed);
    } else {
      setTempTitle(column.title);
    }
    setEditingTitle(false);
  };

  const colDotColor = column.color || "#78716c";

  return (
    <div className="flex-shrink-0 w-72 flex flex-col max-h-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: colDotColor }}
          />
          {editingTitle ? (
            <input
              autoFocus
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setTempTitle(column.title);
                  setEditingTitle(false);
                }
              }}
              className="flex-1 text-sm font-semibold text-surface-800 bg-transparent border-b-2 border-accent outline-none py-0.5"
            />
          ) : (
            <h3
              className="text-sm font-semibold text-surface-700 truncate cursor-text hover:text-surface-900 transition-colors"
              onDoubleClick={() => setEditingTitle(true)}
            >
              {column.title}
            </h3>
          )}
          <span className="text-xs text-surface-400 bg-surface-100 rounded-md px-1.5 py-0.5 font-medium flex-shrink-0 tabular-nums">
            {cards.length}
          </span>
        </div>

        <div className="relative flex-shrink-0 ml-1">
          <button
            onClick={() => setShowMenu(!showMenu)}
            onBlur={() => setTimeout(() => setShowMenu(false), 150)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
          >
            <MoreHorizontal size={15} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-30 bg-white border border-surface-100 rounded-xl shadow-modal py-1 w-38 animate-slide-in">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setEditingTitle(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
              >
                <Edit2 size={13} /> Rename
              </button>
              <div className="my-1 border-t border-surface-100" />
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (window.confirm(`Delete column "${column.title}"? All cards inside will be deleted too.`)) {
                    onDelete(column.id);
                  }
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-red-mid hover:bg-red-soft transition-colors"
              >
                <Trash2 size={13} /> Delete column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards area — scrollable */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto no-scrollbar rounded-xl transition-colors duration-150 space-y-2.5 p-1 -m-1 ${
          isOver ? "bg-blue-soft/40 ring-2 ring-blue-mid/20 rounded-xl" : ""
        }`}
        style={{ minHeight: "40px" }}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>

        {/* Empty state placeholder */}
        {cards.length === 0 && !isOver && (
          <div className="border-2 border-dashed border-surface-150 rounded-xl py-7 flex flex-col items-center justify-center gap-1.5">
            <span className="text-xl opacity-30">📋</span>
            <span className="text-xs text-surface-300">No cards yet</span>
          </div>
        )}

        {isOver && cards.length === 0 && (
          <div className="border-2 border-blue-mid/40 bg-blue-soft/30 rounded-xl py-7 flex items-center justify-center">
            <span className="text-xs text-blue-mid font-medium">Drop here</span>
          </div>
        )}
      </div>

      {/* Add card */}
      <div className="mt-2 flex-shrink-0">
        {addingCard ? (
          <div className="bg-white rounded-xl border border-surface-200 shadow-card p-3">
            <textarea
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === "Escape") setAddingCard(false);
              }}
              placeholder="What needs to be done?"
              rows={2}
              className="w-full text-sm text-surface-800 resize-none outline-none placeholder:text-surface-300 mb-2.5 leading-relaxed"
            />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddCard}
                className="flex items-center gap-1 px-3 py-1.5 bg-surface-800 text-white text-xs font-semibold rounded-lg hover:bg-surface-700 transition-colors"
              >
                <Check size={11} /> Add card
              </button>
              <button
                onClick={() => { setAddingCard(false); setNewCardTitle(""); }}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors group"
          >
            <Plus size={14} className="group-hover:text-accent transition-colors flex-shrink-0" />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}

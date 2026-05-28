import { useState } from "react";
import { Modal } from "../UI/Modal";
import { Tag } from "../UI/Badge";
import { Trash2, Plus, X, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const PRIORITIES = ["low", "medium", "high"];
const AVAILABLE_TAGS = ["frontend", "backend", "design", "ux", "devops", "infra", "auth", "product"];

export function CardDetail({ card, open, onClose, onUpdate, onDelete, columns }) {
  const [editing, setEditing] = useState(null); // 'title' | 'description'
  const [newCheckItem, setNewCheckItem] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);

  if (!card) return null;

  const handleTitleBlur = (e) => {
    if (e.target.value.trim()) onUpdate(card.id, { title: e.target.value.trim() });
    setEditing(null);
  };

  const handleDescBlur = (e) => {
    onUpdate(card.id, { description: e.target.value });
    setEditing(null);
  };

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    const item = { id: uuidv4(), text: newCheckItem.trim(), done: false };
    onUpdate(card.id, { checklist: [...(card.checklist || []), item] });
    setNewCheckItem("");
  };

  const toggleCheck = (itemId) => {
    const updated = card.checklist.map((i) =>
      i.id === itemId ? { ...i, done: !i.done } : i
    );
    onUpdate(card.id, { checklist: updated });
  };

  const removeCheck = (itemId) => {
    onUpdate(card.id, { checklist: card.checklist.filter((i) => i.id !== itemId) });
  };

  const toggleTag = (tag) => {
    const tags = card.tags || [];
    const updated = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    onUpdate(card.id, { tags: updated });
  };

  const doneChecks = card.checklist?.filter((i) => i.done).length || 0;
  const totalChecks = card.checklist?.length || 0;

  return (
    <Modal open={open} onClose={onClose} title="Card Details" wide>
      <div className="space-y-5">
        {/* Title */}
        <div>
          {editing === "title" ? (
            <input
              autoFocus
              defaultValue={card.title}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
              className="w-full text-lg font-semibold text-surface-800 border-0 border-b-2 border-accent outline-none pb-1 bg-transparent"
            />
          ) : (
            <h3
              className="text-lg font-semibold text-surface-800 cursor-text hover:text-accent transition-colors"
              onClick={() => setEditing("title")}
            >
              {card.title}
            </h3>
          )}
        </div>

        {/* Move to column */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Column</label>
          <select
            value={card.columnId}
            onChange={(e) => onUpdate(card.id, { columnId: e.target.value })}
            className="text-sm border border-surface-200 rounded-lg px-2.5 py-1.5 text-surface-700 bg-surface-50 outline-none focus:border-accent"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>{col.title}</option>
            ))}
          </select>

          {/* Priority */}
          <label className="text-xs font-medium text-surface-500 uppercase tracking-wider ml-2">Priority</label>
          <div className="flex gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => onUpdate(card.id, { priority: p })}
                className={`text-xs px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${card.priority === p ? "bg-surface-800 text-white" : "bg-surface-100 text-surface-500 hover:bg-surface-200"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-surface-500 uppercase tracking-wider w-20">Due date</label>
          <input
            type="date"
            value={card.dueDate || ""}
            onChange={(e) => onUpdate(card.id, { dueDate: e.target.value || null })}
            className="text-sm border border-surface-200 rounded-lg px-2.5 py-1.5 text-surface-700 bg-surface-50 outline-none focus:border-accent"
          />
          {card.dueDate && (
            <button onClick={() => onUpdate(card.id, { dueDate: null })} className="text-surface-400 hover:text-red-mid transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-2">Description</label>
          {editing === "description" ? (
            <textarea
              autoFocus
              defaultValue={card.description}
              onBlur={handleDescBlur}
              rows={4}
              className="w-full text-sm text-surface-700 border border-accent rounded-xl px-3 py-2.5 resize-none outline-none bg-surface-50"
            />
          ) : (
            <div
              onClick={() => setEditing("description")}
              className="min-h-[60px] text-sm text-surface-500 bg-surface-50 rounded-xl px-3 py-2.5 cursor-text hover:bg-surface-100 transition-colors border border-surface-100"
            >
              {card.description || <span className="italic opacity-50">Click to add a description…</span>}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Tags</label>
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              className="text-xs text-accent hover:text-accent-dark flex items-center gap-0.5"
            >
              <Plus size={12} /> edit
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.tags?.map((t) => (
              <span key={t} className="flex items-center gap-1">
                <Tag label={t} />
                <button onClick={() => toggleTag(t)} className="text-surface-300 hover:text-red-mid transition-colors">
                  <X size={10} />
                </button>
              </span>
            ))}
            {!card.tags?.length && <span className="text-xs text-surface-300 italic">No tags</span>}
          </div>
          {showTagPicker && (
            <div className="flex flex-wrap gap-1.5 mt-2 p-2.5 bg-surface-50 rounded-lg border border-surface-100">
              {AVAILABLE_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium transition-colors ${card.tags?.includes(t) ? "bg-surface-700 text-white" : "bg-white border border-surface-200 text-surface-600 hover:border-surface-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">
              Checklist {totalChecks > 0 && <span className="text-surface-400">({doneChecks}/{totalChecks})</span>}
            </label>
          </div>

          {totalChecks > 0 && (
            <div className="w-full bg-surface-100 rounded-full h-1 mb-3">
              <div
                className="bg-green-mid h-1 rounded-full transition-all duration-300"
                style={{ width: `${(doneChecks / totalChecks) * 100}%` }}
              />
            </div>
          )}

          <div className="space-y-1.5 mb-2">
            {card.checklist?.map((item) => (
              <div key={item.id} className="flex items-center gap-2 group/item">
                <button
                  onClick={() => toggleCheck(item.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${item.done ? "bg-green-mid border-green-mid" : "border-surface-300 hover:border-surface-500"}`}
                >
                  {item.done && <Check size={10} className="text-white" />}
                </button>
                <span className={`text-sm flex-1 ${item.done ? "line-through text-surface-400" : "text-surface-700"}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => removeCheck(item.id)}
                  className="opacity-0 group-hover/item:opacity-100 text-surface-300 hover:text-red-mid transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCheckItem()}
              placeholder="Add item…"
              className="flex-1 text-sm border border-surface-200 rounded-lg px-3 py-1.5 outline-none focus:border-accent placeholder:text-surface-300 bg-surface-50"
            />
            <button
              onClick={addCheckItem}
              className="px-3 py-1.5 bg-surface-800 text-white text-sm rounded-lg hover:bg-surface-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2 border-t border-surface-100">
          <button
            onClick={() => { onDelete(card.id); onClose(); }}
            className="flex items-center gap-1.5 text-sm text-red-mid hover:text-red-mid/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-soft"
          >
            <Trash2 size={14} />
            Delete card
          </button>
        </div>
      </div>
    </Modal>
  );
}

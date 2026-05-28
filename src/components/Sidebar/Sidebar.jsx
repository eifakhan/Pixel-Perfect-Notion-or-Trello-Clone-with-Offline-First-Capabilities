import { useState } from "react";
import { Plus, Layout, Wifi, WifiOff, Settings, Trash2 } from "lucide-react";
import { Modal } from "../UI/Modal";

const BOARD_COLORS = ["#e85d2f", "#3b82f6", "#22c55e", "#8b5cf6", "#eab308", "#ef4444"];
const BOARD_EMOJIS = ["🚀", "📋", "💡", "🎯", "🏗️", "📦", "🌿", "⚡", "🔥", "🎨"];

function SettingsModal({ open, onClose }) {

  const clearData = () => {
    if (window.confirm("This will delete ALL your boards and cards. Are you sure?")) {
      indexedDB.deleteDatabase("taskflow-db");
      window.location.reload();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-5">
        {/* App info */}
        <div className="bg-surface-50 rounded-xl p-4 border border-surface-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Layout size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-800">TaskFlow</p>
              <p className="text-xs text-surface-400">v1.0.0 · Offline-first Kanban</p>
            </div>
          </div>
          <p className="text-xs text-surface-500 leading-relaxed">
            All your data is stored locally in your browser using IndexedDB. No account needed, works fully offline.
          </p>
        </div>

        {/* Storage info */}
        <div>
          <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-2">Storage</label>
          <div className="flex items-center justify-between bg-surface-50 rounded-xl px-4 py-3 border border-surface-100">
            <div>
              <p className="text-sm font-medium text-surface-700">Local Database (IndexedDB)</p>
              <p className="text-xs text-surface-400 mt-0.5">Data persists across sessions</p>
            </div>
            <span className="text-xs text-green-mid font-semibold bg-green-soft px-2 py-1 rounded-lg">Active</span>
          </div>
        </div>

        {/* Shortcuts */}
        <div>
          <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-2">Keyboard Shortcuts</label>
          <div className="space-y-1.5">
            {[
              ["Enter", "Confirm / Add item"],
              ["Escape", "Cancel / Close modal"],
              ["Drag", "Move cards between columns"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-surface-500">{desc}</span>
                <kbd className="px-2 py-0.5 bg-surface-100 border border-surface-200 rounded text-xs font-mono text-surface-600">{key}</kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="border border-red-soft rounded-xl p-4">
          <p className="text-xs font-semibold text-red-mid uppercase tracking-wider mb-1">Danger Zone</p>
          <p className="text-xs text-surface-400 mb-3">This will permanently delete all boards and cards from your browser.</p>
          <button
            onClick={clearData}
            className="px-3 py-1.5 bg-red-soft text-red-mid text-xs font-medium rounded-lg hover:bg-red-mid hover:text-white transition-colors"
          >
            Clear all data
          </button>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-800 text-white text-sm font-medium rounded-xl hover:bg-surface-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Sidebar({ boards, activeBoardId, onSelectBoard, onCreateBoard, onDeleteBoard, isOffline }) {
  const [creating, setCreating] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(BOARD_COLORS[0]);
  const [emoji, setEmoji] = useState(BOARD_EMOJIS[0]);
  const [hoveredBoard, setHoveredBoard] = useState(null);

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreateBoard(title.trim(), emoji, color);
    setTitle("");
    setColor(BOARD_COLORS[0]);
    setEmoji(BOARD_EMOJIS[0]);
    setCreating(false);
  };

  return (
    <>
      <aside className="w-56 bg-surface-950 flex flex-col h-full flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Layout size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">TaskFlow</span>
          </div>
          <p className="text-[10px] text-surface-500 mt-1 ml-9">Offline-first kanban</p>
        </div>

        {/* Offline indicator */}
        <div
          className={`mx-3 mt-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-all ${
            isOffline ? "bg-yellow-soft/10 text-yellow-mid" : "bg-green-soft/10 text-green-mid"
          }`}
        >
          {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
          {isOffline ? "Working offline" : "All changes saved"}
        </div>

        {/* Boards */}
        <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-widest">Boards</span>
            <button
              onClick={() => setCreating(true)}
              className="w-5 h-5 flex items-center justify-center rounded text-surface-500 hover:text-white hover:bg-surface-700 transition-colors"
              title="New board"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="space-y-0.5">
            {boards.map((board) => (
              <div
                key={board.id}
                onMouseEnter={() => setHoveredBoard(board.id)}
                onMouseLeave={() => setHoveredBoard(null)}
                className="relative group"
              >
                <button
                  onClick={() => onSelectBoard(board.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                    activeBoardId === board.id
                      ? "bg-surface-800 text-white"
                      : "text-surface-400 hover:bg-surface-800 hover:text-surface-200"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{board.emoji}</span>
                  <span className="text-sm font-medium truncate flex-1">{board.title}</span>
                </button>

                {hoveredBoard === board.id && boards.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${board.title}"? All cards will be lost.`)) {
                        onDeleteBoard(board.id);
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-surface-500 hover:text-red-mid transition-colors"
                    title="Delete board"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}

            {boards.length === 0 && (
              <p className="text-xs text-surface-600 px-2 py-3 italic">No boards yet. Create one!</p>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-surface-800 pt-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-800 transition-colors text-sm"
          >
            <Settings size={14} />
            Settings
          </button>
        </div>
      </aside>

      {/* Create board modal */}
      <Modal open={creating} onClose={() => setCreating(false)} title="New board">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-1.5">
              Board name
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Product Roadmap, Sprint 3…"
              className="w-full border border-surface-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent placeholder:text-surface-300 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-2">
              Pick an emoji
            </label>
            <div className="flex gap-2 flex-wrap">
              {BOARD_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 text-xl rounded-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-surface-800 ring-2 ring-surface-600 scale-110"
                      : "bg-surface-50 hover:bg-surface-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-surface-500 uppercase tracking-wider block mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {BOARD_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? "ring-2 ring-offset-2 ring-surface-400 scale-110" : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCreating(false)}
              className="px-4 py-2 text-sm text-surface-500 hover:text-surface-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="px-4 py-2 bg-surface-800 text-white text-sm font-medium rounded-xl hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create board
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

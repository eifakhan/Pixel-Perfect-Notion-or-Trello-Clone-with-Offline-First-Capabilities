import { useBoard } from "./hooks/useBoard";
import { useOffline } from "./hooks/useOffline";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { BoardView } from "./components/Board/BoardView";
import { WifiOff, Loader2, LayoutGrid } from "lucide-react";

export default function App() {
  const isOffline = useOffline();
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    activeBoard,
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
  } = useBoard();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3 text-surface-400">
          <Loader2 size={28} className="animate-spin text-accent" />
          <p className="text-sm font-medium">Loading TaskFlow…</p>
        </div>
      </div>
    );
  }

  const actions = {
    createColumn,
    renameColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
  };

  return (
    <div className="h-screen flex overflow-hidden bg-surface-50">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onCreateBoard={createBoard}
        onDeleteBoard={deleteBoardById}
        isOffline={isOffline}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeBoardId && activeBoard ? (
          <BoardView
            board={activeBoard}
            columns={columns}
            cards={cards}
            actions={actions}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LayoutGrid size={28} className="text-surface-300" />
              </div>
              <p className="text-surface-700 font-medium mb-1">No board selected</p>
              <p className="text-surface-400 text-sm">
                Pick a board from the sidebar or create a new one to get started.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Offline toast */}
      {isOffline && (
        <div className="offline-banner">
          <WifiOff size={13} />
          Offline — all changes saved locally
        </div>
      )}
    </div>
  );
}

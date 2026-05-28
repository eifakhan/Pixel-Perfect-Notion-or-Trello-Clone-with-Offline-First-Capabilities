import { v4 as uuidv4 } from "uuid";
import { saveBoard, saveColumn, saveCard } from "./db";

export async function seedDemoData() {
  const boardId = uuidv4();

  const board = {
    id: boardId,
    title: "Product Roadmap",
    color: "#e85d2f",
    emoji: "🚀",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const cols = [
    { id: uuidv4(), boardId, title: "Backlog", order: 0, color: "#78716c" },
    { id: uuidv4(), boardId, title: "In Progress", order: 1, color: "#3b82f6" },
    { id: uuidv4(), boardId, title: "In Review", order: 2, color: "#eab308" },
    { id: uuidv4(), boardId, title: "Done", order: 3, color: "#22c55e" },
  ];

  const makeCard = (columnId, title, desc, priority, tags, order) => ({
    id: uuidv4(),
    columnId,
    title,
    description: desc,
    priority,
    tags,
    order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: null,
    checklist: [],
  });

  const cards = [
    makeCard(cols[0].id, "Set up CI/CD pipeline", "Configure GitHub Actions for automated testing and deployment.", "medium", ["devops", "infra"], 0),
    makeCard(cols[0].id, "Design system tokens", "Create color, spacing, and type tokens in Figma.", "low", ["design"], 1),
    makeCard(cols[0].id, "User onboarding flow", "Map out the complete new-user experience.", "high", ["ux", "product"], 2),
    makeCard(cols[1].id, "Authentication module", "Email + Google OAuth integration with JWT sessions.", "high", ["backend", "auth"], 0),
    makeCard(cols[1].id, "Kanban board UI", "Drag-and-drop columns and cards using dnd-kit.", "high", ["frontend"], 1),
    makeCard(cols[1].id, "Offline sync logic", "IndexedDB + sync queue for offline-first support.", "medium", ["frontend", "infra"], 2),
    makeCard(cols[2].id, "API rate limiting", "Implement Redis-based rate limiting on all endpoints.", "medium", ["backend"], 0),
    makeCard(cols[2].id, "Landing page redesign", "New hero section + feature highlights.", "low", ["design", "frontend"], 1),
    makeCard(cols[3].id, "Project scaffolding", "Initial React + Tailwind setup with routing.", "low", ["frontend"], 0),
    makeCard(cols[3].id, "Database schema", "PostgreSQL schema for users, boards, and cards.", "medium", ["backend"], 1),
  ];

  await saveBoard(board);
  for (const col of cols) await saveColumn(col);
  for (const card of cards) await saveCard(card);

  return boardId;
}

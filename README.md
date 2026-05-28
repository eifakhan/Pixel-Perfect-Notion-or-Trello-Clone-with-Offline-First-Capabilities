# TaskFlow 🚀

A pixel-perfect, offline-first Kanban board built with React + Tailwind CSS. Inspired by Notion and Trello — but lighter and fully offline-capable via IndexedDB.

# Live Demo
https://pixel-perfect-notion-or-trello-clon-ashen.vercel.app/

## Features

- ✅ Drag-and-drop cards and columns (dnd-kit)
- ✅ Offline-first — all data in IndexedDB, works without internet
- ✅ Multiple boards with custom emoji + color
- ✅ Card details — description, priority, due date, tags, checklist
- ✅ Online/offline status indicator
- ✅ Clean, modern UI with DM Sans font

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Tailwind CSS 3 | Styling |
| @dnd-kit | Drag and drop |
| idb | IndexedDB wrapper (offline storage) |
| lucide-react | Icons |
| date-fns | Date formatting |
| uuid | Unique IDs |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install dependencies
npm install

# Start dev server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# Set homepage in package.json:
# "homepage": "https://YOUR_USERNAME.github.io/taskflow"

npm run deploy
```

## Folder Structure

```
src/
├── components/
│   ├── Board/         # BoardView, Column
│   ├── Card/          # CardItem, CardDetail
│   ├── Sidebar/       # Sidebar
│   └── UI/            # Modal, Badge
├── hooks/
│   ├── useBoard.js    # Main data + IndexedDB logic
│   └── useOffline.js  # Online/offline detection
└── utils/
    ├── db.js          # IndexedDB helpers (idb)
    └── seed.js        # Demo data seeder
```

## License

MIT

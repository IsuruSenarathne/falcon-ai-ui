# FalconAI - React Chat UI

A simple React app interface for falcon AI backend service

## Features

- ✨ Left sidebar with conversation list
- 💬 Main chat area with message display
- 🎨 Clean, modern UI inspired by Claude AI
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- 📱 Responsive design (mobile-friendly)
- 🚀 Built with Vite for fast development

## Project Structure

```
src/
├── App.jsx              # Main app component
├── App.css              # App styles
├── index.css            # Global styles
├── main.jsx             # Entry point
└── components/
    ├── Sidebar.jsx      # Left sidebar with conversations
    ├── Sidebar.css      # Sidebar styles
    ├── ChatArea.jsx     # Main chat interface
    └── ChatArea.css     # Chat area styles
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed

### Installation

1. Navigate to the project directory:
```bash
cd /Users/isurusenarathne/Documents/Dev/AINemoFe
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Usage

- **New Chat**: Click the "+" button in the sidebar to create a new conversation
- **Select Conversation**: Click any conversation in the sidebar to view it
- **Send Message**: Type your message and press Enter (or click the send button)
- **New Line**: Press Shift+Enter to add a new line without sending
- **Toggle Sidebar**: On mobile, click the menu button to show/hide the sidebar

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS3** - Styling with flexbox and transitions

## Future Enhancements

- Integration with AI API (OpenAI, Claude, etc.)
- Message persistence (local storage or backend)
- Dark mode
- User authentication
- File upload support
- Message editing and deletion
- Conversation search

## License

MIT

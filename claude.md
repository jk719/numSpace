# numSpace - Mobile Math Tutoring Whiteboard

## Project Overview
numSpace is a mobile-first collaborative whiteboard application designed specifically for math tutoring. It enables real-time collaboration between tutors and students with an emphasis on ease of use on mobile devices.

## Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Real-time Communication**: Socket.io
- **Backend**: Node.js + Express
- **Gesture Handling**: @use-gesture/react
- **Styling**: CSS3 with custom components

## Architecture

### Frontend Structure
```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main whiteboard canvas
│   ├── TextBlock.tsx   # Individual text elements
│   ├── MathPalette.tsx # Math symbol selector
│   ├── RoomSelector.tsx # Session creation/joining
│   └── Toolbar.tsx     # Clear all and utilities
├── store/              # Zustand state management
│   └── whiteboardStore.ts
├── hooks/              # Custom React hooks
│   └── useSocket.ts    # WebSocket connection
├── utils/              # Utility functions
│   ├── gridSnap.ts     # Grid snapping logic
│   └── smartGrouping.ts # Auto-alignment logic
└── data/               # Static data
    └── mathSymbols.ts  # Math symbols catalog
```

### Backend Structure
```
server/
└── index.cjs           # Socket.io server
```

## Key Features

### 1. Infinite Canvas
- Tap anywhere to create text
- Drag to reposition elements
- Snap-to-grid (20px grid)
- Smart grouping/auto-alignment

### 2. Math Symbol Palette
- 50+ math symbols categorized:
  - Basic operators (+, −, ×, ÷)
  - Greek letters (π, θ, α, β, etc.)
  - Relations (≤, ≥, ≠, ≈)
  - Special symbols (∞, ∂, ∇)
- Template buttons for complex expressions
- Tap symbol → tap canvas to place

### 3. Real-time Collaboration
- WebSocket-based sync
- Room-based sessions with 6-character codes
- Shareable links
- Live updates between users

### 4. Mobile-First UX
- Touch-optimized interactions
- Large tap targets (minimum 44x44px)
- Responsive design
- Bottom-positioned controls for thumb reach

### 5. Modern UX Patterns
- Confirmation dialogs for destructive actions
- Visual feedback on interactions
- Disabled states when actions unavailable
- Element count display
- Smooth animations and transitions

## Running the Application

### Development
```bash
# Install dependencies
npm install

# Start WebSocket server (Terminal 1)
npm run server

# Start Vite dev server (Terminal 2)
npm run dev
```

Access at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## State Management

### Whiteboard Store (Zustand)
```typescript
interface WhiteboardState {
  elements: TextElement[];
  selectedElementId: string | null;
  pendingSymbol: string | null;
  addElement: (element) => void;
  updateElement: (id, updates) => void;
  deleteElement: (id) => void;
  setSelectedElement: (id) => void;
  setPendingSymbol: (symbol) => void;
}
```

### TextElement Interface
```typescript
interface TextElement {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
}
```

## WebSocket Events

### Client → Server
- `join-room`: Join a session room
- `update-elements`: Broadcast element changes

### Server → Client
- `room-state`: Initial room state on join
- `elements-updated`: Real-time element updates
- `user-joined`: New user joined notification

## UX Design Principles Applied

1. **Progressive Disclosure**: Features revealed when needed (delete button on selection)
2. **Confirmation for Destructive Actions**: Dialog before clearing all elements
3. **Feedback**: Visual states for hover, active, disabled
4. **Accessibility**: ARIA labels, semantic HTML, keyboard support
5. **Mobile-First**: Bottom navigation, large tap targets, thumb-friendly layout
6. **Consistency**: Unified design language across components
7. **Performance**: Optimized renders, efficient state updates
8. **Error Prevention**: Disabled buttons when actions unavailable

## Grid System
- Grid size: 20px
- Snap on placement and drag release
- Visual grid pattern (subtle)

## Smart Grouping
- Proximity threshold: 60px
- Alignment tolerance: 40px
- Auto-aligns horizontally or vertically with nearby elements

## Known Limitations (MVP)
- No undo/redo
- No template-based equation builder (UI ready, logic pending)
- No graph plotting
- No handwriting recognition
- No pinch-to-resize
- Room state stored in memory (no persistence)

## Future Enhancements
1. Persistent storage (database)
2. Undo/redo functionality
3. Equation builder with templates
4. Graph plotting tools
5. Handwriting recognition
6. Drawing/sketching mode
7. Export to PDF/image
8. User authentication
9. Session history
10. Mobile app (React Native)

## Code Conventions
- TypeScript strict mode
- Functional components with hooks
- CSS modules for component styles
- Mobile-first responsive design
- Semantic HTML
- Accessibility best practices

## Contributing
When adding features, follow these guidelines:
1. Maintain mobile-first approach
2. Add TypeScript types
3. Follow existing UX patterns
4. Test on mobile devices
5. Keep components small and focused
6. Use modern UX best practices

## License
[Add your license here]

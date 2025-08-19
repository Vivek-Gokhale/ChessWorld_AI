# ChessWorld.ai - Chess Insights Web App

A comprehensive chess analysis web application built with React and Next.js, featuring integration with the Lichess API and optional Stockfish engine analysis.

## Features

### Core Features
- **Player Search & Summary**: Enter a Lichess username to fetch and analyze recent games
- **Comprehensive Statistics**: Wins, losses, draws, color-specific win rates, and most-played openings
- **Games Table**: Interactive table showing last 50 games with sorting, filtering, and search capabilities
- **Game Detail Analysis**: Deep dive into individual games with opening analysis and deviation detection
- **Responsive Design**: Mobile-first design with loading skeletons and error states

### Advanced Features
- **Opening Deviation Detection**: Identifies where players deviate from established opening theory
- **Stockfish Integration**: Optional backend service for deep engine analysis
- **Real-time Analysis**: Mistake and blunder detection with evaluation trends
- **Accessibility**: Keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: React 19, Next.js 15, JavaScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **API**: Lichess Public API
- **Testing**: Vitest with React Testing Library
- **Optional Backend**: Python Flask with Stockfish engine

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Python 3.8+ and Stockfish for engine analysis

### Installation

1. Clone the repository:
\`\`\`bash
# If cloned from GitHub
git clone <repository-url>
cd chess-insights-app

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Optional: Stockfish Backend Setup

For advanced engine analysis, set up the Python backend:

1. Install Python dependencies:
\`\`\`bash
pip install flask flask-cors python-chess stockfish
\`\`\`

2. Download and install Stockfish from [stockfishchess.org](https://stockfishchess.org/download/)

3. Update the Stockfish path in `scripts/stockfish-backend.py`

4. Run the backend:
\`\`\`bash
python scripts/stockfish-backend.py
\`\`\`

The backend will run on `http://localhost:5000` and provide analysis endpoints.

## Usage

1. **Search for a Player**: Enter a Lichess username in the search box
2. **View Statistics**: See comprehensive stats including win rates and favorite openings
3. **Browse Games**: Use the interactive table to filter and sort through recent games
4. **Analyze Games**: Click "Analyze" on any game for detailed opening and tactical analysis
5. **Engine Analysis**: Use the "Analyze with Stockfish" button for deep position evaluation

## API Integration

The app integrates with several Lichess API endpoints:

- `GET /api/games/user/{username}` - Fetch user's recent games
- `GET /api/game/{gameId}` - Get detailed game information

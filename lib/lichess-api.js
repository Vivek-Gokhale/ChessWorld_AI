const LICHESS_API_BASE = "https://lichess.org/api"

export async function fetchPlayerGames(username) {
  const response = await fetch(
    `${LICHESS_API_BASE}/games/user/${username}?max=50&rated=true&perfType=blitz,rapid,classical&format=json`,
    {
      headers: {
        Accept: "application/x-ndjson",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch games for ${username}`)
  }

  const text = await response.text()
  const games = text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))

  return games.map((game) => ({
    id: game.id,
    createdAt: game.createdAt,
    lastMoveAt: game.lastMoveAt,
    status: game.status,
    players: game.players,
    winner: game.winner,
    opening: {
      eco: game.opening?.eco || "Unknown",
      name: game.opening?.name || "Unknown Opening",
    },
    moves: game.moves?.split(" ") || [],
    pgn: game.pgn || "",
    clock: game.clock,
    // Derived fields for table display
    opponent:
      game.players.white.user?.name === username.toLowerCase()
        ? game.players.black.user?.name || "Anonymous"
        : game.players.white.user?.name || "Anonymous",
    opponentRating:
      game.players.white.user?.name === username.toLowerCase() ? game.players.black.rating : game.players.white.rating,
    color: game.players.white.user?.name === username.toLowerCase() ? "white" : "black",
    result: determineResult(game, username),
    timeControl: formatTimeControlFromClock(game.clock),
  }))
}

export async function fetchGameDetails(gameId) {
  const response = await fetch(`${LICHESS_API_BASE}/game/${gameId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch game ${gameId}`)
  }

  const game = await response.json()

  return {
    id: game.id,
    white: {
      username: game.players.white.user?.name || "Anonymous",
      rating: game.players.white.rating,
    },
    black: {
      username: game.players.black.user?.name || "Anonymous",
      rating: game.players.black.rating,
    },
    result:
      game.status === "mate" ? (game.winner === "white" ? "1-0" : "0-1") : game.status === "draw" ? "1/2-1/2" : "1-0",
    opening: {
      eco: game.opening?.eco || "Unknown",
      name: game.opening?.name || "Unknown Opening",
    },
    timeControl: formatTimeControlFromClock(game.clock),
    createdAt: game.createdAt,
    moves: game.moves?.split(" ") || [],
    pgn: game.pgn || "",
    analysis: null, // Will be populated by Stockfish analysis
  }
}

export function calculatePlayerStats(games) {
  const stats = {
    wins: 0,
    losses: 0,
    draws: 0,
    total: games.length,
    whiteWins: 0,
    whiteGames: 0,
    blackWins: 0,
    blackGames: 0,
    whiteWinPercentage: 0,
    blackWinPercentage: 0,
    mostPlayedOpening: { name: "Unknown", eco: "Unknown", count: 0 },
  }

  const openingCounts = {}

  games.forEach((game) => {
    // Count results
    if (game.result === "win") stats.wins++
    else if (game.result === "loss") stats.losses++
    else stats.draws++

    // Count by color
    if (game.color === "white") {
      stats.whiteGames++
      if (game.result === "win") stats.whiteWins++
    } else {
      stats.blackGames++
      if (game.result === "win") stats.blackWins++
    }

    // Count openings
    const openingKey = `${game.opening.eco}-${game.opening.name}`
    if (!openingCounts[openingKey]) {
      openingCounts[openingKey] = {
        name: game.opening.name,
        eco: game.opening.eco,
        count: 0,
      }
    }
    openingCounts[openingKey].count++
  })

  // Calculate percentages
  stats.whiteWinPercentage = stats.whiteGames > 0 ? Math.round((stats.whiteWins / stats.whiteGames) * 100) : 0
  stats.blackWinPercentage = stats.blackGames > 0 ? Math.round((stats.blackWins / stats.blackGames) * 100) : 0

  // Find most played opening
  const mostPlayed = Object.values(openingCounts).reduce(
    (max, current) => (current.count > max.count ? current : max),
    { name: "Unknown", eco: "Unknown", count: 0 },
  )
  stats.mostPlayedOpening = mostPlayed

  return stats
}

export async function analyzeGameWithStockfish(pgn) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pgn }),
    })

    if (!response.ok) {
      throw new Error("Analysis service unavailable")
    }

    return await response.json()
  } catch (error) {
    // Return mock analysis if backend is not available
    return {
      evalTrend: generateMockEvalTrend(),
      mistakes: generateMockMistakes(),
      blunders: generateMockBlunders(),
    }
  }
}

// Helper functions
function determineResult(game, username) {
  if (game.status === "draw" || game.status === "stalemate") return "draw"

  const isWhite = game.players.white.user?.name === username.toLowerCase()
  const winner = game.winner

  if (!winner) return "draw"

  return (isWhite && winner === "white") || (!isWhite && winner === "black") ? "win" : "loss"
}

function formatTimeControlFromClock(clock) {
  if (!clock) return "Unknown"

  const initial = clock.initial
  const increment = clock.increment

  if (initial < 180) return "bullet"
  if (initial < 480) return "blitz"
  if (initial < 1500) return "rapid"
  return "classical"
}

// Mock data generators for when Stockfish backend is not available
function generateMockEvalTrend() {
  const trend = []
  let evaluation = 0

  for (let i = 0; i < 40; i++) {
    evaluation += (Math.random() - 0.5) * 100
    evaluation = Math.max(-500, Math.min(500, evaluation))
    trend.push(Math.round(evaluation))
  }

  return trend
}

function generateMockMistakes() {
  return [
    { move: 12, centipawns: 180 },
    { move: 24, centipawns: 220 },
  ]
}

function generateMockBlunders() {
  return [{ move: 18, centipawns: 350 }]
}

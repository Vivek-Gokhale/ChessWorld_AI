// Mock opening book for demonstration
const OPENING_BOOK = {
  e4: ["e5", "c5", "e6", "c6"],
  "e4 e5": ["Nf3", "f4", "Bc4"],
  "e4 e5 Nf3": ["Nc6", "Nf6", "f5"],
  "e4 e5 Nf3 Nc6": ["Bb5", "Bc4", "d4"],
  d4: ["d5", "Nf6", "f5"],
  "d4 d5": ["c4", "Nf3", "Bf4"],
  "d4 Nf6": ["c4", "Nf3", "Bg5"],
  Nf3: ["d5", "Nf6", "c5"],
  c4: ["e5", "Nf6", "c5"],
}

export function findOpeningDeviation(pgn) {
  if (!pgn) return null

  try {
    // Extract moves from PGN
    const moves = extractMovesFromPGN(pgn)
    if (moves.length < 4) return null

    let position = ""

    for (let i = 0; i < Math.min(moves.length, 20); i++) {
      const move = moves[i]
      const newPosition = position ? `${position} ${move}` : move

      // Check if this position exists in our opening book
      if (OPENING_BOOK[position]) {
        const bookMoves = OPENING_BOOK[position]

        // If the actual move is not in the book, we found a deviation
        if (!bookMoves.includes(move)) {
          return {
            moveNumber: Math.floor(i / 2) + 1,
            actualMove: move,
            bookMove: bookMoves[0], // Suggest the main line
            position: position,
            analysis: `This move deviates from the main theoretical line. The book continuation ${bookMoves[0]} is more commonly played and leads to well-studied positions.`,
          }
        }
      }

      position = newPosition
    }

    return null // No deviation found within the first 20 moves
  } catch (error) {
    console.error("Error analyzing opening deviation:", error)
    return null
  }
}

function extractMovesFromPGN(pgn) {
  // Remove comments, annotations, and metadata
  const cleanPgn = pgn
    .replace(/\{[^}]*\}/g, "") // Remove comments in braces
    .replace(/$$[^)]*$$/g, "") // Remove variations in parentheses
    .replace(/\$\d+/g, "") // Remove numeric annotations
    .replace(/[!?+#=]+/g, "") // Remove move annotations
    .replace(/\d+\./g, "") // Remove move numbers
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, "") // Remove game results
    .trim()

  // Split into moves and filter out empty strings
  return cleanPgn
    .split(/\s+/)
    .filter(
      (move) =>
        move.length > 0 && !move.match(/^\d/) && move !== "1-0" && move !== "0-1" && move !== "1/2-1/2" && move !== "*",
    )
}

export function analyzeMoveAccuracy(move, position, evaluation) {
  // Mock analysis - in a real implementation, this would use Stockfish
  const mockEval = Math.random() * 2 - 1 // Random evaluation between -1 and 1

  if (Math.abs(mockEval) > 0.5) {
    return {
      type: Math.abs(mockEval) > 0.8 ? "blunder" : "mistake",
      evaluation: mockEval,
      description: mockEval > 0 ? "Improves position significantly" : "Worsens position",
    }
  }

  return null
}

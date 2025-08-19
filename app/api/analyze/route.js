import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { pgn } = await request.json()

    if (!pgn) {
      return NextResponse.json({ error: "PGN is required" }, { status: 400 })
    }

    // Try to connect to Python backend
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pgn }),
      })

      if (response.ok) {
        const analysis = await response.json()
        return NextResponse.json(analysis)
      }
    } catch (error) {
      console.log("Python backend not available, using mock analysis")
    }

    // Fallback to mock analysis if Python backend is not available
    const mockAnalysis = {
      evalTrend: generateMockEvalTrend(),
      mistakes: generateMockMistakes(),
      accuracy: Math.floor(Math.random() * 30) + 70, // 70-100%
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

function generateMockEvalTrend() {
  const trend = []
  let currentEval = 0.2

  for (let i = 0; i < 20; i++) {
    currentEval += (Math.random() - 0.5) * 0.8
    currentEval = Math.max(-5, Math.min(5, currentEval))
    trend.push(Math.round(currentEval * 100) / 100)
  }

  return trend
}

function generateMockMistakes() {
  const mistakes = []
  const possibleMistakes = [
    {
      moveNumber: 8,
      move: "Nf3",
      bestMove: "Be2",
      evaluation: -1.2,
      type: "mistake",
      description: "Allows opponent to gain central control",
    },
    {
      moveNumber: 15,
      move: "Qh5",
      bestMove: "Qd2",
      evaluation: -2.8,
      type: "blunder",
      description: "Loses material due to tactical oversight",
    },
    {
      moveNumber: 22,
      move: "Rxf7",
      bestMove: "Rd1",
      evaluation: -1.5,
      type: "mistake",
      description: "Premature sacrifice without sufficient compensation",
    },
  ]

  // Randomly include 0-2 mistakes
  const numMistakes = Math.floor(Math.random() * 3)
  for (let i = 0; i < numMistakes; i++) {
    if (possibleMistakes[i]) {
      mistakes.push(possibleMistakes[i])
    }
  }

  return mistakes
}

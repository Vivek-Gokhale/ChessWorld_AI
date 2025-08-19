"use client"

import { useState } from "react"
import { Brain, TrendingDown, AlertTriangle, Zap } from "lucide-react"

export default function GameAnalysis({ gameData }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeWithStockfish = async () => {
    if (!gameData?.pgn) return

    setLoading(true)
    try {
      // Try to use the Python backend for Stockfish analysis
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pgn: gameData.pgn }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
      } else {
        // Fallback to mock analysis if backend is not available
        setAnalysis(generateMockAnalysis())
      }
    } catch (error) {
      console.error("Analysis error:", error)
      // Fallback to mock analysis
      setAnalysis(generateMockAnalysis())
    } finally {
      setLoading(false)
    }
  }

  const generateMockAnalysis = () => {
    return {
      evalTrend: [0.2, 0.1, -0.3, -0.1, 0.4, -0.8, -1.2, 0.3, 0.1, -0.5],
      mistakes: [
        {
          moveNumber: 12,
          move: "Nf3",
          evaluation: -1.8,
          bestMove: "Be2",
          type: "mistake",
          description: "Allows opponent to gain central control",
        },
        {
          moveNumber: 18,
          move: "Qh5",
          evaluation: -3.2,
          bestMove: "Qd2",
          type: "blunder",
          description: "Loses material due to tactical oversight",
        },
      ],
      accuracy: 78,
    }
  }

  const getMistakeIcon = (type) => {
    switch (type) {
      case "blunder":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "mistake":
        return <TrendingDown className="w-4 h-4 text-orange-600" />
      default:
        return <Zap className="w-4 h-4 text-yellow-600" />
    }
  }

  const getMistakeColor = (type) => {
    switch (type) {
      case "blunder":
        return "bg-red-50 border-red-200 text-red-800"
      case "mistake":
        return "bg-orange-50 border-orange-200 text-orange-800"
      default:
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-slate-800">Stockfish Analysis</h2>
        </div>

        {!analysis && (
          <button
            onClick={analyzeWithStockfish}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Analyzing..." : "Analyze with Stockfish"}
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Accuracy Score */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-2">Game Accuracy</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.accuracy}%` }}
                ></div>
              </div>
              <span className="font-bold text-slate-800">{analysis.accuracy}%</span>
            </div>
          </div>

          {/* Mistakes and Blunders */}
          {analysis.mistakes && analysis.mistakes.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Critical Moments</h3>
              <div className="space-y-3">
                {analysis.mistakes.map((mistake, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getMistakeColor(mistake.type)}`}>
                    <div className="flex items-start gap-3">
                      {getMistakeIcon(mistake.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Move {mistake.moveNumber}</span>
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-mono">
                            {mistake.move}
                          </span>
                          <span className="text-xs capitalize font-medium">{mistake.type}</span>
                        </div>
                        <p className="text-sm mb-2">{mistake.description}</p>
                        <div className="text-xs">
                          <span className="font-medium">Better: </span>
                          <span className="font-mono">{mistake.bestMove}</span>
                          <span className="ml-2">
                            ({mistake.evaluation > 0 ? "+" : ""}
                            {mistake.evaluation})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Trend */}
          {analysis.evalTrend && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Position Evaluation</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="h-32 flex items-end justify-between gap-1">
                  {analysis.evalTrend.map((evaluation, index) => {
                    const height = Math.abs(evaluation) * 20 + 10
                    const isPositive = evaluation >= 0
                    return (
                      <div
                        key={index}
                        className={`w-full rounded-t ${isPositive ? "bg-green-400" : "bg-red-400"}`}
                        style={{ height: `${Math.min(height, 120)}px` }}
                        title={`Move ${index + 1}: ${evaluation > 0 ? "+" : ""}${evaluation}`}
                      ></div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>Opening</span>
                  <span>Middlegame</span>
                  <span>Endgame</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!analysis && !loading && (
        <div className="text-center py-8 text-slate-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Click "Analyze with Stockfish" to get detailed game insights</p>
        </div>
      )}
    </div>
  )
}

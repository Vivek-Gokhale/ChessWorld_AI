"use client"

import { useState, useEffect } from "react"
import { BookOpen, TrendingUp, AlertTriangle } from "lucide-react"
import { findOpeningDeviation } from "@/lib/chess-utils"

export default function OpeningDeviation({ gameData }) {
  const [deviation, setDeviation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (gameData?.pgn) {
      setLoading(true)
      try {
        const deviationData = findOpeningDeviation(gameData.pgn)
        setDeviation(deviationData)
      } catch (error) {
        console.error("Error finding opening deviation:", error)
        setDeviation(null)
      } finally {
        setLoading(false)
      }
    }
  }, [gameData])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-800">Opening Analysis</h2>
      </div>

      {gameData?.opening && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-blue-800">{gameData.opening.name}</span>
            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm font-mono">
              {gameData.opening.eco}
            </span>
          </div>
          <p className="text-blue-700 text-sm">
            This opening is characterized by its solid pawn structure and strategic complexity.
          </p>
        </div>
      )}

      {deviation ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Opening Deviation Found</h3>
              <p className="text-yellow-700 text-sm mb-2">
                The game deviated from book theory at move {deviation.moveNumber}.
              </p>
              <div className="bg-white rounded p-3 font-mono text-sm">
                <div className="text-slate-600 mb-1">Book continuation:</div>
                <div className="font-semibold text-slate-800">{deviation.bookMove}</div>
                <div className="text-slate-600 mt-2 mb-1">Actual move played:</div>
                <div className="font-semibold text-slate-800">{deviation.actualMove}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Analysis</h4>
            <p className="text-slate-700 text-sm">
              {deviation.analysis ||
                "This deviation may lead to different strategic themes and tactical opportunities compared to the main line."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Following Theory</h3>
            <p className="text-green-700 text-sm">The opening moves followed established theory closely.</p>
          </div>
        </div>
      )}
    </div>
  )
}

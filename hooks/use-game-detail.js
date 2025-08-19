"use client"

import { useState, useEffect } from "react"
import { fetchGameById } from "@/lib/lichess-api"

export function useGameDetail(gameId) {
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!gameId) return

    const loadGame = async () => {
      setLoading(true)
      setError(null)

      try {
        const game = await fetchGameById(gameId)
        setGameData(game)
      } catch (err) {
        setError(err.message || "Failed to load game")
      } finally {
        setLoading(false)
      }
    }

    loadGame()
  }, [gameId])

  return {
    gameData,
    loading,
    error,
  }
}

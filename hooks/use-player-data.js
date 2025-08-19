"use client"

import { useState, useCallback } from "react"
import { fetchPlayerGames, calculatePlayerStats } from "@/lib/lichess-api"

export function usePlayerData() {
  const [playerData, setPlayerData] = useState(null)
  const [games, setGames] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchPlayer = useCallback(async (username) => {
    setLoading(true)
    setError(null)
    setPlayerData(null)
    setGames(null)

    try {
      const fetchedGames = await fetchPlayerGames(username)
      const stats = calculatePlayerStats(fetchedGames)

      setPlayerData({
        username,
        stats,
        mostPlayedOpening: stats.mostPlayedOpening,
      })
      setGames(fetchedGames)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch player data")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    playerData,
    games,
    loading,
    error,
    searchPlayer,
  }
}

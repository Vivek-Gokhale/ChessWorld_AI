"use client"

import { useState } from "react"
import { PlayerSearch } from "@/components/player-search"
import { PlayerSummary } from "@/components/player-summary"
import { GamesTable } from "@/components/games-table"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { usePlayerData } from "@/hooks/use-player-data"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const { playerData, games, loading, error, searchPlayer } = usePlayerData()

  const handleSearch = (searchUsername) => {
    setUsername(searchUsername)
    searchPlayer(searchUsername)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">ChessWorld.ai</h1>
            <p className="text-lg text-muted-foreground">
              Analyze your chess games with powerful insights from Lichess
            </p>
          </div>

          {/* Player Search */}
          <PlayerSearch onSearch={handleSearch} loading={loading} />

          {/* Content */}
          {loading && <LoadingSkeleton />}

          {error && <ErrorState error={error} onRetry={() => searchPlayer(username)} />}

          {!loading && !error && !playerData && (
            <EmptyState
              title="Search for a player to get started"
              description="Enter a Lichess username to view detailed game analysis and statistics"
            />
          )}

          {!loading && !error && playerData && games && (
            <div className="space-y-8">
              <PlayerSummary playerData={playerData} />
              <GamesTable games={games} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

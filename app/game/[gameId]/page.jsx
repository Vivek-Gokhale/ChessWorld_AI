"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { OpeningDeviation } from "@/components/opening-deviation"
import { GameAnalysis } from "@/components/game-analysis"
import { fetchGameDetail } from "@/lib/lichess-api"
import { ArrowLeft } from "lucide-react"

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId

  const [gameDetail, setGameDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (gameId) {
      loadGameDetail()
    }
  }, [gameId])

  const loadGameDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const detail = await fetchGameDetail(gameId)
      setGameDetail(detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load game")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ErrorState error={error} onRetry={loadGameDetail} />
        </div>
      </div>
    )
  }

  if (!gameDetail) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Game not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Games
            </Button>
          </div>

          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle>Game Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">White:</span>
                    <span>
                      {gameDetail.white.username} ({gameDetail.white.rating})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Black:</span>
                    <span>
                      {gameDetail.black.username} ({gameDetail.black.rating})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Result:</span>
                    <Badge>{gameDetail.result}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Time Control:</span>
                    <span className="capitalize">{gameDetail.timeControl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{new Date(gameDetail.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opening Analysis */}
          <OpeningDeviation gameData={gameDetail} />

          {/* Stockfish Analysis */}
          <GameAnalysis gameData={gameDetail} />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search, Eye } from "lucide-react"

export function GamesTable({ games }) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterResult, setFilterResult] = useState("all")
  const [filterTimeControl, setFilterTimeControl] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAndSortedGames = useMemo(() => {
    const filtered = games.filter((game) => {
      const matchesResult = filterResult === "all" || game.result === filterResult
      const matchesTimeControl = filterTimeControl === "all" || game.timeControl === filterTimeControl
      const matchesSearch =
        searchTerm === "" ||
        game.opening.eco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.opening.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.opponent.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesResult && matchesTimeControl && matchesSearch
    })

    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "date":
          aValue = a.createdAt
          bValue = b.createdAt
          break
        case "rating":
          aValue = a.opponentRating
          bValue = b.opponentRating
          break
        case "result":
          aValue = a.result
          bValue = b.result
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [games, sortBy, sortOrder, filterResult, filterTimeControl, searchTerm])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const getResultBadgeVariant = (result) => {
    switch (result) {
      case "win":
        return "default"
      case "loss":
        return "destructive"
      case "draw":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Games ({filteredAndSortedGames.length})</CardTitle>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by opening or opponent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="win">Wins</SelectItem>
              <SelectItem value="loss">Losses</SelectItem>
              <SelectItem value="draw">Draws</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTimeControl} onValueChange={setFilterTimeControl}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Control" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times</SelectItem>
              <SelectItem value="bullet">Bullet</SelectItem>
              <SelectItem value="blitz">Blitz</SelectItem>
              <SelectItem value="rapid">Rapid</SelectItem>
              <SelectItem value="classical">Classical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("date")} className="h-8 px-2">
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">Opponent</th>
                <th className="text-left p-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("rating")} className="h-8 px-2">
                    Rating
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">Color</th>
                <th className="text-left p-2">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("result")} className="h-8 px-2">
                    Result
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="text-left p-2">Time</th>
                <th className="text-left p-2">Opening</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedGames.map((game) => (
                <tr key={game.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 text-sm">{formatDate(game.createdAt)}</td>
                  <td className="p-2 font-medium">{game.opponent}</td>
                  <td className="p-2">{game.opponentRating}</td>
                  <td className="p-2">
                    <Badge variant={game.color === "white" ? "outline" : "secondary"}>{game.color}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge variant={getResultBadgeVariant(game.result)}>{game.result}</Badge>
                  </td>
                  <td className="p-2 capitalize">{game.timeControl}</td>
                  <td className="p-2">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {game.opening.eco}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{game.opening.name}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/game/${game.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

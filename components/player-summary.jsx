import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap } from "lucide-react"

export function PlayerSummary({ playerData }) {
  const { username, stats } = playerData

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Record</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.wins}W-{stats.losses}L-{stats.draws}D
          </div>
          <p className="text-xs text-muted-foreground">{Math.round((stats.wins / stats.total) * 100)}% win rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">As White</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.whiteWinPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.whiteWins}/{stats.whiteGames} games won
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">As Black</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.blackWinPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.blackWins}/{stats.blackGames} games won
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Opening</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="secondary">{stats.mostPlayedOpening.eco}</Badge>
            <p className="text-sm font-medium">{stats.mostPlayedOpening.name}</p>
            <p className="text-xs text-muted-foreground">Played {stats.mostPlayedOpening.count} times</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

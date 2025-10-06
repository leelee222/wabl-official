import { getTeams, getMatches, getPlayers } from "@/lib/utils/data"
import { LiveGameSimulator } from "@/components/features/live-game-simulator"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Metadata } from "next"

interface LiveGamePageProps {
  params: Promise<{ matchId: string }>
}

export async function generateMetadata({ params }: LiveGamePageProps): Promise<Metadata> {
  const { matchId } = await params
  const matches = getMatches()
  const teams = getTeams()
  const match = matches.find(m => m.id === matchId)
  
  if (!match) {
    return { title: "Match Not Found | WABL" }
  }
  
  const homeTeam = teams.find(t => t.id === match.homeTeamId)
  const awayTeam = teams.find(t => t.id === match.awayTeamId)
  
  return {
    title: `${homeTeam?.name} vs ${awayTeam?.name} - Live Simulation | WABL`,
    description: `Watch the live simulation of ${homeTeam?.name} vs ${awayTeam?.name} in the West African Basketball League.`,
  }
}

export default async function LiveGamePage({ params }: LiveGamePageProps) {
  const { matchId } = await params
  const matches = getMatches()
  const teams = getTeams()
  const players = getPlayers()
  
  const match = matches.find(m => m.id === matchId)
  
  if (!match) {
    notFound()
  }
  
  const homeTeam = teams.find(t => t.id === match.homeTeamId)
  const awayTeam = teams.find(t => t.id === match.awayTeamId)
  
  if (!homeTeam || !awayTeam) {
    notFound()
  }
  
  const homePlayers = players.filter(p => p.teamId === homeTeam.id)
  const awayPlayers = players.filter(p => p.teamId === awayTeam.id)
  
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold">
              Live Game Simulation
            </h1>
            <p className="text-white/90 text-lg">
              Experience the thrill of WABL basketball in real-time
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-xl">Match Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>{new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{match.venue}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span>{match.attendance?.toLocaleString() || 'TBD'} fans</span>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {match.status === 'live' ? 'LIVE' : 'SIMULATION'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <LiveGameSimulator
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
        />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use the Simulator</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Controls</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Click <strong>Play</strong> to start the simulation</li>
                  <li>• Click <strong>Pause</strong> to pause at any time</li>
                  <li>• Click <strong>Reset</strong> to start over</li>
                  <li>• Game progresses through 4 quarters automatically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Real-time score updates with animations</li>
                  <li>• Live play-by-play commentary</li>
                  <li>• Player statistics tracking</li>
                  <li>• Realistic game events and timing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

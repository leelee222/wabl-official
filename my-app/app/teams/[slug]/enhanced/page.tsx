import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTeams, getPlayers, getMatches, getTeamBySlug } from '@/lib/utils/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const teams = getTeams()
  
  return teams.map((team) => ({
    slug: team.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
  }))
}

export async function generateMetadata(
  { params }: TeamPageProps
): Promise<Metadata> {
  const { slug } = await params
  const team = getTeamBySlug(slug)

  if (!team) {
    return {
      title: 'Team Not Found | WABL',
    }
  }

  return {
    title: `${team.name} | WABL`,
    description: `Official page for ${team.name} from ${team.city}, ${team.country}. View team stats, roster, schedule, and more.`,
    keywords: [
      team.name,
      team.city,
      team.country,
      'WABL',
      'basketball',
      'West African Basketball League',
      'team roster',
      'schedule',
      'stats'
    ],
    openGraph: {
      title: `${team.name} | WABL`,
      description: `${team.name} - ${team.city}, ${team.country}`,
      images: [
        {
          url: team.logo,
          width: 800,
          height: 600,
          alt: `${team.name} logo`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${team.name} | WABL`,
      description: `${team.name} - ${team.city}, ${team.country}`,
      images: [team.logo],
    },
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params
  
  const team = getTeamBySlug(slug)
  
  if (!team) {
    notFound()
  }

  const [allPlayers, allMatches] = await Promise.all([
    getPlayers(),
    getMatches()
  ])

  const teamPlayers = allPlayers.filter(player => player.teamId === team.id)
  const teamMatches = allMatches.filter(match => 
    match.homeTeamId === team.id || match.awayTeamId === team.id
  )

  const recentMatches = teamMatches
    .filter(match => match.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const upcomingMatches = teamMatches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const winPercentage = team.stats.wins + team.stats.losses > 0 
    ? ((team.stats.wins / (team.stats.wins + team.stats.losses)) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">
                {team.city}, {team.country}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Founded {team.founded}</Badge>
                <Badge variant="outline">W: {team.stats.wins}</Badge>
                <Badge variant="outline">L: {team.stats.losses}</Badge>
                <Badge variant="default">{winPercentage}% Win Rate</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Team Roster</CardTitle>
            <CardDescription>
              {teamPlayers.length} players
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamPlayers.slice(0, 10).map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      #{player.number} • {player.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {player.stats.ppg} PPG
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {player.stats.rpg} RPG • {player.stats.apg} APG
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>
              Last {recentMatches.length} completed games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">
                      vs {match.homeTeamId === team.id ? 'Away' : 'Home'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(match.date).toLocaleDateString()}
                    </p>
                  </div>
                  {match.score && (
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {match.homeTeamId === team.id 
                          ? `${match.score.home}-${match.score.away}`
                          : `${match.score.away}-${match.score.home}`
                        }
                      </p>
                      <Badge 
                        variant={
                          (match.homeTeamId === team.id && match.score.home > match.score.away) ||
                          (match.awayTeamId === team.id && match.score.away > match.score.home)
                            ? "default" 
                            : "secondary"
                        }
                      >
                        {(match.homeTeamId === team.id && match.score.home > match.score.away) ||
                         (match.awayTeamId === team.id && match.score.away > match.score.home)
                          ? "W" 
                          : "L"
                        }
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const revalidate = 300

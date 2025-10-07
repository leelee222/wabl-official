import teamsData from '@/lib/data/teams.json'
import playersData from '@/lib/data/players.json'
import matchesData from '@/lib/data/matches.json'

export interface Team {
  id: string
  name: string
  city: string
  country: string
  founded: number
  logo: string
  colors: {
    primary: string
    secondary: string
  }
  stadium: string
  capacity: number
  coach: string
  championships: number
  stats: {
    wins: number
    losses: number
    points_for: number
    points_against: number
    streak: number
    streak_type: string
    home_record: string
    away_record: string
  }
}

export interface Player {
  id: string
  name: string
  teamId: string
  number: number
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  height: string
  weight: string
  age: number
  nationality: string
  photo: string
  stats: {
    ppg: number
    rpg: number
    apg: number
    fg: number
    ft: number
    threePt: number
  }
  bio: string
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string
  venue: string
  status: 'completed' | 'upcoming' | 'live'
  round: number
  score?: {
    home: number
    away: number
    quarters: number[]
  }
  attendance?: number
}

export function getTeams(): Team[] {
  return teamsData as Team[]
}

export function getTeam(id: string): Team | undefined {
  return teamsData.find(team => team.id === id) as Team | undefined
}

export function getPlayers(): Player[] {
  return playersData as Player[]
}

export function getPlayersByTeam(teamId: string): Player[] {
  return playersData.filter(player => player.teamId === teamId) as Player[]
}

export function getPlayer(id: string): Player | undefined {
  return playersData.find(player => player.id === id) as Player | undefined
}

export function getMatches(): Match[] {
  return matchesData as Match[]
}

export function getRecentMatches(limit: number = 5): Match[] {
  return matchesData
    .filter(match => match.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit) as Match[]
}

export function getUpcomingMatches(limit: number = 5): Match[] {
  return matchesData
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit) as Match[]
}

export function getStandings(): (Team & { position: number })[] {
  const teams = getTeams()
  return teams
    .sort((a, b) => {
      if (b.stats.wins !== a.stats.wins) {
        return b.stats.wins - a.stats.wins
      }
      return a.stats.losses - b.stats.losses
    })
    .map((team, index) => ({
      ...team,
      position: index + 1
    }))
}

export function getTopScorers(limit: number = 10): (Player & { teamName: string })[] {
  const players = getPlayers()
  const teams = getTeams()
  
  return players
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, limit)
    .map(player => {
      const team = teams.find(t => t.id === player.teamId)
      return {
        ...player,
        teamName: team?.name || 'Unknown Team'
      }
    })
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function getWinStreak(teamId: string): { type: 'W' | 'L', count: number } {
  const team = getTeam(teamId)
  if (!team) return { type: 'L', count: 0 }
  
  return {
    type: team.stats.streak_type as 'W' | 'L',
    count: Math.abs(team.stats.streak)
  }
}

export function getTeamAverages(team: Team): { ppg: number, oppg: number } {
  const totalGames = team.stats.wins + team.stats.losses
  return {
    ppg: totalGames > 0 ? Math.round((team.stats.points_for / totalGames) * 10) / 10 : 0,
    oppg: totalGames > 0 ? Math.round((team.stats.points_against / totalGames) * 10) / 10 : 0
  }
}

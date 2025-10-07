import { NextRequest, NextResponse } from 'next/server'
import { getTeams, getPlayers, getMatches } from '@/lib/utils/data'
import { SearchResult } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({
      results: [],
      total: 0,
      timestamp: new Date().toISOString()
    })
  }

  const teams = getTeams()
  const players = getPlayers()
  const matches = getMatches()

  const searchQuery = query.toLowerCase()
  const results: SearchResult[] = []

  const matchingTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery) ||
    team.city.toLowerCase().includes(searchQuery) ||
    team.country.toLowerCase().includes(searchQuery)
  )

  matchingTeams.forEach(team => {
    results.push({
      type: 'team',
      id: team.id,
      title: team.name,
      subtitle: `${team.city}, ${team.country}`,
      image: team.logo,
      url: `/teams/${team.id}`
    })
  })

  const matchingPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery) ||
    player.position.toLowerCase().includes(searchQuery) ||
    player.nationality.toLowerCase().includes(searchQuery)
  )

  matchingPlayers.forEach(player => {
    const team = teams.find(t => t.id === player.teamId)
    results.push({
      type: 'player',
      id: player.id,
      title: player.name,
      subtitle: `#${player.number} • ${player.position}${team ? ` • ${team.name}` : ''}`,
      image: player.photo,
      url: `/players/${player.id}`
    })
  })

  const matchingMatches = matches.filter(match => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId)
    const awayTeam = teams.find(t => t.id === match.awayTeamId)
    
    return (
      homeTeam?.name.toLowerCase().includes(searchQuery) ||
      awayTeam?.name.toLowerCase().includes(searchQuery) ||
      match.venue.toLowerCase().includes(searchQuery)
    )
  })

  matchingMatches.forEach(match => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId)
    const awayTeam = teams.find(t => t.id === match.awayTeamId)
    const matchDate = new Date(match.date).toLocaleDateString()
    
    results.push({
      type: 'match',
      id: match.id,
      title: `${homeTeam?.name || 'TBD'} vs ${awayTeam?.name || 'TBD'}`,
      subtitle: `${matchDate} • ${match.venue}`,
      url: `/matches/${match.id}`
    })
  })

  return NextResponse.json({
    results: results.slice(0, 20),
    total: results.length,
    timestamp: new Date().toISOString()
  })
}

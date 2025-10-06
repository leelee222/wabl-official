import { NextRequest, NextResponse } from 'next/server'
import { getTeams, getPlayers, getMatches } from '@/lib/utils/data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({
      teams: [],
      players: [],
      matches: [],
      total: 0
    })
  }

  const teams = getTeams()
  const players = getPlayers()
  const matches = getMatches()

  const searchQuery = query.toLowerCase()

  const matchingTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery) ||
    team.city.toLowerCase().includes(searchQuery) ||
    team.country.toLowerCase().includes(searchQuery)
  )

  const matchingPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery) ||
    player.position.toLowerCase().includes(searchQuery) ||
    player.nationality.toLowerCase().includes(searchQuery)
  ).map(player => {
    const team = teams.find(t => t.id === player.teamId)
    return { ...player, team }
  })

  const matchingMatches = matches.filter(match => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId)
    const awayTeam = teams.find(t => t.id === match.awayTeamId)
    
    return (
      homeTeam?.name.toLowerCase().includes(searchQuery) ||
      awayTeam?.name.toLowerCase().includes(searchQuery) ||
      match.venue.toLowerCase().includes(searchQuery)
    )
  }).map(match => {
    const homeTeam = teams.find(t => t.id === match.homeTeamId)
    const awayTeam = teams.find(t => t.id === match.awayTeamId)
    return { ...match, homeTeam, awayTeam }
  })

  const total = matchingTeams.length + matchingPlayers.length + matchingMatches.length

  return NextResponse.json({
    teams: matchingTeams.slice(0, 5),
    players: matchingPlayers.slice(0, 8),
    matches: matchingMatches.slice(0, 5),
    total,
    query
  })
}

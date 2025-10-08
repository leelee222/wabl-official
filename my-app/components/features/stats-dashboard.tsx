'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts'
import { Trophy, Target, Shield, Zap, TrendingUp, Users, Star, Award } from 'lucide-react'
import { Team, Player } from '@/lib/utils/data'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface StatsData {
  teams: Team[]
  players: Player[]
}

export function StatsChartViewer({ teams, players }: StatsData) {
  const [selectedStat, setSelectedStat] = useState('ppg')
  const [comparisonTeam1, setComparisonTeam1] = useState(teams[0]?.id || '')
  const [comparisonTeam2, setComparisonTeam2] = useState(teams[1]?.id || '')

  const getLeagueLeaders = (stat: keyof Player['stats']) => {
      return players
      .sort((a, b) => b.stats[stat] - a.stats[stat])
      .slice(0, 10)
      .map((player, index) => {
          const team = teams.find(t => t.id === player.teamId)
          return {
              id: player.id,
              name: player.name,
              team: team?.name || '',
              teamColor: team?.colors.primary || '#3B82F6',
              value: player.stats[stat],
              position: player.position,
              rank: index + 1
            }
        })
    }
    
  const getTeamComparison = () => {
    const team1 = teams.find(t => t.id === comparisonTeam1)
    const team2 = teams.find(t => t.id === comparisonTeam2)
    
    if (!team1 || !team2) return []

    const team1Players = players.filter(p => p.teamId === team1.id)
    const team2Players = players.filter(p => p.teamId === team2.id)

    const getTeamAverage = (players: Player[], stat: keyof Player['stats']) => {
      return players.reduce((sum, player) => sum + player.stats[stat], 0) / players.length
    }

    return [
      {
        stat: 'Points',
        team1: Math.round(getTeamAverage(team1Players, 'ppg') * 10) / 10,
        team2: Math.round(getTeamAverage(team2Players, 'ppg') * 10) / 10,
        fullMark: 30
      },
      {
        stat: 'Rebounds',
        team1: Math.round(getTeamAverage(team1Players, 'rpg') * 10) / 10,
        team2: Math.round(getTeamAverage(team2Players, 'rpg') * 10) / 10,
        fullMark: 15
      },
      {
        stat: 'Assists',
        team1: Math.round(getTeamAverage(team1Players, 'apg') * 10) / 10,
        team2: Math.round(getTeamAverage(team2Players, 'apg') * 10) / 10,
        fullMark: 10
      },
      {
        stat: 'FG%',
        team1: Math.round(getTeamAverage(team1Players, 'fg') * 10) / 10,
        team2: Math.round(getTeamAverage(team2Players, 'fg') * 10) / 10,
        fullMark: 100
      },
      {
        stat: '3P%',
        team1: Math.round(getTeamAverage(team1Players, 'threePt') * 10) / 10,
        team2: Math.round(getTeamAverage(team2Players, 'threePt') * 10) / 10,
        fullMark: 100
      }
    ]
  }

  const getPositionDistribution = () => {
      const positions = ['PG', 'SG', 'SF', 'PF', 'C']
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      
      return positions.map((position, index) => ({
          name: position,
          value: players.filter(p => p.position === position).length,
          color: colors[index]
        }))
    }

  const getTeamPerformance = () => {
    return teams.map(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id)
      const avgPPG = teamPlayers.reduce((sum, p) => sum + p.stats.ppg, 0) / teamPlayers.length
      
      return {
        name: team.name.split(' ').pop(),
        wins: team.stats.wins,
        losses: team.stats.losses,
        avgPPG: Math.round(avgPPG * 10) / 10,
        color: team.colors.primary
      }
    }).sort((a, b) => b.wins - a.wins)
  }

  const statOptions = [
    { value: 'ppg', label: 'Points Per Game', icon: Target },
    { value: 'rpg', label: 'Rebounds Per Game', icon: Shield },
    { value: 'apg', label: 'Assists Per Game', icon: Users },
    { value: 'fg', label: 'Field Goal %', icon: Zap },
    { value: 'threePt', label: 'Three Point %', icon: Star },
    { value: 'ft', label: 'Free Throw %', icon: Award }
  ]

  const currentStatOption = statOptions.find(opt => opt.value === selectedStat)
  const leaderData = getLeagueLeaders(selectedStat as keyof Player['stats'])
  const teamComparison = getTeamComparison()
  const positionData = getPositionDistribution()
  const teamPerformance = getTeamPerformance()

  const team1 = teams.find(t => t.id === comparisonTeam1)
  const team2 = teams.find(t => t.id === comparisonTeam2)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-accent" />
                <CardTitle>League Leaders</CardTitle>
              </div>
              <select 
                value={selectedStat} 
                onChange={(e) => setSelectedStat(e.target.value)}
                className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {statOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground">{data.team} • {data.position}</p>
                            <p className="font-bold text-primary">
                              {currentStatOption?.label}: {payload[0].value}
                              {selectedStat.includes('Pt') || selectedStat === 'fg' || selectedStat === 'ft' ? '%' : ''}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              <CardTitle>Team Performance Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Season Record</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="wins" name="Wins" fill="#10B981" />
                      <Bar dataKey="losses" name="Losses" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Player Position Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={positionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {positionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-accent" />
                <CardTitle>Team Comparison</CardTitle>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select 
                  value={comparisonTeam1} 
                  onChange={(e) => setComparisonTeam1(e.target.value)}
                  className="flex h-10 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <span className="self-center text-muted-foreground text-center sm:text-left">vs</span>
                <select 
                  value={comparisonTeam2} 
                  onChange={(e) => setComparisonTeam2(e.target.value)}
                  className="flex h-10 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={teamComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="stat" />
                  <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                  <Radar
                    name={team1?.name || 'Team 1'}
                    dataKey="team1"
                    stroke={team1?.colors.primary || '#3B82F6'}
                    fill={team1?.colors.primary || '#3B82F6'}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name={team2?.name || 'Team 2'}
                    dataKey="team2"
                    stroke={team2?.colors.primary || '#EF4444'}
                    fill={team2?.colors.primary || '#EF4444'}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <Link href={`/players/${leaderData[0]?.id}`} className="block group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">League Leader (PPG)</p>
                  <p className="text-2xl font-bold group-hover:text-primary transition-colors">{leaderData[0]?.name}</p>
                  <p className="text-sm text-muted-foreground">{leaderData[0]?.value} pts</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Link href={`/players/${getLeagueLeaders('rpg')[0]?.id}`} className="block group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Rebounder</p>
                  <p className="text-2xl font-bold group-hover:text-primary transition-colors">{getLeagueLeaders('rpg')[0]?.name}</p>
                  <p className="text-sm text-muted-foreground">{getLeagueLeaders('rpg')[0]?.value} reb</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Link href={`/players/${getLeagueLeaders('apg')[0]?.id}`} className="block group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assist Leader</p>
                  <p className="text-2xl font-bold group-hover:text-primary transition-colors">{getLeagueLeaders('apg')[0]?.name}</p>
                  <p className="text-sm text-muted-foreground">{getLeagueLeaders('apg')[0]?.value} ast</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best 3P% Shooter</p>
                <p className="text-2xl font-bold">{getLeagueLeaders('threePt')[0]?.name}</p>
                <p className="text-sm text-muted-foreground">{getLeagueLeaders('threePt')[0]?.value}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

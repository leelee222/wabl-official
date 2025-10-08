'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Clock, Users, TrendingUp } from 'lucide-react'
import { Team, Player } from '@/lib/utils/data'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface LiveGameSimulatorProps {
  homeTeam: Team
  awayTeam: Team
  homePlayers: Player[]
  awayPlayers: Player[]
}

interface GameState {
  quarter: number
  timeLeft: number
  score: { home: number; away: number }
  isPlaying: boolean
  gameEvents: GameEvent[]
  playerStats: Record<string, PlayerGameStats>
}

interface GameEvent {
  id: string
  time: number
  quarter: number
  type: 'score' | 'foul' | 'timeout' | 'substitution' | 'steal' | 'block' | 'rebound'
  team: 'home' | 'away'
  player?: string
  description: string
  points?: number
}

interface PlayerGameStats {
  playerId: string
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  fouls: number
  minutes: number
}

const QUARTER_LENGTH = 720
const GAME_SPEED = 50

const scoreEvents = [
  { type: 'Two-Pointer', points: 2, probability: 0.4 },
  { type: 'Three-Pointer', points: 3, probability: 0.2 },
  { type: 'Free Throw', points: 1, probability: 0.25 },
  { type: 'And-One', points: 3, probability: 0.15 }
]

const nonScoreEvents = [
  { type: 'foul', description: 'Personal foul', probability: 0.3 },
  { type: 'steal', description: 'Steal', probability: 0.2 },
  { type: 'block', description: 'Blocked shot', probability: 0.15 },
  { type: 'rebound', description: 'Defensive rebound', probability: 0.25 },
  { type: 'timeout', description: 'Timeout called', probability: 0.1 }
]

export function LiveGameSimulator({ 
  homeTeam, 
  awayTeam, 
  homePlayers, 
  awayPlayers 
}: LiveGameSimulatorProps) {
  const [gameState, setGameState] = useState<GameState>({
    quarter: 1,
    timeLeft: QUARTER_LENGTH,
    score: { home: 0, away: 0 },
    isPlaying: false,
    gameEvents: [],
    playerStats: {}
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const allPlayers = [...homePlayers, ...awayPlayers]
    const initialStats: Record<string, PlayerGameStats> = {}
    
    allPlayers.forEach(player => {
      initialStats[player.id] = {
        playerId: player.id,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        fouls: 0,
        minutes: 0
      }
    })
    
    setGameState(prev => ({ ...prev, playerStats: initialStats }))
  }, [homePlayers, awayPlayers])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getRandomPlayer = (team: 'home' | 'away') => {
    const players = team === 'home' ? homePlayers : awayPlayers
    return players[Math.floor(Math.random() * players.length)]
  }

  const generateGameEvent = (): GameEvent | null => {
    const isScore = Math.random() < 0.6
    const team = Math.random() < 0.5 ? 'home' : 'away'
    const player = getRandomPlayer(team)
    
    if (isScore) {
      const scoreEvent = scoreEvents[Math.floor(Math.random() * scoreEvents.length)]
      return {
        id: `${Date.now()}-${Math.random()}`,
        time: gameState.timeLeft,
        quarter: gameState.quarter,
        type: 'score',
        team,
        player: player.name,
        description: `${player.name} scores ${scoreEvent.points} points (${scoreEvent.type})`,
        points: scoreEvent.points
      }
    } else {
      const event = nonScoreEvents[Math.floor(Math.random() * nonScoreEvents.length)]
      return {
        id: `${Date.now()}-${Math.random()}`,
        time: gameState.timeLeft,
        quarter: gameState.quarter,
        type: event.type as GameEvent['type'],
        team,
        player: player.name,
        description: `${player.name} - ${event.description}`,
      }
    }
  }

  const updatePlayerStats = (event: GameEvent) => {
    if (!event.player) return

    const playerId = [...homePlayers, ...awayPlayers].find(p => p.name === event.player)?.id
    if (!playerId) return

    setGameState(prev => ({
      ...prev,
      playerStats: {
        ...prev.playerStats,
        [playerId]: {
          ...prev.playerStats[playerId],
          points: prev.playerStats[playerId].points + (event.points || 0),
          rebounds: prev.playerStats[playerId].rebounds + (event.type === 'rebound' ? 1 : 0),
          steals: prev.playerStats[playerId].steals + (event.type === 'steal' ? 1 : 0),
          blocks: prev.playerStats[playerId].blocks + (event.type === 'block' ? 1 : 0),
          fouls: prev.playerStats[playerId].fouls + (event.type === 'foul' ? 1 : 0),
        }
      }
    }))
  }

  const advanceGame = () => {
    setGameState(prev => {
      let newTimeLeft = prev.timeLeft - 1
      let newQuarter = prev.quarter
      let gameEnded = false

      if (newTimeLeft <= 0) {
          if (newQuarter < 4) {
              newQuarter++
              newTimeLeft = QUARTER_LENGTH
            } else {
                gameEnded = true
                newTimeLeft = 0
            }
        }
        
      const shouldGenerateEvent = Math.random() < 0.05
      let newEvents = [...prev.gameEvents]
      let newScore = { ...prev.score }

      if (shouldGenerateEvent && !gameEnded) {
        const event = generateGameEvent()
        if (event) {
          newEvents = [event, ...newEvents].slice(0, 20)
          
          if (event.type === 'score' && event.points) {
            if (event.team === 'home') {
              newScore = { ...newScore, home: newScore.home + event.points }
            } else {
              newScore = { ...newScore, away: newScore.away + event.points }
            }
          }
        }
      }

      const newState = {
        ...prev,
        timeLeft: newTimeLeft,
        quarter: newQuarter,
        score: newScore,
        gameEvents: newEvents,
        isPlaying: !gameEnded && prev.isPlaying
      }

      if (newEvents.length > prev.gameEvents.length) {
        const latestEvent = newEvents[0]
        setTimeout(() => updatePlayerStats(latestEvent), 0)
      }

      if (gameEnded) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      return newState
    })
  }

  const toggleGame = () => {
    if (gameState.isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setGameState(prev => ({ ...prev, isPlaying: false }))
    } else {
      setGameState(prev => ({ ...prev, isPlaying: true }))
      intervalRef.current = setInterval(advanceGame, GAME_SPEED)
    }
  }

  const resetGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setGameState(prev => ({
      quarter: 1,
      timeLeft: QUARTER_LENGTH,
      score: { home: 0, away: 0 },
      isPlaying: false,
      gameEvents: [],
      playerStats: prev.playerStats
    }))
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const isGameEnded = gameState.quarter > 4 || (gameState.quarter === 4 && gameState.timeLeft === 0)

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <Card className="bg-gradient-to-r from-primary to-accent text-white">
        <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
            {isGameEnded ? 'FINAL' : 'LIVE SIMULATION'}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm sm:text-base">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Q{gameState.quarter} - {formatTime(gameState.timeLeft)}</span>
          </div>
        </CardHeader>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="lg:hidden space-y-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: homeTeam.colors.primary }}
                  >
                    {homeTeam.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-base">{homeTeam.name}</p>
                    <p className="text-sm text-muted-foreground">{homeTeam.city}</p>
                  </div>
                </div>
                <motion.div 
                  className="text-3xl font-bold"
                  key={gameState.score.home}
                  initial={{ scale: 1.2, color: '#10B981' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {gameState.score.home}
                </motion.div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="text-xl font-bold text-muted-foreground">VS</div>
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  <Button
                    onClick={toggleGame}
                    variant={gameState.isPlaying ? "destructive" : "default"}
                    size="sm"
                    disabled={isGameEnded}
                    className="flex items-center gap-2"
                  >
                    {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {gameState.isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={resetGame} variant="outline" size="sm" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: awayTeam.colors.primary }}
                  >
                    {awayTeam.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-base">{awayTeam.name}</p>
                    <p className="text-sm text-muted-foreground">{awayTeam.city}</p>
                  </div>
                </div>
                <motion.div 
                  className="text-3xl font-bold"
                  key={gameState.score.away}
                  initial={{ scale: 1.2, color: '#10B981' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {gameState.score.away}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 lg:items-center lg:gap-4 lg:text-center">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: homeTeam.colors.primary }}
                >
                  {homeTeam.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-lg">{homeTeam.name}</p>
                  <p className="text-sm text-muted-foreground">{homeTeam.city}</p>
                </div>
              </div>
              <motion.div 
                className="text-4xl font-bold"
                key={gameState.score.home}
                initial={{ scale: 1.2, color: '#10B981' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
              >
                {gameState.score.home}
              </motion.div>
            </div>

            <div className="space-y-4">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={toggleGame}
                  variant={gameState.isPlaying ? "destructive" : "default"}
                  size="sm"
                  disabled={isGameEnded}
                >
                  {gameState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {gameState.isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={resetGame} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: awayTeam.colors.primary }}
                >
                  {awayTeam.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-lg">{awayTeam.name}</p>
                  <p className="text-sm text-muted-foreground">{awayTeam.city}</p>
                </div>
              </div>
              <motion.div 
                className="text-4xl font-bold"
                key={gameState.score.away}
                initial={{ scale: 1.2, color: '#10B981' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
              >
                {gameState.score.away}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Play-by-Play
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              <AnimatePresence>
                {gameState.gameEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50"
                  >
                    <Badge 
                      variant={event.type === 'score' ? 'default' : 'secondary'}
                      className="min-w-fit text-xs"
                    >
                      Q{event.quarter} {formatTime(event.time)}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm">{event.description}</p>
                      {event.points && (
                        <p className="text-xs text-muted-foreground">
                          +{event.points} points
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {gameState.gameEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
                  Game events will appear here...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              Leading Scorers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(gameState.playerStats)
                .map(([playerId, stats]) => ({
                  ...stats,
                  player: [...homePlayers, ...awayPlayers].find(p => p.id === playerId)
                }))
                .filter(stat => stat.player && stat.points > 0)
                .sort((a, b) => b.points - a.points)
                .slice(0, 8)
                .map((stat) => (
                  <Link 
                    key={stat.playerId} 
                    href={`/players/${stat.playerId}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-2 rounded bg-muted/30 group-hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div 
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ 
                            backgroundColor: stat.player?.teamId === homeTeam.id 
                              ? homeTeam.colors.primary 
                              : awayTeam.colors.primary 
                          }}
                        >
                          #{stat.player?.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate group-hover:text-primary transition-colors">
                            {stat.player?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{stat.player?.position}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm sm:text-base">{stat.points} PTS</p>
                        <p className="text-xs text-muted-foreground">
                          {stat.rebounds}R {stat.assists}A
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              {Object.values(gameState.playerStats).every(stat => stat.points === 0) && (
                <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm">
                  Player stats will appear here...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

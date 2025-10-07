import { NextRequest, NextResponse } from 'next/server'
import { getPlayers } from '@/lib/utils/data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const position = searchParams.get('position')
    const limit = searchParams.get('limit')
    const sortBy = searchParams.get('sortBy') || 'points'
    const order = searchParams.get('order') || 'desc'

    let players = getPlayers()

    if (teamId) {
        players = players.filter(p => p.teamId === teamId)
    }
    
    if (position) {
      players = players.filter(p => p.position === position)
    }

    players = players.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'points':
        case 'ppg':
          aValue = a.stats.ppg
          bValue = b.stats.ppg
          break
        case 'assists':
        case 'apg':
          aValue = a.stats.apg
          bValue = b.stats.apg
          break
        case 'rebounds':
        case 'rpg':
          aValue = a.stats.rpg
          bValue = b.stats.rpg
          break
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'age':
          aValue = a.age
          bValue = b.age
          break
        default:
          aValue = a.stats.ppg
          bValue = b.stats.ppg
      }

      if (typeof aValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue)
      }

      return order === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    if (limit) {
      players = players.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      players,
      total: players.length,
      filters: { teamId, position, sortBy, order },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, teamId, position, age } = body
    if (!name || !teamId || !position || !age) {
      return NextResponse.json(
        { error: 'Missing required fields: name, teamId, position, age' },
        { status: 400 }
      )
    }

    const newPlayer = {
      id: `player-${Date.now()}`,
      ...body,
      stats: { 
        ppg: 0, 
        rpg: 0, 
        apg: 0, 
        fg: 0, 
        ft: 0, 
        threePt: 0 
      },
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      player: newPlayer,
      message: 'Player created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}

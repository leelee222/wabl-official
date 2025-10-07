import { NextRequest, NextResponse } from 'next/server'
import { getMatches } from '@/lib/utils/data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('teamId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const sortBy = searchParams.get('sortBy') || 'date'
    const order = searchParams.get('order') || 'desc'

    let matches = getMatches()

    if (teamId) {
      matches = matches.filter(m => 
        m.homeTeamId === teamId || m.awayTeamId === teamId
      )
    }

    if (status) {
      matches = matches.filter(m => m.status === status)
    }

    matches = matches.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
          break
        case 'homeTeam':
          aValue = a.homeTeamId
          bValue = b.homeTeamId
          break
        case 'awayTeam':
          aValue = a.awayTeamId
          bValue = b.awayTeamId
          break
        case 'venue':
          aValue = a.venue
          bValue = b.venue
          break
        default:
          aValue = new Date(a.date).getTime()
          bValue = new Date(b.date).getTime()
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
      matches = matches.slice(0, parseInt(limit))
    }

    return NextResponse.json({
      matches,
      total: matches.length,
      filters: { teamId, status, sortBy, order },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { homeTeamId, awayTeamId, date, venue } = body
    if (!homeTeamId || !awayTeamId || !date || !venue) {
      return NextResponse.json(
        { error: 'Missing required fields: homeTeamId, awayTeamId, date, venue' },
        { status: 400 }
      )
    }

    const newMatch = {
      id: `match-${Date.now()}`,
      ...body,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      match: newMatch,
      message: 'Match created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}

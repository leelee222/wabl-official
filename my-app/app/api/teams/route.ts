import { NextRequest, NextResponse } from 'next/server'
import { getTeams } from '@/lib/utils/data'
import { handleCachedRequest } from '@/lib/middleware/cache'

export async function GET(request: NextRequest) {
  return handleCachedRequest(
    request,
    async () => {
      const { searchParams } = new URL(request.url)
      const limit = searchParams.get('limit')
      const sortBy = searchParams.get('sortBy') || 'wins'
      const order = searchParams.get('order') || 'desc'

      let teams = getTeams()

      teams = teams.sort((a, b) => {
        let aValue, bValue

        switch (sortBy) {
          case 'wins':
            aValue = a.stats.wins
            bValue = b.stats.wins
            break
          case 'losses':
            aValue = a.stats.losses
            bValue = b.stats.losses
            break
          case 'name':
            aValue = a.name
            bValue = b.name
            break
          case 'city':
            aValue = a.city
            bValue = b.city
            break
          default:
            aValue = a.stats.wins
            bValue = b.stats.wins
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
        teams = teams.slice(0, parseInt(limit))
      }

      return {
        teams,
        total: teams.length,
        timestamp: new Date().toISOString()
      }
    },
    'teams-list',
    {
      revalidate: 600,
      tags: ['teams']
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, city, country } = body
    if (!name || !city || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: name, city, country' },
        { status: 400 }
      )
    }

    const newTeam = {
      id: `team-${Date.now()}`,
      ...body,
      stats: { wins: 0, losses: 0, streak: 0 },
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      team: newTeam,
      message: 'Team created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}

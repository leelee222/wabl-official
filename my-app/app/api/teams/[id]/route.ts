import { NextRequest, NextResponse } from 'next/server'
import { getTeams } from '@/lib/utils/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teams = getTeams()
    const team = teams.find(t => t.id === id)

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      team,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const teams = getTeams()
    const teamIndex = teams.findIndex(t => t.id === id)

    if (teamIndex === -1) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const updatedTeam = {
      ...teams[teamIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      team: updatedTeam,
      message: 'Team updated successfully'
    })

  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teams = getTeams()
    const team = teams.find(t => t.id === id)

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Team deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPlayers } from '@/lib/utils/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const players = getPlayers()
    const player = players.find(p => p.id === id)

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      player,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
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
    const players = getPlayers()
    const playerIndex = players.findIndex(p => p.id === id)

    if (playerIndex === -1) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    const updatedPlayer = {
      ...players[playerIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      player: updatedPlayer,
      message: 'Player updated successfully'
    })

  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
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
    const players = getPlayers()
    const player = players.find(p => p.id === id)

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Player deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}

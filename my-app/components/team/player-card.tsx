'use client'

import { Player, Team } from '@/lib/utils/data'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PlayerCardProps {
  player: Player
  team: Team
}

export function PlayerCard({ player, team }: PlayerCardProps) {
  return (
    <Link 
      href={`/players/${player.id}`}
      className="block group"
    >
      <div className="flex items-center justify-between p-3 rounded-lg border group-hover:border-primary/50 group-hover:bg-muted/50 transition-all duration-200 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-200"
              sizes="40px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                display: 'none',
                backgroundColor: team.colors.primary
              }}
            >
              {player.name.split(' ').map(word => word[0]).join('')}
            </div>
          </div>
          <div>
            <p className="font-medium group-hover:text-primary transition-colors">
              {player.name}
            </p>
            <p className="text-sm text-muted-foreground">
              #{player.number} • {player.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {player.stats.ppg} PPG
            </p>
            <p className="text-xs text-muted-foreground">
              {player.stats.rpg} RPG • {player.stats.apg} APG
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  )
}

"use client"

import { useEffect, useState } from 'react'

export function BouncingBasketballs() {
  const [balls, setBalls] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([])

  useEffect(() => {
    // Generate random basketball positions and timings
    const generatedBalls = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`, // Random position between 5% and 95%
      delay: `${Math.random() * 2}s`, // Random delay up to 2s
      duration: `${1.5 + Math.random()}s`, // Duration between 1.5s and 2.5s
    }))
    setBalls(generatedBalls)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute bottom-0 text-6xl animate-basketball-bounce"
          style={{
            left: ball.left,
            animationDelay: ball.delay,
            animationDuration: ball.duration,
          }}
        >
          🏀
        </div>
      ))}
    </div>
  )
}

export function DribblingBall({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-dribble ${className}`}>
      🏀
    </div>
  )
}

export function SwishEffect({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-swish ${className}`}>
      <div className="text-4xl">🏀</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-yellow-500 animate-score-pop">
          SWISH! 💫
        </span>
      </div>
    </div>
  )
}

export function SlamDunkIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-block animate-slam-dunk ${className}`}>
      🏀
    </div>
  )
}

export function ThreePointerArc({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-three-pointer text-6xl">
        🏀
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-score-pop text-4xl font-bold text-yellow-500">
          +3 🔥
        </div>
      </div>
    </div>
  )
}

export function CourtLines({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full border-4 border-white/10 animate-spin-ball" style={{ animationDuration: '20s' }} />
      </div>
      
      {/* Three-point lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-spotlight" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-spotlight" style={{ animationDelay: '1.5s' }} />
      
      {/* Side lines */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent animate-spotlight" style={{ animationDelay: '3s' }} />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent animate-spotlight" style={{ animationDelay: '4.5s' }} />
    </div>
  )
}

export function ScorePopAnimation({ score, show, onComplete }: { score: number; show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-score-pop text-8xl font-bold text-yellow-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
        +{score}
      </div>
    </div>
  )
}

export function BuzzerBeaterEffect({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div className={show ? 'animate-buzzer-beater' : ''}>
      {children}
    </div>
  )
}

export function CrowdWave({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="text-4xl animate-crowd-wave"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          🙌
        </div>
      ))}
    </div>
  )
}

export function FastBreakStreak({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <div className="animate-fast-break absolute top-1/2 -translate-y-1/2 text-6xl">
        🏀💨
      </div>
    </div>
  )
}

export function AlleyOopAnimation({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-alley-oop text-6xl">
        🏀
      </div>
      <div className="absolute bottom-20 animate-slam-dunk text-4xl">
        💥 ALLEY-OOP!
      </div>
    </div>
  )
}

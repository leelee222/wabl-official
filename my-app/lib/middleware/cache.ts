import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'

export interface CacheConfig {
  revalidate?: number | false
  tags?: string[]
}

export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config: CacheConfig = {}
): T {
  const { revalidate = 300, tags = [] } = config

  return unstable_cache(fn, undefined, {
    revalidate,
    tags,
  }) as T
}

export function createCachedResponse(
  data: unknown,
  options: {
    maxAge?: number
    tags?: string[]
  } = {}
) {
  const { tags = [], maxAge = 300 } = options

  const response = NextResponse.json(data)
  
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  )
  
  if (tags.length > 0) {
    response.headers.set('Cache-Tags', tags.join(','))
  }

  return response
}

export async function handleCachedRequest<T>(
  request: NextRequest,
  handler: () => Promise<T>,
  cacheKey: string,
  options: CacheConfig = {}
): Promise<NextResponse> {
  try {
    const cachedHandler = withCache(handler, options)
    const data = await cachedHandler()
    
    return createCachedResponse(data, {
      maxAge: typeof options.revalidate === 'number' ? options.revalidate : 300,
      tags: options.tags
    })
  } catch (error) {
    console.error(`Cache error for ${cacheKey}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export function createCacheInvalidator(tags: string[]) {
    return async () => {
    console.log('Invalidating cache tags:', tags)
  }
}

export const CACHE_CONFIGS = {
  TEAMS: {
    revalidate: 600,
    tags: ['teams'],
  },
  PLAYERS: {
    revalidate: 600,
    tags: ['players'],
  },
  MATCHES: {
    revalidate: 120,
    tags: ['matches'],
  },
  SEARCH: {
    revalidate: 300,
    tags: ['search'],
  },
  STATIC: {
    revalidate: 3600,
    tags: ['static'],
  },
} as const

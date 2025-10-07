export interface Team {
  id: string;
  name: string;
  city: string;
  country: string;
  founded: number;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  stadium: string;
  stats: {
    wins: number;
    losses: number;
    streak: number;
    pointsFor: number;
    pointsAgainst: number;
  };
  slug: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number: number;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  height: string;
  weight: string;
  nationality: string;
  photo: string;
  age: number;
  experience: number;
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
    fg: number;
    ft: number;
    threePt: number;
    steals: number;
    blocks: number;
  };
  achievements?: string[];
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: string;
  awayTeam?: string;
  date: string;
  time?: string;
  venue: string;
  city?: string;
  status: 'completed' | 'upcoming' | 'live' | 'postponed';
  round?: number;
  score?: {
    home: number;
    away: number;
    quarters?: {
      q1: { home: number; away: number };
      q2: { home: number; away: number };
      q3: { home: number; away: number };
      q4: { home: number; away: number };
      overtime?: { home: number; away: number };
    };
  };
  quarter?: number;
  timeRemaining?: string;
  attendance?: number;
  highlights?: string[];
  recap?: string;
  season?: string;
  week?: number;
}

export interface Standing {
  teamId: string;
  position: number;
  wins: number;
  losses: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
  streak: string;
  lastFive: string;
  homeRecord: string;
  awayRecord: string;
  conference?: string;
}

export interface GameStats {
  matchId: string;
  teamStats: {
    [teamId: string]: {
      fieldGoals: { made: number; attempted: number };
      threePointers: { made: number; attempted: number };
      freeThrows: { made: number; attempted: number };
      rebounds: { offensive: number; defensive: number; total: number };
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
      fouls: number;
      points: number;
    };
  };
  playerStats: {
    [playerId: string]: {
      minutes: number;
      points: number;
      rebounds: number;
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
      fouls: number;
      fieldGoals: { made: number; attempted: number };
      threePointers: { made: number; attempted: number };
      freeThrows: { made: number; attempted: number };
      plusMinus: number;
    };
  };
}

export interface SearchResult {
  type: 'team' | 'player' | 'match';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  url: string;
}

export interface League {
  name: string;
  fullName: string;
  tagline: string;
  founded: number;
  season: string;
  totalTeams: number;
  totalPlayers: number;
  countries: string[];
  commissioner: string;
  website: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: 'news' | 'analysis' | 'interview' | 'feature' | 'recap';
  tags: string[];
  featuredImage?: string;
  relatedPlayers?: string[];
  relatedTeams?: string[];
  slug: string;
}

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';
export type MatchStatus = 'completed' | 'upcoming' | 'live' | 'postponed';
export type Theme = 'light' | 'dark' | 'system';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TeamCardProps {
  team: Team;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface PlayerCardProps {
  player: Player;
  team: Team;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  showVenue?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface SearchFilters {
  query: string;
  type?: 'all' | 'teams' | 'players' | 'matches';
  team?: string;
  position?: Position;
  country?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface StatComparison {
  player1: Player;
  player2: Player;
  stats: {
    [key: string]: {
      player1: number;
      player2: number;
      unit?: string;
    };
  };
}

export interface TeamComparison {
  team1: Team;
  team2: Team;
  stats: {
    [key: string]: {
      team1: number;
      team2: number;
      unit?: string;
    };
  };
}

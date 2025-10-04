// WABL (West African Basketball League) Type Definitions

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
  slug: string; // URL-friendly version of team name
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number: number;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  height: string; // e.g., "6'2\""
  weight: string; // e.g., "185 lbs"
  nationality: string;
  photo: string;
  age: number;
  experience: number; // years in league
  stats: {
    ppg: number;  // points per game
    rpg: number;  // rebounds per game
    apg: number;  // assists per game
    fg: number;   // field goal percentage (0-100)
    ft: number;   // free throw percentage (0-100)
    threePt: number; // three point percentage (0-100)
    steals: number;
    blocks: number;
  };
  achievements?: string[]; // MVP, All-Star, etc.
}

export interface Match {
  id: string;
  homeTeam: string; // team ID
  awayTeam: string; // team ID
  date: string; // ISO date string
  time: string; // e.g., "7:30 PM WAT"
  venue: string;
  city: string;
  status: 'completed' | 'upcoming' | 'live' | 'postponed';
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
  quarter?: number; // current quarter for live games
  timeRemaining?: string; // e.g., "2:45" for live games
  attendance?: number;
  highlights?: string[]; // URLs to highlight videos
  recap?: string; // game summary
  season: string; // e.g., "2024-25"
  week: number;
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
  streak: string; // e.g., "W3", "L1"
  lastFive: string; // e.g., "3-2"
  homeRecord: string; // e.g., "5-2"
  awayRecord: string; // e.g., "3-4"
  conference?: string; // if applicable
}

// Game statistics for individual games
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

// Search result types
export interface SearchResult {
  type: 'team' | 'player' | 'match';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  url: string;
}

// League information
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

// News/Articles
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
  relatedPlayers?: string[]; // player IDs
  relatedTeams?: string[]; // team IDs
  slug: string;
}

// Utility types
export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';
export type MatchStatus = 'completed' | 'upcoming' | 'live' | 'postponed';
export type Theme = 'light' | 'dark' | 'system';

// API response types
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

// Component prop types
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

// Form types
export interface SearchFilters {
  query: string;
  type?: 'all' | 'teams' | 'players' | 'matches';
  team?: string;
  position?: Position;
  country?: string;
}

// Chart/Stats data types
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

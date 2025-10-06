import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Team, Player, Match, Position } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm} WAT`;
}

export function calculateWinPercentage(wins: number, losses: number): number {
  const totalGames = wins + losses;
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
}

export function calculatePointsDifference(pointsFor: number, pointsAgainst: number): number {
  return Math.round((pointsFor - pointsAgainst) * 10) / 10;
}

export function calculateFieldGoalPercentage(made: number, attempted: number): number {
  if (attempted === 0) return 0;
  return Math.round((made / attempted) * 100);
}

export function getTeamRecord(team: Team): string {
  return `${team.stats.wins}-${team.stats.losses}`;
}

export function getTeamSlug(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function sortTeamsByStandings(teams: Team[]): Team[] {
  return teams.sort((a, b) => {
    const aWinPct = calculateWinPercentage(a.stats.wins, a.stats.losses);
    const bWinPct = calculateWinPercentage(b.stats.wins, b.stats.losses);
    
    if (aWinPct !== bWinPct) {
      return bWinPct - aWinPct;
    }
    
    const aPointsDiff = calculatePointsDifference(a.stats.pointsFor, a.stats.pointsAgainst);
    const bPointsDiff = calculatePointsDifference(b.stats.pointsFor, b.stats.pointsAgainst);
    
    return bPointsDiff - aPointsDiff;
  });
}

export function getPlayerDisplayName(player: Player): string {
  return player.name;
}

export function getPositionFullName(position: Position): string {
  const positions = {
    PG: 'Point Guard',
    SG: 'Shooting Guard',
    SF: 'Small Forward',
    PF: 'Power Forward',
    C: 'Center'
  };
  return positions[position];
}

export function sortPlayersByPoints(players: Player[]): Player[] {
  return players.sort((a, b) => b.stats.ppg - a.stats.ppg);
}

export function sortPlayersByRebounds(players: Player[]): Player[] {
  return players.sort((a, b) => b.stats.rpg - a.stats.rpg);
}

export function sortPlayersByAssists(players: Player[]): Player[] {
  return players.sort((a, b) => b.stats.apg - a.stats.apg);
}

export function getMatchDisplayDate(match: Match): string {
  const date = new Date(match.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return formatDate(date, 'short');
}

export function getMatchStatus(match: Match): {
  status: string;
  color: string;
  bgColor: string;
} {
  switch (match.status) {
    case 'live':
      return {
        status: 'LIVE',
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20'
      };
    case 'completed':
      return {
        status: 'FINAL',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-800/20'
      };
    case 'upcoming':
      return {
        status: formatTime(match.time),
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20'
      };
    case 'postponed':
      return {
        status: 'POSTPONED',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
      };
    default:
      return {
        status: 'TBD',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50 dark:bg-gray-800/20'
      };
  }
}

export function sortMatchesByDate(matches: Match[]): Match[] {
  return matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getUpcomingMatches(matches: Match[], limit?: number): Match[] {
  const upcoming = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getRecentMatches(matches: Match[], limit?: number): Match[] {
  const recent = matches
    .filter(match => match.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  return limit ? recent.slice(0, limit) : recent;
}

export function normalizeSearchQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

export function getContrastColor(hexColor: string): 'white' | 'black' {
  const color = hexColor.replace('#', '');
  
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? 'black' : 'white';
}

export function adjustColorBrightness(hexColor: string, percent: number): string {
  const color = hexColor.replace('#', '');
  const num = parseInt(color, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1);
}

export function staggerChildren(index: number, baseDelay: number = 0.1): number {
  return baseDelay * index;
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}

export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

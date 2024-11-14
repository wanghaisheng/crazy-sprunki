import type { LeaderboardEntry, TimeFilter } from '../types/leaderboard';

export function sortLeaderboard(data: LeaderboardEntry[], sortBy: keyof LeaderboardEntry): LeaderboardEntry[] {
  return [...data].sort((a, b) => {
    if (typeof a[sortBy] === 'string') {
      return (a[sortBy] as string).localeCompare(b[sortBy] as string);
    }
    return (b[sortBy] as number) - (a[sortBy] as number);
  });
}

export function filterLeaderboard(
  data: LeaderboardEntry[],
  timeFrame: TimeFilter,
  searchTerm: string
): LeaderboardEntry[] {
  let filtered = [...data];

  // Time frame filtering
  if (timeFrame !== 'all') {
    const now = new Date();
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.lastActive);
      switch (timeFrame) {
        case 'day':
          return entryDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return entryDate >= weekAgo;
        case 'month':
          return (
            entryDate.getMonth() === now.getMonth() &&
            entryDate.getFullYear() === now.getFullYear()
          );
        default:
          return true;
      }
    });
  }

  // Search term filtering
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(entry =>
      entry.username.toLowerCase().includes(term)
    );
  }

  return filtered;
}
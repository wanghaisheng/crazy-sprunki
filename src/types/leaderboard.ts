export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  coin: number;
  spending: number;
  days?:number;
  record: number;
  joindate:string;
  lastActive: string;
}

export type TimeFilter = 'all' | 'month' | 'week' | 'day' | 'year';
export type TypeFilter = 'all' | 'coin' | 'spending' | 'record' | 'total';
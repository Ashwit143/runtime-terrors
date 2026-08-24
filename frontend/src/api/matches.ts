import { fetchApi } from './client.js';
import { Listing, MatchRecord } from '../types/index.js';

export interface MatchesResponse {
  success: boolean;
  count: number;
  data: MatchRecord[];
}

export interface SimulateMatchesResponse {
  success: boolean;
  targetListing: Listing;
  matchCount: number;
  data: MatchRecord[];
}

export async function getAllMatches(): Promise<MatchRecord[]> {
  const res = await fetchApi<MatchesResponse>('/matches');
  return res.data;
}

export async function getMatchesForListing(listingId: string): Promise<MatchRecord[]> {
  const res = await fetchApi<SimulateMatchesResponse>(`/matches/${listingId}`);
  return res.data;
}

export async function simulateMatches(listing: Partial<Listing>): Promise<{ targetListing: Listing; matches: MatchRecord[] }> {
  const res = await fetchApi<SimulateMatchesResponse>('/matches/simulate', {
    method: 'POST',
    body: JSON.stringify(listing),
  });
  return {
    targetListing: res.targetListing,
    matches: res.data,
  };
}

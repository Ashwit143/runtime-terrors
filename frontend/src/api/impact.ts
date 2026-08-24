import { fetchApi } from './client.js';
import { ImpactSummary, MatchRecord } from '../types/index.js';

export interface ImpactSummaryResponse {
  success: boolean;
  data: {
    summary: ImpactSummary;
    contributingMatchesCount: number;
    topMatches: MatchRecord[];
  };
}

export async function getImpactSummary(): Promise<ImpactSummary> {
  const res = await fetchApi<ImpactSummaryResponse>('/impact/summary');
  return res.data.summary;
}

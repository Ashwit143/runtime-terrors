import { MATCHING_CONFIG } from '../config/matchingConfig.js';
import { MatchRecord } from '../types/index.js';

/**
 * Post-Filter:
 * Exclude matches where overallScore < minPassingScore (40).
 * Sort remaining matches descending by overallScore.
 */
export function applyPostFilterAndSort(matches: MatchRecord[]): MatchRecord[] {
  const minScore = MATCHING_CONFIG.thresholds.minPassingScore;

  return matches
    .filter(m => m.score.overallScore >= minScore)
    .sort((a, b) => b.score.overallScore - a.score.overallScore);
}

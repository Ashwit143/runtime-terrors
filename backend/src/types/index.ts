export type ListingType = 'SUPPLIER' | 'RECEIVER';

export type MaterialCategory =
  | 'PLASTIC'
  | 'TEXTILE'
  | 'METAL'
  | 'FOOD_AGRO'
  | 'CHEMICAL'
  | 'RUBBER_MINERALS';

export type QualityGrade = 'LOW' | 'MEDIUM' | 'HIGH';

export type AvailabilityFrequency =
  | 'CONTINUOUS'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'ONE_TIME';

export interface Listing {
  id: string;
  type: ListingType;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  city: string;
  state?: string;
  category: MaterialCategory;
  materialName: string;
  description?: string;
  quantity: number; // in standard unit (tonnes/month or tonnes)
  unit: string;
  qualityGrade: QualityGrade;
  frequency: AvailabilityFrequency;
  isHazardous: boolean;
  isHazmatLicensed: boolean;
  pricePerUnit?: number;
  currency?: string;
  createdAt?: string;
}

export interface FactorBreakdown {
  name: string;
  key:
    | 'materialCompatibility'
    | 'transportFeasibility'
    | 'quantityFit'
    | 'qualityMatch'
    | 'availabilityFrequency';
  rawScore: number; // 0 - 100
  weight: number; // e.g. 0.35
  contribution: number; // rawScore * weight
  explanation: string;
  metadata?: Record<string, any>;
}

export interface MatchScoreResult {
  overallScore: number; // 0 - 100
  materialCompatibility: FactorBreakdown;
  transportFeasibility: FactorBreakdown;
  quantityFit: FactorBreakdown;
  qualityMatch: FactorBreakdown;
  availabilityFrequency: FactorBreakdown;
  factors: FactorBreakdown[];
  distanceKm: number;
  quantityRatio: number;
  qualityTierDiff: number;
}

export interface MatchRecord {
  matchId: string;
  supplier: Listing;
  receiver: Listing;
  score: MatchScoreResult;
  impact: {
    wasteDivertedTonnes: number;
    estimatedCostSavedINR: number;
    co2AvoidedTons: number;
    landfillDivertedTonnes: number;
  };
}

export interface ImpactSummary {
  totalMatchesCount: number;
  totalWasteDivertedTonnes: number;
  totalCostSavedINR: number;
  totalCo2AvoidedTons: number;
  totalLandfillDivertedTonnes: number;
}

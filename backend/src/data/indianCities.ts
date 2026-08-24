export interface CityCoord {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const INDIAN_CITIES: Record<string, CityCoord> = {
  DELHI: { name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  JAIPUR: { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  AHMEDABAD: { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  SURAT: { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  MUMBAI: { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  PUNE: { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  HYDERABAD: { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  BENGALURU: { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  CHENNAI: { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  INDORE: { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  VADODARA: { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  RAJKOT: { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  LUDHIANA: { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  COIMBATORE: { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  NAGPUR: { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
};

/**
 * Calculates Great-Circle distance between two Indian cities using the Haversine formula
 */
export function calculateDistanceKm(cityA: string, cityB: string): number {
  const normA = cityA.trim().toUpperCase();
  const normB = cityB.trim().toUpperCase();

  const cA = INDIAN_CITIES[normA] || Object.values(INDIAN_CITIES).find(c => c.name.toUpperCase().includes(normA));
  const cB = INDIAN_CITIES[normB] || Object.values(INDIAN_CITIES).find(c => c.name.toUpperCase().includes(normB));

  if (!cA || !cB) {
    // Default fallback realistic distance if unknown city
    return 180;
  }

  if (normA === normB) {
    return 18; // Same city local logistics distance
  }

  const R = 6371; // Earth radius in km
  const dLat = ((cB.lat - cA.lat) * Math.PI) / 180;
  const dLng = ((cB.lng - cA.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((cA.lat * Math.PI) / 180) *
      Math.cos((cB.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

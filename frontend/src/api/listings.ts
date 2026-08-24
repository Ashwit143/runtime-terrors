import { fetchApi } from './client.js';
import { Listing } from '../types/index.js';

export interface ListingsResponse {
  success: boolean;
  count: number;
  data: Listing[];
}

export interface ListingSingleResponse {
  success: boolean;
  data: Listing;
}

export async function getListings(params?: { type?: string; category?: string; city?: string }): Promise<Listing[]> {
  const query = new URLSearchParams();
  if (params?.type) query.append('type', params.type);
  if (params?.category) query.append('category', params.category);
  if (params?.city) query.append('city', params.city);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetchApi<ListingsResponse>(`/listings${qs}`);
  return res.data;
}

export async function createListing(listing: Partial<Listing>): Promise<Listing> {
  const res = await fetchApi<ListingSingleResponse>('/listings', {
    method: 'POST',
    body: JSON.stringify(listing),
  });
  return res.data;
}

export async function resetDatabase(): Promise<void> {
  await fetchApi('/listings/reset', {
    method: 'POST',
  });
}

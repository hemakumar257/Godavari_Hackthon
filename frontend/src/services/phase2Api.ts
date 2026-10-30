import {
  PushkaraluEvent,
  Ghat,
  Temple,
  ParkingLocation,
  Facility,
} from '../types/phase2';
import {
  DEMO_EVENTS,
  DEMO_GHATS,
  DEMO_TEMPLES,
  DEMO_PARKING,
  DEMO_FACILITIES,
} from '../data/phase2Data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function fetchWithFallback<T>(url: string, fallbackData: T[]): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : fallbackData;
  } catch {
    // Graceful fallback to demo data
    return fallbackData;
  }
}

async function fetchItemWithFallback<T extends { id: string }>(
  url: string,
  id: string,
  fallbackList: T[]
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}/${id}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch {
    const found = fallbackList.find(item => item.id === id);
    return found || null;
  }
}

export const phase2Api = {
  getEvents: () => fetchWithFallback<PushkaraluEvent>('/events', DEMO_EVENTS),
  getEventById: (id: string) => fetchItemWithFallback<PushkaraluEvent>('/events', id, DEMO_EVENTS),

  getGhats: () => fetchWithFallback<Ghat>('/ghats', DEMO_GHATS),
  getGhatById: (id: string) => fetchItemWithFallback<Ghat>('/ghats', id, DEMO_GHATS),

  getTemples: () => fetchWithFallback<Temple>('/temples', DEMO_TEMPLES),
  getTempleById: (id: string) => fetchItemWithFallback<Temple>('/temples', id, DEMO_TEMPLES),

  getParking: () => fetchWithFallback<ParkingLocation>('/parking', DEMO_PARKING),
  getParkingById: (id: string) => fetchItemWithFallback<ParkingLocation>('/parking', id, DEMO_PARKING),

  getFacilities: () => fetchWithFallback<Facility>('/facilities', DEMO_FACILITIES),
  getFacilityById: (id: string) => fetchItemWithFallback<Facility>('/facilities', id, DEMO_FACILITIES),
};

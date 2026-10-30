import { LiveStream, StreamReminder, StreamCategory, StreamStatus } from '../types/phase4';
import { DEMO_LIVE_STREAMS } from '../data/phase4Data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function fetchWithFallback<T>(url: string, fallbackData: T[]): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : fallbackData;
  } catch {
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
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch {
    const found = fallbackList.find((item) => item.id === id);
    return found || null;
  }
}

export const phase4Api = {
  // Get all streams
  getLiveStreams: async (params?: {
    category?: StreamCategory | 'all';
    status?: StreamStatus | 'all';
    search?: string;
  }): Promise<LiveStream[]> => {
    let query = '';
    if (params) {
      const q = new URLSearchParams();
      if (params.category && params.category !== 'all') q.set('category', params.category);
      if (params.status && params.status !== 'all') q.set('status', params.status);
      if (params.search) q.set('search', params.search);
      query = `?${q.toString()}`;
    }

    const fetched = await fetchWithFallback<LiveStream>(`/live-streams${query}`, DEMO_LIVE_STREAMS);
    return fetched;
  },

  // Get stream by ID
  getLiveStreamById: (id: string) =>
    fetchItemWithFallback<LiveStream>('/live-streams', id, DEMO_LIVE_STREAMS),

  // Get upcoming streams
  getUpcomingStreams: async (): Promise<LiveStream[]> => {
    const all = await fetchWithFallback<LiveStream>('/live-streams/upcoming', DEMO_LIVE_STREAMS);
    return all.filter((s) => s.status === 'UPCOMING');
  },

  // Get recordings
  getRecordings: async (): Promise<LiveStream[]> => {
    const all = await fetchWithFallback<LiveStream>('/live-streams/recordings', DEMO_LIVE_STREAMS);
    return all.filter((s) => s.status === 'ENDED' || s.duration !== undefined);
  },

  // Local Reminders handling
  getReminders: (): StreamReminder[] => {
    try {
      const data = localStorage.getItem('pushkaralu_stream_reminders');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isReminderSet: (streamId: string): boolean => {
    const list = phase4Api.getReminders();
    return list.some((r) => r.streamId === streamId);
  },

  toggleReminder: (
    streamId: string,
    streamTitleTe: string,
    streamTitleEn: string,
    scheduledStart: string
  ): boolean => {
    try {
      const current = phase4Api.getReminders();
      const exists = current.some((r) => r.streamId === streamId);

      let next: StreamReminder[];
      if (exists) {
        next = current.filter((r) => r.streamId !== streamId);
      } else {
        const item: StreamReminder = {
          streamId,
          streamTitleTe,
          streamTitleEn,
          scheduledStart,
          createdAt: new Date().toISOString(),
        };
        next = [...current, item];
      }

      localStorage.setItem('pushkaralu_stream_reminders', JSON.stringify(next));

      // Attempt background backend ping
      fetch(`${API_BASE_URL}/live-streams/${streamId}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId, action: exists ? 'remove' : 'add' }),
      }).catch(() => {});

      return !exists;
    } catch {
      return false;
    }
  },
};

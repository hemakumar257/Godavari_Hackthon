/**
 * Phase 5 API Service – Heritage Explorer & Personal Yatra Planner
 * Supports REST endpoints with safe localStorage fallback for guest itineraries.
 */

import {
  HeritageLocation,
  HeritageStory,
  GalleryItem,
  YatraItinerary,
  SuggestedYatraTemplate,
  HeritageCategory,
} from '../types/phase5';
import {
  DEMO_HERITAGE_LOCATIONS,
  DEMO_HERITAGE_STORIES,
  DEMO_GALLERY_ITEMS,
  DEMO_SUGGESTED_YATRAS,
} from '../data/phase5Data';

const BASE_URL = '/api';
const LOCAL_STORAGE_YATRAS_KEY = 'pushkaralu_my_yatras';

export const phase5Api = {
  // ─── Heritage Locations ───
  async getHeritageLocations(params?: {
    category?: HeritageCategory | 'all';
    search?: string;
  }): Promise<HeritageLocation[]> {
    try {
      const q = new URLSearchParams();
      if (params?.category && params.category !== 'all') q.set('category', params.category);
      if (params?.search) q.set('search', params.search);
      const res = await fetch(`${BASE_URL}/heritage?${q.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let items = [...DEMO_HERITAGE_LOCATIONS];
    if (params?.category && params.category !== 'all') {
      items = items.filter((h) => h.category === params.category);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      items = items.filter(
        (h) =>
          h.nameEn.toLowerCase().includes(s) ||
          h.nameTe.toLowerCase().includes(s) ||
          h.shortDescEn.toLowerCase().includes(s) ||
          h.shortDescTe.toLowerCase().includes(s)
      );
    }
    return items;
  },

  async getHeritageBySlug(slug: string): Promise<HeritageLocation | null> {
    try {
      const res = await fetch(`${BASE_URL}/heritage/${slug}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DEMO_HERITAGE_LOCATIONS.find((h) => h.slug === slug || h.id === slug) || null;
  },

  async getFeaturedHeritage(): Promise<HeritageLocation[]> {
    try {
      const res = await fetch(`${BASE_URL}/heritage/featured`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DEMO_HERITAGE_LOCATIONS.filter((h) => h.isFeatured);
  },

  // ─── Heritage Stories ───
  async getHeritageStories(): Promise<HeritageStory[]> {
    try {
      const res = await fetch(`${BASE_URL}/heritage/stories`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DEMO_HERITAGE_STORIES;
  },

  async getHeritageStoryBySlug(slug: string): Promise<HeritageStory | null> {
    try {
      const res = await fetch(`${BASE_URL}/heritage/stories/${slug}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DEMO_HERITAGE_STORIES.find((s) => s.slug === slug || s.id === slug) || null;
  },

  // ─── Gallery ───
  async getGalleryItems(category?: HeritageCategory | 'all'): Promise<GalleryItem[]> {
    let items = [...DEMO_GALLERY_ITEMS];
    if (category && category !== 'all') {
      items = items.filter((g) => g.category === category);
    }
    return items;
  },

  // ─── Suggested Yatras ───
  async getSuggestedTemplates(): Promise<SuggestedYatraTemplate[]> {
    try {
      const res = await fetch(`${BASE_URL}/yatras/templates`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DEMO_SUGGESTED_YATRAS;
  },

  // ─── User Personal Yatras (Client localStorage + Backend sync) ───
  getUserYatras(): YatraItinerary[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_YATRAS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getYatraById(id: string): YatraItinerary | null {
    // First check user's saved yatras
    const userYatras = this.getUserYatras();
    const found = userYatras.find((y) => y.id === id);
    if (found) return found;

    // Check if it's a template
    const template = DEMO_SUGGESTED_YATRAS.find((t) => t.id === id || t.slug === id);
    if (template) {
      return {
        id: template.id,
        title: template.titleEn,
        description: template.descEn,
        startDate: '2027-07-15',
        startingLocation: 'Rajahmundry Railway Station / Bus Complex',
        preferences: {
          categories: ['ghat', 'temple', 'heritage'],
          pace: 'moderate',
        },
        stops: template.stops,
        totalDurationHours: 12,
        isTemplate: true,
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  },

  saveYatra(itinerary: YatraItinerary): YatraItinerary {
    const list = this.getUserYatras();
    const index = list.findIndex((y) => y.id === itinerary.id);
    const updated = {
      ...itinerary,
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    localStorage.setItem(LOCAL_STORAGE_YATRAS_KEY, JSON.stringify(list));

    // Async sync with backend if available
    try {
      fetch(`${BASE_URL}/yatras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
    } catch {}

    return updated;
  },

  deleteYatra(id: string): boolean {
    const list = this.getUserYatras();
    const filtered = list.filter((y) => y.id !== id);
    localStorage.setItem(LOCAL_STORAGE_YATRAS_KEY, JSON.stringify(filtered));

    try {
      fetch(`${BASE_URL}/yatras/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}

    return true;
  },
};

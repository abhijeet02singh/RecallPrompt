import { CustomCollection, CustomTopic, PracticeSession, Topic, UserSettings } from "../types";

/**
 * Safe storage utilities with validation
 * Prevents application crashes from manipulated localStorage
 */

export interface SafeStorageResult<T> {
  data: T | null;
  error?: string;
  isCorrupted: boolean;
}

const RECENT_TOPICS_KEY = "explain_recent_topics";
const SESSIONS_KEY = "explain_practice_sessions";
const SETTINGS_KEY = "explain_settings";
const CUSTOM_COLLECTIONS_KEY = "explain_custom_collections";

const MAX_RECENT_TOPICS = 10;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getRecentTopics(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(RECENT_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to read recent topics from localStorage", e);
    }
    return [];
  }
}

export function saveRecentTopic(topicTitle: string): void {
  if (!isBrowser() || !topicTitle) return;
  try {
    const current = getRecentTopics();
    // Filter out if already in list, then prepend
    const updated = [topicTitle, ...current.filter((t) => t !== topicTitle)].slice(
      0,
      MAX_RECENT_TOPICS
    );
    localStorage.setItem(RECENT_TOPICS_KEY, JSON.stringify(updated));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to save recent topic to localStorage", e);
    }
  }
}

export function getPracticeSessions(): PracticeSession[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to read practice sessions from localStorage", e);
    }
    return [];
  }
}

export function savePracticeSession(session: PracticeSession): void {
  if (!isBrowser()) return;
  try {
    const sessions = getPracticeSessions();
    const updated = [session, ...sessions];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to save practice session to localStorage", e);
    }
  }
}

export function deletePracticeSession(id: string): void {
  if (!isBrowser()) return;
  try {
    const sessions = getPracticeSessions().filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to delete practice session from localStorage", e);
    }
  }
}

export function clearAllSessions(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(RECENT_TOPICS_KEY);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to clear sessions", e);
    }
  }
}

export function getKnowledgeGapsSummary(): { gap: string; count: number }[] {
  const sessions = getPracticeSessions();
  const counts: Record<string, number> = {};

  sessions.forEach((s) => {
    if (Array.isArray(s.knowledgeGaps)) {
      s.knowledgeGaps.forEach((gap) => {
        if (gap) {
          counts[gap] = (counts[gap] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(counts)
    .map(([gap, count]) => ({ gap, count }))
    .sort((a, b) => b.count - a.count);
}

export function getUserSettings(): UserSettings {
  if (!isBrowser()) {
    return { theme: "system", soundEnabled: true };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { theme: "system", soundEnabled: true, ...JSON.parse(raw) }
      : { theme: "system", soundEnabled: true };
  } catch (e) {
    return { theme: "system", soundEnabled: true };
  }
}

export function saveUserSettings(settings: Partial<UserSettings>): void {
  if (!isBrowser()) return;
  try {
    const current = getUserSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to save settings to localStorage", e);
    }
  }
}

export function generateLocalId(prefix: string = "id"): string {
  if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
  ) {
    try {
      return `${prefix}-${window.crypto.randomUUID()}`;
    } catch {
      // Fallback
    }
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

export function getCustomCollections(): CustomCollection[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CUSTOM_COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to read custom collections from localStorage", e);
    }
    return [];
  }
}

export function saveCustomCollection(collection: CustomCollection): void {
  if (!isBrowser()) return;
  try {
    const collections = getCustomCollections();
    const updated = [collection, ...collections.filter((c) => c.id !== collection.id)];
    localStorage.setItem(CUSTOM_COLLECTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to save custom collection", e);
    }
  }
}

export function updateCustomCollection(updatedCollection: CustomCollection): void {
  if (!isBrowser()) return;
  try {
    const collections = getCustomCollections();
    const next = collections.map((c) =>
      c.id === updatedCollection.id
        ? { ...updatedCollection, updatedAt: new Date().toISOString() }
        : c
    );
    localStorage.setItem(CUSTOM_COLLECTIONS_KEY, JSON.stringify(next));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to update custom collection", e);
    }
  }
}

export function deleteCustomCollection(id: string): void {
  if (!isBrowser()) return;
  try {
    const collections = getCustomCollections().filter((c) => c.id !== id);
    localStorage.setItem(CUSTOM_COLLECTIONS_KEY, JSON.stringify(collections));
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to delete custom collection", e);
    }
  }
}

export function getCustomCollectionById(id: string): CustomCollection | undefined {
  const collections = getCustomCollections();
  return collections.find((c) => c.id === id);
}

export function customTopicToTopic(customTopic: CustomTopic, collectionName: string): Topic {
  return {
    id: customTopic.id,
    title: customTopic.title,
    category: "My Topics",
    subcategory: collectionName,
    difficulty: "Intermediate",
  };
}

/**
 * Safe get operation with schema validation
 * Returns data if valid, null if corrupted or missing
 */
export function safeGet<T>(
  key: string,
  validator: (data: unknown) => data is T
): SafeStorageResult<T> {
  if (!isBrowser()) {
    return { data: null, isCorrupted: false };
  }
  
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { data: null, isCorrupted: false };
    }
    
    const parsed = JSON.parse(raw);
    
    if (validator(parsed)) {
      return { data: parsed, isCorrupted: false };
    } else {
      return { 
        data: null, 
        isCorrupted: true, 
        error: `Data validation failed for key: ${key}` 
      };
    }
  } catch (e) {
    return { 
      data: null, 
      isCorrupted: true, 
      error: `Failed to parse data for key: ${key}` 
    };
  }
}

/**
 * Safe set operation with validation
 * Returns success status
 */
export function safeSet<T>(
  key: string,
  data: T,
  validator: (data: unknown) => data is T
): { success: boolean; error?: string } {
  if (!isBrowser()) {
    return { success: false, error: 'Not in browser environment' };
  }
  
  if (!validator(data)) {
    return { success: false, error: 'Data validation failed' };
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    if (error.includes('quota')) {
      return { success: false, error: 'Storage quota exceeded. Please clear some data.' };
    }
    return { success: false, error: 'Failed to save data' };
  }
}

/**
 * Safe remove operation
 */
export function safeRemove(key: string): { success: boolean } {
  if (!isBrowser()) {
    return { success: false };
  }
  
  try {
    localStorage.removeItem(key);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

/**
 * Type guards for stored data validation
 */
export function isStringArray(data: unknown): data is string[] {
  return Array.isArray(data) && data.every(item => typeof item === 'string');
}

export function isPracticeSessionArray(data: unknown): data is PracticeSession[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'id' in item &&
    'topic' in item &&
    'mode' in item
  );
}

export function isCustomCollectionArray(data: unknown): data is CustomCollection[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'id' in item &&
    'name' in item &&
    'topics' in item
  );
}

export function isUserSettings(data: unknown): data is UserSettings {
  return typeof data === 'object' && 
    data !== null &&
    ('theme' in data || 'soundEnabled' in data);
}

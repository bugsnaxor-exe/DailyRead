import type { Book, ThemeMode, PageTurnMode, UpdateState } from './types';
import { INITIAL_BOOKS, MOCK_UPDATE_RELEASE } from './mockData';

const STORAGE_KEYS = {
  BOOKS: 'universal_reader_books',
  THEME: 'universal_reader_theme',
  PAGE_TURN_MODE: 'universal_reader_page_turn_mode',
  APP_VERSION: 'universal_reader_version',
  DISMISSED_UPDATE_VERSION: 'universal_reader_dismissed_update_version'
};

export const CURRENT_APP_VERSION = '2.3.0';

export function getStoredBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) {
      saveBooks(INITIAL_BOOKS);
      return INITIAL_BOOKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read books from storage', e);
    return INITIAL_BOOKS;
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books', e);
  }
}

export function getStoredTheme(): ThemeMode {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
  return theme === 'dark' ? 'dark' : 'light';
}

export function saveTheme(theme: ThemeMode): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function getStoredPageTurnMode(): PageTurnMode {
  const mode = localStorage.getItem(STORAGE_KEYS.PAGE_TURN_MODE) as PageTurnMode;
  return mode || '3d-curl';
}

export function savePageTurnMode(mode: PageTurnMode): void {
  localStorage.setItem(STORAGE_KEYS.PAGE_TURN_MODE, mode);
}

export function checkAppUpdate(): UpdateState {
  const currentVersion = CURRENT_APP_VERSION;
  const latest = MOCK_UPDATE_RELEASE;
  
  // Calculate if latest version is higher than current
  const hasUpdate = isVersionGreater(latest.version, currentVersion);
  
  // Calculate if update is over 2 months old (60 days)
  const releaseTime = new Date(latest.releaseDate).getTime();
  const now = Date.now();
  const daysDiff = (now - releaseTime) / (1000 * 60 * 60 * 24);
  const isMandatory = daysDiff >= latest.mandatoryAfterDays;

  // Check if dismissed before
  const dismissedVersion = localStorage.getItem(STORAGE_KEYS.DISMISSED_UPDATE_VERSION);
  const dismissed = dismissedVersion === latest.version && !isMandatory;

  return {
    hasUpdate,
    currentVersion,
    latestRelease: latest,
    isMandatory,
    isUpdating: false,
    updateProgress: 0,
    dismissed
  };
}

export function dismissUpdate(version: string): void {
  localStorage.setItem(STORAGE_KEYS.DISMISSED_UPDATE_VERSION, version);
}

export function clearDismissedUpdate(): void {
  localStorage.removeItem(STORAGE_KEYS.DISMISSED_UPDATE_VERSION);
}

function isVersionGreater(v1: string, v2: string): boolean {
  const parts1 = v1.replace(/^v/, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return true;
    if (p1 < p2) return false;
  }
  return false;
}

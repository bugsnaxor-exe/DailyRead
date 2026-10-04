import type { Book, AppRelease } from './types';

// Zero mock books: user's library is populated directly from their local device
export const INITIAL_BOOKS: Book[] = [];

export const MOCK_UPDATE_RELEASE: AppRelease = {
  version: '2.4.0',
  releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(), // > 60 days for mandatory rule check
  title: 'VerdantReader v2.4 Release',
  notes: [
    'Ultra-fluid 3D page curl physics with corner-peeling on Touch & Mouse',
    'Full hardware-accelerated PDF vector-to-texture rendering',
    'Cumulative updates: All intermediate patches applied at once in 1 tap',
    'Cream & Emerald night contrast mode for OLED displays'
  ],
  mandatoryAfterDays: 60,
  downloadSize: '24.8 MB'
};

export type DocumentFormat = 
  | 'epub' 
  | 'pdf' 
  | 'mobi' 
  | 'kindle'
  | 'azw3' 
  | 'fb2' 
  | 'djvu' 
  | 'doc' 
  | 'docx' 
  | 'rtf' 
  | 'odt' 
  | 'txt' 
  | 'cbr' 
  | 'cbz' 
  | 'book';

export type ShelfType = 'currently_reading' | 'all' | 'favorites' | 'already_read';

export type ThemeMode = 'light' | 'dark';

export type PageTurnMode = '3d-curl' | 'slide' | 'tap';

export type PageTurnDirection = 'ltr' | 'rtl'; // Left-to-Right (Western) vs Right-to-Left (Manga/RTL)

export type OrientationMode = 'auto' | 'portrait' | 'landscape';

export interface Book {
  id: string;
  title: string;
  author: string;
  format: DocumentFormat;
  size: string; // e.g. "2.4 MB"
  coverUrl?: string;
  coverColor?: string; // fallback stylized color
  totalPages: number;
  currentPage: number;
  isFavorite: boolean;
  isFinished: boolean; // "already done reading"
  lastReadDate?: string; // ISO date
  dateAdded: string; // ISO date
  contentPages: string[]; // text or HTML page content
  isPdf?: boolean;
}

export interface AppRelease {
  version: string;
  releaseDate: string; // ISO 8601 string
  title: string;
  notes: string[];
  mandatoryAfterDays: number; // default: 60 (2 months)
  downloadSize: string;
}

export interface UpdateState {
  hasUpdate: boolean;
  currentVersion: string;
  latestRelease: AppRelease | null;
  isMandatory: boolean;
  isUpdating: boolean;
  updateProgress: number;
  dismissed: boolean;
}

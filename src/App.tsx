import React, { useState, useEffect } from 'react';
import type { 
  Book, ShelfType, ThemeMode, PageTurnMode, UpdateState, DocumentFormat 
} from './types';
import { 
  getStoredBooks, saveBooks, getStoredTheme, saveTheme, 
  getStoredPageTurnMode, savePageTurnMode, checkAppUpdate 
} from './storage';
import { Navbar } from './components/Navbar';
import { ShelfView } from './components/ShelfView';
import { ReaderView } from './components/ReaderView';
import { FloatingActionButton } from './components/FloatingActionButton';

export const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(getStoredBooks);
  const [currentShelf, setCurrentShelf] = useState<ShelfType>('all');
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [pageTurnMode, setPageTurnMode] = useState<PageTurnMode>(getStoredPageTurnMode);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Background Update State (accessed via the Upper Right Corner in Navbar)
  const [updateState, setUpdateState] = useState<UpdateState>(checkAppUpdate);

  // Initialize theme on mount
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  // Check update state silently
  useEffect(() => {
    const status = checkAppUpdate();
    setUpdateState(status);
  }, []);

  const updateBooksState = (newBooks: Book[]) => {
    setBooks(newBooks);
    saveBooks(newBooks);
  };

  const handleToggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleChangePageTurnMode = (mode: PageTurnMode) => {
    setPageTurnMode(mode);
    savePageTurnMode(mode);
  };

  // Open book: auto-tracks into "Currently Reading"
  const handleOpenBook = (book: Book) => {
    const updatedBook: Book = {
      ...book,
      lastReadDate: new Date().toISOString()
    };
    const updatedList = books.map((b) => b.id === book.id ? updatedBook : b);
    updateBooksState(updatedList);
    setActiveBook(updatedBook);
  };

  const handleCloseReader = (updatedBook: Book) => {
    const updatedList = books.map((b) => b.id === updatedBook.id ? updatedBook : b);
    updateBooksState(updatedList);
    setActiveBook(null);
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = books.map((b) => {
      if (b.id === id) {
        return { ...b, isFavorite: !b.isFavorite };
      }
      return b;
    });
    updateBooksState(updatedList);
  };

  const handleToggleFinished = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = books.map((b) => {
      if (b.id === id) {
        const nextFinished = !b.isFinished;
        return { 
          ...b, 
          isFinished: nextFinished,
          currentPage: nextFinished ? b.totalPages : 1
        };
      }
      return b;
    });
    updateBooksState(updatedList);
  };

  // Import book/document from device storage
  const handleAddBookFromFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
    const format = (extension === 'pdf' ? 'pdf' : 
                   extension === 'epub' ? 'epub' :
                   extension === 'docx' || extension === 'doc' ? 'docx' :
                   extension === 'mobi' ? 'mobi' :
                   extension === 'kindle' ? 'kindle' :
                   extension === 'azw3' ? 'azw3' :
                   extension === 'fb2' ? 'fb2' :
                   extension === 'djvu' ? 'djvu' :
                   extension === 'cbz' ? 'cbz' :
                   extension === 'cbr' ? 'cbr' : 'book') as DocumentFormat;

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    let pages: string[] = [];
    if (file.type.includes('text') || extension === 'txt') {
      try {
        const text = await file.text();
        const chunkSize = 900;
        for (let i = 0; i < text.length; i += chunkSize) {
          pages.push(text.slice(i, i + chunkSize));
        }
      } catch {
        pages = [`Content of ${file.name}`];
      }
    } else {
      pages = [
        `Document: ${file.name}\n\nFormat: ${format.toUpperCase()}\nSize: ${sizeFormatted}\n\nIndexed directly from device storage. Swipe your finger or mouse across the screen to turn pages with 3D paper curl physics.`,
        `Page 2: Reading Analytics\n\nProgress and bookmarks are stored directly on your device.`
      ];
    }

    const titleWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: titleWithoutExt,
      author: 'Local Document',
      format,
      isPdf: format === 'pdf',
      size: sizeFormatted,
      totalPages: Math.max(pages.length, 1),
      currentPage: 1,
      isFavorite: false,
      isFinished: false,
      dateAdded: new Date().toISOString(),
      lastReadDate: new Date().toISOString(),
      coverColor: '#059669',
      contentPages: pages
    };

    updateBooksState([newBook, ...books]);
    handleOpenBook(newBook);
  };

  const handleApplyUpdate = (newVersion: string) => {
    setUpdateState({
      hasUpdate: false,
      currentVersion: newVersion,
      latestRelease: null,
      isMandatory: false,
      isUpdating: false,
      updateProgress: 100,
      dismissed: false
    });
  };

  const counts = {
    currentlyReading: books.filter((b) => (b.currentPage > 1 && !b.isFinished) || (b.lastReadDate && !b.isFinished)).length,
    all: books.length,
    favorites: books.filter((b) => b.isFavorite).length,
    alreadyRead: books.filter((b) => b.isFinished || b.currentPage >= b.totalPages).length
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Top Navbar with Upper Right Update Dropdown */}
      <Navbar
        currentShelf={currentShelf}
        onSelectShelf={(shelf) => setCurrentShelf(shelf)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        updateState={updateState}
        onApplyUpdate={handleApplyUpdate}
        counts={counts}
      />

      {/* Main Library Shelf */}
      <main className="flex-1">
        <ShelfView
          shelf={currentShelf}
          books={books}
          searchQuery={searchQuery}
          onOpenBook={handleOpenBook}
          onToggleFavorite={handleToggleFavorite}
          onToggleFinished={handleToggleFinished}
          onTriggerAdd={() => {
            const input = document.getElementById('book-upload-input');
            input?.click();
          }}
        />
      </main>

      {/* Floating Action Button (+ FAB) */}
      <FloatingActionButton
        onAddBookFromFile={handleAddBookFromFile}
      />

      {/* Clean Minimalist Footer */}
      <footer 
        className="py-5 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--text-secondary)]">VerdantReader</span>
          <span>•</span>
          <span>Light Emerald & Cream White</span>
          <span>•</span>
          <span>Local Device Library</span>
        </div>
        <div>
          <span>Universal 3D Engine • Zero Telemetry</span>
        </div>
      </footer>

      {/* Active 3D Reader View */}
      {activeBook && (
        <ReaderView
          book={activeBook}
          onClose={handleCloseReader}
          pageTurnMode={pageTurnMode}
          onChangePageTurnMode={handleChangePageTurnMode}
        />
      )}
    </div>
  );
};

export default App;

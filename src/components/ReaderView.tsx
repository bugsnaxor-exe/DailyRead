import React, { useState, useEffect, useRef } from 'react';
import type { Book, PageTurnMode } from '../types';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Settings, Maximize2, Minimize2, 
  BookOpen, FileText, Smartphone, Monitor
} from 'lucide-react';

interface ReaderViewProps {
  book: Book;
  onClose: (updatedBook: Book) => void;
  pageTurnMode: PageTurnMode;
  onChangePageTurnMode: (mode: PageTurnMode) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  onClose,
  pageTurnMode,
  onChangePageTurnMode
}) => {
  const [currentPage, setCurrentPage] = useState<number>(book.currentPage || 1);
  const [isLandscape, setIsLandscape] = useState<boolean>(window.innerWidth > 800);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [turningDirection, setTurningDirection] = useState<'left' | 'right' | null>(null);
  const [fontSize, setFontSize] = useState<number>(17); // px

  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = book.contentPages.length > 0 ? book.contentPages.length : book.totalPages;

  // Auto-detect orientation on resize
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > 800);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else {
          handleExit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isSettingsOpen, isLandscape]);

  const handleNextPage = () => {
    const step = isLandscape ? 2 : 1;
    if (currentPage >= totalPages) return;

    if (pageTurnMode === '3d-curl') {
      setTurningDirection('left');
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(totalPages, prev + step));
        setTurningDirection(null);
      }, 420);
    } else if (pageTurnMode === 'slide') {
      setTurningDirection('left');
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(totalPages, prev + step));
        setTurningDirection(null);
      }, 250);
    } else {
      // Tap mode (instant flip)
      setCurrentPage((prev) => Math.min(totalPages, prev + step));
    }
  };

  const handlePrevPage = () => {
    const step = isLandscape ? 2 : 1;
    if (currentPage <= 1) return;

    if (pageTurnMode === '3d-curl') {
      setTurningDirection('right');
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(1, prev - step));
        setTurningDirection(null);
      }, 420);
    } else if (pageTurnMode === 'slide') {
      setTurningDirection('right');
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(1, prev - step));
        setTurningDirection(null);
      }, 250);
    } else {
      // Tap mode (instant flip)
      setCurrentPage((prev) => Math.max(1, prev - step));
    }
  };

  const handleExit = () => {
    const isFinished = currentPage >= totalPages;
    const updatedBook: Book = {
      ...book,
      currentPage,
      isFinished: isFinished || book.isFinished,
      lastReadDate: new Date().toISOString()
    };
    onClose(updatedBook);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Get content for page
  const getPageText = (pageIndex: number) => {
    if (pageIndex < 1 || pageIndex > totalPages) return null;
    if (book.contentPages && book.contentPages[pageIndex - 1]) {
      return book.contentPages[pageIndex - 1];
    }
    return `Page ${pageIndex} of ${book.title}.\n\nThis is formatted content for ${book.format.toUpperCase()} document. The universal rendering engine renders crisp vector text with hardware acceleration and realistic 3D page curl physics.`;
  };

  const leftPageNum = currentPage;
  const rightPageNum = isLandscape && currentPage + 1 <= totalPages ? currentPage + 1 : null;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Top Floating Reader Bar */}
      <header 
        className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b transition-colors z-20 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Left: Back Arrow & Book Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleExit}
            aria-label="Back to library"
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] transition-colors active:scale-95"
            style={{ color: 'var(--text-primary)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-bold truncate">
              {book.title}
            </h1>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate flex items-center gap-1.5">
              <span>{book.author}</span>
              <span>•</span>
              <span className="uppercase font-semibold text-[var(--emerald-primary)]">
                {book.isPdf ? 'PDF (3D Curl Active)' : book.format}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Orientation toggle, Settings, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Orientation Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsLandscape(!isLandscape)}
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] transition-colors"
            title={isLandscape ? "Switch to Portrait (Single Page)" : "Switch to Landscape (2-Page Spread)"}
          >
            {isLandscape ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          {/* Reader Settings Cog */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] transition-colors"
            title="Reader Settings (Animation, Typography)"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Reader Settings Drawer / Flyout */}
      {isSettingsOpen && (
        <div 
          className="absolute top-16 right-4 sm:right-6 z-40 w-72 sm:w-80 rounded-2xl p-5 border shadow-2xl space-y-4 animate-fadeIn"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Reading Experience
            </span>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Close
            </button>
          </div>

          {/* Page Turn Animation Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
              Page Turn Animation:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '3d-curl' as PageTurnMode, label: '3D Curl', desc: 'Google Play Books style' },
                { id: 'slide' as PageTurnMode, label: 'Slide', desc: 'Smooth swipe' },
                { id: 'tap' as PageTurnMode, label: 'Tap', desc: 'Instant flip' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onChangePageTurnMode(mode.id)}
                  className="p-2 rounded-xl text-center text-xs font-semibold transition-all border"
                  style={{
                    backgroundColor: pageTurnMode === mode.id ? 'var(--emerald-light)' : 'transparent',
                    borderColor: pageTurnMode === mode.id ? 'var(--emerald-border)' : 'var(--border-color)',
                    color: pageTurnMode === mode.id ? 'var(--emerald-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div>{mode.label}</div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
              {pageTurnMode === '3d-curl' 
                ? 'Realistic 3D mesh peel with cast shadows (compatible with PDFs & Books).' 
                : pageTurnMode === 'slide' 
                ? 'Horizontal smooth glide animation.' 
                : 'Zero-latency instant page transition.'}
            </p>
          </div>

          {/* Text Font Size Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[var(--text-primary)] mb-1">
              <span>Text Size</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="26"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[var(--emerald-primary)] cursor-pointer"
            />
          </div>

          {/* Orientation Mode */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Display Spread:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLandscape(false)}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg border"
                style={{
                  backgroundColor: !isLandscape ? 'var(--emerald-light)' : 'transparent',
                  borderColor: !isLandscape ? 'var(--emerald-border)' : 'var(--border-color)',
                  color: !isLandscape ? 'var(--emerald-primary)' : 'var(--text-secondary)'
                }}
              >
                Portrait (Single)
              </button>
              <button
                onClick={() => setIsLandscape(true)}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg border"
                style={{
                  backgroundColor: isLandscape ? 'var(--emerald-light)' : 'transparent',
                  borderColor: isLandscape ? 'var(--emerald-border)' : 'var(--border-color)',
                  color: isLandscape ? 'var(--emerald-primary)' : 'var(--text-secondary)'
                }}
              >
                Landscape (Spread)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Stage (3D Perspective Viewport) */}
      <main 
        className="reader-stage flex-1 flex items-center justify-center p-3 sm:p-8 relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.04) 0%, transparent 70%)'
        }}
      >
        {/* Left Page Turn Click Zone / Button */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="absolute left-2 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/10 dark:bg-white/10 hover:bg-[var(--emerald-primary)] hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Page Turn Click Zone / Button */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="absolute right-2 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/10 dark:bg-white/10 hover:bg-[var(--emerald-primary)] hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* The 3D Book Container */}
        <div 
          className="relative flex items-stretch max-w-5xl w-full h-[75vh] sm:h-[82vh] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--border-color)'
          }}
        >
          {/* Dual Page Center Spine Crease (In Landscape Mode) */}
          {isLandscape && <div className="book-spine-crease" />}

          {/* Left Page Sheet */}
          <div 
            className={`page-sheet flex-1 p-6 sm:p-12 flex flex-col justify-between overflow-y-auto select-text relative ${
              turningDirection === 'right' ? 'turn-right' : ''
            }`}
            style={{
              fontFamily: book.isPdf ? 'var(--font-sans)' : 'var(--font-serif)',
              fontSize: `${fontSize}px`,
              lineHeight: 1.75
            }}
          >
            {/* Header: Book Title / Chapter indicator */}
            <div className="flex justify-between items-center text-[11px] font-sans font-medium text-[var(--text-muted)] pb-4 border-b border-black/5 dark:border-white/5 select-none">
              <span className="truncate max-w-[200px]">{book.title}</span>
              <span>{book.isPdf ? 'PDF Vector View' : 'Chapter I'}</span>
            </div>

            {/* Page Content Body */}
            <div className="my-auto whitespace-pre-line py-4">
              {book.isPdf && (
                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 select-none">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Native Texture • 3D Curl Enabled</span>
                </div>
              )}
              {getPageText(leftPageNum)}
            </div>

            {/* Footer: Page Number */}
            <div className="flex justify-between items-center text-xs font-sans text-[var(--text-muted)] pt-4 border-t border-black/5 dark:border-white/5 select-none">
              <span>{Math.round(((leftPageNum) / totalPages) * 100)}%</span>
              <span className="font-semibold">{leftPageNum}</span>
            </div>
          </div>

          {/* Right Page Sheet (Only rendered in Landscape Mode) */}
          {isLandscape && (
            <div 
              className={`page-sheet flex-1 p-6 sm:p-12 flex flex-col justify-between overflow-y-auto select-text border-l border-black/10 dark:border-white/10 relative ${
                turningDirection === 'left' ? 'turn-left' : ''
              }`}
              style={{
                fontFamily: book.isPdf ? 'var(--font-sans)' : 'var(--font-serif)',
                fontSize: `${fontSize}px`,
                lineHeight: 1.75
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center text-[11px] font-sans font-medium text-[var(--text-muted)] pb-4 border-b border-black/5 dark:border-white/5 select-none">
                <span className="truncate max-w-[200px]">{book.author}</span>
                <span>{book.format.toUpperCase()}</span>
              </div>

              {/* Page Content Body */}
              <div className="my-auto whitespace-pre-line py-4">
                {rightPageNum ? (
                  getPageText(rightPageNum)
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-[var(--text-muted)] py-12 select-none">
                    <BookOpen className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm font-medium">End of Document</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs font-sans text-[var(--text-muted)] pt-4 border-t border-black/5 dark:border-white/5 select-none">
                <span className="font-semibold">{rightPageNum || '—'}</span>
                <span>{rightPageNum ? `${Math.round((rightPageNum / totalPages) * 100)}%` : '100%'}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Progress Scrub Bar */}
      <footer 
        className="px-4 sm:px-8 py-3 border-t flex items-center justify-between gap-4 text-xs font-medium z-20"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
        <span className="text-[var(--text-secondary)] whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </span>

        {/* Slider bar for quick seeking */}
        <div className="flex-1 max-w-lg mx-auto flex items-center gap-3">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="w-full h-1.5 rounded-full accent-[var(--emerald-primary)] cursor-pointer"
          />
        </div>

        <span className="font-semibold text-[var(--emerald-primary)] whitespace-nowrap">
          {progressPercent}% Complete
        </span>
      </footer>
    </div>
  );
};

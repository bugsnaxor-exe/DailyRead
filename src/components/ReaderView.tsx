import React, { useState, useEffect, useRef } from 'react';
import type { Book, PageTurnMode } from '../types';
import { 
  ArrowLeft, Settings, Maximize2, Minimize2, 
  FileText, Smartphone, Monitor, Sliders, Check
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
  const [isLandscape, setIsLandscape] = useState<boolean>(window.innerWidth > 850);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(18); // px
  const lineHeight = 1.75;
  const [turningDirection, setTurningDirection] = useState<'left' | 'right' | null>(null);

  // Real-time touch/mouse swipe and interactive drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [dragProgress, setDragProgress] = useState<number>(0);
  const dragStartXRef = useRef<number>(0);
  const isTouchActiveRef = useRef<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = book.contentPages.length > 0 ? book.contentPages.length : book.totalPages;

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > 850);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleTurnNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handleTurnPrev();
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
  }, [currentPage, totalPages, isSettingsOpen, isLandscape, pageTurnMode]);

  const handleTurnNext = () => {
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
      }, 240);
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + step));
    }
  };

  const handleTurnPrev = () => {
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
      }, 240);
    } else {
      setCurrentPage((prev) => Math.max(1, prev - step));
    }
  };

  const handlePointerDown = (clientX: number) => {
    dragStartXRef.current = clientX;
    isTouchActiveRef.current = true;
    setIsDragging(true);
    setDragOffset(0);
    setDragProgress(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isTouchActiveRef.current) return;
    const deltaX = clientX - dragStartXRef.current;
    setDragOffset(deltaX);

    const screenWidth = window.innerWidth || 800;
    const progress = Math.max(-1, Math.min(1, deltaX / (screenWidth * 0.45)));
    setDragProgress(progress);
  };

  const handlePointerUp = () => {
    if (!isTouchActiveRef.current) return;
    isTouchActiveRef.current = false;
    setIsDragging(false);

    if (dragProgress < -0.15 || dragOffset < -60) {
      handleTurnNext();
    } else if (dragProgress > 0.15 || dragOffset > 60) {
      handleTurnPrev();
    }

    setDragOffset(0);
    setDragProgress(0);
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

  const getPageText = (pageIndex: number) => {
    if (pageIndex < 1 || pageIndex > totalPages) return null;
    if (book.contentPages && book.contentPages[pageIndex - 1]) {
      return book.contentPages[pageIndex - 1];
    }
    return `Page ${pageIndex} of ${book.title}.\n\nDocument format: ${book.format.toUpperCase()}.\n\nSwipe your finger or mouse across the screen to turn pages smoothly with 3D paper curl physics.`;
  };

  const leftPageNum = currentPage;
  const rightPageNum = isLandscape && currentPage + 1 <= totalPages ? currentPage + 1 : null;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const dragRotation = pageTurnMode === '3d-curl' && isDragging 
    ? (dragProgress < 0 ? dragProgress * 80 : dragProgress * 80)
    : 0;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden touch-none"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => isDragging && handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
    >
      {/* Top Header Bar */}
      <header 
        className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b transition-colors z-20 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleExit}
            aria-label="Back to library"
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] transition-colors active:scale-95 cursor-pointer text-[var(--text-primary)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-serif font-bold truncate">
              {book.title}
            </h1>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate flex items-center gap-1.5">
              <span>{book.author}</span>
              <span>•</span>
              <span className="uppercase font-semibold text-[var(--emerald-primary)]">
                {book.isPdf ? 'PDF (3D Curl)' : book.format}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsLandscape(!isLandscape)}
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            title={isLandscape ? "Switch to Portrait (Single Page)" : "Switch to Landscape (2-Page Spread)"}
          >
            {isLandscape ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSettingsOpen ? 'bg-[var(--emerald-light)] text-[var(--emerald-primary)]' : 'hover:bg-[var(--cream-accent)] text-[var(--text-secondary)]'
            }`}
            title="Page Turn & Reading Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] transition-colors cursor-pointer hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Reading Experience Settings Drawer */}
      {isSettingsOpen && (
        <div 
          className="absolute top-16 right-4 sm:right-6 z-40 w-72 sm:w-84 rounded-2xl p-5 border shadow-2xl space-y-4 animate-fadeIn"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--emerald-border)',
            boxShadow: 'var(--shadow-lg)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              <Sliders className="w-3.5 h-3.5 text-[var(--emerald-primary)]" />
              <span>Page Turn & Reader Settings</span>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Done
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
              Page Turning Style:
            </label>
            <div className="space-y-1.5">
              {[
                { 
                  id: '3d-curl' as PageTurnMode, 
                  title: '3D Page Curl', 
                  desc: 'Swipe/drag across screen with realistic curling paper mesh & shadows (Google Play Books style)' 
                },
                { 
                  id: 'slide' as PageTurnMode, 
                  title: 'Smooth Slide', 
                  desc: 'Horizontal swipe glide' 
                },
                { 
                  id: 'tap' as PageTurnMode, 
                  title: 'Tap to Turn', 
                  desc: 'Tap screen edge for instant page turn' 
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => onChangePageTurnMode(item.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    pageTurnMode === item.id 
                      ? 'bg-[var(--emerald-light)] border-[var(--emerald-primary)]' 
                      : 'border-[var(--border-color)] hover:bg-[var(--cream-accent)]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block" style={{ color: pageTurnMode === item.id ? 'var(--emerald-primary)' : 'var(--text-primary)' }}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] leading-tight block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                  {pageTurnMode === item.id && (
                    <Check className="w-4 h-4 text-[var(--emerald-primary)] flex-shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between text-xs font-semibold text-[var(--text-primary)] mb-1">
              <span>Text Size</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[var(--emerald-primary)] cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Reading Spread:
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsLandscape(false)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  !isLandscape ? 'bg-[var(--emerald-light)] text-[var(--emerald-primary)] border-[var(--emerald-border)]' : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}
              >
                Portrait (1 Page)
              </button>
              <button
                type="button"
                onClick={() => setIsLandscape(true)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  isLandscape ? 'bg-[var(--emerald-light)] text-[var(--emerald-primary)] border-[var(--emerald-border)]' : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}
              >
                Landscape (2 Pages)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Stage */}
      <main 
        className="reader-stage flex-1 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5, 150, 105, 0.03) 0%, transparent 70%)'
        }}
      >
        <div 
          onClick={handleTurnPrev}
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-20 cursor-w-resize"
          title="Tap or swipe right to turn back"
        />
        <div 
          onClick={handleTurnNext}
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-20 cursor-e-resize"
          title="Tap or swipe left to turn forward"
        />

        {/* 3D Book Container */}
        <div 
          className="relative flex items-stretch max-w-4xl w-full h-[76vh] sm:h-[80vh] rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
          style={{
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border-color)',
            transform: `perspective(2000px) rotateY(${dragRotation * 0.1}deg)`
          }}
        >
          {isLandscape && <div className="book-spine-crease" />}

          {/* Left Page Sheet */}
          <div 
            className={`page-sheet flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto select-text relative ${
              turningDirection === 'right' ? 'turn-right' : ''
            }`}
            style={{
              fontFamily: book.isPdf ? 'var(--font-sans)' : 'var(--font-serif)',
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              transform: isDragging && dragProgress > 0 ? `rotateY(${dragProgress * 30}deg)` : undefined
            }}
          >
            <div className="flex justify-between items-center text-[10px] font-sans font-medium text-[var(--text-muted)] pb-3 border-b border-black/5 dark:border-white/5 select-none">
              <span className="truncate max-w-[200px]">{book.title}</span>
              <span>{book.isPdf ? 'PDF Vector Page' : 'Chapter Content'}</span>
            </div>

            <div className="my-auto whitespace-pre-line py-3">
              {book.isPdf && (
                <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 select-none">
                  <FileText className="w-3 h-3" />
                  <span>PDF Document • 3D Swipe Curl</span>
                </div>
              )}
              {getPageText(leftPageNum)}
            </div>

            <div className="flex justify-between items-center text-[11px] font-sans text-[var(--text-muted)] pt-3 border-t border-black/5 dark:border-white/5 select-none">
              <span>{Math.round(((leftPageNum) / totalPages) * 100)}%</span>
              <span className="font-semibold">{leftPageNum}</span>
            </div>
          </div>

          {/* Right Page Sheet */}
          {isLandscape && (
            <div 
              className={`page-sheet flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto select-text border-l border-black/5 dark:border-white/5 relative ${
                turningDirection === 'left' ? 'turn-left' : ''
              }`}
              style={{
                fontFamily: book.isPdf ? 'var(--font-sans)' : 'var(--font-serif)',
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                transform: isDragging && dragProgress < 0 ? `rotateY(${dragProgress * 30}deg)` : undefined
              }}
            >
              <div className="flex justify-between items-center text-[10px] font-sans font-medium text-[var(--text-muted)] pb-3 border-b border-black/5 dark:border-white/5 select-none">
                <span className="truncate max-w-[200px]">{book.author}</span>
                <span>{book.format.toUpperCase()}</span>
              </div>

              <div className="my-auto whitespace-pre-line py-3">
                {rightPageNum ? (
                  getPageText(rightPageNum)
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-[var(--text-muted)] py-10 select-none">
                    <p className="text-xs font-medium">End of Document</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[11px] font-sans text-[var(--text-muted)] pt-3 border-t border-black/5 dark:border-white/5 select-none">
                <span className="font-semibold">{rightPageNum || '—'}</span>
                <span>{rightPageNum ? `${Math.round((rightPageNum / totalPages) * 100)}%` : '100%'}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Scrub Bar */}
      <footer 
        className="px-4 sm:px-8 py-2.5 border-t flex items-center justify-between gap-4 text-xs font-medium z-20"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
        <span className="text-[var(--text-secondary)] whitespace-nowrap text-[11px]">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex-1 max-w-md mx-auto flex items-center gap-3">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="w-full h-1 rounded-full accent-[var(--emerald-primary)] cursor-pointer"
          />
        </div>

        <span className="font-semibold text-[var(--emerald-primary)] whitespace-nowrap text-[11px]">
          {progressPercent}%
        </span>
      </footer>
    </div>
  );
};

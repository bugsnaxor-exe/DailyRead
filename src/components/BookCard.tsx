import React from 'react';
import type { Book } from '../types';
import { Heart, CheckCircle2, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpen: (book: Book) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleFinished: (id: string, e: React.MouseEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpen,
  onToggleFavorite,
  onToggleFinished
}) => {
  const formatUpper = book.format.toUpperCase();
  const progressPercent = Math.min(
    100, 
    Math.round((book.currentPage / (book.totalPages || 1)) * 100)
  );

  return (
    <div 
      onClick={() => onOpen(book)}
      className="book-card-item group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border hover:border-[var(--emerald-primary)] hover:shadow-lg bg-[var(--bg-card)]"
      style={{
        borderColor: 'var(--border-color)',
        minHeight: '140px'
      }}
    >
      {/* Left Column: Title, Author, Type & Size, and Action SVGs */}
      <div className="flex-1 pr-4 sm:pr-5 flex flex-col justify-between self-stretch min-w-0">
        <div>
          {/* Document Format Tag & Progress */}
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase"
              style={{
                backgroundColor: 'var(--emerald-light)',
                color: 'var(--emerald-primary)'
              }}
            >
              {book.isPdf ? 'PDF DOCUMENT' : formatUpper}
            </span>

            {book.currentPage > 1 && !book.isFinished && (
              <span 
                className="text-[11px] font-semibold"
                style={{ color: 'var(--emerald-primary)' }}
              >
                {progressPercent}% completed
              </span>
            )}
          </div>

          {/* Book Title (Spacious, 2-line clamp, never cut off awkwardly) */}
          <h3 
            className="text-base sm:text-lg font-serif font-bold leading-snug line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--emerald-primary)] transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author Name */}
          <p 
            className="text-xs sm:text-sm font-medium mt-1 truncate text-[var(--text-secondary)]"
          >
            {book.author}
          </p>

          {/* Document Type & Size comma-separated */}
          <p 
            className="text-xs font-medium mt-1 text-[var(--text-muted)]"
          >
            {formatUpper}, {book.size}
          </p>
        </div>

        {/* Action SVG Buttons Row (Favorite & Already Read) */}
        <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-black/5 dark:border-white/5">
          {/* Favorite SVG Toggle Button */}
          <button
            type="button"
            aria-label={book.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            onClick={(e) => onToggleFavorite(book.id, e)}
            className="w-8 h-8 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border cursor-pointer"
            style={{
              backgroundColor: book.isFavorite ? 'var(--emerald-light)' : 'transparent',
              borderColor: book.isFavorite ? 'var(--emerald-border)' : 'var(--border-color)'
            }}
            title={book.isFavorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart 
              className="w-4 h-4 transition-colors"
              style={{
                color: book.isFavorite ? 'var(--emerald-primary)' : 'var(--text-muted)',
                fill: book.isFavorite ? 'var(--emerald-primary)' : 'none'
              }}
            />
          </button>

          {/* Already Done Reading SVG Toggle Button */}
          <button
            type="button"
            aria-label={book.isFinished ? 'Mark as unread' : 'Mark as already done reading'}
            onClick={(e) => onToggleFinished(book.id, e)}
            className="w-8 h-8 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border cursor-pointer"
            style={{
              backgroundColor: book.isFinished ? 'var(--emerald-light)' : 'transparent',
              borderColor: book.isFinished ? 'var(--emerald-border)' : 'var(--border-color)'
            }}
            title={book.isFinished ? 'Finished' : 'Mark as Done Reading'}
          >
            <CheckCircle2 
              className="w-4 h-4 transition-colors"
              style={{
                color: book.isFinished ? 'var(--emerald-primary)' : 'var(--text-muted)',
                fill: book.isFinished ? 'var(--emerald-light)' : 'none'
              }}
            />
          </button>

          {/* Mini Reading Progress Bar */}
          {book.currentPage > 1 && !book.isFinished && (
            <div 
              className="flex-1 max-w-[100px] h-1.5 rounded-full overflow-hidden ml-2 hidden sm:block"
              style={{ backgroundColor: 'var(--cream-accent)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--emerald-primary)'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column: 3D Book Cover / Wallpaper */}
      <div className="book-cover-container flex-shrink-0 self-center">
        <div 
          className="book-cover-3d w-20 h-28 sm:w-24 sm:h-34 rounded-md overflow-hidden flex flex-col justify-between p-2 text-white relative select-none"
          style={{
            backgroundColor: book.coverColor || '#059669',
            backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : `linear-gradient(135deg, ${book.coverColor || '#059669'} 0%, #064E3B 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle Spine Texture */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

          {/* Cover Art Typography */}
          <div className="z-10 mt-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-200 block truncate">
              {formatUpper}
            </span>
            <span className="text-[11px] font-serif font-bold line-clamp-2 leading-tight mt-1 text-white/95 drop-shadow-sm">
              {book.title}
            </span>
          </div>

          <div className="z-10 flex items-center justify-between text-[9px] text-emerald-100/80 pt-1 border-t border-white/20">
            <span className="truncate max-w-[50px]">{book.author.split(' ')[0]}</span>
            <BookOpen className="w-3 h-3 opacity-80 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

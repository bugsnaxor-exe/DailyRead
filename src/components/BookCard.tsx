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
      className="book-card-item group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 border hover:border-[var(--emerald-primary)] hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        minHeight: '112px'
      }}
    >
      {/* Left Column: Title, Author, Type & Size, SVG buttons */}
      <div className="flex-1 pr-3 sm:pr-4 flex flex-col justify-between h-full min-w-0">
        <div>
          {/* Format Badge & Progress */}
          <div className="flex items-center gap-1.5 mb-1">
            <span 
              className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase"
              style={{
                backgroundColor: 'var(--emerald-light)',
                color: 'var(--emerald-primary)'
              }}
            >
              {book.isPdf ? 'PDF' : formatUpper}
            </span>

            {book.currentPage > 1 && !book.isFinished && (
              <span 
                className="text-[10px] font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {progressPercent}%
              </span>
            )}
          </div>

          {/* Book Title */}
          <h3 
            className="text-sm font-bold leading-tight truncate text-[var(--text-primary)] group-hover:text-[var(--emerald-primary)] transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author Name */}
          <p 
            className="text-xs font-medium mt-0.5 truncate text-[var(--text-secondary)]"
          >
            {book.author}
          </p>

          {/* Document Type & Size (Comma Separated) */}
          <p 
            className="text-[11px] font-medium mt-1 text-[var(--text-muted)]"
          >
            {formatUpper}, {book.size}
          </p>
        </div>

        {/* Action SVG Buttons Row (Favorite & Already Read) */}
        <div className="flex items-center gap-2 mt-2 pt-1">
          {/* Favorite SVG Toggle */}
          <button
            type="button"
            aria-label={book.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            onClick={(e) => onToggleFavorite(book.id, e)}
            className="w-7 h-7 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border cursor-pointer"
            style={{
              backgroundColor: book.isFavorite ? 'var(--emerald-light)' : 'transparent',
              borderColor: book.isFavorite ? 'var(--emerald-border)' : 'var(--border-color)'
            }}
          >
            <Heart 
              className="w-3.5 h-3.5 transition-colors"
              style={{
                color: book.isFavorite ? 'var(--emerald-primary)' : 'var(--text-muted)',
                fill: book.isFavorite ? 'var(--emerald-primary)' : 'none'
              }}
            />
          </button>

          {/* Already Done Reading SVG Toggle */}
          <button
            type="button"
            aria-label={book.isFinished ? 'Mark as unread' : 'Mark as already done reading'}
            onClick={(e) => onToggleFinished(book.id, e)}
            className="w-7 h-7 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border cursor-pointer"
            style={{
              backgroundColor: book.isFinished ? 'var(--emerald-light)' : 'transparent',
              borderColor: book.isFinished ? 'var(--emerald-border)' : 'var(--border-color)'
            }}
          >
            <CheckCircle2 
              className="w-3.5 h-3.5 transition-colors"
              style={{
                color: book.isFinished ? 'var(--emerald-primary)' : 'var(--text-muted)',
                fill: book.isFinished ? 'var(--emerald-light)' : 'none'
              }}
            />
          </button>

          {/* Read Progress Mini Bar */}
          {book.currentPage > 1 && !book.isFinished && (
            <div 
              className="flex-1 max-w-[80px] h-1 rounded-full overflow-hidden ml-1 hidden sm:block"
              style={{ backgroundColor: 'var(--cream-accent)' }}
            >
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--emerald-accent)'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Compact 3D Book Cover Wallpaper */}
      <div className="book-cover-container flex-shrink-0">
        <div 
          className="book-cover-3d w-14 h-20 sm:w-16 sm:h-22 rounded overflow-hidden flex flex-col justify-between p-1.5 text-white relative select-none"
          style={{
            backgroundColor: book.coverColor || '#059669',
            backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : `linear-gradient(135deg, ${book.coverColor || '#059669'} 0%, #064E3B 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle Spine Texture */}
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />

          {/* Cover Art Text */}
          <div className="z-10 mt-0.5">
            <span className="text-[8px] uppercase font-bold tracking-wider text-emerald-200 block truncate">
              {formatUpper}
            </span>
            <span className="text-[9px] font-serif font-bold line-clamp-2 leading-tight mt-0.5 text-white/95 drop-shadow-sm">
              {book.title}
            </span>
          </div>

          <div className="z-10 flex items-center justify-between text-[8px] text-emerald-100/70 pt-0.5 border-t border-white/20">
            <span className="truncate max-w-[36px]">{book.author.split(' ')[0]}</span>
            <BookOpen className="w-2.5 h-2.5 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

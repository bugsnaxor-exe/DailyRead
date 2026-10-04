import React, { useState } from 'react';
import type { Book, ShelfType } from '../types';
import { BookCard } from './BookCard';
import { Filter, Plus, UploadCloud } from 'lucide-react';

interface ShelfViewProps {
  shelf: ShelfType;
  books: Book[];
  searchQuery: string;
  onOpenBook: (book: Book) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleFinished: (id: string, e: React.MouseEvent) => void;
  onTriggerAdd: () => void;
}

export const ShelfView: React.FC<ShelfViewProps> = ({
  shelf,
  books,
  searchQuery,
  onOpenBook,
  onToggleFavorite,
  onToggleFinished,
  onTriggerAdd
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Filter books based on shelf
  let filtered = books.filter((book) => {
    if (shelf === 'currently_reading') {
      return (book.currentPage > 1 && !book.isFinished) || (book.lastReadDate && !book.isFinished);
    }
    if (shelf === 'favorites') {
      return book.isFavorite;
    }
    if (shelf === 'already_read') {
      return book.isFinished || book.currentPage >= book.totalPages;
    }
    return true;
  });

  // Sort Currently Reading by latest read date
  if (shelf === 'currently_reading') {
    filtered.sort((a, b) => {
      const timeA = a.lastReadDate ? new Date(a.lastReadDate).getTime() : 0;
      const timeB = b.lastReadDate ? new Date(b.lastReadDate).getTime() : 0;
      return timeB - timeA;
    });
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((b) => 
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.format.toLowerCase().includes(q) ||
      (b.isPdf && 'pdf'.includes(q))
    );
  }

  // Filter by format chip
  if (selectedFormat !== 'all') {
    filtered = filtered.filter((b) => {
      if (selectedFormat === 'pdf') return b.isPdf || b.format === 'pdf';
      if (selectedFormat === 'ebooks') return ['epub', 'mobi', 'azw3', 'kindle', 'fb2', 'book'].includes(b.format);
      if (selectedFormat === 'office') return ['doc', 'docx', 'rtf', 'odt', 'txt'].includes(b.format);
      if (selectedFormat === 'comics') return ['cbr', 'cbz'].includes(b.format);
      return b.format === selectedFormat;
    });
  }

  const formatChips = [
    { id: 'all', label: 'All Formats' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'ebooks', label: 'EPUB & Kindle' },
    { id: 'office', label: 'Word & Text' },
    { id: 'comics', label: 'Comics (CBR/CBZ)' }
  ];

  const getShelfTitle = () => {
    switch (shelf) {
      case 'currently_reading':
        return 'Currently Reading';
      case 'favorites':
        return 'Favorites';
      case 'already_read':
        return 'Already Read';
      case 'all':
      default:
        return 'Books & Documents';
    }
  };

  const getShelfDescription = () => {
    switch (shelf) {
      case 'currently_reading':
        return 'Documents with active reading progress, ordered by most recently opened.';
      case 'favorites':
        return 'Your favorite books and marked documents.';
      case 'already_read':
        return 'Books and documents you have finished reading.';
      case 'all':
      default:
        return 'All documents and books indexed from your device.';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Shelf Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b gap-3" style={{ borderColor: 'var(--border-color)' }}>
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
            {getShelfTitle()}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {getShelfDescription()}
          </p>
        </div>

        <span 
          className="text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto" 
          style={{ backgroundColor: 'var(--emerald-light)', color: 'var(--emerald-primary)' }}
        >
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Format Filter Pills (Shown when there are books) */}
      {shelf === 'all' && books.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          {formatChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedFormat(chip.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer"
              style={{
                backgroundColor: selectedFormat === chip.id ? 'var(--emerald-primary)' : 'var(--bg-card)',
                color: selectedFormat === chip.id ? '#FFFFFF' : 'var(--text-secondary)',
                borderColor: selectedFormat === chip.id ? 'var(--emerald-primary)' : 'var(--border-color)'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Books Card List / Spacious Responsive Grid (2 to 3 columns on desktop for optimal reading width) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpen={onOpenBook}
              onToggleFavorite={onToggleFavorite}
              onToggleFinished={onToggleFinished}
            />
          ))}
        </div>
      ) : (
        /* Clean Empty State with Drag-and-Drop Dropzone */
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const input = document.getElementById('book-upload-input') as HTMLInputElement;
              if (input) {
                input.files = e.dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          }}
          className={`rounded-3xl p-10 sm:p-16 text-center border-2 border-dashed flex flex-col items-center justify-center my-6 transition-all duration-200 ${
            isDragOver ? 'border-[var(--emerald-primary)] bg-[var(--emerald-light)]' : 'border-[var(--border-color)] bg-[var(--bg-card)]'
          }`}
        >
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-[var(--emerald-primary)] shadow-sm"
            style={{ backgroundColor: 'var(--emerald-light)' }}
          >
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            {shelf === 'currently_reading' ? 'No books currently in progress' :
             shelf === 'favorites' ? 'No favorite books yet' :
             shelf === 'already_read' ? 'No completed books yet' :
             'Your library is ready for documents'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mb-6 leading-relaxed">
            {shelf === 'all' 
              ? 'Books stay on your device. Click the button below or drop files here to add EPUB, PDF, Kindle, MOBI, DOCX, or comic files.'
              : 'Open any book or document from your device to begin reading.'}
          </p>

          <button
            type="button"
            onClick={onTriggerAdd}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: 'var(--emerald-primary)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Select Document from Device</span>
          </button>
        </div>
      )}
    </div>
  );
};

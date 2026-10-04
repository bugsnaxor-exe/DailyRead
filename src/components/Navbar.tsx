import React from 'react';
import type { ShelfType, ThemeMode } from '../types';
import { Sun, Moon, Search, BookMarked, BookmarkCheck, Library, Clock } from 'lucide-react';

interface NavbarProps {
  currentShelf: ShelfType;
  onSelectShelf: (shelf: ShelfType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    currentlyReading: number;
    all: number;
    favorites: number;
    alreadyRead: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentShelf,
  onSelectShelf,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  counts
}) => {
  const tabs = [
    {
      id: 'currently_reading' as ShelfType,
      label: 'Currently Reading',
      icon: Clock,
      count: counts.currentlyReading
    },
    {
      id: 'all' as ShelfType,
      label: 'Books & Documents',
      icon: Library,
      count: counts.all
    },
    {
      id: 'favorites' as ShelfType,
      label: 'Favorites',
      icon: BookMarked,
      count: counts.favorites
    },
    {
      id: 'already_read' as ShelfType,
      label: 'Already Read',
      icon: BookmarkCheck,
      count: counts.alreadyRead
    }
  ];

  return (
    <header 
      className="sticky top-0 z-30 transition-colors duration-200 border-b"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-white text-lg shadow-sm"
              style={{
                backgroundColor: 'var(--emerald-primary)'
              }}
            >
              V
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                Verdant<span style={{ color: 'var(--emerald-primary)' }}>Reader</span>
              </span>
              <span className="block text-[11px] font-medium tracking-wide uppercase text-[var(--text-muted)]">
                Universal Shelf & Reader
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title, author, or format..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl outline-none transition-all border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Right Controls: Light / Dark Mode Toggle only */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl transition-all duration-200 border hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light Cream Mode' : 'Switch to Dark Emerald Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs (Currently Reading, Books & Documents, Favorites, Already Read) */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentShelf === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectShelf(tab.id)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--emerald-primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-bold ml-1"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--cream-accent)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

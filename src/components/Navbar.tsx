import React, { useState, useRef, useEffect } from 'react';
import type { ShelfType, ThemeMode, UpdateState } from '../types';
import { UpdateDropdown } from './UpdateDropdown';
import { Sun, Moon, Search, BookMarked, BookmarkCheck, Library, Clock, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentShelf: ShelfType;
  onSelectShelf: (shelf: ShelfType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  updateState: UpdateState;
  onApplyUpdate: (newVersion: string) => void;
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
  updateState,
  onApplyUpdate,
  counts
}) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUpdateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
        <div className="flex items-center justify-between h-15 sm:h-18 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-white text-base shadow-sm"
              style={{
                backgroundColor: 'var(--emerald-primary)'
              }}
            >
              V
            </div>
            <div>
              <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)]">
                Verdant<span style={{ color: 'var(--emerald-primary)' }}>Reader</span>
              </span>
              <span className="block text-[10px] font-medium tracking-wide uppercase text-[var(--text-muted)]">
                Universal Shelf & Reader
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title, author, or format..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm rounded-xl outline-none transition-all border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Upper Right Corner Controls: Update notification & Theme Switcher */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            {/* Upper Right Update Notification Icon */}
            {updateState.hasUpdate && (
              <button
                type="button"
                onClick={() => setIsUpdateOpen(!isUpdateOpen)}
                className="relative p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: isUpdateOpen ? 'var(--emerald-light)' : 'var(--bg-card)',
                  borderColor: isUpdateOpen ? 'var(--emerald-border)' : 'var(--border-color)',
                  color: 'var(--emerald-primary)'
                }}
                title={`New update v${updateState.latestRelease?.version} available. Tap to view.`}
              >
                <Sparkles className="w-4 h-4" />
                {/* Emerald pulse notification dot */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--emerald-primary)] ring-2 ring-[var(--bg-primary)] animate-pulse" />
              </button>
            )}

            {/* Dropdown Menu attached to the Upper Right Corner */}
            <UpdateDropdown
              isOpen={isUpdateOpen}
              onClose={() => setIsUpdateOpen(false)}
              updateState={updateState}
              onApplyUpdate={onApplyUpdate}
            />

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl transition-all duration-200 border hover:scale-105 active:scale-95 cursor-pointer"
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
                <Moon className="w-4 h-4 text-emerald-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-2.5 md:hidden">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl outline-none border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs (Currently Reading, Books & Documents, Favorites, Already Read) */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar pb-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentShelf === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectShelf(tab.id)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'var(--emerald-primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span 
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5"
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

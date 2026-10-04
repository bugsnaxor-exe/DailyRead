import React from 'react';
import type { PageTurnMode, UpdateState } from '../types';
import { X, RefreshCw, Sparkles, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageTurnMode: PageTurnMode;
  onChangePageTurnMode: (mode: PageTurnMode) => void;
  updateState: UpdateState;
  onTriggerCheckUpdate: () => void;
  onResetLibrary: () => void;
  onToggleSimulateMandatory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pageTurnMode,
  onChangePageTurnMode,
  updateState,
  onTriggerCheckUpdate,
  onResetLibrary,
  onToggleSimulateMandatory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-reader animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative space-y-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--emerald-light)] text-[var(--emerald-primary)] flex items-center justify-center font-bold text-sm">
              ⚙
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold">
              Application Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--cream-accent)] text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Turn Mode Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Default Page Turn Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '3d-curl' as PageTurnMode, label: '3D Curl', desc: 'Google Play Books style' },
              { id: 'slide' as PageTurnMode, label: 'Slide', desc: 'Horizontal sweep' },
              { id: 'tap' as PageTurnMode, label: 'Tap', desc: 'Instant page flip' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onChangePageTurnMode(item.id)}
                className="p-3 rounded-2xl border text-center transition-all"
                style={{
                  backgroundColor: pageTurnMode === item.id ? 'var(--emerald-light)' : 'transparent',
                  borderColor: pageTurnMode === item.id ? 'var(--emerald-border)' : 'var(--border-color)',
                  color: pageTurnMode === item.id ? 'var(--emerald-primary)' : 'var(--text-secondary)'
                }}
              >
                <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* In-App Auto-Update & GitHub Section */}
        <div 
          className="p-4 rounded-2xl border space-y-3"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--emerald-primary)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                In-App Updates & Releases
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--text-secondary)]">
              v{updateState.currentVersion}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Connected to automated GitHub Release feed. Updates are <strong>cumulative</strong> (skipping intermediate versions updates directly to the latest) and become <strong>mandatory</strong> after 60 days.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onTriggerCheckUpdate}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              style={{ backgroundColor: 'var(--emerald-primary)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check for Updates Now</span>
            </button>

            <button
              onClick={onToggleSimulateMandatory}
              className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-[var(--text-secondary)] hover:bg-[var(--cream-accent)]"
              style={{ borderColor: 'var(--border-color)' }}
              title="Toggle 60-day expiration simulation"
            >
              {updateState.isMandatory ? 'Set Voluntary Mode' : 'Test Mandatory Mode (>60 Days)'}
            </button>
          </div>
        </div>

        {/* Reset Data Option */}
        <div className="pt-2 flex justify-between items-center text-xs text-[var(--text-muted)] border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span>Reset library to sample books & documents</span>
          <button
            onClick={onResetLibrary}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-600 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Library</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { UpdateState } from '../types';
import { Sparkles, Check, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface UpdateDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  updateState: UpdateState;
  onApplyUpdate: (newVersion: string) => void;
}

export const UpdateDropdown: React.FC<UpdateDropdownProps> = ({
  isOpen,
  onClose,
  updateState,
  onApplyUpdate
}) => {
  const { latestRelease, currentVersion } = updateState;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen || !latestRelease) return null;

  const handleStartUpdate = () => {
    setIsDownloading(true);
    setDownloadProgress(8);
    setStatusMessage('Downloading cumulative update package...');

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setStatusMessage('Installing & restarting...');
          setTimeout(() => {
            onApplyUpdate(latestRelease.version);
            onClose();
          }, 1000);
          return 100;
        }
        if (prev === 30) setStatusMessage('Unpacking 3D page curl modules...');
        if (prev === 70) setStatusMessage('Preserving library & settings...');
        return prev + Math.floor(Math.random() * 10 + 6);
      });
    }, 180);
  };

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl p-5 border shadow-2xl z-50 animate-fadeIn transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--emerald-border)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--emerald-light)] text-[var(--emerald-primary)] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              App Update Available
            </h4>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              v{currentVersion} → v{latestRelease.version}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--cream-accent)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
        {latestRelease.title}. Cumulative update: all new features are installed at once.
      </p>

      {/* Release Notes */}
      <div 
        className="p-2.5 rounded-xl mb-4 max-h-28 overflow-y-auto space-y-1 border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)'
        }}
      >
        {latestRelease.notes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[var(--text-secondary)]">
            <Check className="w-3 h-3 text-[var(--emerald-accent)] flex-shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar (during download) */}
      {isDownloading ? (
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-[var(--emerald-primary)]">
              <RefreshCw className="w-3 h-3 animate-spin" />
              {statusMessage}
            </span>
            <span>{downloadProgress}%</span>
          </div>

          <div 
            className="w-full h-2 rounded-full overflow-hidden border p-0.5"
            style={{
              backgroundColor: 'var(--cream-accent)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div 
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${downloadProgress}%`,
                backgroundColor: 'var(--emerald-primary)'
              }}
            />
          </div>
        </div>
      ) : (
        /* Action Buttons: Install Update & Do Later */
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Do Later
          </button>

          <button
            type="button"
            onClick={handleStartUpdate}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: 'var(--emerald-primary)'
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Install ({latestRelease.downloadSize})</span>
          </button>
        </div>
      )}
    </div>
  );
};

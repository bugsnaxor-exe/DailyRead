import React, { useState } from 'react';
import type { UpdateState } from '../types';
import { Sparkles, Check, ShieldCheck, RefreshCw, X, Clock } from 'lucide-react';

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
          setStatusMessage('Installing & restarting in-place...');
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
      className="absolute right-0 top-full mt-2.5 w-84 sm:w-96 rounded-2xl p-5 border shadow-2xl z-50 animate-fadeIn transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--emerald-border)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--emerald-light)] text-[var(--emerald-primary)] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Updated App Available
            </h4>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              v{currentVersion} → v{latestRelease.version}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--cream-accent)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
        {latestRelease.title}. All updates are cumulative and will be applied at once in-place.
      </p>

      {/* Release Notes */}
      <div 
        className="p-3 rounded-xl mb-4 max-h-32 overflow-y-auto space-y-1.5 border"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)'
        }}
      >
        {latestRelease.notes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
            <Check className="w-3.5 h-3.5 text-[var(--emerald-accent)] flex-shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar during download */}
      {isDownloading ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[var(--emerald-primary)]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
        /* Action Buttons */
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all hover:bg-[var(--cream-accent)] text-[var(--text-secondary)] cursor-pointer flex items-center justify-center gap-1.5"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Update Later</span>
          </button>

          <button
            type="button"
            onClick={handleStartUpdate}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: 'var(--emerald-primary)'
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Install Updated App</span>
          </button>
        </div>
      )}
    </div>
  );
};

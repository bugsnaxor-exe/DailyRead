import React, { useState } from 'react';
import type { UpdateState } from '../types';
import { Sparkles, Check, ArrowRight, AlertTriangle, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface UpdateModalProps {
  updateState: UpdateState;
  onDismiss: () => void;
  onApplyUpdate: (newVersion: string) => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  updateState,
  onDismiss,
  onApplyUpdate
}) => {
  const { latestRelease, isMandatory, currentVersion } = updateState;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  if (!latestRelease) return null;

  // Calculate days since release
  const releaseDateObj = new Date(latestRelease.releaseDate);
  const daysOld = Math.floor((Date.now() - releaseDateObj.getTime()) / (1000 * 60 * 60 * 24));

  const handleStartUpdate = () => {
    setIsDownloading(true);
    setDownloadProgress(5);
    setStatusMessage('Connecting to GitHub Releases & fetching full cumulative package...');

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setStatusMessage('Installing package & updating in-place...');
          setTimeout(() => {
            onApplyUpdate(latestRelease.version);
          }, 1200);
          return 100;
        }
        if (prev === 25) setStatusMessage('Downloading assets & new 3D reader modules...');
        if (prev === 65) setStatusMessage('Verifying package integrity & preserving your library...');
        if (prev === 85) setStatusMessage('Finalizing Android APK / Desktop bundle installation...');
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-reader animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: isMandatory ? 'var(--emerald-accent)' : 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Subtle decorative gradient pill in header */}
        <div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{
            background: isMandatory 
              ? 'linear-gradient(90deg, #F59E0B, #10B981)' 
              : 'linear-gradient(90deg, var(--emerald-primary), var(--emerald-accent))'
          }}
        />

        {/* Close Button (ONLY visible if NOT mandatory) */}
        {!isMandatory && !isDownloading && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss update for now"
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--cream-accent)] transition-colors text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              backgroundColor: isMandatory ? '#0F5132' : 'var(--emerald-primary)'
            }}
          >
            {isMandatory ? (
              <AlertTriangle className="w-6 h-6 text-emerald-300" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[var(--emerald-light)] text-[var(--emerald-primary)]">
                Cumulative Update
              </span>
              {isMandatory && (
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  Mandatory (60+ Days Old)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold mt-1">
              New Update Available
            </h2>
          </div>
        </div>

        {/* Version Migration Pill (e.g. v2.3.0 -> v2.4.0) */}
        <div 
          className="flex items-center justify-between p-3.5 rounded-2xl mb-4 text-xs sm:text-sm font-semibold border"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Installed</span>
            <span>v{currentVersion}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--emerald-accent)]" />
          <div className="text-right">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Target Version</span>
            <span className="text-[var(--emerald-primary)] font-bold">v{latestRelease.version}</span>
          </div>
        </div>

        {/* Mandatory Warning Note if > 2 months */}
        {isMandatory && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
            <strong>Mandatory Update Notice:</strong> This version is {daysOld} days old (exceeds the 60-day support window). To ensure document stability, PDF engine compatibility, and security, updating is required to proceed.
          </div>
        )}

        {/* Cumulative Notice */}
        <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
          This update installs all intermediate improvements, fixes, and formats directly in a single pass. Your library, bookmarks, and reading history are safe.
        </p>

        {/* Release Notes */}
        <div 
          className="p-3.5 rounded-2xl mb-6 max-h-36 overflow-y-auto border space-y-1.5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)'
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            What's New in v{latestRelease.version}:
          </p>
          {latestRelease.notes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
              <Check className="w-3.5 h-3.5 text-[var(--emerald-accent)] flex-shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>

        {/* Download & Installation Progress Bar (if active) */}
        {isDownloading ? (
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[var(--emerald-primary)]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {statusMessage}
              </span>
              <span>{downloadProgress}%</span>
            </div>

            <div 
              className="w-full h-3 rounded-full overflow-hidden border p-0.5"
              style={{
                backgroundColor: 'var(--cream-accent)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${downloadProgress}%`,
                  background: 'linear-gradient(90deg, var(--emerald-primary), var(--emerald-accent))'
                }}
              />
            </div>
            <p className="text-[11px] text-center text-[var(--text-muted)]">
              Please wait while the app updates in-place...
            </p>
          </div>
        ) : (
          /* Action Buttons */
          <div className="flex items-center gap-3">
            {!isMandatory && (
              <button
                type="button"
                onClick={onDismiss}
                className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border hover:bg-[var(--cream-accent)] text-[var(--text-secondary)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Later (Stay on v{currentVersion})
              </button>
            )}

            <button
              type="button"
              onClick={handleStartUpdate}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--emerald-primary)'
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Update Now ({latestRelease.downloadSize})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

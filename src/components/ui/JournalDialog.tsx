'use client';

import { useEffect } from 'react';
import type { GameRuntime } from '../../game/GameRuntime';
import { contentBundle } from '../../game/content';

export interface JournalDialogProps {
  runtime: GameRuntime;
  onClose: () => void;
}

export function JournalDialog({ runtime, onClose }: JournalDialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const state = runtime.snapshot;
  const knownEntries = contentBundle.journal.filter((j) =>
    state.journalEntryIds.includes(j.id),
  );

  const unlockedFlowers = contentBundle.flowers.filter((f) =>
    state.unlockedFlowerIds.includes(f.id),
  );

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="journal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Sổ hoa"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="journal-header">
          <h2>Sổ Hoa & Ghi Chép</h2>
          <button
            type="button"
            className="action-button"
            autoFocus
            onClick={onClose}
          >
            Đóng (Esc)
          </button>
        </header>

        <div className="journal-content">
          <section className="journal-section">
            <h3>Ghi chép đã khám phá</h3>
            {knownEntries.length === 0 ? (
              <p>Chưa có ghi chép nào.</p>
            ) : (
              knownEntries.map((entry) => (
                <article key={entry.id} className="journal-entry">
                  <h4>{entry.title}</h4>
                  <p>{entry.text}</p>
                </article>
              ))
            )}
          </section>

          <section className="journal-section">
            <h3>Ý nghĩa các loài hoa đã biết</h3>
            <div className="journal-flowers-grid">
              {unlockedFlowers.map((flower) => {
                const worldText =
                  flower.world === 'dead'
                    ? 'Cõi âm'
                    : flower.world === 'both'
                      ? 'Lưỡng giới'
                      : 'Cõi trần';

                return (
                  <div key={flower.id} className="journal-flower-card">
                    <h4>{flower.displayName} ({worldText})</h4>
                    <p><strong>Ý nghĩa:</strong> {flower.meanings.join(', ')}</p>
                    <p><strong>Cảm xúc:</strong> {flower.emotionalTags.join(', ')}</p>
                    <p>{flower.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

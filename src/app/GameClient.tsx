'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { GameSession } from '../game/GameSession';
import { BouquetModel } from '../game/bouquet/BouquetModel';
import { AudioManager } from '../game/audio';
import { GameRuntime } from '../game/GameRuntime';
import type { SaveRepository } from '../game/save/SaveRepository';
import { createBrowserSaveRepository } from '../game/save/browserSaveRepository';
import { ThreeViewport } from '../components/ThreeViewport';
import { GameHeader } from '../components/ui/GameHeader';
import { NoticeBanner } from '../components/ui/NoticeBanner';
import { JournalDialog } from '../components/ui/JournalDialog';
import { SettingsDialog } from '../components/ui/SettingsDialog';
import { RecoveryDialog } from '../components/ui/RecoveryDialog';
import type { ActiveView } from '../game/GameRuntime';
import { LobbyView } from '../components/views/LobbyView';
import { CounterView } from '../components/views/CounterView';
import { WorkspaceView } from '../components/views/WorkspaceView';

export default function GameClient() {
  const [runtime, setRuntime] = useState<GameRuntime | null>(null);
  const [, setVersion] = useState(0); // force re-render on runtime state change
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);


  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const repoRef = useRef<SaveRepository | null>(null);
  const audioRef = useRef<AudioManager | null>(null);
  const showNotice = useCallback((msg: string, durationMs = 3000) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(msg);
    noticeTimerRef.current = setTimeout(() => {
      setNotice(null);
      noticeTimerRef.current = null;
    }, durationMs);
  }, []);

  const checkIsSaved = useCallback(() => {
    if (typeof window === 'undefined') return false;
    try {
      return Boolean(window.localStorage?.getItem('hoatich.save.v1'));
    } catch {
      return false;
    }
  }, []);

  // Initialize runtime on client mount
  useEffect(() => {
    let disposed = false;
    const repo = createBrowserSaveRepository();
    repoRef.current = repo;

    repo.load().then((loaded) => {
      if (disposed) return;

      const isCorrupted = loaded.status === 'error';
      const session = new GameSession(
        loaded.status === 'loaded' ? loaded.state : undefined,
        isCorrupted ? undefined : repo,
        () => showNotice('Không thể lưu trò chơi vào trình duyệt.', 3000),
      );
      const bouquet = new BouquetModel();
      const audio = new AudioManager(session.state.settings);
      audioRef.current = audio;

      const rt = new GameRuntime(session, bouquet, audio, isCorrupted ? undefined : repo);
      // Subscribe to runtime changes
      rt.subscribe(() => {
        if (!disposed) {
          setVersion((v) => v + 1);
          if (checkIsSaved()) {
            setIsSaved(true);
          }
        }
      });

      setRuntime(rt);

      if (loaded.status === 'loaded') {
        setIsSaved(true);
        if (loaded.recovered) {
          showNotice('Tiến trình đã được khôi phục từ bản sao lưu an toàn.', 4000);
        }
      } else if (loaded.status === 'error') {
        setRecoveryError(loaded.message);
      }

      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--font-scale', String(session.state.settings.fontScale ?? 1));
      }

    }).catch((err) => {
      console.error('Save repository load failed:', err);
      if (!disposed) {
        const session = new GameSession();
        const bouquet = new BouquetModel();
        const audio = new AudioManager(session.state.settings);
        const rt = new GameRuntime(session, bouquet, audio, repo);
        rt.subscribe(() => setVersion((v) => v + 1));
        setRuntime(rt);
      }
    });

    return () => {
      disposed = true;
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      audioRef.current?.destroy();
      audioRef.current = null;
    };
  }, [showNotice, checkIsSaved]);

  const isModalOpen = isJournalOpen || isSettingsOpen || Boolean(recoveryError);

  const performDelivery = useCallback(() => {
    if (
      !runtime ||
      runtime.activeView !== 'workspace' ||
      Boolean(runtime.dialogue) ||
      !runtime.canCompose ||
      runtime.bouquetItems.length === 0
    ) {
      return;
    }
    try {
      const result = runtime.deliver();
      const outcome = result.outcome;
      const msg =
        outcome === 'resonant'
          ? 'Bó hoa đồng điệu sâu sắc!'
          : outcome === 'accepted'
            ? 'Bó hoa được tiếp nhận trân trọng.'
            : 'Bó hoa chưa trọn vẹn ý nguyện.';
      showNotice(msg, 2500);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Không thể trao hoa', 3000);
    }
  }, [runtime, showNotice]);
  // Global keyboard shortcuts
  useEffect(() => {
    if (!runtime) return;

    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }
      if (isModalOpen) return;

      const hasActiveDialogue = Boolean(runtime.dialogue);

      // Workspace keyboard hotkeys only when active and without active dialogue
      if (runtime.activeView !== 'workspace' || hasActiveDialogue) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        performDelivery();
        return;
      }

      // Hotkeys for bouquet manipulation — Tab is preserved for normal focus traversal
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        runtime.cycleSelection(e.shiftKey ? -1 : 1);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        runtime.cycleSelection(-1);
      } else if (e.key === 'q' || e.key === 'Q' || e.key === '<') {
        e.preventDefault();
        runtime.rotateSelected(-15);
      } else if (e.key === 'e' || e.key === 'E' || e.key === '>') {
        e.preventDefault();
        runtime.rotateSelected(15);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        runtime.removeSelected();
      } else if (((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) || e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        runtime.undoBouquet();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        runtime.clearBouquet();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runtime, isModalOpen, performDelivery]);

  if (!runtime) {
    return (
      <div className="game-loading-screen" role="status">
        <p>Đang chuẩn bị không gian tiệm hoa...</p>
      </div>
    );
  }


  const activeView: ActiveView = runtime.activeView;
  const handleNavigate = (view: ActiveView) => {
    runtime.navigate(view);
  };

  const handleAdvanceShift = () => {
    try {
      runtime.advanceShift();
      showNotice('Đã chuyển sang buổi tiếp theo.', 2500);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Chưa thể chuyển buổi', 3000);
    }
  };

  const handleSave = async () => {
    try {
      if (runtime.repository) {
        await runtime.repository.save(runtime.snapshot);
        setIsSaved(true);
        showNotice('Đã lưu tiến trình chơi.', 2000);
      }
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Lưu thất bại', 3000);
    }
  };

  const handleRestart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn chơi lại từ đầu không?')) {
      try {
        await runtime.resetGame();
        setIsSaved(false);
        showNotice('Đã bắt đầu lại trò chơi mới.', 2500);
      } catch (err) {
        showNotice(err instanceof Error ? err.message : 'Không thể đặt lại trò chơi', 3000);
      }
    }
  };

  const handleResetSaveRecovery = async () => {
    try {
      if (repoRef.current) {
        await repoRef.current.clear();
        const session = new GameSession(undefined, repoRef.current);
        const bouquet = new BouquetModel();
        const audio = new AudioManager(session.state.settings);
        audioRef.current?.destroy();
        audioRef.current = audio;
        const rt = new GameRuntime(session, bouquet, audio, repoRef.current);
        rt.subscribe(() => setVersion((v) => v + 1));
        setRuntime(rt);
      } else {
        await runtime?.resetGame();
      }
      setIsSaved(false);
      setRecoveryError(null);
      showNotice('Đã làm sạch bản lưu hỏng và bắt đầu mới.', 2500);
    } catch (err) {
      showNotice(err instanceof Error ? err.message : 'Không thể xóa bản lưu lỗi', 3000);
    }
  };

  const isDead = runtime.snapshot.currentShift === 'dead';

  return (
    <main className={`game-shell ${isDead ? 'dead-shift' : ''}`}>
      <ThreeViewport
        runtime={runtime}
        isInputBlocked={isModalOpen || activeView !== 'workspace'}
      />

      <div className={`game-ui view-mode-${activeView}`}>
        {activeView !== 'lobby' && (
          <GameHeader
            runtime={runtime}
            activeView={activeView}
            onNavigate={handleNavigate}
            onOpenJournal={() => setJournalOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        )}

        <NoticeBanner message={notice} />

        {activeView === 'lobby' && (
          <LobbyView
            runtime={runtime}
            onNavigate={handleNavigate}
            onOpenJournal={() => setJournalOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            onAdvanceShift={handleAdvanceShift}
            onSave={handleSave}
            onRestart={handleRestart}
            isModalOpen={isModalOpen}
            isSaved={isSaved}
          />
        )}

        {activeView === 'counter' && (
          <CounterView
            runtime={runtime}
            onNavigate={handleNavigate}
            onOpenJournal={() => setJournalOpen(true)}
            onDeliver={performDelivery}
            onOpenSettings={() => setSettingsOpen(true)}
            isModalOpen={isModalOpen}
          />
        )}

        {activeView === 'workspace' && (
          <WorkspaceView
            runtime={runtime}
            onNavigate={handleNavigate}
            onOpenJournal={() => setJournalOpen(true)}
            onDeliver={performDelivery}
            isModalOpen={isModalOpen}
          />
        )}
        {isJournalOpen && (
          <JournalDialog
            runtime={runtime}
            onClose={() => setJournalOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsDialog
            runtime={runtime}
            onClose={() => setSettingsOpen(false)}
          />
        )}

        {recoveryError && (
          <RecoveryDialog
            message={recoveryError}
            onReset={handleResetSaveRecovery}
            onKeep={() => setRecoveryError(null)}
          />
        )}


        {runtime.isDemoComplete && (
          <div className="demo-complete-banner" role="status">
            <h3>Hoàn thành bản chơi thử Hoa Tích</h3>
            <p>Bạn đã đồng hành và lắng nghe trọn vẹn tâm nguyện của các vị khách trong cả hai cõi.</p>
            <button
              type="button"
              className="action-button primary-action"
              onClick={handleRestart}
            >
              Chơi lại từ đầu
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

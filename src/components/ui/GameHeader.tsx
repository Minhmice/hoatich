'use client';

import type { ActiveView, GameRuntime } from '../../game/GameRuntime';
import { contentBundle } from '../../game/content';
import { getDayNumber } from '../../game/content/progression';

export interface GameHeaderProps {
  runtime: GameRuntime;
  activeView?: ActiveView;
  onNavigate?: (view: ActiveView) => void;
  onOpenJournal?: () => void;
  onOpenSettings?: () => void;
}

export function GameHeader({
  runtime,
  activeView,
  onNavigate,
  onOpenJournal,
  onOpenSettings,
}: GameHeaderProps) {
  const state = runtime.snapshot;
  const isDead = state.currentShift === 'dead';
  const shiftLabel = isDead ? 'Buổi tối — Cõi âm' : 'Buổi sáng — Cõi trần';
  const dayNum = getDayNumber(state.currentDay);
  const dayLabel = `Ngày ${dayNum}`;
  const clockLabel = isDead ? '8:00 CH' : '6:00 CH';
  const hasOrder = Boolean(runtime.currentOrder);

  const currentOrder = runtime.currentOrder;
  const currentCustomer = currentOrder
    ? contentBundle.customers.find((c) => c.id === currentOrder.customerId)
    : undefined;
  const currentNpcProgress = currentCustomer
    ? state.npcProgress[currentCustomer.id]
    : undefined;
  const affinity = currentNpcProgress ? currentNpcProgress.affinity : undefined;

  return (
    <header className="game-header gpgp-top-hud" aria-label="Thanh trạng thái trò chơi">
      <h1 className="sr-only">Tiệm Hoa Tích</h1>

      {/* Top Left: Day and Shift Time */}
      <div className="hud-group hud-left">
        <div className="hud-capsule hud-time-capsule" title={`${dayLabel} • ${shiftLabel}`}>
          <span className="hud-shift-icon" aria-hidden="true">{isDead ? '🌙' : '☀️'}</span>
          <div className="hud-time-details">
            <span className="hud-day-text">NGÀY {dayNum}</span>
            <span className="hud-clock-text">{clockLabel}</span>
          </div>
        </div>
      </div>

      {/* Top Center: Real NPC Affinity / Shift status */}
      <div className="hud-group hud-center">
        {currentCustomer && affinity !== undefined ? (
          <div className="hud-capsule hud-affinity-capsule" title={`Mức độ thấu cảm của ${currentCustomer.name}: ${affinity}/100`}>
            <span className="hud-affinity-icon" aria-hidden="true">🪷</span>
            <span className="hud-affinity-name">{currentCustomer.name}</span>
            <span className="hud-affinity-value">Tâm ý: {affinity}</span>
          </div>
        ) : (
          <div className="hud-capsule hud-shift-capsule" title={shiftLabel}>
            <span className="hud-shift-badge-text">{shiftLabel}</span>
          </div>
        )}
      </div>

      {/* Top Right: Navigation shortcuts, Journal button with red dot, Settings */}
      <div className="hud-group hud-right">
        {onNavigate && activeView && (
          <div className="hud-view-shortcuts" aria-label="Lối chuyển nhanh">
            {activeView !== 'lobby' && (
              <button
                type="button"
                className="hud-quick-btn"
                onClick={() => onNavigate('lobby')}
                title="Sảnh tiệm"
              >
                Sảnh
              </button>
            )}
            {activeView !== 'counter' && (
              <button
                type="button"
                className="hud-quick-btn"
                onClick={() => onNavigate('counter')}
                title="Quầy tiếp khách"
              >
                Quầy
              </button>
            )}
            {activeView !== 'workspace' && runtime.canCompose && (
              <button
                type="button"
                className="hud-quick-btn primary"
                onClick={() => onNavigate('workspace')}
                title="Bàn cắm hoa"
              >
                Bàn hoa
              </button>
            )}
          </div>
        )}

        {onOpenJournal && (
          <button
            type="button"
            className="hud-icon-button hud-journal-button"
            onClick={onOpenJournal}
            title="Mở cẩm nang Sổ hoa"
            aria-label="Sổ hoa"
          >
            <span className="hud-btn-symbol" aria-hidden="true">📖</span>
            {hasOrder && (
              <span className="hud-notification-badge" aria-label="Có đơn mới">!</span>
            )}
          </button>
        )}

        {onOpenSettings && (
          <button
            type="button"
            className="hud-icon-button hud-settings-button"
            onClick={onOpenSettings}
            title="Cài đặt trò chơi"
            aria-label="Cài đặt"
          >
            <span className="hud-btn-symbol" aria-hidden="true">⚙️</span>
          </button>
        )}
      </div>
    </header>
  );
}

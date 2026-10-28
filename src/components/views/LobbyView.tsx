'use client';

import type { ActiveView, GameRuntime } from '../../game/GameRuntime';
import { getDayNumber } from '../../game/content/progression';
export interface LobbyViewProps {
  runtime: GameRuntime;
  onNavigate: (view: ActiveView) => void;
  onOpenJournal: () => void;
  onOpenSettings: () => void;
  onAdvanceShift: () => void;
  onSave: () => void;
  onRestart: () => void;
  isModalOpen: boolean;
  isSaved?: boolean;
}

export function LobbyView({
  runtime,
  onNavigate,
  onOpenJournal,
  onOpenSettings,
  onAdvanceShift,
  onSave,
  onRestart,
  isModalOpen,
  isSaved = false,
}: LobbyViewProps) {
  const state = runtime.snapshot;
  const isDead = state.currentShift === 'dead';
  const shiftTitle = isDead ? 'Buổi tối — Cõi âm' : 'Buổi sáng — Cõi trần';
  const dayNum = getDayNumber(state.currentDay);
  const dayTitle = `Ngày ${dayNum}`;
  const chapterTitle = 'Chương 1';
  const hasDialogue = Boolean(runtime.dialogue);
  const canAdvance = runtime.isShiftComplete && !hasDialogue && !isModalOpen;
  const hasPendingOrder = Boolean(runtime.currentOrder);

  return (
    <section className="view-lobby gpgp-lobby-scene" aria-label="Màn hình chính tiệm hoa">
      {/* Background Town & Storefront Architecture */}
      <div className="storefront-street-backdrop" aria-hidden="true">
        <div className="street-building street-building-left" />
        <div className="street-building street-building-center">
          <div className="storefront-roof-eaves" />
          <div className="storefront-awning" />
          <div className="storefront-facade" />
        </div>
        <div className="street-building street-building-right" />
        <div className="street-sidewalk" />
      </div>

      {/* Top Left: Save & Play Status Bubble (Good Pizza, Great Pizza style) */}
      <div className="lobby-top-left-bubble" role="status">
        <div className="speech-bubble-tail" aria-hidden="true" />
        <div className="bubble-content">
          <span className="bubble-tag">Tiến trình tiệm</span>
          <p className="bubble-text">{isSaved ? 'Đã lưu tiến trình' : 'Tiến trình mới'}</p>
          <div className="bubble-actions">
            <button
              type="button"
              className="bubble-btn"
              onClick={onSave}
              title="Lưu tiến trình vào trình duyệt"
            >
              Lưu ngay
            </button>
            <button
              type="button"
              className="bubble-btn"
              onClick={onRestart}
              title="Chơi lại từ đầu"
            >
              Chơi lại
            </button>
          </div>
        </div>
      </div>

      {/* Top Right: Settings Gear Button */}
      <div className="lobby-top-right-settings">
        <button
          type="button"
          className="lobby-gear-button"
          onClick={onOpenSettings}
          aria-label="Cài đặt trò chơi"
          title="Cài đặt âm thanh, phông chữ, tốc độ thoại"
        >
          <span className="gear-icon" aria-hidden="true">⚙️</span>
        </button>
      </div>

      {/* Center Stage: Storefront Sign, Main Logo & Big Start Button */}
      <div className="lobby-center-stage">
        <div className="lobby-brand-container">
          <div className="lobby-woodblock-badge" aria-hidden="true">
            <div className="badge-inner-seal">
              <span className="seal-char">華</span>
            </div>
          </div>

          <h1 className="lobby-game-title">
            <span className="title-shadow" aria-hidden="true">TIỆM HOA TÍCH</span>
            <span className="title-text">TIỆM HOA TÍCH</span>
          </h1>

          <div className="lobby-tagline-ribbon">
            <span className="ribbon-text">CHUYỆN CỦA HOA</span>
          </div>
        </div>

        {/* Big Start Button: Chapter 1 / Day 1 (Good Pizza, Great Pizza style) */}
        <div className="lobby-start-container">
          <button
            type="button"
            className="lobby-play-button"
            onClick={() => onNavigate('counter')}
            title="Mở cửa tiệm đón khách"
          >
            <span className="play-btn-chapter">{chapterTitle}</span>
            <span className="play-btn-day">{dayTitle}</span>
            <span className="play-btn-shift">{shiftTitle}</span>
            {hasPendingOrder && (
              <span className="play-btn-alert" aria-label="Có khách đợi">● Có khách</span>
            )}
          </button>
        </div>

        {/* Auxiliary links below storefront */}
        <nav className="lobby-aux-nav" aria-label="Các lối đi phụ">
          <button
            type="button"
            className="lobby-aux-chip"
            onClick={onOpenJournal}
          >
            📖 Cẩm nang Sổ hoa
          </button>


          {canAdvance && (
            <button
              type="button"
              className="lobby-aux-chip chip-highlight"
              onClick={onAdvanceShift}
              title={isDead ? 'Bắt đầu ngày mới tiếp theo' : 'Chuyển sang buổi tối cõi âm'}
            >
              {isDead ? '🌅 Bắt đầu ngày mới' : '🌙 Chuyển sang buổi tối'}
            </button>
          )}
        </nav>

        <p className="lobby-motto">
          “Làm một bó hoa để giúp ai đó nói điều họ không thể tự nói.”
        </p>
      </div>
    </section>
  );
}

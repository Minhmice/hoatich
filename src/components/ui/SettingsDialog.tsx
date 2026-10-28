'use client';

import { useEffect } from 'react';
import type { GameRuntime } from '../../game/GameRuntime';
import type { GameSettings } from '../../game/state/GameState';

export interface SettingsDialogProps {
  runtime: GameRuntime;
  onClose: () => void;
}

export function SettingsDialog({ runtime, onClose }: SettingsDialogProps) {
  const settings = runtime.snapshot.settings;

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

  const update = (patch: Partial<GameSettings>) => {
    runtime.applySettings(patch);
    if (patch.fontScale !== undefined && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--font-scale', String(patch.fontScale));
    }
  };

  return (
    <div className="settings-overlay" role="presentation" onClick={onClose}>
      <div
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Cài đặt hỗ trợ tiếp cận"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="settings-header">
          <h2 className="settings-title">Cài Đặt Tiếp Cận & Âm Thanh</h2>
          <button
            type="button"
            className="settings-close-button"
            autoFocus
            onClick={onClose}
          >
            Đóng (Esc)
          </button>
        </header>

        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="settings-group">
            <label className="settings-label" htmlFor="setting-text-speed">
              Tốc độ hiển thị chữ hội thoại
            </label>
            <select
              id="setting-text-speed"
              className="settings-select"
              value={settings.textSpeed}
              onChange={(e) => update({ textSpeed: e.target.value as GameSettings['textSpeed'] })}
            >
              <option value="slow">Chậm rãi</option>
              <option value="normal">Vừa phải (chuẩn)</option>
              <option value="fast">Nhanh</option>
            </select>
          </div>

          <div className="settings-group">
            <div className="settings-slider-header">
              <label className="settings-label" htmlFor="setting-font-scale">
                Cỡ chữ giao diện
              </label>
              <span className="settings-value-indicator">
                {`${Math.round(settings.fontScale * 100)}%`}
              </span>
            </div>
            <input
              id="setting-font-scale"
              type="range"
              className="settings-slider"
              min={0.85}
              max={1.5}
              step={0.05}
              value={settings.fontScale}
              onChange={(e) => update({ fontScale: parseFloat(e.target.value) })}
            />
          </div>

          <div className="settings-group">
            <div className="settings-slider-header">
              <label className="settings-label" htmlFor="setting-music-volume">
                Âm lượng nhạc nền
              </label>
              <span className="settings-value-indicator">
                {`${Math.round(settings.musicVolume * 100)}%`}
              </span>
            </div>
            <input
              id="setting-music-volume"
              type="range"
              className="settings-slider"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={(e) => update({ musicVolume: parseFloat(e.target.value) })}
            />
          </div>

          <div className="settings-group">
            <div className="settings-slider-header">
              <label className="settings-label" htmlFor="setting-sfx-volume">
                Âm lượng hiệu ứng
              </label>
              <span className="settings-value-indicator">
                {`${Math.round(settings.sfxVolume * 100)}%`}
              </span>
            </div>
            <input
              id="setting-sfx-volume"
              type="range"
              className="settings-slider"
              min={0}
              max={1}
              step={0.05}
              value={settings.sfxVolume}
              onChange={(e) => update({ sfxVolume: parseFloat(e.target.value) })}
            />
          </div>

          <div className="settings-group settings-group-checkbox">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => update({ reducedMotion: e.target.checked })}
              />
              <span>Giảm chuyển động (tắt hoạt họa gõ chữ và hiệu ứng động)</span>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

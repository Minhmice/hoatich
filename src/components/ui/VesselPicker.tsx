'use client';

import { useState } from 'react';
import type { GameRuntime } from '../../game/GameRuntime';
import type { VesselKind } from '../../game/bouquet/BouquetModel';

export interface VesselPickerProps {
  runtime: GameRuntime;
  onConfirm: (vessel: VesselKind, stemCount: number) => void;
}

const VESSEL_OPTIONS: { id: VesselKind; name: string; desc: string; icon: string }[] = [
  {
    id: 'bouquet',
    name: 'Bó hoa cầm tay',
    desc: 'Dáng quấn giấy xòe hình nón kinh điển',
    icon: '💐',
  },
  {
    id: 'vase',
    name: 'Bình gốm mộc',
    desc: 'Bình gốm tráng men mộc mạc trang trọng',
    icon: '🏺',
  },
  {
    id: 'jar',
    name: 'Lọ thủy tinh',
    desc: 'Lọ thủy tinh thanh thoát tỏa thấp',
    icon: '🫙',
  },
];

const PRESET_STEM_COUNTS = [1, 3, 5, 8, 12, 15, 20, 24];

export function VesselPicker({ runtime, onConfirm }: VesselPickerProps) {
  const arrangement = runtime.currentOrderArrangement;
  const initialVessel: VesselKind = arrangement?.suggestedVessel ?? 'bouquet';
  const initialCount = arrangement?.minStems ?? 3;

  const [selectedVessel, setSelectedVessel] = useState<VesselKind>(initialVessel);
  const [stemCount, setStemCount] = useState<number>(initialCount);

  const isSuggestedRange =
    arrangement && stemCount >= arrangement.minStems && stemCount <= arrangement.maxStems;

  const handleConfirm = () => {
    if (stemCount >= 1 && stemCount <= 24) {
      onConfirm(selectedVessel, stemCount);
    }
  };

  return (
    <div className="vessel-picker-card" role="region" aria-label="Chọn dáng bình và số lượng cành">
      <div className="vessel-picker-header">
        <h3 className="vessel-picker-title">Chọn Dáng Cắm & Số Lượng Cành</h3>
        <p className="vessel-picker-subtitle">
          {arrangement
            ? `Khách gợi ý: ${arrangement.suggestedVessel === 'vase'
              ? 'Bình gốm'
              : arrangement.suggestedVessel === 'jar'
                ? 'Lọ thủy tinh'
                : 'Bó hoa'
            } (${arrangement.minStems} - ${arrangement.maxStems} cành)`
            : 'Chọn dáng cắm và số lượng cành phù hợp cho tác phẩm.'}
        </p>
      </div>

      {/* Vessel selection cards */}
      <div className="vessel-options-grid" role="radiogroup" aria-label="Loại bình cắm">
        {VESSEL_OPTIONS.map((v) => {
          const isSelected = selectedVessel === v.id;
          const isSuggested = arrangement?.suggestedVessel === v.id;
          return (
            <button
              key={v.id}
              type="button"
              className={`vessel-card-btn ${isSelected ? 'selected' : ''}`}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedVessel(v.id)}
            >
              <span className="vessel-icon" aria-hidden="true">{v.icon}</span>
              <strong className="vessel-name">{v.name}</strong>
              <small className="vessel-desc">{v.desc}</small>
              {isSuggested && <span className="vessel-suggested-tag">Khuyên dùng</span>}
            </button>
          );
        })}
      </div>

      {/* Stem count selection */}
      <div className="stem-count-section">
        <label htmlFor="stem-count-input" className="stem-count-label">
          Số lượng cành hoa: <strong>{stemCount} cành</strong>
          {isSuggestedRange && (
            <span className="count-match-tag"> (Đúng số lượng mong đợi)</span>
          )}
        </label>

        <div className="stem-count-stepper">
          <button
            type="button"
            className="stepper-btn"
            disabled={stemCount <= 1}
            onClick={() => setStemCount((c) => Math.max(1, c - 1))}
            title="Giảm 1 cành"
          >
            -
          </button>
          <input
            id="stem-count-input"
            type="range"
            min={1}
            max={24}
            value={stemCount}
            onChange={(e) => setStemCount(parseInt(e.target.value, 10))}
            className="stem-range-slider"
          />
          <button
            type="button"
            className="stepper-btn"
            disabled={stemCount >= 24}
            onClick={() => setStemCount((c) => Math.min(24, c + 1))}
            title="Tăng 1 cành"
          >
            +
          </button>
        </div>

        {/* Preset quick buttons */}
        <div className="stem-presets-row" aria-label="Các mức cành thông dụng">
          {PRESET_STEM_COUNTS.map((cnt) => {
            const isPresetActive = stemCount === cnt;
            const inRange = arrangement && cnt >= arrangement.minStems && cnt <= arrangement.maxStems;
            return (
              <button
                key={cnt}
                type="button"
                className={`stem-preset-btn ${isPresetActive ? 'active' : ''} ${inRange ? 'suggested-preset' : ''}`}
                onClick={() => setStemCount(cnt)}
              >
                {cnt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="vessel-picker-footer">
        <button
          type="button"
          className="action-button primary-action confirm-vessel-btn"
          onClick={handleConfirm}
        >
          Xác nhận dáng cắm & Bắt đầu ({stemCount} cành)
        </button>
      </div>
    </div>
  );
}

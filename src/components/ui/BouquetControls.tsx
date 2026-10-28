'use client';

import { useState } from 'react';
import type { GameRuntime } from '../../game/GameRuntime';
import { contentBundle } from '../../game/content';

export interface BouquetControlsProps {
  runtime: GameRuntime;
  isModalOpen: boolean;
  onDeliver: () => void;
  activeTab: 'arrange' | 'finish';
  onTabChange: (tab: 'arrange' | 'finish') => void;
}

export function BouquetControls({
  runtime,
  isModalOpen,
  onDeliver,
  activeTab,
  onTabChange,
}: BouquetControlsProps) {
  const items = runtime.bouquetItems;
  const config = runtime.bouquetConfiguration;
  const finish = runtime.bouquetFinish;
  const features = runtime.features;
  const hasItems = items.length > 0;
  const hasSelection = Boolean(runtime.selectedItemId);
  const hasActiveDialogue = Boolean(runtime.dialogue);
  const isFull = runtime.isBouquetFull;

  const [isBowAnimating, setIsBowAnimating] = useState(false);

  // Bow advance animation lock
  const handleAdvanceBow = () => {
    if (isBowAnimating || finish.bowStep >= 3) return;
    runtime.advanceBow();

    const isReducedMotion = runtime.snapshot.settings.reducedMotion;
    if (!isReducedMotion) {
      setIsBowAnimating(true);
      setTimeout(() => {
        setIsBowAnimating(false);
      }, 350);
    }
  };

  const canDeliver =
    isFull &&
    (finish.ribbon === 'none' || finish.bowStep === 3) &&
    !hasActiveDialogue &&
    !isModalOpen &&
    !isBowAnimating;

  const disabledOverall = !hasItems || hasActiveDialogue || isModalOpen;
  const disabledSelection = !hasSelection || hasActiveDialogue || isModalOpen;

  return (
    <footer className="bouquet-controls-panel" aria-label="Bảng điều khiển cắm và hoàn thiện hoa">
      {/* Tab Switcher: Cắm & Chỉnh cành vs Hoàn thiện */}
      <div className="workspace-tab-row">
        <button
          type="button"
          className={`workspace-tab-btn ${activeTab === 'arrange' ? 'active' : ''}`}
          onClick={() => onTabChange('arrange')}
        >
          Cắm & Chỉnh cành {config ? `(${items.length}/${config.stemCount})` : ''}
        </button>
        <button
          type="button"
          className={`workspace-tab-btn ${activeTab === 'finish' ? 'active' : ''}`}
          onClick={() => onTabChange('finish')}
        >
          Gói & Nơ {finish.ribbon !== 'none' ? `[Nơ ${finish.bowStep}/3]` : ''}
        </button>
      </div>

      {activeTab === 'arrange' && (
        <div className="workspace-control-toolbar" aria-label="Thao tác cành hoa">
          <select
            className="bouquet-select"
            aria-label="Chọn cành hoa để nhấc hoặc xoay"
            disabled={disabledOverall}
            value={runtime.selectedItemId ?? ''}
            onChange={(e) => {
              runtime.selectItem(e.target.value || null);
            }}
          >
            <option value="" disabled>
              {items.length === 0 ? '(Bình chưa có hoa)' : 'Chọn cành hoa trên bàn...'}
            </option>
            {items.map((item) => {
              const flower = contentBundle.flowers.find((f) => f.id === item.flowerId);
              const name = flower ? flower.displayName : item.flowerId;
              const poseLabel =
                item.pose === 'left'
                  ? 'nghiêng trái'
                  : item.pose === 'right'
                    ? 'nghiêng phải'
                    : item.pose === 'down'
                      ? 'xòe thấp'
                      : 'chính diện';
              return (
                <option key={item.id} value={item.id}>
                  {`Vị trí ${item.slotIndex + 1}: ${name} (${poseLabel})`}
                </option>
              );
            })}
          </select>

          <button
            type="button"
            className="action-button"
            disabled={disabledOverall}
            onClick={() => runtime.cycleSelection(-1)}
            title="Chọn cành liền trước"
          >
            ◀ Cành trước
          </button>

          <button
            type="button"
            className="action-button"
            disabled={disabledOverall}
            onClick={() => runtime.cycleSelection(1)}
            title="Chọn cành liền sau"
          >
            Cành tiếp ▶
          </button>

          <button
            type="button"
            className="action-button"
            disabled={disabledSelection}
            onClick={() => runtime.rotateSelected(-15)}
            title="Xoay cành sang trái 15 độ"
          >
            ↺ Xoay trái
          </button>

          <button
            type="button"
            className="action-button"
            disabled={disabledSelection}
            onClick={() => runtime.rotateSelected(15)}
            title="Xoay cành sang phải 15 độ"
          >
            ↻ Xoay phải
          </button>

          <button
            type="button"
            className="action-button"
            disabled={disabledSelection}
            onClick={() => runtime.removeSelected()}
            title="Nhấc cành ra khỏi bình hoa"
          >
            Nhấc cành ra
          </button>

          <button
            type="button"
            className="action-button"
            disabled={!runtime.isBouquetConfigured || isModalOpen}
            onClick={() => runtime.undoBouquet()}
            title="Hoàn tác thao tác gần nhất"
          >
            Hoàn tác
          </button>

          <button
            type="button"
            className="action-button"
            disabled={!hasItems || isModalOpen}
            onClick={() => runtime.clearBouquet()}
            title="Nhấc toàn bộ hoa ra khỏi bình"
          >
            Nhấc hết hoa
          </button>

          <button
            type="button"
            className="action-button"
            disabled={isModalOpen}
            onClick={() => {
              if (
                items.length === 0 ||
                window.confirm('Bạn có chắc muốn chọn lại bình hoa và số cành không?')
              ) {
                runtime.resetBouquet();
              }
            }}
            title="Chọn lại dáng bình và số lượng cành"
          >
            Đổi bình khác
          </button>
        </div>
      )}

      {activeTab === 'finish' && (
        <div className="workspace-finish-toolbar" aria-label="Tùy chọn hoàn thiện bó hoa">
          {/* Paper options */}
          {features.paper && (
            <div className="finish-group">
              <span className="finish-label">Giấy gói:</span>
              <div className="finish-btn-group">
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.paper === 'none' ? 'selected' : ''}`}
                  onClick={() => runtime.setPaper('none')}
                >
                  Không gói
                </button>
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.paper === 'kraft' ? 'selected' : ''}`}
                  onClick={() => runtime.setPaper('kraft')}
                >
                  Giấy kraft
                </button>
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.paper === 'cream' ? 'selected' : ''}`}
                  onClick={() => runtime.setPaper('cream')}
                >
                  Giấy kem
                </button>
              </div>
            </div>
          )}

          {/* Ribbon options */}
          {features.ribbon && (
            <div className="finish-group">
              <span className="finish-label">Ruy-băng:</span>
              <div className="finish-btn-group">
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.ribbon === 'none' ? 'selected' : ''}`}
                  onClick={() => runtime.setRibbon('none')}
                >
                  Không nơ
                </button>
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.ribbon === 'sage' ? 'selected' : ''}`}
                  onClick={() => runtime.setRibbon('sage')}
                >
                  Xanh sage
                </button>
                <button
                  type="button"
                  className={`finish-opt-btn ${finish.ribbon === 'rose' ? 'selected' : ''}`}
                  onClick={() => runtime.setRibbon('rose')}
                >
                  Hồng rose
                </button>
              </div>
            </div>
          )}

          {/* 3 intentional bow clicks */}
          {features.ribbon && finish.ribbon !== 'none' && (
            <div className="finish-group bow-tying-group">
              <span className="finish-label">Thắt nơ (3 bước):</span>
              <div className="bow-stepper">
                <button
                  type="button"
                  className={`action-button bow-action-btn ${isBowAnimating ? 'bow-animating' : ''}`}
                  disabled={finish.bowStep >= 3 || isBowAnimating}
                  onClick={handleAdvanceBow}
                >
                  {finish.bowStep === 0
                    ? 'Bước 1: Thắt nút dây'
                    : finish.bowStep === 1
                      ? 'Bước 2: Tạo hai cánh nơ'
                      : finish.bowStep === 2
                        ? 'Bước 3: Vuốt đuôi nơ'
                        : 'Nơ đã thắt hoàn thiện ✓'}
                </button>
                <span className="bow-step-indicator" aria-live="polite">
                  {finish.bowStep === 0 && 'Chưa thắt (0/3)'}
                  {finish.bowStep === 1 && 'Nút thắt (1/3)'}
                  {finish.bowStep === 2 && 'Cánh nơ (2/3)'}
                  {finish.bowStep === 3 && 'Hoàn chỉnh (3/3) ✓'}
                </span>
              </div>
            </div>
          )}

          {/* Card options */}
          {features.cards && (
            <div className="finish-group card-group">
              <span className="finish-label">Thiệp chúc:</span>
              <select
                className="finish-card-select"
                value={finish.cardId ?? ''}
                onChange={(e) => runtime.setCard(e.target.value || null)}
              >
                <option value="">Không kèm thiệp</option>
                {runtime.currentOrderCardChoices.map((card) => (
                  <option key={card.id} value={card.id}>
                    {`${card.label}: "${card.message}"`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Delivery CTA */}
      <div className="workspace-delivery-bar">
        <div className="delivery-status-note">
          {!isFull && config && (
            <span className="delivery-warn">
              Cần cắm đủ {config.stemCount} cành hoa (hiện có {items.length}).
            </span>
          )}
          {isFull && finish.ribbon !== 'none' && finish.bowStep < 3 && (
            <span className="delivery-warn">
              Hoàn thành thắt nơ ruy-băng ({finish.bowStep}/3) trước khi trao.
            </span>
          )}
          {canDeliver && (
            <span className="delivery-ready">Bó hoa đã sẵn sàng trao cho khách!</span>
          )}
        </div>

        <button
          type="button"
          className="action-button primary-action delivery-btn"
          disabled={!canDeliver}
          onClick={onDeliver}
          title={canDeliver ? 'Trao bó hoa cho khách' : 'Chưa hoàn thành yêu cầu cắm hoa'}
        >
          Trao hoa cho khách
        </button>
      </div>
    </footer>
  );
}

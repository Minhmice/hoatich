'use client';

import { useState } from 'react';
import type { ActiveView, GameRuntime } from '../../game/GameRuntime';
import { FlowerCatalog } from '../ui/FlowerCatalog';
import { BouquetControls } from '../ui/BouquetControls';
import { VesselPicker } from '../ui/VesselPicker';
import { ContextualHint } from '../ui/ContextualHint';
import { OrderNote } from '../ui/OrderNote';
import { contentBundle } from '../../game/content';

export interface WorkspaceViewProps {
  runtime: GameRuntime;
  onNavigate: (view: ActiveView) => void;
  onOpenJournal: () => void;
  onDeliver: () => void;
  isModalOpen: boolean;
}

export function WorkspaceView({
  runtime,
  onNavigate,
  onOpenJournal,
  onDeliver,
  isModalOpen,
}: WorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<'arrange' | 'finish'>('arrange');

  const order = runtime.currentOrder;
  const customer = order
    ? contentBundle.customers.find((c) => c.id === order.customerId)
    : undefined;

  const isConfigured = runtime.isBouquetConfigured;
  const config = runtime.bouquetConfiguration;
  const items = runtime.bouquetItems;
  const hasDraftItems = items.length > 0;

  const handleConfirmVessel = (vessel: typeof runtime.availableVessels[number], stemCount: number) => {
    runtime.configureBouquet(vessel, stemCount);
  };

  return (
    <section className="view-workspace" aria-label="Bàn cắm hoa">
      {/* Subtle top navigation bar */}
      <div className="view-top-bar">
        <button
          type="button"
          className="action-button"
          onClick={() => onNavigate('counter')}
        >
          ← Quầy tiếp khách
        </button>

        <span className="view-title">
          {customer ? `Bàn cắm hoa • Chuẩn bị cho ${customer.name}` : 'Bàn cắm hoa tự do'}
        </span>

        <div className="view-top-actions">
          <button
            type="button"
            className="action-button"
            onClick={onOpenJournal}
          >
            Sổ hoa
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => onNavigate('lobby')}
          >
            Sảnh tiệm
          </button>
        </div>
      </div>

      {/* Unsaved draft status notice banner */}
      {hasDraftItems && (
        <div className="workspace-draft-notice" role="status">
          Đã lưu câu chuyện; bó đang cắm chưa được lưu
        </div>
      )}

      {/* Contextual non-modal guide hand / hint */}
      <ContextualHint runtime={runtime} />

      <div className="workspace-stage">
        {/* Phase 1: Unconfigured workspace -> Vessel & stem count form */}
        {!isConfigured ? (
          <div className="workspace-vessel-stage">
            <VesselPicker
              runtime={runtime}
              onConfirm={handleConfirmVessel}
            />
            {order && (
              <aside className="workspace-order-memo" aria-label="Ghi nhớ tâm nguyện của khách">
                <OrderNote runtime={runtime} showArrangement={true} />
              </aside>
            )}
          </div>
        ) : (
          /* Phase 2: Configured workspace -> Catalog + 3D Viewport + Controls */
          <>
            <div className="workspace-catalog-wrapper">
              <div className="workspace-slot-status" aria-label="Tiến độ cắm cành">
                <span className="slot-count-badge">
                  Đã cắm: <strong>{items.length}</strong> / {config?.stemCount} cành
                </span>
                {runtime.isBouquetFull && (
                  <span className="slot-full-badge">Đã đủ cành ✓</span>
                )}
              </div>
              <FlowerCatalog runtime={runtime} isModalOpen={isModalOpen} />
            </div>

            {order && (
              <aside className="workspace-order-memo" aria-label="Ghi nhớ tâm nguyện của khách">
                <OrderNote runtime={runtime} showArrangement={false} />
              </aside>
            )}

            <BouquetControls
              runtime={runtime}
              isModalOpen={isModalOpen}
              onDeliver={onDeliver}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </>
        )}
      </div>
    </section>
  );
}

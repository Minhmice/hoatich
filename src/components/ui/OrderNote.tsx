'use client';

import type { GameRuntime } from '../../game/GameRuntime';
import { contentBundle } from '../../game/content';

export interface OrderNoteProps {
  runtime: GameRuntime;
  className?: string;
  showArrangement?: boolean;
}

export function OrderNote({ runtime, className = '', showArrangement = false }: OrderNoteProps) {
  const order = runtime.currentOrder;
  if (!order) return null;

  const customer = contentBundle.customers.find((c) => c.id === order.customerId);
  const notes = runtime.heardOrderNotes;
  const isDead = order.recipient === 'deceased';
  const arrangement = runtime.currentOrderArrangement;

  const vesselLabels: Record<string, string> = {
    bouquet: 'Bó hoa cầm tay',
    vase: 'Bình hoa gốm',
    jar: 'Lọ hoa thủy tinh',
  };

  return (
    <div className={`order-note-card ${className}`} role="region" aria-label="Ghi chú đơn hàng">
      <div className="order-note-header">
        <span className="order-note-customer">{customer?.name ?? 'Khách ghé tiệm'}</span>
        <span className={`order-recipient-badge ${isDead ? 'recipient-deceased' : 'recipient-living'}`}>
          {isDead ? 'Viếng cõi âm' : 'Tặng cõi trần'}
        </span>
      </div>

      {showArrangement && arrangement && (
        <div className="order-note-arrangement">
          <span className="arrangement-tag">
            Dáng cắm: {vesselLabels[arrangement.suggestedVessel] ?? arrangement.suggestedVessel}
          </span>
          <span className="arrangement-tag">
            Số lượng: {arrangement.minStems} - {arrangement.maxStems} cành
          </span>
        </div>
      )}

      {notes.length > 0 && (
        <ul className="order-note-list">
          {notes.map((note, index) => (
            <li key={index} className="order-note-item">
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

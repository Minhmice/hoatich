'use client';

import { useState } from 'react';
import type { GameRuntime } from '../../game/GameRuntime';

export interface ContextualHintProps {
  runtime: GameRuntime;
}

export function ContextualHint({ runtime }: ContextualHintProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const isConfigured = runtime.isBouquetConfigured;
  const config = runtime.bouquetConfiguration;
  const items = runtime.bouquetItems;
  const isFull = runtime.isBouquetFull;
  const finish = runtime.bouquetFinish;
  const features = runtime.features;

  let hintStep = 1;
  let hintText = '';

  if (!isConfigured) {
    hintStep = 1;
    hintText = 'Bước 1: Chọn dáng cắm và số lượng cành phù hợp với tâm nguyện của khách, sau đó bấm Xác nhận.';
  } else if (items.length === 0) {
    hintStep = 2;
    hintText = 'Bước 2: Chọn loài hoa từ danh mục bên dưới để cắm cành đầu tiên vào vị trí mở.';
  } else if (!isFull && config) {
    hintStep = 3;
    hintText = `Bước 3: Cắm tiếp cho đủ ${config.stemCount} cành (hiện có ${items.length}). Nhấp vào cành hoa để nhấc lên hoặc xoay chỉnh góc.`;
  } else if (isFull && features.ribbon && finish.ribbon !== 'none' && finish.bowStep < 3) {
    hintStep = 4;
    hintText = `Bước 4: Sang mục 'Gói & Nơ' và nhấn nút 'Thắt nơ' 3 lần (${finish.bowStep}/3) để hoàn chỉnh dải ruy-băng.`;
  } else {
    hintStep = 5;
    hintText = 'Bước cuối: Tác phẩm đã hoàn thành trọn vẹn! Bấm \'Trao hoa cho khách\' để gửi trao tâm nguyện.';
  }

  if (isDismissed) {
    return (
      <aside className="contextual-hint-toggle" aria-label="Gợi ý thao tác">
        <button
          type="button"
          className="hint-reopen-btn"
          onClick={() => setIsDismissed(false)}
          title="Xem gợi ý thao tác"
        >
          💡 Gợi ý ({hintStep}/5)
        </button>
      </aside>
    );
  }

  return (
    <aside className="contextual-hint-bar" role="status" aria-label="Gợi ý thao tác">
      <div className="hint-content">
        <span className="hint-icon" aria-hidden="true">💡</span>
        <span className="hint-step-badge">Gợi ý {hintStep}/5</span>
        <p className="hint-message">{hintText}</p>
      </div>
      <button
        type="button"
        className="hint-dismiss-btn"
        onClick={() => setIsDismissed(true)}
        title="Tạm ẩn gợi ý"
        aria-label="Đóng gợi ý"
      >
        ✕
      </button>
    </aside>
  );
}

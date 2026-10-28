'use client';

import type { GameRuntime } from '../../game/GameRuntime';
import { contentBundle } from '../../game/content';
import { flowerAssets } from '../../game/content/flowerAssets';
import { getUnlockedSpeciesForDay } from '../../game/content/progression';

export interface FlowerCatalogProps {
  runtime: GameRuntime;
  isModalOpen: boolean;
}

export function FlowerCatalog({ runtime, isModalOpen }: FlowerCatalogProps) {
  const state = runtime.snapshot;
  const hasActiveDialogue = Boolean(runtime.dialogue);

  const dailySpecies = getUnlockedSpeciesForDay(state.currentDay);
  const unlockedFlowers = contentBundle.flowers.filter((flower) =>
    state.unlockedFlowerIds.includes(flower.id) && dailySpecies.includes(flower.id),
  );

  return (
    <section className="flower-list" aria-label="Danh mục hoa có sẵn">
      {unlockedFlowers.map((flower) => {
        const remainingStock = runtime.getRemainingStock(flower.id);
        const isDisabled =
          remainingStock <= 0 ||
          !runtime.isBouquetConfigured ||
          runtime.isBouquetFull ||
          hasActiveDialogue ||
          isModalOpen;

        const worldBadge =
          flower.world === 'dead'
            ? '[Cõi âm]'
            : flower.world === 'both'
              ? '[Lưỡng giới]'
              : '[Cõi trần]';

        const asset = flowerAssets[flower.id];

        return (
          <button
            key={flower.id}
            type="button"
            className="flower-button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                runtime.addFlower(flower.id);
              }
            }}
          >
            {asset && (
              <img
                src={asset.url}
                alt=""
                width={42}
                height={42}
                decoding="async"
              />
            )}
            <strong>{`${flower.displayName} ${worldBadge}`}</strong>
            <div>
              {`Ý nghĩa: ${flower.meanings.slice(0, 2).join(', ')} • Còn lại: ${remainingStock}`}
            </div>
          </button>
        );
      })}
    </section>
  );
}

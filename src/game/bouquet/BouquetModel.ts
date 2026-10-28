import { contentBundle } from '../content';
import {
  generateSlots,
  type BouquetSlot,
  type FlowerPose,
  type VesselKind,
} from './slotLayout';

export type { BouquetSlot, FlowerPose, VesselKind };

export interface BouquetConfiguration {
  readonly vessel: VesselKind;
  readonly stemCount: number;
}

export interface BouquetItem {
  readonly id: string;
  readonly flowerId: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly layer: number;
  readonly rotation: number;
  readonly slotIndex: number;
  readonly pose: FlowerPose;
}

interface MutableBouquetItem {
  readonly id: string;
  readonly flowerId: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly layer: number;
  rotation: number;
  readonly slotIndex: number;
  readonly pose: FlowerPose;
}

export interface BouquetFinish {
  readonly paper: 'none' | 'kraft' | 'cream';
  readonly ribbon: 'none' | 'sage' | 'rose';
  readonly bowStep: 0 | 1 | 2 | 3;
  readonly cardId: string | null;
}

export interface BouquetSubmission {
  readonly configuration: BouquetConfiguration;
  readonly items: readonly BouquetItem[];
  readonly finish: BouquetFinish;
}

interface HistorySnapshot {
  readonly configuration: BouquetConfiguration | null;
  readonly slots: readonly BouquetSlot[];
  readonly items: readonly BouquetItem[];
  readonly finish: BouquetFinish;
}

const VALID_VESSELS: Record<VesselKind, true> = {
  bouquet: true,
  vase: true,
  jar: true,
};

const VALID_PAPERS: Record<BouquetFinish['paper'], true> = {
  none: true,
  kraft: true,
  cream: true,
};

const VALID_RIBBONS: Record<BouquetFinish['ribbon'], true> = {
  none: true,
  sage: true,
  rose: true,
};

export class BouquetModel {
  private _configuration: BouquetConfiguration | null = null;
  private _slots: readonly BouquetSlot[] = [];
  private _items: MutableBouquetItem[] = [];
  private _finish: BouquetFinish = {
    paper: 'none',
    ribbon: 'none',
    bowStep: 0,
    cardId: null,
  };
  private _history: HistorySnapshot[] = [];
  private _idCounter = 0;
  private _isGestureActive = false;
  private _gestureHasSnapshot = false;
  constructor(
    configuration?: BouquetConfiguration | null,
    initialItems?: readonly BouquetItem[],
    finish?: BouquetFinish,
  ) {
    if (configuration) {
      this.configure(configuration);

      if (initialItems && initialItems.length > 0) {
        if (initialItems.length > configuration.stemCount) {
          throw new Error(
            `Initial items count (${initialItems.length}) exceeds stem capacity (${configuration.stemCount})`,
          );
        }

        const seenSlots: Record<number, true> = {};
        for (const item of initialItems) {
          if (!contentBundle.flowers.some((f) => f.id === item.flowerId)) {
            throw new Error(`Unknown flower ID: ${item.flowerId}`);
          }
          if (
            !Number.isInteger(item.slotIndex) ||
            item.slotIndex < 0 ||
            item.slotIndex >= configuration.stemCount
          ) {
            throw new Error(`Invalid slotIndex: ${item.slotIndex}`);
          }
          if (seenSlots[item.slotIndex]) {
            throw new Error(`Duplicate slotIndex in initial items: ${item.slotIndex}`);
          }
          seenSlots[item.slotIndex] = true;
        }

        this._items = initialItems.map((item) => {
          const slot = this._slots[item.slotIndex];
          return {
            id: item.id || `item-${++this._idCounter}`,
            flowerId: item.flowerId,
            slotIndex: item.slotIndex,
            position: item.position ? { ...item.position } : { ...slot.position },
            rotation: Number.isFinite(item.rotation) ? item.rotation : slot.rotation,
            layer: Number.isFinite(item.layer) ? item.layer : slot.layer,
            pose: item.pose || slot.pose,
          };
        });
      }

      if (finish) {
        if (!VALID_PAPERS[finish.paper]) throw new Error(`Invalid paper: ${finish.paper}`);
        if (!VALID_RIBBONS[finish.ribbon]) throw new Error(`Invalid ribbon: ${finish.ribbon}`);
        if (![0, 1, 2, 3].includes(finish.bowStep)) {
          throw new Error(`Invalid bowStep: ${finish.bowStep}`);
        }
        if (finish.ribbon === 'none' && finish.bowStep !== 0) {
          throw new Error('Bow step must be 0 when ribbon is none');
        }
        this._finish = { ...finish };
      }

      this._history = [];
    } else {
      if (initialItems && initialItems.length > 0) {
        throw new Error('Cannot supply initial items without a matching configuration');
      }
    }
  }

  get configuration(): Readonly<BouquetConfiguration> | null {
    return this._configuration ? Object.freeze({ ...this._configuration }) : null;
  }

  get slots(): readonly BouquetSlot[] {
    return this._slots;
  }

  get items(): readonly BouquetItem[] {
    return Object.freeze(
      this._items.map((item) =>
        Object.freeze({
          ...item,
          position: Object.freeze({ ...item.position }),
        }),
      ),
    );
  }

  get finish(): Readonly<BouquetFinish> {
    return Object.freeze({ ...this._finish });
  }

  get isFull(): boolean {
    return (
      this._configuration !== null &&
      this._items.length === this._configuration.stemCount
    );
  }

  get submission(): BouquetSubmission {
    if (!this._configuration) {
      throw new Error('Cannot get submission: bouquet is not configured');
    }
    if (!this.isFull) {
      throw new Error(
        `Cannot get submission: bouquet is not full (${this._items.length}/${this._configuration.stemCount} stems)`,
      );
    }
    return Object.freeze({
      configuration: Object.freeze({ ...this._configuration }),
      items: this.items,
      finish: Object.freeze({ ...this._finish }),
    });
  }

  configure(configuration: BouquetConfiguration): void {
    if (this._configuration !== null) {
      throw new Error(
        'Bouquet configuration is locked. Call reset() to start a new configuration.',
      );
    }
    if (!configuration || typeof configuration !== 'object') {
      throw new Error('Configuration must be an object');
    }
    if (!VALID_VESSELS[configuration.vessel]) {
      throw new Error(`Invalid vessel kind: ${configuration.vessel}`);
    }
    if (
      !Number.isInteger(configuration.stemCount) ||
      configuration.stemCount < 1 ||
      configuration.stemCount > 24
    ) {
      throw new Error(
        `Stem count must be an integer between 1 and 24, got: ${configuration.stemCount}`,
      );
    }

    const newSlots = generateSlots(configuration.vessel, configuration.stemCount);

    this.saveSnapshot();
    this._configuration = {
      vessel: configuration.vessel,
      stemCount: configuration.stemCount,
    };
    this._slots = newSlots;

  }

  add(flowerId: string): BouquetItem {
    if (!this._configuration) {
      throw new Error('Bouquet is not configured. Call configure() before adding stems.');
    }
    if (this.isFull) {
      throw new Error(
        `Bouquet is full. Maximum capacity is ${this._configuration.stemCount} stems.`,
      );
    }
    const flowerDef = contentBundle.flowers.find((f) => f.id === flowerId);
    if (!flowerDef) {
      throw new Error(`Unknown flower ID: ${flowerId}`);
    }

    const occupiedSlots: Record<number, true> = {};
    for (const item of this._items) {
      occupiedSlots[item.slotIndex] = true;
    }

    let targetSlot: BouquetSlot | undefined;
    for (const slot of this._slots) {
      if (!occupiedSlots[slot.index]) {
        targetSlot = slot;
        break;
      }
    }

    if (!targetSlot) {
      throw new Error('No vacant slot found.');
    }

    this.saveSnapshot();
    const item: MutableBouquetItem = {
      id: `item-${++this._idCounter}`,
      flowerId,
      slotIndex: targetSlot.index,
      position: { x: targetSlot.position.x, y: targetSlot.position.y },
      rotation: targetSlot.rotation,
      layer: targetSlot.layer,
      pose: targetSlot.pose,
    };

    this._items.push(item);

    if (this._finish.bowStep > 0) {
      this._finish = { ...this._finish, bowStep: 0 };
    }

    return Object.freeze({
      ...item,
      position: Object.freeze({ ...item.position }),
    });
  }

  remove(id: string): void {
    const index = this._items.findIndex((item) => item.id === id);
    if (index === -1) return;

    this.saveSnapshot();
    this._items.splice(index, 1);

    if (this._finish.bowStep > 0) {
      this._finish = { ...this._finish, bowStep: 0 };
    }
  }

  rotate(id: string, delta: number): void {
    if (!Number.isFinite(delta)) {
      throw new Error('Rotation delta must be a finite number');
    }
    const item = this._items.find((entry) => entry.id === id);
    if (!item) return;

    const slot = this._slots.find((s) => s.index === item.slotIndex);
    const baseRotation = slot ? slot.rotation : 0;

    const candidate = item.rotation + delta;
    const clamped = Math.max(baseRotation - 25, Math.min(baseRotation + 25, candidate));
    const rounded = Math.round(clamped * 10) / 10;

    if (rounded === item.rotation) {
      return;
    }

    this.saveSnapshot();
    item.rotation = rounded;
  }

  clear(): void {
    if (this._items.length === 0 && this._finish.bowStep === 0) return;
    this.saveSnapshot();
    this._items = [];
    this._finish = { ...this._finish, bowStep: 0 };
  }

  reset(): void {
    this._configuration = null;
    this._slots = [];
    this._items = [];
    this._finish = { paper: 'none', ribbon: 'none', bowStep: 0, cardId: null };
    this._history = [];
    this._isGestureActive = false;
    this._gestureHasSnapshot = false;
  }

  beginGesture(): void {
    this._isGestureActive = true;
    this._gestureHasSnapshot = false;
  }

  endGesture(): void {
    this._isGestureActive = false;
    this._gestureHasSnapshot = false;
  }

  undo(): void {
    const previous = this._history.pop();
    if (!previous) return;

    this._configuration = previous.configuration ? { ...previous.configuration } : null;
    this._slots = previous.slots;
    this._items = previous.items.map((it) => ({
      ...it,
      position: { ...it.position },
    }));
    this._finish = { ...previous.finish };
  }

  setPaper(value: BouquetFinish['paper']): void {
    if (!VALID_PAPERS[value]) {
      throw new Error(`Invalid paper value: ${value}`);
    }
    if (this._finish.paper === value) return;
    this.saveSnapshot();
    this._finish = {
      ...this._finish,
      paper: value,
      bowStep: 0,
    };
  }

  setRibbon(value: BouquetFinish['ribbon']): void {
    if (!VALID_RIBBONS[value]) {
      throw new Error(`Invalid ribbon value: ${value}`);
    }
    if (this._finish.ribbon === value) return;
    this.saveSnapshot();
    this._finish = {
      ...this._finish,
      ribbon: value,
      bowStep: 0,
    };
  }

  advanceBow(): void {
    if (this._finish.ribbon === 'none') {
      return;
    }
    if (this._finish.bowStep >= 3) {
      return;
    }
    this.saveSnapshot();
    const nextStep = (this._finish.bowStep + 1) as 1 | 2 | 3;
    this._finish = {
      ...this._finish,
      bowStep: nextStep,
    };
  }

  setCard(cardId: string | null): void {
    if (cardId !== null && typeof cardId !== 'string') {
      throw new Error('Card ID must be a string or null');
    }
    if (this._finish.cardId === cardId) return;
    this.saveSnapshot();
    this._finish = {
      ...this._finish,
      cardId,
    };
  }

  private saveSnapshot(): void {
    if (this._isGestureActive) {
      if (this._gestureHasSnapshot) {
        return;
      }
      this._gestureHasSnapshot = true;
    }
    this._history.push({
      configuration: this._configuration ? { ...this._configuration } : null,
      slots: this._slots,
      items: this._items.map((it) => ({
        ...it,
        position: { ...it.position },
      })),
      finish: { ...this._finish },
    });
    if (this._history.length > 50) {
      this._history.shift();
    }
  }
}

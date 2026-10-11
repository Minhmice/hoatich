import { contentBundle } from '../content';

export interface BouquetItem {
  id: string;
  flowerId: string;
  position: { x: number; y: number };
  layer: number;
  rotation: number;
}

export class BouquetModel {
  private _items: BouquetItem[] = [];
  private _history: BouquetItem[][] = [];
  private _idCounter = 0;
  private _isGestureActive = false;
  private _gestureHasSnapshot = false;
  constructor(initialItems?: readonly BouquetItem[]) {
    if (initialItems) {
      for (const item of initialItems) {
        if (!contentBundle.flowers.some((f) => f.id === item.flowerId)) {
          throw new Error(`Unknown flower ID: ${item.flowerId}`);
        }
        if (!Number.isFinite(item.position.x) || !Number.isFinite(item.position.y)) {
          throw new Error('Position coordinates must be finite numbers');
        }
        if (!Number.isFinite(item.layer)) {
          throw new Error('Layer must be a finite number');
        }
        if (!Number.isFinite(item.rotation)) {
          throw new Error('Rotation must be a finite number');
        }
      }

      this._items = initialItems.map((item) => ({
        id: item.id,
        flowerId: item.flowerId,
        position: { x: item.position.x, y: item.position.y },
        layer: item.layer,
        rotation: item.rotation,
      }));
    }
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
  // ponytail: single gesture flag ceiling; upgrade to gesture stack if nested compound gestures needed.
  beginGesture(): void {
    this._isGestureActive = true;
    this._gestureHasSnapshot = false;
  }

  endGesture(): void {
    this._isGestureActive = false;
    this._gestureHasSnapshot = false;
  }

  add(flowerId: string, position = { x: 640, y: 410 }): BouquetItem {
    if (!contentBundle.flowers.some((f) => f.id === flowerId)) {
      throw new Error(`Unknown flower ID: ${flowerId}`);
    }
    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      throw new Error('Position coordinates must be finite numbers');
    }

    this.saveSnapshot();
    const id = `item-${++this._idCounter}-${Math.random().toString(36).slice(2, 8)}`;
    const newItem: BouquetItem = {
      id,
      flowerId,
      position: { x: position.x, y: position.y },
      layer: this._items.length,
      rotation: 0,
    };
    this._items.push(newItem);
    return newItem;
  }

  remove(id: string): void {
    const idx = this._items.findIndex((item) => item.id === id);
    if (idx === -1) return;

    this.saveSnapshot();
    this._items.splice(idx, 1);
    this._items.forEach((item, index) => {
      item.layer = index;
    });
  }

  move(id: string, x: number, y: number): void {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error('Coordinates must be finite numbers');
    }

    const item = this._items.find((item) => item.id === id);
    if (!item) return;

    this.saveSnapshot();
    item.position = { x, y };
  }

  rotate(id: string, delta: number): void {
    if (!Number.isFinite(delta)) {
      throw new Error('Rotation delta must be a finite number');
    }

    const item = this._items.find((item) => item.id === id);
    if (!item) return;

    this.saveSnapshot();
    item.rotation += delta;
  }

  reorder(id: string, direction: -1 | 1): void {
    if (direction !== -1 && direction !== 1) {
      throw new Error('Direction must be -1 or 1');
    }

    const idx = this._items.findIndex((item) => item.id === id);
    if (idx === -1) return;

    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this._items.length) return;

    this.saveSnapshot();
    const temp = this._items[idx];
    this._items[idx] = this._items[targetIdx];
    this._items[targetIdx] = temp;
    this._items.forEach((item, index) => {
      item.layer = index;
    });
  }


  clear(): void {
    if (this._items.length === 0) return;

    this.saveSnapshot();
    this._items = [];
  }

  private saveSnapshot(): void {
    if (this._isGestureActive) {
      if (this._gestureHasSnapshot) {
        return;
      }
      this._gestureHasSnapshot = true;
    }

    this._history.push(
      this._items.map((item) => ({
        id: item.id,
        flowerId: item.flowerId,
        position: { ...item.position },
        layer: item.layer,
        rotation: item.rotation,
      })),
    );
  }

  undo(): void {
    const previous = this._history.pop();
    if (previous !== undefined) {
      this._items = previous;
      this._gestureHasSnapshot = false;
    }
  }
}

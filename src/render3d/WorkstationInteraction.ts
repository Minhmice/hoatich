import { Raycaster, Vector2, type Camera } from 'three';
import type { BouquetModel } from '../game/bouquet/BouquetModel';
import type { Workstation3D } from './Workstation3D';

export interface WorkstationInteractionOptions {
  readonly enabled: () => boolean;
  readonly onChange: (selectedId: string | null) => void;
  readonly onSlotClick?: (slotIndex: number) => void;
}

export class WorkstationInteraction {
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly events = new AbortController();
  private activePointerId: number | null = null;
  private selectedItemId: string | null = null;
  private lastClientX = 0;
  private isRotating = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly camera: Camera,
    workstation: Workstation3D,
    private readonly bouquet: BouquetModel,
    options: WorkstationInteractionOptions,
  ) {
    const signal = this.events.signal;

    canvas.addEventListener(
      'pointerdown',
      (event) => {
        if (!options.enabled() || event.button !== 0 || this.activePointerId !== null) return;

        this.cast(event);
        const hit = this.raycaster.intersectObjects([...workstation.pickables], false)[0]?.object;
        const itemId = typeof hit?.userData.itemId === 'string' ? hit.userData.itemId : null;
        const isSlotRing = hit?.userData.isSlotRing === true;
        const slotIndex = typeof hit?.userData.slotIndex === 'number' ? hit.userData.slotIndex : null;

        if (itemId) {
          this.selectedItemId = itemId;
          this.activePointerId = event.pointerId;
          this.lastClientX = event.clientX;
          this.isRotating = true;
          this.bouquet.beginGesture();
          options.onChange(itemId);
          canvas.setPointerCapture(event.pointerId);
        } else if (isSlotRing && slotIndex !== null) {
          this.selectedItemId = null;
          options.onChange(null);
          options.onSlotClick?.(slotIndex);
        } else {
          this.selectedItemId = null;
          options.onChange(null);
        }
      },
      { signal },
    );

    canvas.addEventListener(
      'pointermove',
      (event) => {
        if (!this.isRotating || event.pointerId !== this.activePointerId || !this.selectedItemId) return;
        if (!options.enabled()) {
          this.cancel();
          return;
        }

        const deltaX = event.clientX - this.lastClientX;
        this.lastClientX = event.clientX;

        // Subtle horizontal rotation drag: 10 pixels = ~2 degrees
        if (Math.abs(deltaX) > 0.5) {
          const deltaAngle = (deltaX / 5) * 1;
          this.bouquet.rotate(this.selectedItemId, deltaAngle);
          options.onChange(this.selectedItemId);
        }
      },
      { signal },
    );

    // Mouse wheel rotates selected item
    canvas.addEventListener(
      'wheel',
      (event) => {
        if (!options.enabled() || !this.selectedItemId) return;
        event.preventDefault();
        const deltaAngle = event.deltaY > 0 ? 5 : -5;
        this.bouquet.rotate(this.selectedItemId, deltaAngle);
        options.onChange(this.selectedItemId);
      },
      { signal, passive: false },
    );

    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      canvas.addEventListener(type, () => this.cancel(), { signal });
    }
    window.addEventListener('blur', () => this.cancel(), { signal });
  }

  private cast(event: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  cancel(): void {
    const id = this.activePointerId;
    this.activePointerId = null;
    if (this.isRotating) {
      this.isRotating = false;
      this.bouquet.endGesture();
    }
    if (id !== null && this.canvas.hasPointerCapture(id)) {
      this.canvas.releasePointerCapture(id);
    }
  }

  dispose(): void {
    this.cancel();
    this.events.abort();
  }
}

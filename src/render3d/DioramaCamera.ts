import { PerspectiveCamera, Vector3 } from 'three';
import type { ActiveView } from '../game/GameRuntime';

function applyViewPose(
  view: ActiveView,
  aspect: number,
  outPos: Vector3,
  outTarget: Vector3,
): void {
  const safeAspect = aspect > 0 ? aspect : 1;
  const zoom = Math.max(1, 1 / safeAspect);

  if (view === 'counter') {
    outPos.set(1.8, 3.2 * zoom, 7.5 * zoom);
    outTarget.set(2.2, 1.8, -3.0);
  } else if (view === 'lobby') {
    outPos.set(0, 3.8 * zoom, 8.5 * zoom);
    outTarget.set(0, 1.8, -2.5);
  } else {
    // 'workspace'
    outPos.set(0, 10 * zoom, 12 * zoom);
    outTarget.set(0, 0, 0);
  }
}

export function getViewPose(
  view: ActiveView,
  aspect: number,
): { position: Vector3; target: Vector3 } {
  const position = new Vector3();
  const target = new Vector3();
  applyViewPose(view, aspect, position, target);
  return { position, target };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class DioramaCamera extends PerspectiveCamera {
  readonly currentTarget = new Vector3();
  private readonly _startPos = new Vector3();
  private readonly _startTarget = new Vector3();
  private readonly _destPos = new Vector3();
  private readonly _destTarget = new Vector3();
  private _activeView: ActiveView = 'workspace';
  private _transitioning = false;
  private _transitionElapsed = 0;
  private readonly _durationMs = 500;

  constructor(initialView: ActiveView = 'workspace', aspect = 1) {
    super(45, aspect, 0.1, 100);
    this._activeView = initialView;
    applyViewPose(initialView, aspect, this._destPos, this._destTarget);
    this.position.copy(this._destPos);
    this.currentTarget.copy(this._destTarget);
    this.lookAt(this.currentTarget);
  }

  get activeView(): ActiveView {
    return this._activeView;
  }

  get transitioning(): boolean {
    return this._transitioning;
  }

  setView(view: ActiveView, reducedMotion = false): void {
    if (view === this._activeView) {
      if (reducedMotion && this._transitioning) {
        this._transitioning = false;
        this._transitionElapsed = this._durationMs;
        this.position.copy(this._destPos);
        this.currentTarget.copy(this._destTarget);
        this.lookAt(this.currentTarget);
      }
      return;
    }
    this._activeView = view;
    applyViewPose(view, this.aspect, this._destPos, this._destTarget);

    if (reducedMotion) {
      this._transitioning = false;
      this._transitionElapsed = this._durationMs;
      this.position.copy(this._destPos);
      this.currentTarget.copy(this._destTarget);
      this.lookAt(this.currentTarget);
      return;
    }

    this._startPos.copy(this.position);
    this._startTarget.copy(this.currentTarget);
    this._transitionElapsed = 0;
    this._transitioning = true;
  }

  resize(aspect: number): void {
    this.aspect = aspect;
    this.updateProjectionMatrix();

    applyViewPose(this._activeView, aspect, this._destPos, this._destTarget);

    if (!this._transitioning) {
      this.position.copy(this._destPos);
      this.currentTarget.copy(this._destTarget);
      this.lookAt(this.currentTarget);
    }
  }

  update(delta: number): boolean {
    if (!this._transitioning) {
      return false;
    }

    const dtMs = Math.max(0, delta);
    this._transitionElapsed += dtMs;

    const t = Math.min(1, this._transitionElapsed / this._durationMs);
    const progress = easeInOutCubic(t);

    this.position.lerpVectors(this._startPos, this._destPos, progress);
    this.currentTarget.lerpVectors(this._startTarget, this._destTarget, progress);
    this.lookAt(this.currentTarget);

    if (t >= 1) {
      this._transitioning = false;
      this.position.copy(this._destPos);
      this.currentTarget.copy(this._destTarget);
      this.lookAt(this.currentTarget);
    }

    return this._transitioning;
  }

  step(dtSeconds: number): boolean {
    return this.update(dtSeconds * 1000);
  }
}

export function createDioramaCamera(initialView: ActiveView = 'workspace'): DioramaCamera {
  return new DioramaCamera(initialView);
}

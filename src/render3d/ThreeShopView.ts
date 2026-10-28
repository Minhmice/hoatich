import { Color, Scene, WebGLRenderer } from 'three';
import type { GameSession } from '../game/GameSession';
import type { BouquetModel } from '../game/bouquet/BouquetModel';
import type { ActiveView } from '../game/GameRuntime';
import { contentBundle } from '../game/content';
import { createDioramaCamera, type DioramaCamera } from './DioramaCamera';
import { DioramaLighting } from './DioramaLighting';
import { RoomEnvironment } from './RoomEnvironment';
import { CharacterBillboard } from './CharacterBillboard';
import { Workstation3D } from './Workstation3D';
import { WorkstationInteraction } from './WorkstationInteraction';

export class ThreeShopView {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer = new WebGLRenderer({ antialias: true });
  private readonly scene = new Scene();
  private readonly camera: DioramaCamera;
  private readonly lighting = new DioramaLighting();
  private readonly environment: RoomEnvironment;
  private readonly player: CharacterBillboard;
  private readonly customer: CharacterBillboard;
  private readonly workstation: Workstation3D;
  private readonly interaction: WorkstationInteraction;
  private readonly resize: ResizeObserver;
  private currentView: ActiveView;
  private requestedInputEnabled = false;
  private inputEnabled = false;
  private lastFrameTime = 0;
  private disposed = false;

  constructor(
    private readonly parent: HTMLElement,
    private readonly session: GameSession,
    private readonly bouquet: BouquetModel,
    onBouquetChange: (selectedId: string | null) => void,
    initialView: ActiveView = 'workspace',
  ) {
    this.currentView = initialView;
    this.camera = createDioramaCamera(initialView);
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute(
      'aria-label',
      'Không gian tiệm hoa 3D. Dùng thanh thao tác để chọn và chỉnh cành hoa bằng bàn phím.',
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene.background = new Color(0xede6ce);
    this.scene.add(this.lighting);
    this.environment = new RoomEnvironment(this.scene, this.camera);
    this.player = new CharacterBillboard(this.scene, this.camera, -4.8);
    this.customer = new CharacterBillboard(this.scene, this.camera, 4.8);
    this.workstation = new Workstation3D(this.scene);
    this.interaction = new WorkstationInteraction(
      this.canvas,
      this.camera,
      this.workstation,
      bouquet,
      {
        enabled: () => this.inputEnabled && this.isWorkspaceInteractive(),
        onChange: (selectedId) => {
          if (this.inputEnabled && this.isWorkspaceInteractive()) {
            onBouquetChange(selectedId);
          }
        },
      },
    );
    this.resize = new ResizeObserver(() => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (!width || !height) return;
      this.camera.resize(width / height);
      this.renderer.setSize(width, height);
      this.environment.resize(this.camera);
      this.player.updateOrientation(this.camera);
      this.customer.updateOrientation(this.camera);
    });
  }

  get transitioning(): boolean {
    return this.camera.transitioning;
  }

  get activeView(): ActiveView {
    return this.currentView;
  }

  private isWorkspaceInteractive(): boolean {
    return this.currentView === 'workspace' && !this.camera.transitioning;
  }

  private updateEffectiveInput(): void {
    const effective = this.requestedInputEnabled && this.isWorkspaceInteractive();
    this.inputEnabled = effective;
    if (!effective) {
      this.interaction.cancel();
    }
  }

  setView(view: ActiveView, reducedMotion = false): void {
    if (this.disposed) return;
    if (view === this.currentView && !this.camera.transitioning) return;

    this.currentView = view;
    this.camera.setView(view, reducedMotion);
    this.updateEffectiveInput();

    if (reducedMotion) {
      this.environment.resize(this.camera);
      this.player.updateOrientation(this.camera);
      this.customer.updateOrientation(this.camera);
    }
  }

  async mount(): Promise<void> {
    if (this.disposed) throw new Error('Không thể mount view đã dispose. Tạo view mới để mở lại.');
    this.parent.prepend(this.canvas);
    this.resize.observe(this.parent);
    try {
      await Promise.all([
        this.environment.load(),
        this.player.load(),
        this.customer.load(),
        this.workstation.load(),
      ]);
    } catch (error) {
      this.dispose();
      throw error;
    }
    if (this.disposed) return;

    this.lastFrameTime = 0;
    this.renderer.setAnimationLoop((time) => {
      if (this.disposed) return;
      const dt = this.lastFrameTime ? time - this.lastFrameTime : 16.6;
      this.lastFrameTime = time;

      const wasTransitioning = this.camera.transitioning;
      this.camera.update(dt);

      if (wasTransitioning || this.camera.transitioning) {
        this.environment.resize(this.camera);
        this.player.updateOrientation(this.camera);
        this.customer.updateOrientation(this.camera);
      }

      if (wasTransitioning && !this.camera.transitioning) {
        this.updateEffectiveInput();
      }

      this.renderer.render(this.scene, this.camera);
    });
  }

  sync(selectedId: string | null, inputEnabled: boolean): void {
    if (this.disposed) return;
    this.requestedInputEnabled = inputEnabled;
    this.updateEffectiveInput();
    this.workstation.sync(this.bouquet, selectedId);
    const shift = this.session.state.currentShift;
    this.environment.setShift(shift);
    this.lighting.setShift(shift);
    const showSceneCharacters = this.currentView !== 'counter' && this.currentView !== 'workspace';
    this.player.sync('player', false, 'neutral', showSceneCharacters);
    this.environment.resize(this.camera);
    const order = this.session.currentOrder;
    const customer = contentBundle.customers.find((entry) => entry.id === order?.customerId);
    const outcome = this.session.lastDeliveryResult?.outcome;
    const portraitKey = customer?.portraitKey ?? 'customer-one';
    const mood =
      portraitKey === 'passerby' && outcome === 'resonant'
        ? 'annoyed'
        : portraitKey === 'customer-one' && outcome === 'missed'
          ? 'happy'
          : outcome === 'resonant'
            ? 'happy'
            : outcome === 'missed'
              ? 'worried'
              : 'neutral';
    this.customer.sync(
      order ? portraitKey : null,
      shift === 'dead',
      mood,
      showSceneCharacters,
    );
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resize.disconnect();
    this.interaction.dispose();
    this.workstation.dispose();
    this.player.dispose();
    this.customer.dispose();
    this.environment.dispose();
    this.lighting.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }
}

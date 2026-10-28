import type { GameSession, DeliveryResult } from './GameSession';
import type {
  BouquetItem,
  BouquetModel,
  BouquetConfiguration,
  BouquetFinish,
  BouquetSlot,
  VesselKind,
} from './bouquet/BouquetModel';
import type { AudioManager } from './audio';
import type { SaveRepository } from './save/SaveRepository';
import type { GameSettings, GameState } from './state/GameState';
import type {
  CardChoice,
  DialogueChoice,
  DialogueNode,
  OrderArrangement,
  OrderDefinition,
  Shift,
} from './content/types';
import {
  getAvailableVessels,
  getCardChoices,
  getDayNumber,
  getFeatures,
  getOrderArrangement,
  getOrderNote,
  getUnlockedSpeciesForDay,
} from './content/progression';
export type ActiveView = 'lobby' | 'counter' | 'workspace';

export class GameRuntime {
  private readonly subscribers = new Set<() => void>();
  private _selectedItemId: string | null = null;
  private _activeView: ActiveView = 'lobby';

  constructor(
    public readonly session: GameSession,
    public readonly bouquet: BouquetModel,
    public readonly audio: AudioManager,
    public readonly repository?: SaveRepository,
  ) {
    this.audio.setShift(this.session.state.currentShift);
    this.ensureNextOrderReady();
  }

  get snapshot(): Readonly<GameState> {
    return this.session.state;
  }

  get selectedItemId(): string | null {
    return this._selectedItemId;
  }
  get activeView(): ActiveView {
    return this._activeView;
  }

  private get canManipulateWorkspace(): boolean {
    return this._activeView === 'workspace' && this.canCompose;
  }

  public navigate(view: ActiveView): boolean {
    if (view === this._activeView) {
      return true;
    }

    if (view === 'workspace') {
      if (this._activeView === 'lobby') {
        return false;
      }
      if (!this.session.currentOrder || !this.canCompose) {
        return false;
      }
    }

    this._activeView = view;
    this.notify();
    return true;
  }


  get bouquetItems(): readonly BouquetItem[] {
    return this.bouquet.items;
  }

  get dialogue(): DialogueNode | undefined {
    return this.session.dialogue;
  }

  get currentOrder(): OrderDefinition | undefined {
    return this.session.currentOrder;
  }

  get currentChoices(): DialogueChoice[] {
    return this.session.currentChoices;
  }

  get canCompose(): boolean {
    return this.session.canCompose;
  }

  get isShiftComplete(): boolean {
    return this.session.isShiftComplete;
  }

  get isDemoComplete(): boolean {
    return this.session.isDemoComplete;
  }

  get progress(): { completed: number; total: number } {
    return this.session.progress;
  }

  get lastDeliveryResult(): DeliveryResult | undefined {
    return this.session.lastDeliveryResult;
  }

  get currentDayNumber(): number {
    return getDayNumber(this.session.state.currentDay);
  }

  get features(): { paper: boolean; ribbon: boolean; cards: boolean } {
    return getFeatures(this.session.state.currentDay);
  }

  get availableVessels(): readonly VesselKind[] {
    return getAvailableVessels(this.session.state.currentDay);
  }

  get currentOrderArrangement(): OrderArrangement | null {
    if (!this.session.currentOrder) return null;
    return getOrderArrangement(this.session.currentOrder.id);
  }

  get currentOrderCardChoices(): readonly CardChoice[] {
    if (!this.session.currentOrder) return [];
    return getCardChoices(this.session.currentOrder.id);
  }

  get heardOrderNotes(): readonly string[] {
    if (!this.session.currentOrder) return [];
    return getOrderNote(this.session.currentOrder.id, this.session.state.flags);
  }

  get isOrderDetailHeard(): boolean {
    if (!this.session.currentOrder) return false;
    return Boolean(this.session.state.flags[`flag_heard_detail_${this.session.currentOrder.id}`]);
  }

  get isBouquetConfigured(): boolean {
    return this.bouquet.configuration !== null;
  }

  get bouquetConfiguration(): Readonly<BouquetConfiguration> | null {
    return this.bouquet.configuration;
  }

  get bouquetSlots(): readonly BouquetSlot[] {
    return this.bouquet.slots;
  }

  get bouquetFinish(): Readonly<BouquetFinish> {
    return this.bouquet.finish;
  }

  get isBouquetFull(): boolean {
    return this.bouquet.isFull;
  }

  public getRemainingStock(flowerId: string): number {
    const total = this.session.state.inventory[flowerId] ?? 0;
    const drafted = this.bouquet.items.filter((item) => item.flowerId === flowerId).length;
    return Math.max(0, total - drafted);
  }

  public configureBouquet(vessel: VesselKind, stemCount: number): void {
    if (!this.canManipulateWorkspace) {
      throw new Error('Chỉ có thể thiết lập bình hoa khi đang ở bàn cắm hoa và không có hội thoại.');
    }
    this.bouquet.configure({ vessel, stemCount });
    this.notify();
  }

  public resetBouquet(): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    this.bouquet.reset();
    this._selectedItemId = null;
    this.notify();
  }
  public subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private notify(): void {
    this.ensureNextOrderReady();
    for (const sub of this.subscribers) {
      sub();
    }
  }

  private ensureNextOrderReady(): void {
    if (
      !this.session.isDemoComplete &&
      !this.session.currentOrder &&
      !this.session.dialogue
    ) {
      const candidates = this.session.getOrdersForCurrentShift();
      const hasPending = candidates.some((o) => !this.session.state.completedOrderIds.includes(o.id));
      if (hasPending) {
        try {
          this.session.startOrder();
        } catch {
          // No more orders in shift
        }
      }
    }
  }

  public addFlower(flowerId: string): BouquetItem {
    if (!this.canManipulateWorkspace) {
      throw new Error('Chỉ có thể cắm hoa khi đang ở bàn cắm hoa và không có hội thoại.');
    }
    if (!this.isBouquetConfigured) {
      throw new Error('Cần chọn bình hoa và số lượng cành trước khi cắm hoa.');
    }
    if (this.isBouquetFull) {
      throw new Error('Bình hoa đã đủ số lượng cành quy định.');
    }

    const unlockedSpecies = getUnlockedSpeciesForDay(this.session.state.currentDay);
    if (!unlockedSpecies.includes(flowerId) || !this.session.state.unlockedFlowerIds.includes(flowerId)) {
      throw new Error(`Loài hoa "${flowerId}" chưa được mở khóa.`);
    }

    const remaining = this.getRemainingStock(flowerId);
    if (remaining <= 0) {
      throw new Error(`Hoa "${flowerId}" đã hết trong kho.`);
    }

    const item = this.bouquet.add(flowerId);
    this._selectedItemId = item.id;
    this.audio.playPlacementSfx();
    this.notify();
    return item;
  }

  public selectItem(id: string | null): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (id !== null && !this.bouquet.items.some((i) => i.id === id)) {
      this._selectedItemId = null;
    } else {
      this._selectedItemId = id;
    }
    this.notify();
  }

  public cycleSelection(delta: number): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    const items = this.bouquet.items;
    if (items.length === 0) {
      this._selectedItemId = null;
      this.notify();
      return;
    }
    if (!this._selectedItemId) {
      this._selectedItemId = delta >= 0 ? items[0].id : items[items.length - 1].id;
    } else {
      const idx = items.findIndex((i) => i.id === this._selectedItemId);
      if (idx === -1) {
        this._selectedItemId = items[0].id;
      } else {
        const nextIdx = (idx + delta + items.length) % items.length;
        this._selectedItemId = items[nextIdx].id;
      }
    }
    this.notify();
  }

  public rotateSelected(degrees: number): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (this._selectedItemId) {
      this.bouquet.rotate(this._selectedItemId, degrees);
      this.notify();
    }
  }

  public removeSelected(): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (this._selectedItemId) {
      this.bouquet.remove(this._selectedItemId);
      this._selectedItemId = null;
      this.notify();
    }
  }

  public removeFlower(id: string): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    this.bouquet.remove(id);
    if (this._selectedItemId === id) {
      this._selectedItemId = null;
    }
    this.notify();
  }

  public undoBouquet(): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    this.bouquet.undo();
    if (this._selectedItemId && !this.bouquet.items.some((i) => i.id === this._selectedItemId)) {
      this._selectedItemId = null;
    }
    this.notify();
  }

  public clearBouquet(): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    this.bouquet.clear();
    this._selectedItemId = null;
    this.notify();
  }

  public setPaper(paper: BouquetFinish['paper']): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (!this.features.paper && paper !== 'none') {
      throw new Error('Giấy gói chưa mở khóa ở ngày này.');
    }
    this.bouquet.setPaper(paper);
    this.notify();
  }

  public setRibbon(ribbon: BouquetFinish['ribbon']): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (!this.features.ribbon && ribbon !== 'none') {
      throw new Error('Ruy-băng chưa mở khóa ở ngày này.');
    }
    this.bouquet.setRibbon(ribbon);
    this.notify();
  }

  public advanceBow(): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (!this.features.ribbon) {
      throw new Error('Thắt nơ ruy-băng chưa mở khóa ở ngày này.');
    }
    this.bouquet.advanceBow();
    this.notify();
  }

  public setCard(cardId: string | null): void {
    if (!this.canManipulateWorkspace) {
      return;
    }
    if (!this.features.cards && cardId !== null) {
      throw new Error('Thiệp nhắn chưa mở khóa ở ngày này.');
    }
    this.bouquet.setCard(cardId);
    this.notify();
  }

  public askOrderDetail(): void {
    const order = this.session.currentOrder;
    if (!order) {
      throw new Error('Không có đơn hàng nào đang hoạt động.');
    }
    this.session.requestOrderDetail();
    this.notify();
  }

  public deliver(): DeliveryResult {
    if (!this.canManipulateWorkspace) {
      throw new Error('Chỉ có thể trao hoa khi đang ở bàn cắm hoa và hoàn tất trao đổi.');
    }
    if (!this.session.currentOrder) {
      throw new Error('Không có đơn hàng nào đang hoạt động để trao hoa.');
    }
    if (!this.bouquet.configuration) {
      throw new Error('Chưa thiết lập bình hoa và số cành.');
    }
    if (!this.bouquet.isFull) {
      throw new Error(
        `Cần cắm đủ ${this.bouquet.configuration.stemCount} cành hoa trước khi trao (hiện có ${this.bouquet.items.length}).`,
      );
    }
    if (this.bouquet.finish.ribbon !== 'none' && this.bouquet.finish.bowStep !== 3) {
      throw new Error('Cần hoàn thiện thắt nơ ruy-băng (3 bước) trước khi trao hoa.');
    }

    const submission = this.bouquet.submission;
    const result = this.session.deliver(submission);
    const isSuccess = result.outcome !== 'missed';
    this.audio.playDeliverySfx(isSuccess);

    this.bouquet.reset();
    this._selectedItemId = null;
    this._activeView = 'counter';
    this.notify();
    return result;
  }
  public advanceDialogue(choiceId?: string): void {
    this.session.advanceDialogue(choiceId);
    this.notify();
  }

  public advanceShift(): { shift: Shift; dayId: string } {
    const res = this.session.advanceShift();
    this.audio.setShift(res.shift);
    this.notify();
    return res;
  }

  public applySettings(settings: Partial<GameSettings>): void {
    this.session.applySettings(settings);
    if (settings.musicVolume !== undefined) {
      this.audio.setMusicVolume(settings.musicVolume);
    }
    if (settings.sfxVolume !== undefined) {
      this.audio.setSfxVolume(settings.sfxVolume);
    }
    this.notify();
  }

  public async resetGame(): Promise<void> {
    await this.session.resetGame();
    this.bouquet.reset();
    this._selectedItemId = null;
    this._activeView = 'lobby';
    this.audio.setShift(this.session.state.currentShift);
    this.notify();
  }
}

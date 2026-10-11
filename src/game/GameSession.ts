import { contentBundle } from './content';
import type {
  DialogueChoice,
  DialogueNode,
  Effect,
  OrderDefinition,
  Outcome,
  Shift,
} from './content/types';
import { BouquetModel, type BouquetItem } from './bouquet/BouquetModel';
import { evaluateBouquet } from './bouquet/evaluateBouquet';
import type { GameSettings, GameState } from './state/GameState';
import { createInitialGameState } from './state/GameState';
import { applyEffects, reduceGameState, type GameEvent } from './state/stateReducer';
import type { SaveRepository } from './save/SaveRepository';

export const INTRO_DIALOGUE_ID = 'dlg-intro';

export const INTRO_DIALOGUE_NODE: DialogueNode = {
  id: INTRO_DIALOGUE_ID,
  speakerId: 'player',
  text: 'Tiệm hoa Cô Năm... Cuốn sổ tay cô để lại ghi chép bao bí quyết cắm hoa nối liền hai cõi. Ban ngày tiệm phục vụ khách cõi trần; khi màn đêm buông xuống, ranh giới sinh tử mịt mờ, những linh hồn mang tâm nguyện sẽ ghé tìm...',
  choices: [
    {
      id: 'choice-intro-start',
      text: 'Mở sổ tay và bắt đầu đón khách',
      effects: [
        { type: 'journal', entryId: 'journal_aunt_shop_creed' },
        { type: 'setFlag', flag: 'flag_intro_seen', value: true },
      ],
    },
  ],
};


export interface DeliveryResult {
  outcome: Outcome;
  reasonIds: string[];
  effects: Effect[];
  matchedRuleIds: string[];
  resultDialogueId: string;
}

export class GameSession {
  private _state: GameState;
  private readonly _saveRepo?: SaveRepository;
  private _lastDeliveryResult?: DeliveryResult;

  constructor(
    initialState?: GameState,
    saveRepo?: SaveRepository,
    private readonly onSaveError?: (error: unknown) => void,
  ) {
    this._state = initialState ? { ...initialState } : createInitialGameState();
    this._saveRepo = saveRepo;

    // Apply entry effects of resumed dialogue if not already applied
    if (this._state.activeDialogueId) {
      this.applyNodeEntryEffectsOnce(this._state.activeDialogueId);
    }
  }
  get state(): Readonly<GameState> {
    return this._state;
  }

  get content(): Readonly<typeof contentBundle> {
    return contentBundle;
  }

  get currentOrder(): OrderDefinition | undefined {
    if (!this._state.currentOrderId) return undefined;
    return contentBundle.orders.find((o) => o.id === this._state.currentOrderId);
  }

  get canCompose(): boolean {
    return Boolean(this.currentOrder && !this.dialogue);
  }
  get dialogue(): DialogueNode | undefined {
    if (!this._state.flags.flag_intro_seen && !this._state.currentOrderId) {
      return INTRO_DIALOGUE_NODE;
    }
    if (this._state.activeDialogueId) {
      if (this._state.activeDialogueId === INTRO_DIALOGUE_ID) {
        return INTRO_DIALOGUE_NODE;
      }
      return contentBundle.dialogue.find((d) => d.id === this._state.activeDialogueId);
    }
    return undefined;
  }

  get currentChoices(): DialogueChoice[] {
    const d = this.dialogue;
    if (!d || !d.choices) return [];
    return d.choices.filter((choice) => {
      if (!choice.conditions || choice.conditions.length === 0) return true;
      return choice.conditions.every((c) => this._state.flags[c.flag] === c.equals);
    });
  }

  get isShiftComplete(): boolean {
    const shiftOrders = contentBundle.orders.filter(
      (o) => o.dayId === this._state.currentDay && o.shift === this._state.currentShift,
    );
    return (
      shiftOrders.length > 0 &&
      shiftOrders.every((o) => this._state.completedOrderIds.includes(o.id))
    );
  }

  get complete(): boolean {
    return (
      contentBundle.orders.length > 0 &&
      contentBundle.orders.every((o) => this._state.completedOrderIds.includes(o.id))
    );
  }

  get isDemoComplete(): boolean {
    return this.complete && !this._state.activeDialogueId;
  }

  get progress(): { completed: number; total: number } {
    return {
      completed: this._state.completedOrderIds.length,
      total: contentBundle.orders.length,
    };
  }

  get lastDeliveryResult(): DeliveryResult | undefined {
    return this._lastDeliveryResult;
  }

  public getOrdersForCurrentShift(): OrderDefinition[] {
    return contentBundle.orders.filter(
      (o) => o.dayId === this._state.currentDay && o.shift === this._state.currentShift,
    );
  }

  public startOrder(id?: string): OrderDefinition {
    let order: OrderDefinition | undefined;
    if (id) {
      order = contentBundle.orders.find((o) => o.id === id);
      if (!order) throw new Error(`Không tìm thấy đơn hàng với mã: ${id}`);
    } else {
      const candidates = this.getOrdersForCurrentShift();
      order = candidates.find((o) => !this._state.completedOrderIds.includes(o.id));
      if (!order) {
        throw new Error('Đã hoàn thành mọi đơn hàng trong buổi hiện tại.');
      }
    }

    this.dispatch({
      type: 'checkpoint',
      orderId: order.id,
      dialogueId: order.openingDialogueId,
    });

    this.applyNodeEntryEffectsOnce(order.openingDialogueId);
    this.persistInBackground();
    return order;
  }

  private applyNodeEntryEffectsOnce(nodeId: string): Effect[] {
    if (nodeId === INTRO_DIALOGUE_ID) return [];
    const node = contentBundle.dialogue.find((d) => d.id === nodeId);
    if (!node || !node.effects || node.effects.length === 0) return [];

    const flagKey = `dlg_effect_applied_${node.id}`;
    if (this._state.flags[flagKey]) {
      return []; // Already applied, avoid duplicate rewards
    }

    this._state = applyEffects(this._state, node.effects);
    this._state = {
      ...this._state,
      flags: {
        ...this._state.flags,
        [flagKey]: true,
      },
    };
    return node.effects;
  }

  public advanceDialogue(choiceId?: string): {
    nextDialogueId?: string;
    effectsApplied: Effect[];
    isFinished: boolean;
  } {
    // Handle intro progression
    if (!this._state.flags.flag_intro_seen && !this._state.currentOrderId) {
      const choice = INTRO_DIALOGUE_NODE.choices?.find((c) => c.id === choiceId);
      if (!choice) throw new Error('Lựa chọn mở đầu không hợp lệ.');
      const effects = choice.effects ?? [];
      this._state = applyEffects(this._state, effects);
      this._state = {
        ...this._state,
        flags: {
          ...this._state.flags,
          flag_intro_seen: true,
        },
      };
      // Automatically start the first living order
      const firstOrder = this.getOrdersForCurrentShift()[0];
      if (firstOrder) {
        this.dispatch({
          type: 'checkpoint',
          orderId: firstOrder.id,
          dialogueId: firstOrder.openingDialogueId,
        });
        this.applyNodeEntryEffectsOnce(firstOrder.openingDialogueId);
      }
      this.persistInBackground();
      return {
        nextDialogueId: firstOrder?.openingDialogueId,
        effectsApplied: effects,
        isFinished: false,
      };
    }

    const current = this.dialogue;
    if (!current) {
      return { isFinished: true, effectsApplied: [] };
    }

    let nextId: string | undefined;
    const applied: Effect[] = [];

    if (current.choices && current.choices.length > 0) {
      if (!choiceId) {
        throw new Error(`Cần chọn một phản hồi cho hội thoại "${current.id}"`);
      }
      const validChoices = this.currentChoices;
      const selected = validChoices.find((c) => c.id === choiceId);
      if (!selected) {
        throw new Error(`Lựa chọn "${choiceId}" không hợp lệ hoặc chưa đủ điều kiện`);
      }
      if (selected.effects && selected.effects.length > 0) {
        this._state = applyEffects(this._state, selected.effects);
        applied.push(...selected.effects);
      }
      nextId = selected.nextId;
    } else {
      nextId = current.nextId;
    }

    if (nextId) {
      this.dispatch({
        type: 'checkpoint',
        orderId: this._state.currentOrderId,
        dialogueId: nextId,
      });
      const nodeEffects = this.applyNodeEntryEffectsOnce(nextId);
      applied.push(...nodeEffects);
    } else {
      // Check if we are finishing a result dialogue
      const isResultDialogue =
        this.currentOrder &&
        Object.values(this.currentOrder.resultDialogueIds).includes(current.id);

      if (isResultDialogue) {
        this.dispatch({
          type: 'checkpoint',
          orderId: undefined,
          dialogueId: undefined,
        });
      } else {
        // Finishing ready/leaf dialogue: clear activeDialogueId so dialogue panel closes,
        // leaving currentOrderId active for bouquet composition and delivery
        this.dispatch({
          type: 'checkpoint',
          orderId: this._state.currentOrderId,
          dialogueId: undefined,
        });
      }
    }

    this.persistInBackground();
    return {
      nextDialogueId: nextId,
      effectsApplied: applied,
      isFinished: nextId === undefined,
    };
  }

  public deliver(
    bouquet: BouquetModel | readonly BouquetItem[],
    options?: { completeIfMissed?: boolean },
  ): DeliveryResult {
    const order = this.currentOrder;
    if (!order) {
      throw new Error('Không có đơn hàng nào đang hoạt động để trao hoa.');
    }

    const items: readonly BouquetItem[] = bouquet instanceof BouquetModel ? bouquet.items : bouquet;
    const flowerIds = items.map((i) => i.flowerId);

    // Validate inventory stock
    const counts: Record<string, number> = {};
    for (const fId of flowerIds) counts[fId] = (counts[fId] ?? 0) + 1;
    for (const [fId, count] of Object.entries(counts)) {
      const stock = this._state.inventory[fId] ?? 0;
      if (stock < count) {
        throw new Error(`Không đủ hoa trong kho cho "${fId}": cần ${count}, còn ${stock}`);
      }
    }

    const evaluation = evaluateBouquet(order, bouquet, { flags: this._state.flags });
    const resultDialogueId = order.resultDialogueIds[evaluation.outcome];

    const result: DeliveryResult = {
      outcome: evaluation.outcome,
      reasonIds: evaluation.reasonIds,
      effects: evaluation.effects,
      matchedRuleIds: evaluation.matchedRuleIds,
      resultDialogueId,
    };
    this._lastDeliveryResult = result;

    if (evaluation.outcome === 'accepted' || evaluation.outcome === 'resonant') {
      this.dispatch({
        type: 'completeOrder',
        orderId: order.id,
        bouquetFlowerIds: flowerIds,
        effects: evaluation.effects,
      });
      // Show result dialogue before moving to next order
      this._state = {
        ...this._state,
        currentOrderId: order.id,
        activeDialogueId: resultDialogueId,
      };
    } else {
      // Outcome is missed
      if (options?.completeIfMissed) {
        this.dispatch({
          type: 'completeOrder',
          orderId: order.id,
          bouquetFlowerIds: flowerIds,
          effects: evaluation.effects,
        });
        this._state = {
          ...this._state,
          currentOrderId: order.id,
          activeDialogueId: resultDialogueId,
        };
      } else {
        // Allow retry: keep inventory intact, show missed reaction
        this._state = {
          ...this._state,
          activeDialogueId: resultDialogueId,
        };
      }
    }

    this.persistInBackground();
    return result;
  }

  public retryMissed(): void {
    if (!this.currentOrder) return;
    // Return to opening or ready dialogue to recompose
    this.dispatch({
      type: 'checkpoint',
      orderId: this.currentOrder.id,
      dialogueId: this.currentOrder.openingDialogueId,
    });
    this._lastDeliveryResult = undefined;
    this.persistInBackground();
  }

  public advanceShift(): { shift: Shift; dayId: string } {
    if (!this.isShiftComplete) {
      throw new Error('Chưa hoàn thành tất cả đơn hàng trong buổi này.');
    }

    if (this._state.currentShift === 'living') {
      this.dispatch({
        type: 'advanceShift',
        shift: 'dead',
      });
    } else {
      // From dead shift -> start next day in living shift
      this.dispatch({
        type: 'advanceShift',
        shift: 'living',
        dayId: 'day-2',
      });
    }

    this.persistInBackground();
    return {
      shift: this._state.currentShift,
      dayId: this._state.currentDay,
    };
  }

  public applySettings(settings: Partial<GameSettings>): void {
    this.dispatch({
      type: 'settings',
      settings,
    });
    this.persistInBackground();
  }

  public async resetGame(): Promise<void> {
    const nextState = createInitialGameState();
    if (this._saveRepo) {
      await this._saveRepo.clear();
      await this._saveRepo.save(nextState);
    }
    this._state = nextState;
    this._lastDeliveryResult = undefined;
  }

  public dispatch(event: GameEvent): void {
    this._state = reduceGameState(this._state, event);
  }

  private persistInBackground(): void {
    void this.persist().catch((error) => this.onSaveError?.(error));
  }

  private async persist(): Promise<void> {
    await this._saveRepo?.save(this._state);
  }
}

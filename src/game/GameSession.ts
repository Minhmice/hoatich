import { contentBundle } from './content';
import { DAY_SEQUENCE, getFeatures, getCardChoices } from './content/progression';
import type { BouquetSubmission } from './content/types';
import type {
  DialogueChoice,
  DialogueNode,
  Effect,
  OrderDefinition,
  Outcome,
  Shift,
} from './content/types';
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

  public getPlayableOrders(): OrderDefinition[] {
    const completedSet = new Set(this._state.completedOrderIds);
    return contentBundle.orders.filter((order) => {
      if (completedSet.has(order.id)) return true;
      const completedSameEncounter = contentBundle.orders.some(
        (o) => o.dayId === order.dayId && o.customerId === order.customerId && completedSet.has(o.id)
      );
      if (completedSameEncounter) return false;
      const branch = this._state.npcProgress[order.customerId]?.activeBranch ?? 'neutral';
      return order.branch === undefined ? true : order.branch === branch;
    });
  }

  get isShiftComplete(): boolean {
    const shiftOrders = this.getOrdersForCurrentShift();
    return (
      shiftOrders.length > 0 &&
      shiftOrders.every((o) => this._state.completedOrderIds.includes(o.id))
    );
  }

  get complete(): boolean {
    const playable = this.getPlayableOrders();
    return (
      playable.length > 0 &&
      playable.every((o) => this._state.completedOrderIds.includes(o.id))
    );
  }

  get isDemoComplete(): boolean {
    return this.complete && !this._state.activeDialogueId;
  }

  get progress(): { completed: number; total: number } {
    const playable = this.getPlayableOrders();
    return {
      completed: this._state.completedOrderIds.length,
      total: playable.length,
    };
  }

  get lastDeliveryResult(): DeliveryResult | undefined {
    return this._lastDeliveryResult;
  }

  public getOrdersForCurrentShift(): OrderDefinition[] {
    return contentBundle.orders.filter((order) => {
      if (order.dayId !== this._state.currentDay || order.shift !== this._state.currentShift) return false;
      const branch = this._state.npcProgress[order.customerId]?.activeBranch ?? 'neutral';
      return order.branch === undefined ? true : order.branch === branch;
    });
  }

  public startOrder(id?: string): OrderDefinition {
    let order: OrderDefinition | undefined;
    if (id) {
      order = this.getOrdersForCurrentShift().find((o) => o.id === id);
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
  public requestOrderDetail(): void {
    const order = this.currentOrder;
    if (!order) throw new Error('No active order for detail request.');
    const flagId = `flag_heard_detail_${order.id}`;
    if (this._state.flags[flagId]) throw new Error('Order detail was already heard.');
    const detailDialogueId = `dlg-${order.id}-detail`;
    const detailNode = contentBundle.dialogue.find((d) => d.id === detailDialogueId);
    this._state = {
      ...this._state,
      flags: { ...this._state.flags, [flagId]: true },
      activeDialogueId: detailNode ? detailNode.id : this._state.activeDialogueId,
    };
    if (detailNode) {
      this.applyNodeEntryEffectsOnce(detailNode.id);
    }
    this.persistInBackground();
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

  public deliver(submission: BouquetSubmission): DeliveryResult {
    const order = this.currentOrder;
    if (!order) throw new Error('No active order to deliver.');
    if (this._state.completedOrderIds.includes(order.id)) throw new Error('This order has already been delivered.');
    if (this._state.activeDialogueId !== undefined || !this.canCompose) {
      throw new Error('Cannot deliver bouquet while dialogue is active.');
    }

    if (!submission || typeof submission !== 'object') {
      throw new Error('Invalid bouquet submission: object required.');
    }
    if (!submission.configuration || typeof submission.configuration !== 'object') {
      throw new Error('Invalid bouquet submission: configuration required.');
    }
    if (!Array.isArray(submission.items)) {
      throw new Error('Invalid bouquet submission: items array required.');
    }
    if (!submission.finish || typeof submission.finish !== 'object') {
      throw new Error('Invalid bouquet submission: finish metadata required.');
    }

    const { configuration, items, finish } = submission;
    if (!['bouquet', 'vase', 'jar'].includes(configuration.vessel)) {
      throw new Error(`Invalid vessel: ${configuration.vessel}`);
    }
    if (
      !Number.isInteger(configuration.stemCount) ||
      configuration.stemCount < 1 ||
      configuration.stemCount > 24
    ) {
      throw new Error('Bouquet stem count must be between 1 and 24.');
    }
    if (items.length !== configuration.stemCount) {
      throw new Error('Bouquet must contain exactly the configured number of stems.');
    }

    const seenSlots = new Set<number>();
    const seenItemIds = new Set<string>();
    for (const item of items) {
      if (!item || typeof item !== 'object') {
        throw new Error('Bouquet stem item must be an object.');
      }
      if (typeof item.id !== 'string' || item.id.length === 0) {
        throw new Error('Bouquet stem item must have a non-empty string id.');
      }
      if (seenItemIds.has(item.id)) {
        throw new Error(`Duplicate stem item id: ${item.id}`);
      }
      seenItemIds.add(item.id);

      if (typeof item.flowerId !== 'string' || !contentBundle.flowers.some((f) => f.id === item.flowerId)) {
        throw new Error(`Unknown flower ID: ${item.flowerId}`);
      }
      if (!item.position || typeof item.position !== 'object' || !Number.isFinite(item.position.x) || !Number.isFinite(item.position.y)) {
        throw new Error('Bouquet stem item position must have finite coordinates.');
      }
      if (!Number.isFinite(item.rotation)) {
        throw new Error('Bouquet stem item rotation must be a finite number.');
      }

      if (!Number.isInteger(item.slotIndex) || item.slotIndex < 0 || item.slotIndex >= configuration.stemCount) {
        throw new Error(`Invalid slotIndex: ${item.slotIndex}`);
      }
      if (seenSlots.has(item.slotIndex)) {
        throw new Error(`Duplicate slotIndex in items: ${item.slotIndex}`);
      }
      seenSlots.add(item.slotIndex);
      if (!item.pose || !['center', 'left', 'right', 'down'].includes(item.pose)) {
        throw new Error(`Invalid or missing pose: ${item.pose}`);
      }
    }

    if (!['none', 'kraft', 'cream'].includes(finish.paper)) {
      throw new Error(`Invalid wrapping paper: ${finish.paper}`);
    }
    if (!['none', 'sage', 'rose'].includes(finish.ribbon)) {
      throw new Error(`Invalid ribbon: ${finish.ribbon}`);
    }
    if (!Number.isInteger(finish.bowStep) || ![0, 1, 2, 3].includes(finish.bowStep)) {
      throw new Error(`Invalid bowStep: ${finish.bowStep}`);
    }
    if (finish.ribbon === 'none' && finish.bowStep !== 0) {
      throw new Error('Bow step must be 0 when ribbon is none.');
    }
    if (finish.ribbon !== 'none' && finish.bowStep !== 3) {
      throw new Error('Finish the ribbon bow before delivery.');
    }

    const features = getFeatures(this._state.currentDay);
    if (!features.paper && finish.paper !== 'none') throw new Error('Wrapping paper is not unlocked yet.');
    if (!features.ribbon && (finish.ribbon !== 'none' || finish.bowStep !== 0)) throw new Error('Ribbon finishing is not unlocked yet.');
    if (!features.cards && finish.cardId !== null) throw new Error('Cards are not unlocked yet.');
    if (finish.cardId !== null) {
      if (typeof finish.cardId !== 'string') throw new Error('Invalid card ID');
      if (!getCardChoices(order.id).some((card) => card.id === finish.cardId)) {
        throw new Error(`Card ${finish.cardId} is not an authored choice for this order.`);
      }
    }
    const unlocked = new Set(this._state.unlockedFlowerIds);
    const counts: Record<string, number> = {};
    for (const item of items) {
      if (!unlocked.has(item.flowerId)) throw new Error(`Flower is locked: ${item.flowerId}`);
      counts[item.flowerId] = (counts[item.flowerId] ?? 0) + 1;
    }
    for (const [flowerId, count] of Object.entries(counts)) {
      if ((this._state.inventory[flowerId] ?? 0) < count) throw new Error(`Insufficient inventory for ${flowerId}.`);
    }
    const evaluation = evaluateBouquet(order, submission, { flags: this._state.flags });
    const resultDialogueId = order.resultDialogueIds[evaluation.outcome];
    const result: DeliveryResult = {
      outcome: evaluation.outcome,
      reasonIds: evaluation.reasonIds,
      effects: evaluation.effects,
      matchedRuleIds: evaluation.matchedRuleIds,
      resultDialogueId,
    };
    const next = reduceGameState(this._state, {
      type: 'completeOrder',
      orderId: order.id,
      bouquetFlowerIds: items.map((item) => item.flowerId),
      effects: evaluation.effects,
      outcome: evaluation.outcome,
    });
    this._state = { ...next, currentOrderId: order.id, activeDialogueId: resultDialogueId };
    this._lastDeliveryResult = result;
    this.persistInBackground();
    return result;
  }

  public askDetail(orderId: string): void {
    const order = this.currentOrder;
    if (!order || order.id !== orderId) throw new Error('Detail request does not match active order.');
    const flag = `flag_heard_detail_${order.id}`;
    if (this._state.flags[flag]) throw new Error('Order detail was already heard.');
    const detailDialogueId = `dlg-${order.id}-detail`;
    const detailNode = contentBundle.dialogue.find((d) => d.id === detailDialogueId);
    this._state = {
      ...this._state,
      flags: { ...this._state.flags, [flag]: true },
      activeDialogueId: detailNode ? detailNode.id : this._state.activeDialogueId,
    };
    if (detailNode) {
      this.applyNodeEntryEffectsOnce(detailNode.id);
    }
    this.persistInBackground();
  }

  public retryMissed(): void {
    throw new Error('Submitted bouquets are final; missed orders cannot be retried.');
  }

  public advanceShift(): { shift: Shift; dayId: string } {
    if (!this.isShiftComplete) throw new Error('Chưa hoàn thành tất cả đơn hàng trong buổi này.');
    if (this._state.currentShift === 'living') {
      this.dispatch({ type: 'advanceShift', shift: 'dead' });
    } else {
      const currentIndex = DAY_SEQUENCE.indexOf(this._state.currentDay as typeof DAY_SEQUENCE[number]);
      const nextDay = DAY_SEQUENCE[currentIndex + 1];
      if (!nextDay) return { shift: 'dead', dayId: this._state.currentDay };
      this.dispatch({ type: 'advanceShift', shift: 'living', dayId: nextDay });
    }
    this.persistInBackground();
    return { shift: this._state.currentShift, dayId: this._state.currentDay };
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

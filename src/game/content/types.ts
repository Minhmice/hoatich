import type { BouquetConfiguration, BouquetFinish, BouquetItem, BouquetSubmission, BouquetSlot, FlowerPose, VesselKind } from '../bouquet/BouquetModel';
export type { BouquetConfiguration, BouquetFinish, BouquetItem, BouquetSubmission, BouquetSlot, FlowerPose, VesselKind };
export type PaperKind = BouquetFinish['paper'];
export type RibbonKind = BouquetFinish['ribbon'];
export type BowStep = BouquetFinish['bowStep'];
export type BranchKind = 'neutral' | 'good' | 'strained';


export interface CardChoice {
  id: string;
  label: string;
  message: string;
  tone: string;
}

export interface OrderArrangement {
  suggestedVessel: VesselKind;
  minStems: number;
  maxStems: number;
}

export interface RequiredFinish {
  paper?: PaperKind;
  ribbon?: RibbonKind;
  requireCard?: boolean;
  targetTone?: string;
}

export type Shift = 'living' | 'dead';

export type Outcome = 'missed' | 'accepted' | 'resonant';

export type RequirementKind = 'flower' | 'tag' | 'world' | 'color';

export interface Requirement {
  kind: RequirementKind;
  value: string;
  min?: number;
}

export type Effect =
  | { type: 'setFlag'; flag: string; value: boolean | string | number }
  | { type: 'relationship'; customerId: string; amount: number }
  | { type: 'unlockFlower'; flowerId: string }
  | { type: 'journal'; entryId: string };

export interface Condition {
  flag: string;
  equals: boolean | string | number;
}

export interface FlowerDefinition {
  id: string;
  displayName: string;
  world: 'living' | 'dead' | 'both';
  colors: string[];
  meanings: string[];
  emotionalTags: string[];
  seasonTags: string[];
  description: string;
  price: number;
  unlockFlag?: string;
}

export type CustomerPortraitKey = 'player' | 'passerby' | 'customer-one';

export interface CustomerDefinition {
  id: string;
  name: string;
  description: string;
  portraitKey: CustomerPortraitKey;
  mood?: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextId?: string;
  effects?: Effect[];
  conditions?: Condition[];
}

export interface DialogueNode {
  id: string;
  speakerId: string;
  text: string;
  nextId?: string;
  choices?: DialogueChoice[];
  effects?: Effect[];
}

export interface Rule {
  id: string;
  description?: string;
  requirements: Requirement[];
  conditions: Condition[];
  effects: Effect[];
}

export type RecipientType = 'living' | 'deceased' | 'unknown';

export interface OrderDefinition {
  id: string;
  dayId: string;
  shift: Shift;
  customerId: string;
  recipient: RecipientType;
  openingDialogueId: string;
  explicitRequirements: Requirement[];
  preferences: Requirement[];
  taboos: Requirement[];
  resonanceRules: Rule[];
  resultDialogueIds: Record<Outcome, string>;
  effects?: Partial<Record<Outcome, Effect[]>>;
  branch?: BranchKind;
  arrangement?: OrderArrangement;
  noteOpening?: readonly string[];
  noteDetail?: readonly string[];
  cardChoices?: readonly CardChoice[];
  requiredFinish?: RequiredFinish;
}

export interface JournalEntry {
  id: string;
  title: string;
  text: string;
}

export interface ContentBundle {
  flowers: FlowerDefinition[];
  customers: CustomerDefinition[];
  orders: OrderDefinition[];
  dialogue: DialogueNode[];
  flags: string[];
  journal: JournalEntry[];
  assetKeys: string[];
}

import type { CardChoice, OrderArrangement, VesselKind } from './types';
import { orderMap } from './orders';

export const DAY_SEQUENCE = [
  'day-1',
  'day-2',
  'day-3',
  'day-4',
  'day-5',
  'day-6',
] as const;

export type DayId = (typeof DAY_SEQUENCE)[number];

export const DAILY_NEW_SPECIES: Record<string, string> = {
  'day-1': 'hoa-cuc-trang',
  'day-2': 'hoa-hong-do',
  'day-3': 'hoa-huong-duong',
  'day-4': 'hoa-sen-hong',
  'day-5': 'hoa-thuy-tien',
  'day-6': 'hoa-luu-ly',
};

export const CUMULATIVE_SPECIES_BY_DAY: Record<string, readonly string[]> = {
  'day-1': ['hoa-cuc-trang'],
  'day-2': ['hoa-cuc-trang', 'hoa-hong-do'],
  'day-3': ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong'],
  'day-4': ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong', 'hoa-sen-hong'],
  'day-5': ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong', 'hoa-sen-hong', 'hoa-thuy-tien'],
  'day-6': ['hoa-cuc-trang', 'hoa-hong-do', 'hoa-huong-duong', 'hoa-sen-hong', 'hoa-thuy-tien', 'hoa-luu-ly'],
};

export function getDayNumber(dayId: string): number {
  const match = /^day-([1-6])$/.exec(dayId);
  if (!match) throw new Error(`Unknown day ID: ${dayId}`);
  return Number(match[1]);
}

export function getFeatures(dayId: string): { paper: boolean; ribbon: boolean; cards: boolean } {
  const day = getDayNumber(dayId);
  return {
    paper: day >= 2,
    ribbon: day >= 3,
    cards: day >= 4,
  };
}

export function getAvailableVessels(_dayId: string): readonly VesselKind[] {
  return ['bouquet', 'vase', 'jar'];
}

export function getUnlockedSpeciesForDay(dayId: string): readonly string[] {
  const species = CUMULATIVE_SPECIES_BY_DAY[dayId];
  if (!species) throw new Error(`Unknown day ID: ${dayId}`);
  return species;
}

export const DEFAULT_CARD_CHOICES: readonly CardChoice[] = [
  {
    id: 'card-respect',
    label: 'Kính trọng',
    message: 'Nguyện cầu bình an và trọn vẹn nghĩa tình.',
    tone: 'respect',
  },
  {
    id: 'card-warmth',
    label: 'Ấm áp',
    message: 'Gửi trao hơi ấm yêu thương và nụ cười rạng rỡ.',
    tone: 'warmth',
  },
  {
    id: 'card-memory',
    label: 'Tưởng nhớ',
    message: 'Ký ức dịu dàng mãi lắng đọng trong tim.',
    tone: 'memory',
  },
  {
    id: 'card-comfort',
    label: 'An ủi',
    message: 'Mong muộn phiền tan biến, lòng nhẹ nhõm an yên.',
    tone: 'comfort',
  },
];

export function getCardChoices(orderId: string): readonly CardChoice[] {
  const order = orderMap[orderId];
  if (!order) throw new Error(`Unknown order ID: ${orderId}`);
  return order.cardChoices?.length ? order.cardChoices : DEFAULT_CARD_CHOICES;
}

export function getOrderArrangement(orderId: string): OrderArrangement {
  const arrangement = orderMap[orderId]?.arrangement;
  if (!arrangement) throw new Error(`No arrangement defined for order: ${orderId}`);
  return arrangement;
}

export function getOrderNote(
  orderId: string,
  flags: Readonly<Record<string, boolean | number | string>>,
): readonly string[] {
  const order = orderMap[orderId];
  if (!order) throw new Error(`Unknown order ID: ${orderId}`);
  const notes: string[] = [];

  if (order.noteOpening && order.noteOpening.length > 0) {
    notes.push(...order.noteOpening);
  } else {
    // Fallback opening note from order recipient and requirements
    const recipientText = order.recipient === 'deceased' ? 'Viếng người đã khuất' : 'Tặng người cõi trần';
    notes.push(`Ý nguyện: ${recipientText}.`);
  }

  const detailFlagKey = `flag_heard_detail_${orderId}`;
  if (flags[detailFlagKey] && order.noteDetail && order.noteDetail.length > 0) {
    notes.push(...order.noteDetail);
  }

  return notes;
}

import type { OrderDefinition } from './types';

export const orders: OrderDefinition[] = [
  // 1. Living flowers for deceased wife
  {
    id: 'order-01-bac-ba',
    dayId: 'day-1',
    shift: 'living',
    customerId: 'bac-ba',
    recipient: 'deceased',
    openingDialogueId: 'dlg-bacba-01',
    explicitRequirements: [
      { kind: 'world', value: 'living' },
      { kind: 'flower', value: 'hoa-cuc-trang', min: 1 },
    ],
    preferences: [
      { kind: 'tag', value: 'respect' },
      { kind: 'color', value: 'white' },
    ],
    taboos: [
      { kind: 'world', value: 'dead' },
    ],
    resonanceRules: [
      {
        id: 'rule-bacba-thuytien',
        requirements: [
          { kind: 'flower', value: 'hoa-thuy-tien', min: 1 },
        ],
        conditions: [
          { flag: 'flag_knows_bac_ba_wife_memory', equals: true },
        ],
        effects: [
          { type: 'relationship', customerId: 'bac-ba', amount: 15 },
        ],
      },
    ],
    resultDialogueIds: {
      missed: 'dlg-bacba-result-missed',
      accepted: 'dlg-bacba-result-accepted',
      resonant: 'dlg-bacba-result-resonant',
    },
    effects: {
      accepted: [
        { type: 'relationship', customerId: 'bac-ba', amount: 5 },
      ],
      resonant: [
        { type: 'relationship', customerId: 'bac-ba', amount: 10 },
      ],
    },
  },

  // 2. Living gift
  {
    id: 'order-02-co-lien',
    dayId: 'day-1',
    shift: 'living',
    customerId: 'co-lien',
    recipient: 'living',
    openingDialogueId: 'dlg-colien-01',
    explicitRequirements: [
      { kind: 'world', value: 'living' },
      { kind: 'flower', value: 'hoa-huong-duong', min: 1 },
    ],
    preferences: [
      { kind: 'tag', value: 'warmth' },
      { kind: 'color', value: 'yellow' },
    ],
    taboos: [
      { kind: 'tag', value: 'mourning' },
      { kind: 'flower', value: 'hoa-cuc-trang' },
    ],
    resonanceRules: [
      {
        id: 'rule-colien-senhong',
        requirements: [
          { kind: 'flower', value: 'hoa-sen-hong', min: 1 },
        ],
        conditions: [
          { flag: 'flag_knows_co_lien_daughter_pressure', equals: true },
        ],
        effects: [
          { type: 'relationship', customerId: 'co-lien', amount: 15 },
        ],
      },
    ],
    resultDialogueIds: {
      missed: 'dlg-colien-result-missed',
      accepted: 'dlg-colien-result-accepted',
      resonant: 'dlg-colien-result-resonant',
    },
    effects: {
      accepted: [
        { type: 'relationship', customerId: 'co-lien', amount: 5 },
      ],
      resonant: [
        { type: 'relationship', customerId: 'co-lien', amount: 10 },
      ],
    },
  },

  // 3. Evening spirit with contradictory clue and fictional flower
  {
    id: 'order-03-linh-hon',
    dayId: 'day-1',
    shift: 'dead',
    customerId: 'linh-hon-thi-si',
    recipient: 'deceased',
    openingDialogueId: 'dlg-spirit-01',
    explicitRequirements: [
      { kind: 'world', value: 'dead' },
      { kind: 'flower', value: 'hoa-hoang-tuyen', min: 1 },
    ],
    preferences: [
      { kind: 'tag', value: 'spectral' },
    ],
    taboos: [
      { kind: 'tag', value: 'mourning' },
      { kind: 'flower', value: 'hoa-cuc-trang' },
    ],
    resonanceRules: [
      {
        id: 'rule-spirit-dangan',
        requirements: [
          { kind: 'flower', value: 'hoa-da-ngan', min: 1 },
        ],
        conditions: [
          { flag: 'flag_knows_spirit_poem_truth', equals: true },
        ],
        effects: [
          { type: 'relationship', customerId: 'linh-hon-thi-si', amount: 20 },
        ],
      },
    ],
    resultDialogueIds: {
      missed: 'dlg-spirit-result-missed',
      accepted: 'dlg-spirit-result-accepted',
      resonant: 'dlg-spirit-result-resonant',
    },
    effects: {
      accepted: [
        { type: 'relationship', customerId: 'linh-hon-thi-si', amount: 5 },
      ],
      resonant: [
        { type: 'relationship', customerId: 'linh-hon-thi-si', amount: 15 },
      ],
    },
  },

  // 4. Light living passerby
  {
    id: 'order-04-chu-tu',
    dayId: 'day-2',
    shift: 'living',
    customerId: 'chu-tu',
    recipient: 'living',
    openingDialogueId: 'dlg-chutu-01',
    explicitRequirements: [
      { kind: 'world', value: 'living' },
      { kind: 'flower', value: 'hoa-hong-do', min: 1 },
    ],
    preferences: [
      { kind: 'tag', value: 'apology' },
      { kind: 'color', value: 'red' },
    ],
    taboos: [
      { kind: 'world', value: 'dead' },
      { kind: 'flower', value: 'hoa-cuc-trang' },
    ],
    resonanceRules: [
      {
        id: 'rule-chutu-huongduong',
        requirements: [
          { kind: 'flower', value: 'hoa-huong-duong', min: 1 },
        ],
        conditions: [
          { flag: 'flag_knows_chu_tu_wife_favorite', equals: true },
        ],
        effects: [
          { type: 'relationship', customerId: 'chu-tu', amount: 15 },
        ],
      },
    ],
    resultDialogueIds: {
      missed: 'dlg-chutu-result-missed',
      accepted: 'dlg-chutu-result-accepted',
      resonant: 'dlg-chutu-result-resonant',
    },
    effects: {
      accepted: [
        { type: 'relationship', customerId: 'chu-tu', amount: 5 },
      ],
      resonant: [
        { type: 'relationship', customerId: 'chu-tu', amount: 10 },
      ],
    },
  },
];

export const orderMap: Record<string, OrderDefinition> = Object.fromEntries(
  orders.map((o) => [o.id, o]),
);

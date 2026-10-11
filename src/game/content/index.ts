export * from './types';
export * from './flowers';
export * from './customers';
export * from './orders';
export * from './dialogue';
export * from './characterAssets';

import type { ContentBundle, JournalEntry } from './types';
import { flowers } from './flowers';
import { customers } from './customers';
import { orders } from './orders';
import { dialogues } from './dialogue';

const narrativeFlags = [
  'flag_knows_bac_ba_wife_memory',
  'flag_knows_co_lien_daughter_pressure',
  'flag_knows_spirit_poem_truth',
  'flag_knows_chu_tu_wife_favorite',
  'flag_read_aunt_spirit_journal',
  'flag_unlock_hoa_cam_chuong',
  'flag_unlock_hoa_oai_huong',
  'flag_unlock_hoa_hoang_tuyen',
  'flag_unlock_hoa_da_ngan',
];

export const runtimeFlags: string[] = [
  'flag_intro_seen',
  ...dialogues.filter((node) => node.effects?.length).map((node) => `dlg_effect_applied_${node.id}`),
];

export const flags: string[] = [...narrativeFlags, ...runtimeFlags];
export const chapterIds: Record<string, true> = { 'thang-mot': true };
export const dayIds: Record<string, true> = { 'day-1': true, 'day-2': true };

export const journalEntries: JournalEntry[] = [
  {
    id: 'journal_aunt_hoang_tuyen',
    title: 'Ghi chép về Hoàng Tuyền',
    text: 'Hoa Hoàng Tuyền chỉ nở nơi ranh giới mịt mờ giữa hai cõi. Khi người đã khuất mang nỗi luyến tiếc khôn nguôi, ánh lửa đỏ của hoa sẽ sưởi ấm linh hồn họ, giúp họ an lòng bước qua cầu nại hà mà không còn vướng bận oán thán.',
  },
  {
    id: 'journal_aunt_da_ngan',
    title: 'Ghi chép về Dạ Ngân',
    text: 'Dạ Ngân là loài hoa hấp thu ánh trăng tĩnh lặng. Dưới cánh bạc mỏng manh là những ký ức chân thật nhất từng bị chôn giấu. Cắm Dạ Ngân cùng Hoàng Tuyền sẽ tháo gỡ được mối tơ vò của những linh hồn mang gánh nặng thi ca.',
  },
  {
    id: 'journal_aunt_shop_creed',
    title: 'Lời dặn của Cô Năm',
    text: 'Mỗi bó hoa trao đi không chỉ là những cánh hoa xếp cạnh nhau. Nó là chiếc cầu nối giữa hai trái tim, giữa người sống và người đã khuất. Hãy lắng nghe điều họ không thể thốt nên lời.',
  },
];

export const assetKeys: string[] = ['player', 'passerby', 'customer-one'];

export const contentBundle: ContentBundle = {
  flowers,
  customers,
  orders,
  dialogue: dialogues,
  flags,
  journal: journalEntries,
  assetKeys,
};
export const content = contentBundle;

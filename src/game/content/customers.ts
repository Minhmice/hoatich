import type { CustomerDefinition } from './types';

export const customers: CustomerDefinition[] = [
  {
    id: 'bac-ba',
    name: 'Bác Ba',
    description: 'Người đàn ông lớn tuổi với ánh mắt trầm mặc, ghé tiệm lúc sáng sớm tìm hoa viếng mộ người vợ đã khuất.',
    portraitKey: 'customer-one',
    mood: 50,
  },
  {
    id: 'co-lien',
    name: 'Cô Liên',
    description: 'Người hàng xóm thân thiện, tính tình chu đáo, muốn chọn một bó hoa mừng tin vui của con gái.',
    portraitKey: 'passerby',
    mood: 75,
  },
  {
    id: 'linh-hon-thi-si',
    name: 'Hồn Thi Sĩ',
    description: 'Bóng hình lãng đãng dừng chân trước tiệm lúc sương chiều buông xuống, mang nỗi niềm dang dở và lời nhắn gửi vượt qua cõi chết.',
    portraitKey: 'customer-one',
    mood: 40,
  },
  {
    id: 'chu-tu',
    name: 'Chú Tư',
    description: 'Người đàn ông vui tính ghé vội vào tiệm, gãi đầu tìm cách dỗ dành vợ sau một pha trêu chọc vụng về.',
    portraitKey: 'passerby',
    mood: 80,
  },
];

export const customerMap: Record<string, CustomerDefinition> = Object.fromEntries(
  customers.map((c) => [c.id, c]),
);

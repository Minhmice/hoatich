import type { DialogueNode } from './types';

export const dialogues: DialogueNode[] = [
  // --- Order 1: Bác Ba ---
  {
    id: 'dlg-bacba-01',
    speakerId: 'bac-ba',
    text: 'Chào cháu gái... Tiệm hoa của cô Năm vẫn mở cửa nhỉ. Bác muốn tìm một bó hoa để mang ra mộ bác gái sáng nay.',
    choices: [
      {
        id: 'choice-bacba-01-direct',
        text: 'Cháu chào bác Ba. Bác muốn lấy bó cúc trắng truyền thống như mọi khi ạ?',
        nextId: 'dlg-bacba-02-direct',
      },
      {
        id: 'choice-bacba-01-memory',
        text: 'Bác ơi, ngày trước bác gái ở nhà thích loài hoa nào nhất ạ?',
        nextId: 'dlg-bacba-03-memory',
      },
    ],
  },
  {
    id: 'dlg-bacba-02-direct',
    speakerId: 'bac-ba',
    text: 'Ừ, cứ bó cho bác mấy cành cúc trắng là được rồi. Đơn giản, trang nghiêm là trọn lễ nghĩa.',
    nextId: 'dlg-bacba-ready',
  },
  {
    id: 'dlg-bacba-03-memory',
    speakerId: 'bac-ba',
    text: 'Bà ấy ấy à... Ngày xưa lúc còn trẻ, bà ấy mê hoa thủy tiên lắm. Bà bảo hoa thanh khiết, nở đúng dịp đầu xuân lại thoảng hương dịu dàng. Nhưng giờ người ta hay bảo ra nghĩa trang thì chỉ nên cắm cúc trắng...',
    effects: [
      {
        type: 'setFlag',
        flag: 'flag_knows_bac_ba_wife_memory',
        value: true,
      },
    ],
    nextId: 'dlg-bacba-04-advice',
  },
  {
    id: 'dlg-bacba-04-advice',
    speakerId: 'player',
    text: 'Hoa là gửi tấm lòng mình cho người thương mà bác. Đâu có khuôn mẫu nào ngăn được tình cảm chân thành đâu ạ.',
    nextId: 'dlg-bacba-05-smile',
  },
  {
    id: 'dlg-bacba-05-smile',
    speakerId: 'bac-ba',
    text: 'Cháu nói chí phải... Nếu cắm được nhành thủy tiên cùng cúc trắng, chắc bà ấy dưới suối vàng sẽ mỉm cười mừng rỡ.',
    nextId: 'dlg-bacba-ready',
  },
  {
    id: 'dlg-bacba-ready',
    speakerId: 'bac-ba',
    text: 'Nhờ tay nghề của cháu nhé. Cứ cắm thong thả, bác ngồi đợi bên hiên uống chén trà.',
  },
  {
    id: 'dlg-bacba-result-missed',
    speakerId: 'bac-ba',
    text: 'Bó hoa này... hình như có điều gì đó chưa phải phép hoặc thiếu cúc trắng viếng mộ rồi cháu ạ. Nhưng không sao, bác vẫn cảm ơn cháu.',
  },
  {
    id: 'dlg-bacba-result-accepted',
    speakerId: 'bac-ba',
    text: 'Bó cúc trắng tươm tất lắm, rất trang nghiêm. Bác gái chắc chắn sẽ cảm nhận được lòng thành. Cảm ơn cháu nhiều.',
  },
  {
    id: 'dlg-bacba-result-resonant',
    speakerId: 'bac-ba',
    text: 'Ôi... nhành thủy tiên trắng ngát hương bên cúc trang trọng! Đã bao năm rồi bác mới lại thấy sắc hoa này... Giống hệt ngày cưới năm xưa. Bác cảm động lắm, cảm ơn cháu!',
  },

  // --- Order 2: Cô Liên ---
  {
    id: 'dlg-colien-01',
    speakerId: 'co-lien',
    text: 'Cháu ơi! Nay cô ghé tiệm là có chuyện vui đây. Con bé Mai nhà cô vừa nhận quyết định đi làm ở viện lớn. Cô muốn bó hoa thật ấm áp, chúc mừng con gái!',
    choices: [
      {
        id: 'choice-colien-01-bright',
        text: 'Chúc mừng em Mai ạ! Con gái đi làm thì cắm hướng dương vàng rực rỡ đón tương lai tươi sáng cô nhé.',
        nextId: 'dlg-colien-02-bright',
      },
      {
        id: 'choice-colien-01-daughter',
        text: 'Dạo này em Mai có bị áp lực nhiều không cô? Em ôn thi bao tháng chắc mệt mỏi lắm.',
        nextId: 'dlg-colien-03-daughter',
      },
    ],
  },
  {
    id: 'dlg-colien-02-bright',
    speakerId: 'co-lien',
    text: 'Đúng rồi, hoa gì rạng rỡ như ánh mặt trời ấy! Đừng dùng màu buồn hay hoa tang nhé, ngày vui mà.',
    nextId: 'dlg-colien-ready',
  },
  {
    id: 'dlg-colien-03-daughter',
    speakerId: 'co-lien',
    text: 'Haizz, cháu nói trúng tim đen cô rồi. Mấy tuần nay nó mất ngủ, mặt mũi xanh xao. Nhận việc thì mừng nhưng lo lắng, căng thẳng dữ lắm. Cô chỉ mong con bé được an lòng, thư thả đầu óc một chút.',
    effects: [
      {
        type: 'setFlag',
        flag: 'flag_knows_co_lien_daughter_pressure',
        value: true,
      },
    ],
    nextId: 'dlg-colien-04-comfort',
  },
  {
    id: 'dlg-colien-04-comfort',
    speakerId: 'player',
    text: 'Thế thì bên cạnh hướng dương hy vọng, cháu sẽ phối thêm sắc hoa sen hồng thanh tịnh để em thấy nhẹ lòng, bình yên nhé cô.',
    nextId: 'dlg-colien-05-praise',
  },
  {
    id: 'dlg-colien-05-praise',
    speakerId: 'co-lien',
    text: 'Khéo quá! Cô Năm ngày xưa cũng chu đáo y hệt cháu vậy đó. Cháu cắm giùm cô nhé.',
    nextId: 'dlg-colien-ready',
  },
  {
    id: 'dlg-colien-ready',
    speakerId: 'co-lien',
    text: 'Nhớ là tránh mấy hoa màu trắng tang tóc nghen cháu. Cứ tươi tắn, ấm áp là cô duyệt liền!',
  },
  {
    id: 'dlg-colien-result-missed',
    speakerId: 'co-lien',
    text: 'Ủa cháu ơi, hoa này có vẻ ảm đạm quá hoặc dính màu tang lễ rồi. Ngày mừng của con bé mà nhận thế này thì không hợp đâu.',
  },
  {
    id: 'dlg-colien-result-accepted',
    speakerId: 'co-lien',
    text: 'Đẹp và sáng sủa lắm cháu! Màu vàng rực rỡ thế này con bé chắc chắn sẽ rất thích. Cảm ơn cháu nha!',
  },
  {
    id: 'dlg-colien-result-resonant',
    speakerId: 'co-lien',
    text: 'Tuyệt vời quá cháu ơi! Vừa có hướng dương rực rỡ tiếp thêm nghị lực, lại thêm đóa sen hồng dịu dàng xoa dịu áp lực. Con bé nhìn vào chắc sẽ thấy lòng bình an ngay. Chu đáo lắm!',
  },

  // --- Order 3: Hồn Thi Sĩ ---
  {
    id: 'dlg-spirit-01',
    speakerId: 'linh-hon-thi-si',
    text: 'Đêm đã buông... Hỡi người giữ tiệm hoa giữa hai bờ sinh tử, người có nghe tiếng sương rơi trên phiến đá lạnh?',
    choices: [
      {
        id: 'choice-spirit-01-order',
        text: 'Khách nhân muốn tìm loài hoa nào cho cuộc hành trình phía trước?',
        nextId: 'dlg-spirit-02-contradiction',
      },
      {
        id: 'choice-spirit-01-story',
        text: 'Vì sao người lại lang thang nơi chốn nhân gian muộn màng thế này?',
        nextId: 'dlg-spirit-03-backstory',
      },
    ],
  },
  {
    id: 'dlg-spirit-02-contradiction',
    speakerId: 'linh-hon-thi-si',
    text: 'Ta muốn một đóa hoa đỏ rực như thiêu đốt tâm can, nhưng phải lạnh buốt như dòng băng dưới cửu tuyền. Đừng dâng hoa của cõi trần hữu hạn, bởi phàm hoa sẽ tàn lụi trước cánh cửa cõi vĩnh hằng.',
    nextId: 'dlg-spirit-check-clue',
  },
  {
    id: 'dlg-spirit-03-backstory',
    speakerId: 'linh-hon-thi-si',
    text: 'Ta từng là một kẻ say thơ bên bờ sông trăng... Ta rời cõi tạm mang theo bài thơ chưa viết nốt câu cuối cùng. Linh hồn ta mắc kẹt nơi bờ suối tăm tối, chỉ có ngọn lửa hoa âm giới mới dẫn lối cho ta siêu thoát.',
    effects: [
      {
        type: 'setFlag',
        flag: 'flag_knows_spirit_poem_truth',
        value: true,
      },
    ],
    nextId: 'dlg-spirit-04-journal-hint',
  },
  {
    id: 'dlg-spirit-04-journal-hint',
    speakerId: 'player',
    text: 'Hoa nở bên dòng sông Hoàng Tuyền... Hình như trong sổ tay của cô Năm có ghi chép về loài hoa này.',
    nextId: 'dlg-spirit-05-unlock-both',
  },
  {
    id: 'dlg-spirit-05-unlock-both',
    speakerId: 'linh-hon-thi-si',
    text: 'Đúng vậy... Hãy lần giở lại từng trang ký ức của người đi trước. Chỉ có Hoàng Tuyền soi lối và Dạ Ngân lưu giữ lời thì thầm mới gỡ được phong ấn cho bài thơ của ta.',
    effects: [
      {
        type: 'journal',
        entryId: 'journal_aunt_hoang_tuyen',
      },
      {
        type: 'unlockFlower',
        flowerId: 'hoa-hoang-tuyen',
      },
      {
        type: 'setFlag',
        flag: 'flag_unlock_hoa_hoang_tuyen',
        value: true,
      },
      {
        type: 'journal',
        entryId: 'journal_aunt_da_ngan',
      },
      {
        type: 'unlockFlower',
        flowerId: 'hoa-da-ngan',
      },
      {
        type: 'setFlag',
        flag: 'flag_unlock_hoa_da_ngan',
        value: true,
      },
      {
        type: 'setFlag',
        flag: 'flag_read_aunt_spirit_journal',
        value: true,
      },
    ],
    nextId: 'dlg-spirit-ready',
  },
  {
    id: 'dlg-spirit-check-clue',
    speakerId: 'player',
    text: 'Đóa hoa đỏ như lửa nhưng lạnh như băng, lại không thuộc về cõi trần... Có phải ngài đang nhắc tới hoa Hoàng Tuyền trong ghi chép của người cô?',
    choices: [
      {
        id: 'choice-spirit-check-notes',
        text: 'Cháu sẽ tra sổ tay của cô để tìm cách giúp ngài.',
        nextId: 'dlg-spirit-05-unlock-both',
      },
    ],
  },
  {
    id: 'dlg-spirit-ready',
    speakerId: 'linh-hon-thi-si',
    text: 'Ta đợi người nơi ngã ba sông... Đừng cắm hoa tang điếu của thế gian, linh hồn này không cần nước mắt xót thương.',
  },
  {
    id: 'dlg-spirit-result-missed',
    speakerId: 'linh-hon-thi-si',
    text: 'Bó hoa này vẫn vương bụi trần tục hoặc thiếu đi ngọn lửa dẫn đường của Hoàng Tuyền. Ta vẫn chưa thể qua sông...',
  },
  {
    id: 'dlg-spirit-result-accepted',
    speakerId: 'linh-hon-thi-si',
    text: 'Sắc đỏ của Hoàng Tuyền tỏa sáng trong bóng tối... Lối mòn đã mở ra. Ta có thể cất bước đi tiếp rồi. Đa tạ người gìn giữ tiệm hoa.',
  },
  {
    id: 'dlg-spirit-result-resonant',
    speakerId: 'linh-hon-thi-si',
    text: 'Hoàng Tuyền dẫn lối, lại có Dạ Ngân lưu lại vần thơ cuối cùng trọn vẹn... Mọi vướng bận trăm năm phút chốc tan biến thành làn khói nhẹ. Ta đã tìm thấy sự thanh thản vĩnh hằng. Xin tạ ơn tri kỷ!',
  },

  // --- Order 4: Chú Tư Xe Ôm ---
  {
    id: 'dlg-chutu-01',
    speakerId: 'chu-tu',
    text: 'Cứu chú với cháu gái ơi! Chú vừa lỡ cái mồm chê nồi cá kho của bà xã hơi mặn, bả giận đùng đùng đuổi chú ra khỏi bếp rồi!',
    choices: [
      {
        id: 'choice-chutu-01-rose',
        text: 'Haha chú Tư hài quá! Thế chú muốn lấy cành hồng đỏ tạ lỗi truyền thống không ạ?',
        nextId: 'dlg-chutu-02-rose',
      },
      {
        id: 'choice-chutu-01-secret',
        text: 'Bình thường cô thích hoa gì hay có sở thích gì đặc biệt không chú?',
        nextId: 'dlg-chutu-03-secret',
      },
    ],
  },
  {
    id: 'dlg-chutu-02-rose',
    speakerId: 'chu-tu',
    text: 'Ừ, hồng đỏ cho nó tình cảm cháu ơi! Nhìn vô là thấy mình biết lỗi liền. Nhưng nhớ đừng cắm hoa cúc trắng nha, cắm cúc trắng bả tưởng chú trù bả là chú no đòn đó!',
    nextId: 'dlg-chutu-ready',
  },
  {
    id: 'dlg-chutu-03-secret',
    speakerId: 'chu-tu',
    text: 'Bà xã chú bề ngoài dữ dằn vậy chứ thích mấy thứ vui tươi, ấm áp lắm. Bả khoái màu vàng rực rỡ như nắng ban trưa, bả bảo nhìn vô là hết bực mình.',
    effects: [
      {
        type: 'setFlag',
        flag: 'flag_knows_chu_tu_wife_favorite',
        value: true,
      },
    ],
    nextId: 'dlg-chutu-04-sunflower',
  },
  {
    id: 'dlg-chutu-04-sunflower',
    speakerId: 'player',
    text: 'Thế thì cắm hồng đỏ tạ lỗi, kèm thêm hướng dương vàng rực rỡ cho cô vui vẻ mỉm cười chú nhé!',
    nextId: 'dlg-chutu-05-laugh',
  },
  {
    id: 'dlg-chutu-05-laugh',
    speakerId: 'chu-tu',
    text: 'Hay quá trời hay! Đúng là tiệm hoa cô Năm có khác, cháu tư vấn có tâm số một luôn!',
    nextId: 'dlg-chutu-ready',
  },
  {
    id: 'dlg-chutu-ready',
    speakerId: 'chu-tu',
    text: 'Cứ làm cho chú bó hoa thật tươi nghen, chú ngồi canh xe ngoài này, giá mềm mềm xíu chú còn tiền dắt bả đi ăn chè!',
  },
  {
    id: 'dlg-chutu-result-missed',
    speakerId: 'chu-tu',
    text: 'Chết chú rồi cháu ơi! Bó này thiếu hoa hồng xin lỗi hoặc dính cúc trắng viếng đám ma rồi, mang về chắc bả cho chú ra đường ngủ luôn quá!',
  },
  {
    id: 'dlg-chutu-result-accepted',
    speakerId: 'chu-tu',
    text: 'Bó hồng đỏ tươi rói, thơm phức! Thế này thì bà xã chắc nguôi giận được tám phần rồi. Cảm ơn cháu gái nhiều nghen!',
  },
  {
    id: 'dlg-chutu-result-resonant',
    speakerId: 'chu-tu',
    text: 'Trời ơi xuất sắc cháu ơi! Vừa có hồng đỏ tạ lỗi ngọt ngào, vừa có hướng dương vàng tươi đúng gu bà xã! Kiểu này bả không những tha tội mà trưa nay còn múc cho chú tô canh to bự nữa chứ chẳng chơi! Đỉnh chóp luôn!',
  },
];

export const dialogueMap: Record<string, DialogueNode> = Object.fromEntries(
  dialogues.map((d) => [d.id, d]),
);

import type { DialogueNode } from './types';

export const dialogues: DialogueNode[] = [
  {
    "id": "dlg-bacba-01",
    "speakerId": "bac-ba",
    "text": "Chào cháu gái... Tiệm hoa của cô Năm vẫn mở cửa nhỉ. Bác muốn tìm một bó hoa để mang ra mộ bác gái sáng nay.",
    "choices": [
      {
        "id": "choice-order-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-01-bac-ba-ready"
      },
      {
        "id": "choice-order-01-bac-ba-detail",
        "text": "Bác ơi, ngày trước bác gái ở nhà thích loài hoa nào nhất ạ?",
        "nextId": "dlg-order-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Bà ấy thích sự thanh khiết giản dị. Cứ cắm 3 đến 5 cành cúc trắng trang nghiêm là trọn lễ nghĩa.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Nhờ tay nghề của cháu nhé. Cứ cắm thong thả, bác ngồi đợi bên hiên uống chén trà."
  },
  {
    "id": "dlg-bacba-result-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này... hình như có điều gì đó chưa phải phép hoặc thiếu cúc trắng viếng mộ rồi cháu ạ. Nhưng không sao, bác vẫn cảm ơn cháu."
  },
  {
    "id": "dlg-bacba-result-accepted",
    "speakerId": "bac-ba",
    "text": "Bó cúc trắng tươm tất lắm, rất trang nghiêm. Bác gái chắc chắn sẽ cảm nhận được lòng thành. Cảm ơn cháu nhiều."
  },
  {
    "id": "dlg-bacba-result-resonant",
    "speakerId": "bac-ba",
    "text": "Bó hoa cúc trắng tinh khôi, cắm vừa vặn trang trọng đúng như tâm ý bác gái ngày trước. Bác cảm động lắm, cảm ơn cháu!"
  },
  {
    "id": "dlg-colien-01",
    "speakerId": "co-lien",
    "text": "Cháu ơi! Sáng sớm cô ghé qua tiệm mở hàng cho cháu đây. Cô muốn tìm mấy cành hoa trắng thanh nhã cắm bàn thờ gia tiên ngày rằm, nhẹ nhàng trang nghiêm nhé.",
    "choices": [
      {
        "id": "choice-order-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-02-co-lien-ready"
      },
      {
        "id": "choice-order-02-co-lien-detail",
        "text": "Cô Liên ơi, cô có lưu ý gì thêm về bình hoa dâng cúng không ạ?",
        "nextId": "dlg-order-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Hoa cúng gia tiên cần hoa cõi trần thanh khiết, chớ để dính hoa u ám cõi âm nghen cháu. Cắm chừng 3 cành cúc trắng là đẹp.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-02-co-lien-ready"
  },
  {
    "id": "dlg-order-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm cẩn thận giùm cô nhé, cô ghé sạp rau đầu ngõ mua mớ rau rồi quay lại lấy."
  },
  {
    "id": "dlg-colien-result-missed",
    "speakerId": "co-lien",
    "text": "Ủa cháu ơi, hoa dính hoa cõi âm hoặc không đủ cúc trắng rồi. Đem cúng thế này không được đâu."
  },
  {
    "id": "dlg-colien-result-accepted",
    "speakerId": "co-lien",
    "text": "Hoa cúc trắng tươi tắn và tinh khiết lắm cháu! Cảm ơn cháu nha, chúc tiệm mua may bán đắt!"
  },
  {
    "id": "dlg-colien-result-resonant",
    "speakerId": "co-lien",
    "text": "Bình cúc trắng cắm thanh tao, trang trọng vô cùng! Gia tiên nhìn vào chắc chắn hài lòng. Khéo tay lắm cháu gái!"
  },
  {
    "id": "dlg-order-01-chu-tu-01",
    "speakerId": "chu-tu",
    "text": "Chào cô chủ nhỏ! Chú chạy xe ôm ngang qua thấy tiệm hoa mới khai trương rực rỡ quá, ghé vô mua bình hoa cúc trắng về kính mẹ già nhân ngày mở tiệm nè.",
    "choices": [
      {
        "id": "choice-order-01-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-01-chu-tu-ready"
      },
      {
        "id": "choice-order-01-chu-tu-detail",
        "text": "Dạ cháu chào chú Tư! Mẹ chú ở nhà thích cắm hoa thế nào ạ?",
        "nextId": "dlg-order-01-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-01-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Mẹ chú thích hoa cúc trắng bình dị thôi. Cắm bình gốm mộc mạc độ 3 đến 5 bông trắng muốt là cụ vui cả ngày.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-01-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-01-chu-tu-ready"
  },
  {
    "id": "dlg-order-01-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, chú dựng chân chống xe ngồi ngắm phố phường tí."
  },
  {
    "id": "dlg-order-01-chu-tu-missed",
    "speakerId": "chu-tu",
    "text": "Ủa cháu ơi, hoa này thiếu cúc trắng rồi, hoặc cắm nhầm cành héo úa rồi cháu nè."
  },
  {
    "id": "dlg-order-01-chu-tu-accepted",
    "speakerId": "chu-tu",
    "text": "Bình cúc trắng mộc mạc mà đẹp quá chừng! Mang về chắc cụ nhà khen chú hết lời. Cảm ơn cháu nghen!"
  },
  {
    "id": "dlg-order-01-chu-tu-resonant",
    "speakerId": "chu-tu",
    "text": "Chà chà, cắm bình gốm 3 bông cúc trắng nhìn thanh tao nhã nhặn y hệt gu của mẹ chú! Cháu đúng là hiểu lòng người già!"
  },
  {
    "id": "dlg-spirit-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Đêm đã buông sương... Hỡi người trông giữ tiệm hoa giữa hai bờ sinh tử, ta ghé chốn này tìm một đóa hoa tưởng nhớ để xoa dịu nỗi niềm nơi ngã ba sông lạnh.",
    "choices": [
      {
        "id": "choice-order-03-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-03-linh-hon-ready"
      },
      {
        "id": "choice-order-03-linh-hon-detail",
        "text": "Khách nhân ơi, nơi cõi âm tịch mịch, điều gì có thể mang lại thanh thản cho người?",
        "nextId": "dlg-order-03-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-03-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Ta chỉ cần sắc trắng của cúc tưởng nhớ, giản dị thanh tao để linh hồn không vướng bận oán than. Cắm 3 cành trong bình lặng lẽ là đủ.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-03-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-03-linh-hon-ready"
  },
  {
    "id": "dlg-order-03-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Ta sẽ đợi nơi góc hiên... Nghe tiếng gió thở dài qua khe lá."
  },
  {
    "id": "dlg-spirit-result-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đủ đóa cúc tưởng nhớ, hoặc vương vấn sắc thái không hợp với linh hồn tịch mịch rồi..."
  },
  {
    "id": "dlg-spirit-result-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đóa cúc trắng thanh khiết... Lòng ta như dịu lại giữa đêm sương lạnh. Cảm tạ người tiệm hoa."
  },
  {
    "id": "dlg-spirit-result-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Sắc trắng thanh tịnh và hương hoa dịu dàng xua tan nỗi cô đơn trăm năm... Tâm hồn ta đã tìm lại được một thoáng an yên."
  },
  {
    "id": "dlg-order-02-01-bac-ba-01",
    "speakerId": "bac-ba",
    "text": "Chào cháu, hôm nay là ngày giỗ nhỏ của bác gái. Bác muốn cắm một bó hoa có cúc trắng trang nghiêm điểm thêm đóa hồng đỏ ấm áp.",
    "choices": [
      {
        "id": "choice-order-02-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-02-01-bac-ba-ready"
      },
      {
        "id": "choice-order-02-01-bac-ba-detail",
        "text": "Bác Ba ơi, bác có muốn gói giấy gì bên ngoài cho bó hoa thêm tươm tất không?",
        "nextId": "dlg-order-02-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-02-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Cháu gói giùm bác lớp giấy kraft mộc mạc nhé. Hoa thì cắm 2 cúc trắng 1 hồng đỏ là đẹp và ấm cúng.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-02-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-02-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-02-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Bác ngồi đợi ngoài hiên, cháu cứ cắm thong thả."
  },
  {
    "id": "dlg-order-02-01-bac-ba-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa thiếu mất đóa hồng đỏ ấm áp hoặc chưa gói giấy kraft mộc mạc rồi cháu ạ."
  },
  {
    "id": "dlg-order-02-01-bac-ba-accepted",
    "speakerId": "bac-ba",
    "text": "Bó hoa trang nhã và ấm cúng lắm cháu! Giấy kraft nhìn mộc mạc đúng ý bác."
  },
  {
    "id": "dlg-order-02-01-bac-ba-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời quá cháu ơi, sắc đỏ của đóa hồng nổi bật giữa nền cúc trắng, gói giấy kraft rất mực trang trọng!"
  },
  {
    "id": "dlg-order-02-02-co-lien-01",
    "speakerId": "co-lien",
    "text": "Cháu gái ơi! Hôm nay sinh nhật cháu gái nhỏ của cô, cô muốn chọn một bó hoa hồng đỏ thật tươi tắn chúc mừng con bé!",
    "choices": [
      {
        "id": "choice-order-02-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-02-02-co-lien-ready"
      },
      {
        "id": "choice-order-02-02-co-lien-detail",
        "text": "Cô Liên ơi, cô thích hoa được gói bằng loại giấy nào ạ?",
        "nextId": "dlg-order-02-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-02-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Gói giấy kem cho nó sáng sủa và thanh lịch nghen cháu! Cắm chừng 3 cành hồng đỏ, chớ để dính hoa tang u buồn.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-02-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-02-02-co-lien-ready"
  },
  {
    "id": "dlg-order-02-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cô đứng ngắm hoa một lát, cắm xinh xắn giùm cô nhé!"
  },
  {
    "id": "dlg-order-02-02-co-lien-missed",
    "speakerId": "co-lien",
    "text": "Hoa chưa đủ sắc đỏ hoặc dính hoa tang rồi cháu ơi. Sinh nhật con nít không hợp bó này đâu."
  },
  {
    "id": "dlg-order-02-02-co-lien-accepted",
    "speakerId": "co-lien",
    "text": "Bó hồng đỏ bọc giấy kem nhìn cưng xỉu luôn! Con bé nhận được chắc chắn sẽ nhảy cẫng lên mừng."
  },
  {
    "id": "dlg-order-02-02-co-lien-resonant",
    "speakerId": "co-lien",
    "text": "Ôi khéo tay quá chừng! Bó hoa hồng đỏ rực rỡ gói giấy kem tinh tế, tràn ngập tình yêu thương của người cô!"
  },
  {
    "id": "dlg-chutu-01",
    "speakerId": "chu-tu",
    "text": "Cứu chú với cháu gái ơi! Chú vừa lỡ cái mồm chê nồi cá kho của bà xã hơi mặn, bả giận đùng đùng đuổi chú ra khỏi bếp rồi!",
    "choices": [
      {
        "id": "choice-order-04-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-chu-tu-ready"
      },
      {
        "id": "choice-order-04-chu-tu-detail",
        "text": "Haha chú Tư ơi! Chú muốn gói hoa thế nào để cô nguôi giận ạ?",
        "nextId": "dlg-order-04-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Bó giấy kraft cho nó chân chất mộc mạc cháu ơi! Nhớ là cắm hoa hồng đỏ thắm tạ lỗi, TUYỆT ĐỐI KHÔNG cắm cúc trắng nha, bả tưởng chú trù bả là chú toi đời!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-chu-tu-ready"
  },
  {
    "id": "dlg-order-04-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Cứ làm cho chú bó hoa thật tươi nghen, chú ngồi canh xe ngoài này!"
  },
  {
    "id": "dlg-chutu-result-missed",
    "speakerId": "chu-tu",
    "text": "Chết chú rồi cháu ơi! Bó này thiếu hoa hồng xin lỗi hoặc dính cúc trắng viếng đám ma rồi, mang về chắc bả cho chú ra đường ngủ luôn quá!"
  },
  {
    "id": "dlg-chutu-result-accepted",
    "speakerId": "chu-tu",
    "text": "Bó hồng đỏ tươi rói, thơm phức gói giấy kraft đúng điệu! Thế này thì bà xã chắc nguôi giận được tám phần rồi. Cảm ơn cháu gái nhiều nghen!"
  },
  {
    "id": "dlg-chutu-result-resonant",
    "speakerId": "chu-tu",
    "text": "Trời ơi xuất sắc cháu ơi! Hồng đỏ rực rỡ tạ lỗi ngọt ngào gói giấy kraft mộc mạc chân tình! Kiểu này bả không những tha tội mà trưa nay còn múc cho chú tô canh to bự nữa chứ chẳng chơi!"
  },
  {
    "id": "dlg-order-02-04-linh-hon-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Gió lạnh thổi qua hàng hiên... Ta nhớ về một bóng hình xưa nơi trần thế, người từng cài nhành hồng đỏ thắm lên mái tóc.",
    "choices": [
      {
        "id": "choice-order-02-04-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-02-04-linh-hon-ready"
      },
      {
        "id": "choice-order-02-04-linh-hon-detail",
        "text": "Thi sĩ ơi, người muốn hoa được cắm như thế nào để giữ trọn ký ức ấy?",
        "nextId": "dlg-order-02-04-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-02-04-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 2 cành cúc trắng kết hợp 1 nhành hồng đỏ trong chiếc bình thanh tao. Sắc đỏ sẽ gợi lại hơi ấm tình đầu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-02-04-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-02-04-linh-hon-ready"
  },
  {
    "id": "dlg-order-02-04-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Ta sẽ đứng dưới ánh trăng mờ chờ đợi..."
  },
  {
    "id": "dlg-order-02-04-linh-hon-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bình hoa này thiếu đi sắc đỏ của tình xưa hoặc chưa đủ cúc trắng tĩnh mịch rồi..."
  },
  {
    "id": "dlg-order-02-04-linh-hon-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Một đóa hồng đỏ giữa sắc trắng thanh khiết... Ký ức về người ấy lại hiện về ấm áp trong tâm tưởng ta."
  },
  {
    "id": "dlg-order-02-04-linh-hon-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Bình hoa tuyệt diệu làm rung động tâm can kẻ thi sĩ... Hơi ấm tình yêu nơi trần thế như vừa sưởi ấm linh hồn giá lạnh."
  },
  {
    "id": "dlg-order-03-01-bac-ba-01",
    "speakerId": "bac-ba",
    "text": "Hôm nay trời hửng nắng đẹp quá cháu à. Bác muốn cắm một bình hoa hướng dương kết hợp cúc trắng đón nắng sớm.",
    "choices": [
      {
        "id": "choice-order-03-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-03-01-bac-ba-ready"
      },
      {
        "id": "choice-order-03-01-bac-ba-detail",
        "text": "Bác Ba ơi, bác có muốn thắt thêm dải nơ gì cho chiếc bình thêm trang nhã không ạ?",
        "nextId": "dlg-order-03-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-03-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Thắt giùm bác dải nơ xanh sage hiền dịu nhé. Hoa thì cắm 1 hướng dương và 2 cúc trắng trong bình là đẹp.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-03-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-03-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-03-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Bác đợi bên chén trà thơm, cháu cắm cẩn thận nhé."
  },
  {
    "id": "dlg-order-03-01-bac-ba-missed",
    "speakerId": "bac-ba",
    "text": "Bình hoa thiếu mất cành hướng dương đón nắng hoặc chưa thắt dải nơ xanh dịu rồi cháu ạ."
  },
  {
    "id": "dlg-order-03-01-bac-ba-accepted",
    "speakerId": "bac-ba",
    "text": "Bình hoa đón nắng sớm tươi tắn và trang nhã lắm. Nơ xanh sage nhìn rất thanh tịnh."
  },
  {
    "id": "dlg-order-03-01-bac-ba-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời lắm cháu! Ánh dương ấm áp soi rọi đóa cúc trắng, dải nơ xanh dịu dàng trang nghiêm trọn vẹn!"
  },
  {
    "id": "dlg-order-03-02-co-lien-01",
    "speakerId": "co-lien",
    "text": "Tin vui lớn cháu ơi! Con bé Mai vừa chính thức trúng tuyển bác sĩ nội trú rồi! Cô muốn đặt bó hướng dương rực rỡ chúc mừng con gái!",
    "choices": [
      {
        "id": "choice-order-03-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-03-02-co-lien-ready"
      },
      {
        "id": "choice-order-03-02-co-lien-detail",
        "text": "Chúc mừng em Mai ạ! Cô muốn bó hoa hoành tráng thế nào cô dặn cháu nhé!",
        "nextId": "dlg-order-03-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-03-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Cắm bó 6 đến 9 cành thật rực rỡ, ít nhất 3 bông hướng dương vàng chói lọi! Bọc giấy kem và thắt nơ hồng duyên dáng nghen!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-03-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-03-02-co-lien-ready"
  },
  {
    "id": "dlg-order-03-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cô đứng đợi lấy liền để mang sang viện cho con bé đây!"
  },
  {
    "id": "dlg-order-03-02-co-lien-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa chưa đủ số cành hướng dương hoặc thiếu nơ hồng chúc mừng rồi cháu ơi!"
  },
  {
    "id": "dlg-order-03-02-co-lien-accepted",
    "speakerId": "co-lien",
    "text": "Bó hoa hướng dương vàng rực rỡ thắt nơ hồng xinh quá! Con bé Mai nhìn thấy chắc chắn sẽ nở nụ cười rạng rỡ."
  },
  {
    "id": "dlg-order-03-02-co-lien-resonant",
    "speakerId": "co-lien",
    "text": "Xuất sắc luôn cháu gái! Năng lượng hy vọng từ những đóa hướng dương thắt nơ hồng tinh tế sẽ tiếp thêm bao nghị lực cho bác sĩ tương lai!"
  },
  {
    "id": "dlg-order-03-03-chu-tu-01",
    "speakerId": "chu-tu",
    "text": "Hôm nay là kỷ niệm 20 năm ngày cưới của vợ chồng chú nè cháu! Chú muốn một bó hoa thật nồng thắm vừa có hồng đỏ vừa có hướng dương rạng rỡ!",
    "choices": [
      {
        "id": "choice-order-03-03-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-03-03-chu-tu-ready"
      },
      {
        "id": "choice-order-03-03-chu-tu-detail",
        "text": "Chúc mừng hai cô chú ạ! Chú Tư muốn điểm xuyết thêm nơ thiệp gì không chú?",
        "nextId": "dlg-order-03-03-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-03-03-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Bó từ 6 đến 9 bông, ít nhất 2 hướng dương và 2 hồng đỏ! Nhớ thắt thêm dải nơ hồng cho nó lãng mạn nghen, cấm tiệt cúc trắng nha!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-03-03-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-03-03-chu-tu-ready"
  },
  {
    "id": "dlg-order-03-03-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Chú ngóng chờ bó hoa kỷ niệm của cháu đó!"
  },
  {
    "id": "dlg-order-03-03-chu-tu-missed",
    "speakerId": "chu-tu",
    "text": "Cháu ơi, thiếu hoa hồng tình yêu hoặc hướng dương ấm áp rồi, nơ hồng cũng chưa thắt kìa!"
  },
  {
    "id": "dlg-order-03-03-chu-tu-accepted",
    "speakerId": "chu-tu",
    "text": "Bó hoa phối màu vàng đỏ rực rỡ quá trời! Thắt nơ hồng nhìn lãng mạn như thời mới yêu vậy. Cảm ơn cháu nhiều!"
  },
  {
    "id": "dlg-order-03-03-chu-tu-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt cú mèo luôn cháu ơi! Vừa rực rỡ ấm áp vừa nồng nàn gắn kết, bà xã chú thấy bó này chắc chắn sẽ rơm rớm nước mắt vì xúc động!"
  },
  {
    "id": "dlg-order-03-04-linh-hon-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Đêm nay trăng khuất sau mây... Ta thèm khát một ánh dương ấm áp của nhân gian để xua đi bóng tối ngàn năm.",
    "choices": [
      {
        "id": "choice-order-03-04-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-03-04-linh-hon-ready"
      },
      {
        "id": "choice-order-03-04-linh-hon-detail",
        "text": "Thi sĩ ơi, người muốn ánh dương được gửi gắm thế nào nơi cõi âm?",
        "nextId": "dlg-order-03-04-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-03-04-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 1 cành hướng dương rạng rỡ bên 2 cành cúc trắng trong bình gốm. Ánh vàng ấy sẽ thắp sáng những vần thơ u tối.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-03-04-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-03-04-linh-hon-ready"
  },
  {
    "id": "dlg-order-03-04-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Ta sẽ lặng im đón nhận vầng dương trong đêm sương..."
  },
  {
    "id": "dlg-order-03-04-linh-hon-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bình hoa này thiếu mất đóa hướng dương ấm áp rồi người cắm hoa ơi..."
  },
  {
    "id": "dlg-order-03-04-linh-hon-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đóa hướng dương vàng rực rỡ... Ánh sáng nhân gian như vừa len lỏi vào góc khuất lạnh lẽo của linh hồn ta."
  },
  {
    "id": "dlg-order-03-04-linh-hon-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Ánh dương kỳ diệu sưởi ấm toàn bộ cõi lòng kẻ thi sĩ! Những vần thơ bi ai phút chốc bừng sáng niềm hy vọng tái sinh!"
  },
  {
    "id": "dlg-order-04-01-bac-ba-01",
    "speakerId": "bac-ba",
    "text": "Hôm nay ngày rằm tháng chạp, bác muốn tìm hoa sen hồng thanh tịnh cắm viếng mộ bác gái.",
    "choices": [
      {
        "id": "choice-order-04-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-01-bac-ba-ready"
      },
      {
        "id": "choice-order-04-01-bac-ba-detail",
        "text": "Bác Ba ơi, bác có muốn gửi kèm tấm thiệp kính trọng đến bác gái không?",
        "nextId": "dlg-order-04-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Có chứ cháu, viết giùm bác lời cầu chúc an yên kính cẩn. Cắm 6 đến 9 cành sen hồng và cúc trắng vào bình hoa nhé.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-04-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Bác ra ghế đá ngồi đợi, cháu cắm cẩn thận giùm bác."
  },
  {
    "id": "dlg-order-04-01-bac-ba-missed",
    "speakerId": "bac-ba",
    "text": "Bình hoa thiếu sen hồng thanh tịnh hoặc chưa cài tấm thiệp kính trọng rồi cháu gái."
  },
  {
    "id": "dlg-order-04-01-bac-ba-accepted",
    "speakerId": "bac-ba",
    "text": "Bình sen hồng thanh khiết và trang nghiêm lắm. Tấm thiệp viết rất vừa ý bác."
  },
  {
    "id": "dlg-order-04-01-bac-ba-resonant",
    "speakerId": "bac-ba",
    "text": "Đóa sen hồng tỏa hương thơm ngát bên tấm thiệp hiếu kính... Bác gái ở cõi vĩnh hằng chắc chắn mỉm cười an lạc."
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-01",
    "speakerId": "bac-ba",
    "text": "Cháu gái ơi, mấy lần trước cháu cắm hoa có tâm và chu đáo quá. Hôm nay bác muốn gửi gắm một bó hoa sen hồng thật đặc biệt mừng kỷ niệm ngày đầu gặp gỡ bác gái!",
    "choices": [
      {
        "id": "choice-order-04-01-bac-ba-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-01-bac-ba-good-ready"
      },
      {
        "id": "choice-order-04-01-bac-ba-good-detail",
        "text": "Bác Ba tin tưởng cháu thế này cháu vui lắm! Bác muốn bó hoa được hoàn thiện thế nào ạ?",
        "nextId": "dlg-order-04-01-bac-ba-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-detail",
    "speakerId": "bac-ba",
    "text": "Bó 6 đến 9 cành kết hợp sen hồng thanh cao và hướng dương ấm áp! Gói giấy kraft, thắt nơ xanh sage và cài tấm thiệp tưởng nhớ dịu dàng nhé cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-01-bac-ba-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-01-bac-ba-good-ready"
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-ready",
    "speakerId": "bac-ba",
    "text": "Bác tin tưởng hoàn toàn vào hoa tay và tấm lòng của cháu!"
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa còn thiếu chút hương sen hoặc nơ xanh, thiệp tưởng nhớ của bác rồi cháu ơi."
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-accepted",
    "speakerId": "bac-ba",
    "text": "Bó hoa tuyệt đẹp! Sự kết hợp giữa sen hồng và hướng dương với nơ sage làm bác vô cùng xúc động."
  },
  {
    "id": "dlg-order-04-01-bac-ba-good-resonant",
    "speakerId": "bac-ba",
    "text": "Kỳ diệu quá cháu ơi! Tấm lòng tri kỷ của cháu đã biến bó hoa thành một tác phẩm lay động cõi lòng! Bác vô cùng biết ơn cháu!"
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-01",
    "speakerId": "bac-ba",
    "text": "Chào cháu... Mấy lần trước hoa cắm chưa được vừa ý lắm làm bác hơi băn khoăn. Lần này bác chỉ lấy đúng 3 cành sen hồng đơn sơ trong bình gốm thôi, cháu nhớ cẩn thận nhé.",
    "choices": [
      {
        "id": "choice-order-04-01-bac-ba-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-01-bac-ba-strained-ready"
      },
      {
        "id": "choice-order-04-01-bac-ba-strained-detail",
        "text": "Dạ bác Ba, cháu xin lỗi vì những sơ suất trước. Bác dặn dò kỹ để cháu làm thật đúng ý bác ạ!",
        "nextId": "dlg-order-04-01-bac-ba-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-detail",
    "speakerId": "bac-ba",
    "text": "Cứ cắm đúng 3 cành sen hồng thanh tịnh trong bình gốm, không cần nơ thiệp rườm rà gì đâu. Đúng lễ nghĩa là được.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-01-bac-ba-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-01-bac-ba-strained-ready"
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-ready",
    "speakerId": "bac-ba",
    "text": "Bác ngồi đây đợi, mong là lần này cháu cắm chuẩn mực."
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-missed",
    "speakerId": "bac-ba",
    "text": "Hoa vẫn chưa đúng ý bác rồi cháu... Sen hồng còn thiếu hoặc cắm lộn xộn quá."
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-accepted",
    "speakerId": "bac-ba",
    "text": "Lần này cháu cắm cẩn thận và đúng mực rồi đó. Cảm ơn cháu."
  },
  {
    "id": "dlg-order-04-01-bac-ba-strained-resonant",
    "speakerId": "bac-ba",
    "text": "Bình sen hồng mộc mạc mà chuẩn mực, thanh tịnh đúng như lễ nghi xưa. Bác đã thấy lại sự an tâm nơi tiệm hoa này."
  },
  {
    "id": "dlg-order-04-02-co-lien-01",
    "speakerId": "co-lien",
    "text": "Chào cháu, cô muốn cắm một bình sen hồng dịu dàng xoa dịu áp lực học hành cho Mai. Cháu giúp cô một tay nhé.",
    "choices": [
      {
        "id": "choice-order-04-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-02-co-lien-ready"
      },
      {
        "id": "choice-order-04-02-co-lien-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Cô dặn nè: Cắm khoảng 6 đến 9 cành kết hợp sen hồng thanh nhã cùng hướng dương rạng rỡ vào bình hoa nhé. Nhớ cài thêm tấm thiệp gửi gắm lời an ủi chúc Mai vững tâm nghen cháu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-02-co-lien-ready"
  },
  {
    "id": "dlg-order-04-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-02-co-lien-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-04-02-co-lien-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-04-02-co-lien-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-04-02-co-lien-good-01",
    "speakerId": "co-lien",
    "text": "Cháu ơi, hoa cháu cắm đẹp quá, cô muốn đặt lẵng sen hồng và hướng dương 12 đến 15 cành cho tiệc mừng con bé! Cháu giúp cô nghen!",
    "choices": [
      {
        "id": "choice-order-04-02-co-lien-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-02-co-lien-good-ready"
      },
      {
        "id": "choice-order-04-02-co-lien-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-02-co-lien-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-02-co-lien-good-detail",
    "speakerId": "co-lien",
    "text": "Cắm cho cô lẵng 12 đến 15 cành sen hồng tươi thắm xen cùng hướng dương rạng ngời nhé! Thắt chiếc nơ hồng điệu đà và cài tấm thiệp chúc mừng ấm áp nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-02-co-lien-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-02-co-lien-good-ready"
  },
  {
    "id": "dlg-order-04-02-co-lien-good-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-02-co-lien-good-missed",
    "speakerId": "co-lien",
    "text": "Lẵng hoa tiệc còn thiếu hoa sen hoặc chiếc nơ hồng xinh xắn rồi cháu ơi, xem lại giúp cô chút nghen."
  },
  {
    "id": "dlg-order-04-02-co-lien-good-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp rực rỡ luôn cháu ơi! Lẵng sen hồng và hướng dương thắt nơ hồng duyên dáng vô cùng, Mai nó sẽ thích mê cho mà xem!"
  },
  {
    "id": "dlg-order-04-02-co-lien-good-resonant",
    "speakerId": "co-lien",
    "text": "Kỳ công và lộng lẫy quá cháu ơi! Từng đóa sen, đóa hướng dương nở rộ bên nơ hồng ấm áp, cả nhà cô ai nhìn vào cũng tấm tắc khen ngợi!"
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-01",
    "speakerId": "co-lien",
    "text": "Chào cháu... lần trước hoa mau tàn làm cô hơi buồn. Nay cô chỉ cần 3 cành sen hồng đơn sơ thôi, cháu lựa cành tươi giúp cô nhé.",
    "choices": [
      {
        "id": "choice-order-04-02-co-lien-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-02-co-lien-strained-ready"
      },
      {
        "id": "choice-order-04-02-co-lien-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-02-co-lien-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-detail",
    "speakerId": "co-lien",
    "text": "Chỉ cần đúng 3 cành sen hồng búp chúm chím cắm trong bình hoa thôi cháu, tuyệt đối đừng cắm hoa tang hay phụ kiện rườm rà nghen.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-02-co-lien-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-02-co-lien-strained-ready"
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-missed",
    "speakerId": "co-lien",
    "text": "Bình hoa vẫn chưa đúng ý cô rồi cháu... Sen hồng chưa đạt hoặc cắm chưa ngay ngắn."
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-accepted",
    "speakerId": "co-lien",
    "text": "Lần này cháu chọn sen hồng tươi tắn và cắm gọn gàng lắm. Cảm ơn cháu nhé."
  },
  {
    "id": "dlg-order-04-02-co-lien-strained-resonant",
    "speakerId": "co-lien",
    "text": "Bình hoa giản dị mà thanh khiết đến nao lòng. Sự chu đáo lần này của cháu làm cô lấy lại trọn vẹn niềm tin nơi tiệm hoa."
  },
  {
    "id": "dlg-order-04-03-chu-tu-01",
    "speakerId": "chu-tu",
    "text": "Cháu ơi, chú lỡ quên đón bả ở chợ, bả đang giận đùng đùng! Chú mua bó sen hồng phối hồng đỏ về tạ lỗi, cháu cứu chú nghen!",
    "choices": [
      {
        "id": "choice-order-04-03-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-03-chu-tu-ready"
      },
      {
        "id": "choice-order-04-03-chu-tu-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-03-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-03-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Chú dặn kỹ nè: Cắm chừng 2 cành sen hồng dịu dàng phối với 2 cành hồng đỏ thắm nha. Nhớ thắt thêm chiếc nơ hồng ngọt ngào rồi cài tấm thiệp dỗ dành bả nghen!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-03-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-03-chu-tu-ready"
  },
  {
    "id": "dlg-order-04-03-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-03-chu-tu-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-04-03-chu-tu-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-04-03-chu-tu-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-01",
    "speakerId": "chu-tu",
    "text": "Haha cháu ơi, bả khen hoa cháu cắm hết lời, nay kỷ niệm ngày cưới chú đặt lẵng to 12 đến 15 cành sen hồng phối hồng đỏ hoành tráng luôn! Cháu giúp chú nghen!",
    "choices": [
      {
        "id": "choice-order-04-03-chu-tu-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-03-chu-tu-good-ready"
      },
      {
        "id": "choice-order-04-03-chu-tu-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-03-chu-tu-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-detail",
    "speakerId": "chu-tu",
    "text": "Cắm cho chú lẵng lớn 12 đến 15 cành cân đối giữa sen hồng và hồng đỏ rực rỡ nha! Bọc giấy kraft mộc mạc bên ngoài, thắt chiếc nơ hồng rồi cài tấm thiệp yêu thương ấm áp nghen!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-03-chu-tu-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-03-chu-tu-good-ready"
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-missed",
    "speakerId": "chu-tu",
    "text": "Ủa cháu ơi, hoa chưa đủ cành hoặc thiếu nơ hồng, thiệp ấm áp của chú rồi nè. Chỉnh lại xíu giùm chú nghen!"
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-accepted",
    "speakerId": "chu-tu",
    "text": "Lẵng hoa quá xá đã luôn cháu! Sen hồng hòa với hồng đỏ nhìn vừa sang vừa ấm áp, bả thấy là chấm điểm mười liền!"
  },
  {
    "id": "dlg-order-04-03-chu-tu-good-resonant",
    "speakerId": "chu-tu",
    "text": "Trời ơi đẹp thần sầu luôn cháu ơi! Lẵng hoa rực rỡ chan chứa tình cảm thế này bả nhìn chắc xúc động rơi nước mắt luôn quá! Đa tạ cháu nhiều nghen!"
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-01",
    "speakerId": "chu-tu",
    "text": "Chào cháu... bữa trước hoa chưa được tươi làm bả càu nhàu miết, nay chú chỉ lấy 3 cành sen hồng mộc mạc thôi, cháu cắm cẩn thận giùm chú nha.",
    "choices": [
      {
        "id": "choice-order-04-03-chu-tu-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-03-chu-tu-strained-ready"
      },
      {
        "id": "choice-order-04-03-chu-tu-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-03-chu-tu-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-detail",
    "speakerId": "chu-tu",
    "text": "Chỉ cần đúng 2 đến 3 cành sen hồng thanh lịch trong bình gốm thôi cháu, tuyệt đối đừng cắm cúc trắng nha bả tưởng hoa tang là bả giận chú thêm đó!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-03-chu-tu-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-03-chu-tu-strained-ready"
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-missed",
    "speakerId": "chu-tu",
    "text": "Bình hoa này chưa đạt rồi cháu... Thiếu sen hồng hoặc cắm chưa gọn gàng rồi."
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-accepted",
    "speakerId": "chu-tu",
    "text": "Bình hoa lần này cắm khéo và tươi tắn lắm cháu! Giản dị vậy mà bả thích nè. Cảm ơn cháu nghen."
  },
  {
    "id": "dlg-order-04-03-chu-tu-strained-resonant",
    "speakerId": "chu-tu",
    "text": "Đẹp và ngay ngắn lắm cháu ơi! Sen hồng mộc mạc trong bình gốm mà toát lên vẻ trang nhã lạ lùng. Chú an tâm về tiệm cháu rồi đó!"
  },
  {
    "id": "dlg-order-04-04-linh-hon-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Đêm nay ta ghé lại tiệm hoa nơi ranh giới, tìm một đóa sen hồng thanh khiết gột rửa muộn phiền cõi tục. Xin người cắm hoa gửi chút hương sen giúp ta.",
    "choices": [
      {
        "id": "choice-order-04-04-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-04-linh-hon-ready"
      },
      {
        "id": "choice-order-04-04-linh-hon-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-04-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-04-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Cắm cho ta 2 cành sen hồng thanh tịnh phối cùng 1 cành cúc trắng tinh khôi nhé. Nhớ cài thêm tấm thiệp an ủi, để những oán than trần thế hóa thành mây khói tan biến.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-04-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-04-linh-hon-ready"
  },
  {
    "id": "dlg-order-04-04-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-04-linh-hon-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-04-04-linh-hon-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-04-04-linh-hon-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Hỡi người tri âm, đêm nay ta muốn ngâm bài thơ tâm huyết nhất bên đóa sen hồng thanh khiết. Xin người kết hoa giúp ta.",
    "choices": [
      {
        "id": "choice-order-04-04-linh-hon-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-04-linh-hon-good-ready"
      },
      {
        "id": "choice-order-04-04-linh-hon-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-04-linh-hon-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 3 cành sen hồng tao nhã hòa cùng 2 cành cúc trắng tinh anh. Thắt dải nơ màu lá sage trầm mặc và cài tấm thiệp an ủi vỗ về nhé.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-04-linh-hon-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-04-linh-hon-good-ready"
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa tri kỷ còn thiếu sắc sen hồng hoặc dải nơ sage trầm lắng của ta rồi người ơi..."
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Thật là một tác phẩm thanh nhã! Sắc sen hòa cùng cúc trắng và nơ sage như nét mực vương trên giấy lụa, làm ta vô cùng xúc động."
  },
  {
    "id": "dlg-order-04-04-linh-hon-good-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt tác giữa hai cõi! Hoa của người đã hòa quyện cùng vần thơ của ta thành khúc ca vĩnh cửu! Cảm tạ tấm lòng tri âm cao khiết!"
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Gió lạnh đêm nay sao nghe buốt giá... ta chỉ xin 3 cành sen hồng tĩnh lặng trong bình gốm mộc, xin người lắng lòng cắm hoa.",
    "choices": [
      {
        "id": "choice-order-04-04-linh-hon-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-04-04-linh-hon-strained-ready"
      },
      {
        "id": "choice-order-04-04-linh-hon-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-04-04-linh-hon-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Chỉ cần 2 đến 3 cành sen hồng đơn sơ trong bình gốm thôi người ơi, giữ lấy nét thanh tịnh nơi cửa Phật, đừng thêm bớt điều chi rườm rà.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-04-04-linh-hon-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-04-04-linh-hon-strained-ready"
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Sắc hoa vẫn còn vương vấn sự xao động trần thế, chưa đúng với nỗi niềm thanh lặng của ta..."
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Sen hồng trong bình gốm thanh tịnh và mực thước. Lòng ta đã tìm lại được chút bình yên nơi cõi hư vô. Cảm tạ người."
  },
  {
    "id": "dlg-order-04-04-linh-hon-strained-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tĩnh lặng tuyệt đối! Nét mộc mạc của đóa sen hồng đã xoa dịu vết thương lòng u uất bấy lâu. Ta đã tìm lại được sự thấu cảm nơi tiệm hoa này."
  },
  {
    "id": "dlg-order-05-01-bac-ba-01",
    "speakerId": "bac-ba",
    "text": "Cháu gái ơi, hôm nay tiệm có hoa thủy tiên - loài hoa sinh thời bác gái yêu quý nhất. Bác muốn cắm bình tưởng nhớ bà ấy, cháu cắm giúp bác nhé.",
    "choices": [
      {
        "id": "choice-order-05-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-01-bac-ba-ready"
      },
      {
        "id": "choice-order-05-01-bac-ba-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Bác dặn nè: Cắm khoảng 6 đến 9 cành kết hợp 2 đóa thủy tiên thanh khiết cùng cúc trắng trang nghiêm vào bình hoa nhé. Nhớ cài tấm thiệp tưởng nhớ ghi lời nguyện ước ngàn thu giùm bác.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-05-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-01-bac-ba-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-01-bac-ba-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-01-bac-ba-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-01",
    "speakerId": "bac-ba",
    "text": "Cháu ơi, đêm qua bác gái báo mộng an lành, nay bác đặt bình hoa thủy tiên phối sen hồng 12 đến 15 cành tri ân bà ấy! Cháu giúp bác nhé!",
    "choices": [
      {
        "id": "choice-order-05-01-bac-ba-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-01-bac-ba-good-ready"
      },
      {
        "id": "choice-order-05-01-bac-ba-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-01-bac-ba-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-detail",
    "speakerId": "bac-ba",
    "text": "Cắm cho bác 12 đến 15 cành kết hợp thủy tiên thanh nhã và sen hồng thoát tục nhé! Thắt chiếc nơ xanh sage trang trọng và cài tấm thiệp tưởng nhớ tri ân người vợ hiền.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-01-bac-ba-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-01-bac-ba-good-ready"
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-01-bac-ba-good-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-01",
    "speakerId": "bac-ba",
    "text": "Chào cháu... hôm nay bác chỉ lấy 3 cành thủy tiên mộc mạc cắm bình gốm viếng mộ thôi, cháu cắm cẩn thận giúp bác nhé.",
    "choices": [
      {
        "id": "choice-order-05-01-bac-ba-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-01-bac-ba-strained-ready"
      },
      {
        "id": "choice-order-05-01-bac-ba-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-01-bac-ba-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-detail",
    "speakerId": "bac-ba",
    "text": "Chỉ cần đúng 2 đến 3 cành thủy tiên mộc mạc cắm trong bình gốm giản dị thôi cháu, không cần phụ kiện màu mè gì đâu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-01-bac-ba-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-01-bac-ba-strained-ready"
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-01-bac-ba-strained-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-02-co-lien-01",
    "speakerId": "co-lien",
    "text": "Chào cháu, cô muốn cắm bình thủy tiên thanh nhã đặt ở phòng khách đón đồng nghiệp. Cháu cắm giúp cô nhé.",
    "choices": [
      {
        "id": "choice-order-05-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-02-co-lien-ready"
      },
      {
        "id": "choice-order-05-02-co-lien-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Cắm cho cô 6 đến 9 cành kết hợp 2 đóa thủy tiên thanh lịch cùng hướng dương rạng rỡ vào bình hoa nhé. Nhớ cài tấm thiệp kính trọng bày tỏ lòng tri ân chân thành tới các bậc tiền bối nghen cháu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-02-co-lien-ready"
  },
  {
    "id": "dlg-order-05-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-02-co-lien-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-02-co-lien-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-02-co-lien-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-02-co-lien-good-01",
    "speakerId": "co-lien",
    "text": "Cháu ơi, hội phụ nữ khen hoa tiệm cháu nức nở, nay cô đặt lẵng thủy tiên và hướng dương 12 đến 15 cành đại hội luôn! Cháu giúp cô nghen!",
    "choices": [
      {
        "id": "choice-order-05-02-co-lien-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-02-co-lien-good-ready"
      },
      {
        "id": "choice-order-05-02-co-lien-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-02-co-lien-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-02-co-lien-good-detail",
    "speakerId": "co-lien",
    "text": "Cắm cho cô 12 đến 15 cành phối hợp thủy tiên thanh nhã cùng hướng dương rực rỡ nhé! Thắt chiếc nơ hồng duyên dáng và cài tấm thiệp ấm áp chúc mừng đại hội thành công nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-02-co-lien-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-02-co-lien-good-ready"
  },
  {
    "id": "dlg-order-05-02-co-lien-good-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-02-co-lien-good-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-02-co-lien-good-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-02-co-lien-good-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-01",
    "speakerId": "co-lien",
    "text": "Chào cháu... lần này cô đặt 3 cành thủy tiên gọn gàng cho bàn trà thôi, cháu cắm cẩn thận giúp cô nhé.",
    "choices": [
      {
        "id": "choice-order-05-02-co-lien-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-02-co-lien-strained-ready"
      },
      {
        "id": "choice-order-05-02-co-lien-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-02-co-lien-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-detail",
    "speakerId": "co-lien",
    "text": "Chỉ cần cắm đúng 2 đến 3 cành thủy tiên thanh mảnh trong bình hoa thôi cháu, tuyệt đối tránh các loài hoa mang sắc buồn tang tóc nghen.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-02-co-lien-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-02-co-lien-strained-ready"
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-02-co-lien-strained-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-03-chu-tu-01",
    "speakerId": "chu-tu",
    "text": "Cháu ơi, nay rằm lớn chú tìm hoa thủy tiên đem về thắp hương tạ ơn mẹ già và tặng bà xã. Cháu cắm giúp chú nghen!",
    "choices": [
      {
        "id": "choice-order-05-03-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-03-chu-tu-ready"
      },
      {
        "id": "choice-order-05-03-chu-tu-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-03-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-03-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Cắm cho chú chừng 2 cành thủy tiên thanh nhã phối cùng 2 cành hồng đỏ thắm trong bình hoa nhé. Cài thêm tấm thiệp kính trọng bày tỏ lòng hiếu kính với mẹ nghen cháu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-03-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-03-chu-tu-ready"
  },
  {
    "id": "dlg-order-05-03-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-03-chu-tu-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-03-chu-tu-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-03-chu-tu-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-01",
    "speakerId": "chu-tu",
    "text": "Haha cháu ơi, mẹ chú vui lắm, nay chú đặt hẳn bó hoa 12 đến 15 cành thủy tiên phối hồng đỏ tưng bừng mừng thọ mẹ luôn! Cháu giúp chú nghen!",
    "choices": [
      {
        "id": "choice-order-05-03-chu-tu-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-03-chu-tu-good-ready"
      },
      {
        "id": "choice-order-05-03-chu-tu-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-03-chu-tu-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-detail",
    "speakerId": "chu-tu",
    "text": "Cắm cho chú 12 đến 15 cành thủy tiên thanh cao phối hồng đỏ rực rỡ nha! Thắt chiếc nơ hồng duyên dáng và cài tấm thiệp ấm áp chúc mẹ trường thọ bách niên giai lão nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-03-chu-tu-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-03-chu-tu-good-ready"
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-03-chu-tu-good-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-01",
    "speakerId": "chu-tu",
    "text": "Chào cháu... nay chú chỉ dám lấy 3 cành thủy tiên mộc mạc cắm bình gốm thôi, cháu cắm thật cẩn thận giúp chú nha.",
    "choices": [
      {
        "id": "choice-order-05-03-chu-tu-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-03-chu-tu-strained-ready"
      },
      {
        "id": "choice-order-05-03-chu-tu-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-03-chu-tu-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-detail",
    "speakerId": "chu-tu",
    "text": "Chỉ cần đúng 2 đến 3 cành thủy tiên thanh tao trong bình gốm thôi cháu, cắm đứng dáng và tươi rói là được, đừng thêm thắt gì rườm rà.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-03-chu-tu-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-03-chu-tu-strained-ready"
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-03-chu-tu-strained-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-04-linh-hon-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Làn sương đêm nay đưa ta gặp lại đóa thủy tiên thanh cao trong ký ức thi ca thuở thiếu thời. Xin người cắm hoa giúp ta.",
    "choices": [
      {
        "id": "choice-order-05-04-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-04-linh-hon-ready"
      },
      {
        "id": "choice-order-05-04-linh-hon-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-04-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-04-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 2 cành thủy tiên thanh tao phối cùng 2 cành sen hồng thuần khiết. Cài thêm tấm thiệp an ủi, để những hoài niệm dở dang chốn nhân gian được xoa dịu an yên.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-04-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-04-linh-hon-ready"
  },
  {
    "id": "dlg-order-05-04-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-04-linh-hon-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-04-linh-hon-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-04-linh-hon-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Hỡi người tri âm, đêm nay ta muốn kết bình hoa 12 đến 15 cành thủy tiên và sen hồng thanh cao tạ ơn đời! Xin người giúp ta.",
    "choices": [
      {
        "id": "choice-order-05-04-linh-hon-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-04-linh-hon-good-ready"
      },
      {
        "id": "choice-order-05-04-linh-hon-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-04-linh-hon-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Cắm cho ta 3 cành thủy tiên tao nhã hòa cùng 2 cành sen hồng thanh khiết nhé. Thắt dải nơ sage trầm mặc và cài tấm thiệp tưởng nhớ ngàn thu lưu dấu mối lương duyên này.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-04-linh-hon-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-04-linh-hon-good-ready"
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-04-linh-hon-good-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Trăng lạnh khuyết tàn... đêm nay ta chỉ xin 3 cành thủy tiên thanh bạch trong bình gốm, mong người tĩnh tâm cắm hoa.",
    "choices": [
      {
        "id": "choice-order-05-04-linh-hon-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-05-04-linh-hon-strained-ready"
      },
      {
        "id": "choice-order-05-04-linh-hon-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-05-04-linh-hon-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Chỉ cần 2 đến 3 cành thủy tiên trong bình gốm mộc thôi người ơi, giữ trọn nét thanh tao thuần khiết, tuyệt đối không thêm thắt điều chi vướng bận.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-05-04-linh-hon-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-05-04-linh-hon-strained-ready"
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-05-04-linh-hon-strained-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-01-bac-ba-01",
    "speakerId": "bac-ba",
    "text": "Cháu gái ơi, hôm nay ngày giỗ năm của bác gái, bác tìm hoa lưu ly gửi gắm lời nguyện ước không bao giờ quên bà ấy. Cháu cắm giúp bác nhé.",
    "choices": [
      {
        "id": "choice-order-06-01-bac-ba-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-01-bac-ba-ready"
      },
      {
        "id": "choice-order-06-01-bac-ba-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-01-bac-ba-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-01-bac-ba-detail",
    "speakerId": "bac-ba",
    "text": "Bác dặn nè: Cắm khoảng 6 đến 9 cành kết hợp 2 đóa lưu ly xanh thủy chung cùng cúc trắng trang nghiêm vào bình hoa nhé. Nhớ cài tấm thiệp tưởng nhớ ghi lời thề son sắt ngàn năm giùm bác.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-01-bac-ba",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-01-bac-ba-ready"
  },
  {
    "id": "dlg-order-06-01-bac-ba-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-01-bac-ba-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-01-bac-ba-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-01-bac-ba-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-01",
    "speakerId": "bac-ba",
    "text": "Cháu gái ơi, nay ngày giỗ lớn, bác muốn đặt bình lưu ly phối cúc trắng 12 đến 15 cành trọn nghĩa phu thê! Cháu cắm giúp bác nhé!",
    "choices": [
      {
        "id": "choice-order-06-01-bac-ba-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-01-bac-ba-good-ready"
      },
      {
        "id": "choice-order-06-01-bac-ba-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-01-bac-ba-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-detail",
    "speakerId": "bac-ba",
    "text": "Cắm cho bác 12 đến 15 cành phối hợp lưu ly biếc xanh và cúc trắng tinh khôi nhé! Thắt chiếc nơ xanh sage trang nhã và cài tấm thiệp tưởng nhớ tri ân trọn đời người vợ hiền tào khang nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-01-bac-ba-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-01-bac-ba-good-ready"
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-01-bac-ba-good-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-01",
    "speakerId": "bac-ba",
    "text": "Chào cháu, nay giỗ bác gái, bác chỉ xin đúng 3 cành lưu ly mộc mạc trong bình gốm thôi, cháu cắm cẩn thận giúp bác nhé.",
    "choices": [
      {
        "id": "choice-order-06-01-bac-ba-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-01-bac-ba-strained-ready"
      },
      {
        "id": "choice-order-06-01-bac-ba-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-01-bac-ba-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-detail",
    "speakerId": "bac-ba",
    "text": "Chỉ cần đúng 2 đến 3 cành lưu ly trong bình gốm đơn sơ thôi cháu, không cần phụ kiện cầu kỳ. Giữ lấy sự tĩnh lặng và lòng thành kính là đủ rồi.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-01-bac-ba-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-01-bac-ba-strained-ready"
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-ready",
    "speakerId": "bac-ba",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-missed",
    "speakerId": "bac-ba",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-accepted",
    "speakerId": "bac-ba",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-01-bac-ba-strained-resonant",
    "speakerId": "bac-ba",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-02-co-lien-01",
    "speakerId": "co-lien",
    "text": "Chào cháu, mai Mai lên đường nhập học xa nhà rồi, cô muốn cắm bó lưu ly dịu dàng làm quà chia tay con bé. Cháu giúp cô nhé.",
    "choices": [
      {
        "id": "choice-order-06-02-co-lien-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-02-co-lien-ready"
      },
      {
        "id": "choice-order-06-02-co-lien-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-02-co-lien-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-02-co-lien-detail",
    "speakerId": "co-lien",
    "text": "Bó cho cô khoảng 6 đến 9 cành kết hợp 2 cành lưu ly xanh biếc cùng hướng dương rạng rỡ nhé. Cài thêm tấm thiệp ấm áp nhắn nhủ con gái vững tin tiến bước nghen cháu.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-02-co-lien",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-02-co-lien-ready"
  },
  {
    "id": "dlg-order-06-02-co-lien-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-02-co-lien-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-02-co-lien-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-02-co-lien-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-02-co-lien-good-01",
    "speakerId": "co-lien",
    "text": "Cháu ơi, cả tuần qua nhờ có hoa tiệm cháu mà hai mẹ con cô vui lắm! Nay cô đặt bó lưu ly và hướng dương 12 đến 15 cành tri ân! Cháu giúp cô nghen!",
    "choices": [
      {
        "id": "choice-order-06-02-co-lien-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-02-co-lien-good-ready"
      },
      {
        "id": "choice-order-06-02-co-lien-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-02-co-lien-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-02-co-lien-good-detail",
    "speakerId": "co-lien",
    "text": "Bó cho cô 12 đến 15 cành phối hợp lưu ly biếc xanh và hướng dương tươi rói nhé! Thắt chiếc nơ hồng duyên dáng và cài tấm thiệp ấm áp đong đầy tình yêu thương của mẹ dành cho con gái yêu nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-02-co-lien-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-02-co-lien-good-ready"
  },
  {
    "id": "dlg-order-06-02-co-lien-good-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-02-co-lien-good-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-02-co-lien-good-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-02-co-lien-good-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-01",
    "speakerId": "co-lien",
    "text": "Chào cháu, cô lấy 3 cành lưu ly nhẹ nhàng gửi con gái lên đường, cháu cắm cẩn thận giúp cô nhé.",
    "choices": [
      {
        "id": "choice-order-06-02-co-lien-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-02-co-lien-strained-ready"
      },
      {
        "id": "choice-order-06-02-co-lien-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-02-co-lien-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-detail",
    "speakerId": "co-lien",
    "text": "Chỉ cần đúng 2 đến 3 cành lưu ly trong bình thôi cháu, giữ lấy vẻ thanh nhã mộc mạc và tuyệt đối tránh các loài hoa mang sắc buồn tang tóc nghen.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-02-co-lien-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-02-co-lien-strained-ready"
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-ready",
    "speakerId": "co-lien",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-missed",
    "speakerId": "co-lien",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-accepted",
    "speakerId": "co-lien",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-02-co-lien-strained-resonant",
    "speakerId": "co-lien",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-03-chu-tu-01",
    "speakerId": "chu-tu",
    "text": "Cháu ơi, nay kỷ niệm ba mươi năm ngày cưới, chú muốn cắm hoa lưu ly tình nghĩa phối hồng đỏ đem về tặng bả. Cháu giúp chú một phen nghen!",
    "choices": [
      {
        "id": "choice-order-06-03-chu-tu-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-03-chu-tu-ready"
      },
      {
        "id": "choice-order-06-03-chu-tu-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-03-chu-tu-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-03-chu-tu-detail",
    "speakerId": "chu-tu",
    "text": "Bó cho chú khoảng 6 đến 9 cành kết hợp 2 đóa lưu ly xanh biếc cùng hồng đỏ thắm nhé. Thắt chiếc nơ hồng duyên dáng rồi cài tấm thiệp ấm áp cảm ơn bả đã chịu đựng chú suốt ba chục năm qua nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-03-chu-tu",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-03-chu-tu-ready"
  },
  {
    "id": "dlg-order-06-03-chu-tu-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-03-chu-tu-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-03-chu-tu-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-03-chu-tu-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-01",
    "speakerId": "chu-tu",
    "text": "Haha cháu ơi, nay chú chơi lớn đặt bó lưu ly phối hồng đỏ 12 đến 15 cành hoành tráng nhất phố tặng bà xã luôn! Cháu làm tới bến giùm chú nghen!",
    "choices": [
      {
        "id": "choice-order-06-03-chu-tu-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-03-chu-tu-good-ready"
      },
      {
        "id": "choice-order-06-03-chu-tu-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-03-chu-tu-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-detail",
    "speakerId": "chu-tu",
    "text": "Bó cho chú 12 đến 15 cành phối hợp lưu ly biếc xanh và hồng đỏ rực rỡ nha! Thắt chiếc nơ hồng điệu đà và cài tấm thiệp ấm áp ghi lời ước hẹn răng long đầu bạc cùng bà xã nghen cháu!",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-03-chu-tu-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-03-chu-tu-good-ready"
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-03-chu-tu-good-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-01",
    "speakerId": "chu-tu",
    "text": "Chào cháu, kỷ niệm ngày cưới nay chú lấy 3 cành lưu ly cắm bình gốm mộc mạc thôi, cháu cắm cẩn thận giúp chú nghen.",
    "choices": [
      {
        "id": "choice-order-06-03-chu-tu-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-03-chu-tu-strained-ready"
      },
      {
        "id": "choice-order-06-03-chu-tu-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-03-chu-tu-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-detail",
    "speakerId": "chu-tu",
    "text": "Chỉ cần đúng 2 đến 3 cành lưu ly thanh nhã trong bình gốm thôi cháu, cắm chắc chắn và tươi rói là được, đừng thêm thắt điều chi rườm rà.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-03-chu-tu-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-03-chu-tu-strained-ready"
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-ready",
    "speakerId": "chu-tu",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-missed",
    "speakerId": "chu-tu",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-accepted",
    "speakerId": "chu-tu",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-03-chu-tu-strained-resonant",
    "speakerId": "chu-tu",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-04-linh-hon-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Đêm nay là đêm cuối cùng ta nương náu chốn nhân gian trước khi qua cầu Nại Hà, ta tìm nhành lưu ly giữ lại ký ức đẹp cõi trần. Xin người kết hoa tiễn biệt ta.",
    "choices": [
      {
        "id": "choice-order-06-04-linh-hon-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-04-linh-hon-ready"
      },
      {
        "id": "choice-order-06-04-linh-hon-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-04-linh-hon-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-04-linh-hon-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 2 cành lưu ly xanh biếc phối cùng 2 cành cúc trắng tinh khôi nhé. Cài thêm tấm thiệp an ủi vỗ về, để hồn ta thanh thản buông bỏ mọi oán than mà nhẹ bước sang bờ giác.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-04-linh-hon",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-04-linh-hon-ready"
  },
  {
    "id": "dlg-order-06-04-linh-hon-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-04-linh-hon-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-04-linh-hon-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-04-linh-hon-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Hỡi người bạn tri kỷ! Đêm nay trước khi siêu thoát, ta xin gửi lại lời tri ân sâu sắc nhất qua đóa lưu ly và sen hồng thanh khiết. Xin người giúp ta.",
    "choices": [
      {
        "id": "choice-order-06-04-linh-hon-good-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-04-linh-hon-good-ready"
      },
      {
        "id": "choice-order-06-04-linh-hon-good-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-04-linh-hon-good-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Hãy cắm cho ta 3 cành lưu ly tao nhã hòa cùng 2 cành sen hồng thuần khiết nhé. Thắt dải nơ sage trầm mặc và cài tấm thiệp an ủi vỗ về, lưu lại vần thơ tạ biệt đẹp đẽ nhất cõi trần.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-04-linh-hon-good",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-04-linh-hon-good-ready"
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-04-linh-hon-good-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-01",
    "speakerId": "linh-hon-thi-si",
    "text": "Đêm nay ta phải rời đi rồi, ta chỉ xin 3 cành lưu ly mộc mạc trong sương lạnh trước khi bước qua cầu Nại Hà. Xin người cắm hoa giúp ta.",
    "choices": [
      {
        "id": "choice-order-06-04-linh-hon-strained-direct",
        "text": "Cháu hiểu rồi, để cháu bắt tay vào cắm ngay.",
        "nextId": "dlg-order-06-04-linh-hon-strained-ready"
      },
      {
        "id": "choice-order-06-04-linh-hon-strained-detail",
        "text": "Cháu có thể hỏi thêm về yêu cầu chi tiết không ạ?",
        "nextId": "dlg-order-06-04-linh-hon-strained-detail"
      }
    ]
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-detail",
    "speakerId": "linh-hon-thi-si",
    "text": "Chỉ cần đúng 2 đến 3 cành lưu ly trong bình gốm đơn sơ thôi cháu, không cần phụ kiện cầu kỳ. Giữ lấy sự tĩnh lặng và lòng thành kính là đủ rồi.",
    "effects": [
      {
        "type": "setFlag",
        "flag": "flag_heard_detail_order-06-04-linh-hon-strained",
        "value": true
      }
    ],
    "nextId": "dlg-order-06-04-linh-hon-strained-ready"
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-ready",
    "speakerId": "linh-hon-thi-si",
    "text": "Cứ cắm thong thả nghen cháu, ta ngồi đợi bên hiên."
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-missed",
    "speakerId": "linh-hon-thi-si",
    "text": "Bó hoa này chưa đáp ứng đúng tâm nguyện rồi cháu ơi..."
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-accepted",
    "speakerId": "linh-hon-thi-si",
    "text": "Đẹp và đúng ý lắm cháu! Cảm ơn cháu nhiều nhé."
  },
  {
    "id": "dlg-order-06-04-linh-hon-strained-resonant",
    "speakerId": "linh-hon-thi-si",
    "text": "Tuyệt vời xuất sắc cháu ơi! Bó hoa chan chứa tình cảm làm ta vô cùng xúc động!"
  }
];

export const dialogueMap: Record<string, DialogueNode> = Object.fromEntries(
  dialogues.map((d) => [d.id, d]),
);

import type { OrderDefinition } from './types';

export const orders: OrderDefinition[] = [
  {
    "id": "order-01-bac-ba",
    "dayId": "day-1",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-bacba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "respect"
      },
      {
        "kind": "color",
        "value": "white"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-bacba-cuc-kinhtrong",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-cuc-trang",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-01-bac-ba",
            "equals": true
          }
        ],
        "effects": [
          {
            "type": "relationship",
            "customerId": "bac-ba",
            "amount": 15
          }
        ]
      },
      {
        "id": "rule-bacba-thuytien",
        "description": "Thủy tiên thanh tao gợi nhắc ký ức về bác gái",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 1
          }
        ],
        "conditions": [
          {
            "flag": "flag_knows_bac_ba_wife_memory",
            "equals": true
          }
        ],
        "effects": [
          {
            "type": "relationship",
            "customerId": "bac-ba",
            "amount": 15
          }
        ]
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-bacba-result-missed",
      "accepted": "dlg-bacba-result-accepted",
      "resonant": "dlg-bacba-result-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 10
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba ghé tiệm sáng sớm tìm hoa viếng mộ bác gái.",
      "Yêu cầu: Trang nghiêm, giản dị cõi trần."
    ],
    "noteDetail": [
      "Bác gái thích sự thanh tịnh, cắm 3 đến 5 cành cúc trắng là trọn lễ nghĩa."
    ]
  },
  {
    "id": "order-02-co-lien",
    "dayId": "day-1",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-colien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "white"
      },
      {
        "kind": "tag",
        "value": "peace"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-colien-cuc-thanhkhiet",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-cuc-trang",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-colien-result-missed",
      "accepted": "dlg-colien-result-accepted",
      "resonant": "dlg-colien-result-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Cô Liên ghé sớm tìm hoa cắm bàn thờ gia tiên ngày rằm.",
      "Yêu cầu: Tươi tắn, thanh khiết cõi trần."
    ],
    "noteDetail": [
      "Cần hoa cúc trắng tươi cõi trần thanh khiết, tránh hoa cõi âm. Cắm chừng 3 cành."
    ]
  },
  {
    "id": "order-01-chu-tu",
    "dayId": "day-1",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-01-chu-tu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "white"
      },
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-chutu-cuc-meco",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-cuc-trang",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-01-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-01-chu-tu-missed",
      "accepted": "dlg-order-01-chu-tu-accepted",
      "resonant": "dlg-order-01-chu-tu-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Chú Tư mua hoa kính mẹ già nhân ngày mở tiệm.",
      "Yêu cầu: Bình cúc trắng mộc mạc, bình an."
    ],
    "noteDetail": [
      "Mẹ chú thích cúc trắng cắm bình gốm mộc mạc, độ 3 đến 5 cành thanh thản."
    ]
  },
  {
    "id": "order-03-linh-hon",
    "dayId": "day-1",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-spirit-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "white"
      },
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-spirit-cuc-tuongnho",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-cuc-trang",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-03-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-spirit-result-missed",
      "accepted": "dlg-spirit-result-accepted",
      "resonant": "dlg-spirit-result-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bóng hình thi sĩ dừng chân trong sương chiều tìm hoa tưởng nhớ.",
      "Yêu cầu: Thanh tịnh, xoa dịu vong linh."
    ],
    "noteDetail": [
      "Cần hoa cúc trắng tưởng nhớ thanh tịnh, cắm 3 cành trong bình gốm tĩnh lặng."
    ]
  },
  {
    "id": "order-02-01-bac-ba",
    "dayId": "day-2",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-02-01-bac-ba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "red"
      },
      {
        "kind": "color",
        "value": "white"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-02-bacba-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-hong-do",
            "min": 1
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-02-01-bac-ba",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-02-01-bac-ba-missed",
      "accepted": "dlg-order-02-01-bac-ba-accepted",
      "resonant": "dlg-order-02-01-bac-ba-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba cần hoa cúc trắng kết hợp hồng đỏ cho ngày giỗ nhỏ.",
      "Yêu cầu: Gói giấy kraft mộc mạc."
    ],
    "noteDetail": [
      "Cần ít nhất 2 cúc trắng và 1 hồng đỏ, gói giấy kraft."
    ],
    "requiredFinish": {
      "paper": "kraft"
    }
  },
  {
    "id": "order-02-02-co-lien",
    "dayId": "day-2",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-02-02-co-lien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "red"
      },
      {
        "kind": "tag",
        "value": "love"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-02-colien-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-hong-do",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-02-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-02-02-co-lien-missed",
      "accepted": "dlg-order-02-02-co-lien-accepted",
      "resonant": "dlg-order-02-02-co-lien-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Cô Liên tìm hoa hồng đỏ mừng sinh nhật cháu gái nhỏ.",
      "Yêu cầu: Gói giấy kem tươi sáng, tránh hoa tang."
    ],
    "noteDetail": [
      "Cần ít nhất 2 cành hồng đỏ, gói giấy kem nhẹ nhàng, tuyệt đối tránh hoa tang."
    ],
    "requiredFinish": {
      "paper": "cream"
    }
  },
  {
    "id": "order-04-chu-tu",
    "dayId": "day-2",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-chutu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "red"
      },
      {
        "kind": "tag",
        "value": "apology"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      },
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-04-chutu-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-hong-do",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-chutu-result-missed",
      "accepted": "dlg-chutu-result-accepted",
      "resonant": "dlg-chutu-result-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Chú Tư cần hoa hồng đỏ xin lỗi vợ vì lỡ chê cá kho mặn.",
      "Yêu cầu: Gói giấy kraft mộc mạc, TUYỆT ĐỐI tránh cúc trắng."
    ],
    "noteDetail": [
      "Cần ít nhất 2 cành hồng đỏ, gói giấy kraft, cấm kỵ cúc trắng viếng mộ."
    ],
    "requiredFinish": {
      "paper": "kraft"
    }
  },
  {
    "id": "order-02-04-linh-hon",
    "dayId": "day-2",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-02-04-linh-hon-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "red"
      },
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-02-spirit-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-hong-do",
            "min": 1
          },
          {
            "kind": "flower",
            "value": "hoa-cuc-trang",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-02-04-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-02-04-linh-hon-missed",
      "accepted": "dlg-order-02-04-linh-hon-accepted",
      "resonant": "dlg-order-02-04-linh-hon-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Hồn thi sĩ nhớ về bóng hình xưa nơi trần thế.",
      "Yêu cầu: Cúc trắng kết hợp nhành hồng đỏ ấm áp."
    ],
    "noteDetail": [
      "Cần 2 cúc trắng và 1 hồng đỏ cắm bình thanh tao."
    ]
  },
  {
    "id": "order-03-01-bac-ba",
    "dayId": "day-3",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-03-01-bac-ba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 1
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "hope"
      },
      {
        "kind": "color",
        "value": "yellow"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-03-bacba-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-huong-duong",
            "min": 1
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-03-01-bac-ba",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-03-01-bac-ba-missed",
      "accepted": "dlg-order-03-01-bac-ba-accepted",
      "resonant": "dlg-order-03-01-bac-ba-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba cần cắm hoa hướng dương và cúc trắng đón nắng sớm.",
      "Yêu cầu: Thắt nơ xanh sage trang nhã."
    ],
    "noteDetail": [
      "Cần 1 hướng dương, 2 cúc trắng, thắt nơ sage trong bình."
    ],
    "requiredFinish": {
      "ribbon": "sage"
    }
  },
  {
    "id": "order-03-02-co-lien",
    "dayId": "day-3",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-03-02-co-lien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 3
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "yellow"
      },
      {
        "kind": "tag",
        "value": "joy"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-03-colien-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-huong-duong",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-03-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-03-02-co-lien-missed",
      "accepted": "dlg-order-03-02-co-lien-accepted",
      "resonant": "dlg-order-03-02-co-lien-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Cô Liên đặt hoa hướng dương mừng con gái đỗ bác sĩ nội trú.",
      "Yêu cầu: 6-9 cành, nơ hồng, tránh hoa tang."
    ],
    "noteDetail": [
      "Cần ít nhất 3 hướng dương rực rỡ, bọc giấy kem, thắt nơ hồng."
    ],
    "requiredFinish": {
      "paper": "cream",
      "ribbon": "rose"
    }
  },
  {
    "id": "order-03-03-chu-tu",
    "dayId": "day-3",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-03-03-chu-tu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "yellow"
      },
      {
        "kind": "color",
        "value": "red"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      },
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-03-chutu-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-huong-duong",
            "min": 2
          },
          {
            "kind": "flower",
            "value": "hoa-hong-do",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-03-03-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-03-03-chu-tu-missed",
      "accepted": "dlg-order-03-03-chu-tu-accepted",
      "resonant": "dlg-order-03-03-chu-tu-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Chú Tư đặt hoa kỷ niệm 20 năm ngày cưới.",
      "Yêu cầu: 6-9 bông, phối hướng dương và hồng đỏ, thắt nơ hồng."
    ],
    "noteDetail": [
      "Cần ít nhất 2 hướng dương và 2 hồng đỏ, thắt nơ hồng, không cúc trắng."
    ],
    "requiredFinish": {
      "ribbon": "rose"
    }
  },
  {
    "id": "order-03-04-linh-hon",
    "dayId": "day-3",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-03-04-linh-hon-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 1
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "yellow"
      },
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-03-spirit-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-huong-duong",
            "min": 1
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-03-04-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-03-04-linh-hon-missed",
      "accepted": "dlg-order-03-04-linh-hon-accepted",
      "resonant": "dlg-order-03-04-linh-hon-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Hồn thi sĩ tìm ánh mặt trời ấm áp xua tan đêm dài âm giới.",
      "Yêu cầu: Hướng dương và cúc trắng trong bình gốm."
    ],
    "noteDetail": [
      "Cần 1 hướng dương và 2 cúc trắng trong bình gốm."
    ]
  },
  {
    "id": "order-04-01-bac-ba",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-01-bac-ba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      },
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-04-bacba-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-01-bac-ba",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-01-bac-ba-missed",
      "accepted": "dlg-order-04-01-bac-ba-accepted",
      "resonant": "dlg-order-04-01-bac-ba-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Bác Ba tìm sen hồng thanh tịnh cắm viếng mộ ngày rằm.",
      "Yêu cầu: 6-9 cành, cắm bình, cài thiệp kính trọng."
    ],
    "noteDetail": [
      "Cần ít nhất 2 sen hồng và 2 cúc trắng, cài thiệp kính trọng."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "respect"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-04-01-bac-ba-good",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-01-bac-ba-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 3
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      },
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-04-bacba-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-01-bac-ba-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-01-bac-ba-good-missed",
      "accepted": "dlg-order-04-01-bac-ba-good-accepted",
      "resonant": "dlg-order-04-01-bac-ba-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Bác Ba tin tưởng đặt bó sen hồng và hướng dương kỷ niệm ngày đầu gặp gỡ.",
      "Yêu cầu: 6-9 cành, giấy kraft, nơ sage, thiệp tưởng nhớ."
    ],
    "noteDetail": [
      "Cần 3 sen hồng, 2 hướng dương, giấy kraft, nơ sage và thiệp tưởng nhớ."
    ],
    "branch": "good",
    "requiredFinish": {
      "paper": "kraft",
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-04-01-bac-ba-strained",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-01-bac-ba-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      },
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-04-bacba-str-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-01-bac-ba-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-01-bac-ba-strained-missed",
      "accepted": "dlg-order-04-01-bac-ba-strained-accepted",
      "resonant": "dlg-order-04-01-bac-ba-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba dè dặt sau những lần chưa vừa ý.",
      "Yêu cầu: 3-5 cành sen hồng mộc mạc cắm bình gốm, không nơ thiệp."
    ],
    "noteDetail": [
      "Cần ít nhất 2 cành sen hồng trong bình gốm đơn sơ chuẩn mực."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-04-02-co-lien",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-02-co-lien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-02-co-lien-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-02-co-lien-missed",
      "accepted": "dlg-order-04-02-co-lien-accepted",
      "resonant": "dlg-order-04-02-co-lien-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Cô Liên cắm bình sen hồng dịu dàng xoa dịu áp lực cho Mai."
    ],
    "noteDetail": [
      "Cô dặn cắm 6-9 cành sen hồng và hướng dương, cài thiệp an ủi."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-02-co-lien-good",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-02-co-lien-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 3
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-02-co-lien-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-02-co-lien-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-02-co-lien-good-missed",
      "accepted": "dlg-order-04-02-co-lien-good-accepted",
      "resonant": "dlg-order-04-02-co-lien-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Cô Liên hết lời khen ngợi tay nghề cháu, đặt lẵng sen hồng và hướng dương đại tiệc 12-15 cành!"
    ],
    "noteDetail": [
      "Cần 4 sen hồng, 3 hướng dương, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "paper": "cream",
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-02-co-lien-strained",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-02-co-lien-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-02-co-lien-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-02-co-lien-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-02-co-lien-strained-missed",
      "accepted": "dlg-order-04-02-co-lien-strained-accepted",
      "resonant": "dlg-order-04-02-co-lien-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Cô Liên hơi lo lắng sau lần trước, dặn cắm 3 cành sen hồng thật cẩn thận."
    ],
    "noteDetail": [
      "Chỉ cắm 3 cành sen hồng trong bình, tránh hoa tang."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-03-chu-tu",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-03-chu-tu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-03-chu-tu-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-03-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-03-chu-tu-missed",
      "accepted": "dlg-order-04-03-chu-tu-accepted",
      "resonant": "dlg-order-04-03-chu-tu-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Chú Tư mua sen hồng phối hồng đỏ làm dịu cơn giận của vợ."
    ],
    "noteDetail": [
      "Cần 2 sen hồng, 2 hồng đỏ, nơ hồng và thiệp dỗ dành."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-03-chu-tu-good",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-03-chu-tu-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 4
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-03-chu-tu-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-03-chu-tu-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-03-chu-tu-good-missed",
      "accepted": "dlg-order-04-03-chu-tu-good-accepted",
      "resonant": "dlg-order-04-03-chu-tu-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Chú Tư hào hứng khoe vợ khen hết lời, đặt lẵng hoa to 12-15 cành sen hồng và hồng đỏ!"
    ],
    "noteDetail": [
      "Cần 4 sen hồng, 4 hồng đỏ, giấy kraft, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "paper": "kraft",
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-03-chu-tu-strained",
    "dayId": "day-4",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-04-03-chu-tu-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-04-03-chu-tu-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-03-chu-tu-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-03-chu-tu-strained-missed",
      "accepted": "dlg-order-04-03-chu-tu-strained-accepted",
      "resonant": "dlg-order-04-03-chu-tu-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Chú Tư than thở bị vợ càu nhàu lần trước, chỉ dám lấy 3 cành sen hồng mộc mạc."
    ],
    "noteDetail": [
      "Cần 2 sen hồng cắm bình gốm gọn gàng."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-04-04-linh-hon",
    "dayId": "day-4",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-04-linh-hon-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 1
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-04-04-linh-hon-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-04-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-04-linh-hon-missed",
      "accepted": "dlg-order-04-04-linh-hon-accepted",
      "resonant": "dlg-order-04-04-linh-hon-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Thi sĩ tìm đóa sen hồng thanh tẩy muộn phiền cõi tục."
    ],
    "noteDetail": [
      "Cần 2 sen hồng, 1 cúc trắng, thiệp an ủi."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-04-04-linh-hon-good",
    "dayId": "day-4",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-04-linh-hon-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 3
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-04-04-linh-hon-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-04-linh-hon-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-04-linh-hon-good-missed",
      "accepted": "dlg-order-04-04-linh-hon-good-accepted",
      "resonant": "dlg-order-04-04-linh-hon-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Thi sĩ mở lòng ngâm bài thơ tâm huyết bên sen hồng thanh khiết."
    ],
    "noteDetail": [
      "Cần 3 sen hồng, 2 cúc trắng, nơ sage, thiệp an ủi."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-04-04-linh-hon-strained",
    "dayId": "day-4",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-04-04-linh-hon-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "color",
        "value": "pink"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-04-04-linh-hon-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-sen-hong",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-04-04-linh-hon-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-04-04-linh-hon-strained-missed",
      "accepted": "dlg-order-04-04-linh-hon-strained-accepted",
      "resonant": "dlg-order-04-04-linh-hon-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Thi sĩ thở dài u uất trong đêm, chỉ xin 3 cành sen hồng tĩnh lặng."
    ],
    "noteDetail": [
      "Cần 2 sen hồng cắm bình gốm."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-01-bac-ba",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-01-bac-ba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-01-bac-ba-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-01-bac-ba",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-01-bac-ba-missed",
      "accepted": "dlg-order-05-01-bac-ba-accepted",
      "resonant": "dlg-order-05-01-bac-ba-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Bác Ba tìm đóa thủy tiên - loài hoa người vợ hằng yêu quý."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên, 2 cúc trắng, thiệp tưởng nhớ."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-01-bac-ba-good",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-01-bac-ba-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 3
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-01-bac-ba-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-01-bac-ba-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-01-bac-ba-good-missed",
      "accepted": "dlg-order-05-01-bac-ba-good-accepted",
      "resonant": "dlg-order-05-01-bac-ba-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Bác Ba xúc động đặt bình hoa thủy tiên và sen hồng 12-15 cành tri ân người vợ hiền."
    ],
    "noteDetail": [
      "Cần 4 thủy tiên, 3 sen hồng, nơ sage, thiệp tưởng nhớ."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-01-bac-ba-strained",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-01-bac-ba-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-01-bac-ba-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-01-bac-ba-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-01-bac-ba-strained-missed",
      "accepted": "dlg-order-05-01-bac-ba-strained-accepted",
      "resonant": "dlg-order-05-01-bac-ba-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba thở dài tìm vài cành thủy tiên mộc mạc viếng mộ."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên cắm bình gốm giản dị."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-02-co-lien",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-02-co-lien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-02-co-lien-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-02-co-lien-missed",
      "accepted": "dlg-order-05-02-co-lien-accepted",
      "resonant": "dlg-order-05-02-co-lien-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Cô Liên cắm thủy tiên phòng khách đón đồng nghiệp của Mai."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên, 2 hướng dương, thiệp kính trọng."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "respect"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-02-co-lien-good",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-02-co-lien-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 4
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-02-co-lien-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-02-co-lien-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-02-co-lien-good-missed",
      "accepted": "dlg-order-05-02-co-lien-good-accepted",
      "resonant": "dlg-order-05-02-co-lien-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Cô Liên đặt lẵng thủy tiên và hướng dương 12-15 cành cho hội phụ nữ!"
    ],
    "noteDetail": [
      "Cần 4 thủy tiên, 4 hướng dương, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-02-co-lien-strained",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-02-co-lien-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-02-co-lien-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-02-co-lien-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-02-co-lien-strained-missed",
      "accepted": "dlg-order-05-02-co-lien-strained-accepted",
      "resonant": "dlg-order-05-02-co-lien-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Cô Liên thử đặt 3 cành thủy tiên gọn gàng cho bàn trà."
    ],
    "noteDetail": [
      "Cần 2 cành thủy tiên, tránh hoa tang."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-03-chu-tu",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-03-chu-tu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-03-chu-tu-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-03-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-03-chu-tu-missed",
      "accepted": "dlg-order-05-03-chu-tu-accepted",
      "resonant": "dlg-order-05-03-chu-tu-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Chú Tư tìm hoa thủy tiên tặng mẹ nhân ngày rằm."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên, 2 hồng đỏ, thiệp hiếu kính."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "respect"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-03-chu-tu-good",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-03-chu-tu-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 4
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-03-chu-tu-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-03-chu-tu-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-03-chu-tu-good-missed",
      "accepted": "dlg-order-05-03-chu-tu-good-accepted",
      "resonant": "dlg-order-05-03-chu-tu-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Chú Tư hồ hởi đặt hoa thủy tiên phối hồng đỏ 12-15 cành tưng bừng cho mẹ và vợ!"
    ],
    "noteDetail": [
      "Cần 4 thủy tiên, 4 hồng đỏ, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-03-chu-tu-strained",
    "dayId": "day-5",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-05-03-chu-tu-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "respect"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-05-03-chu-tu-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-03-chu-tu-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-03-chu-tu-strained-missed",
      "accepted": "dlg-order-05-03-chu-tu-strained-accepted",
      "resonant": "dlg-order-05-03-chu-tu-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Chú Tư dặn cắm đúng 3 cành thủy tiên giản dị trong bình gốm."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên cắm bình gốm."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-05-04-linh-hon",
    "dayId": "day-5",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-04-linh-hon-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-05-04-linh-hon-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-04-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-04-linh-hon-missed",
      "accepted": "dlg-order-05-04-linh-hon-accepted",
      "resonant": "dlg-order-05-04-linh-hon-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Thi sĩ gặp lại đóa thủy tiên thanh cao trong ký ức thi ca."
    ],
    "noteDetail": [
      "Cần 2 thủy tiên, 2 sen hồng, thiệp an ủi."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-04-linh-hon-good",
    "dayId": "day-5",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-04-linh-hon-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 3
      },
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-05-04-linh-hon-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-04-linh-hon-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-04-linh-hon-good-missed",
      "accepted": "dlg-order-05-04-linh-hon-good-accepted",
      "resonant": "dlg-order-05-04-linh-hon-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Thi sĩ tìm thấy tri âm, hòa nhịp thơ với đóa thủy tiên thanh nhã."
    ],
    "noteDetail": [
      "Cần 3 thủy tiên, 2 sen hồng, nơ sage, thiệp tưởng nhớ."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-05-04-linh-hon-strained",
    "dayId": "day-5",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-05-04-linh-hon-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-thuy-tien",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-05-04-linh-hon-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-thuy-tien",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-05-04-linh-hon-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-05-04-linh-hon-strained-missed",
      "accepted": "dlg-order-05-04-linh-hon-strained-accepted",
      "resonant": "dlg-order-05-04-linh-hon-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Thi sĩ ngập ngừng trước hiên vắng tìm 3 cành thủy tiên."
    ],
    "noteDetail": [
      "Cần 2 cành thủy tiên trong bình gốm."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-01-bac-ba",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-01-bac-ba-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-01-bac-ba-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-01-bac-ba",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-01-bac-ba-missed",
      "accepted": "dlg-order-06-01-bac-ba-accepted",
      "resonant": "dlg-order-06-01-bac-ba-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Bác Ba tìm hoa lưu ly gửi gắm ước nguyện không bao giờ quên người vợ hiền."
    ],
    "noteDetail": [
      "Cần 2 lưu ly, 2 cúc trắng, thiệp tưởng nhớ."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-01-bac-ba-good",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-01-bac-ba-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 3
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-01-bac-ba-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-01-bac-ba-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-01-bac-ba-good-missed",
      "accepted": "dlg-order-06-01-bac-ba-good-accepted",
      "resonant": "dlg-order-06-01-bac-ba-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Bác Ba mỉm cười trọn vẹn đặt bình lưu ly và cúc trắng 12-15 cành trọn nghĩa phu thê!"
    ],
    "noteDetail": [
      "Cần 4 lưu ly, 3 cúc trắng, nơ sage, thiệp tưởng nhớ."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "memory"
    },
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-01-bac-ba-strained",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "bac-ba",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-01-bac-ba-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "memory"
      }
    ],
    "taboos": [
      {
        "kind": "world",
        "value": "dead"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-01-bac-ba-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-01-bac-ba-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-01-bac-ba-strained-missed",
      "accepted": "dlg-order-06-01-bac-ba-strained-accepted",
      "resonant": "dlg-order-06-01-bac-ba-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "bac-ba",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Bác Ba ghé tiệm lần cuối của tuần, cắm 3 cành lưu ly mộc mạc."
    ],
    "noteDetail": [
      "Cần 2 cành lưu ly trong bình gốm."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính dâng người vợ hiền trọn nghĩa phu thê, nguyện cầu bà an nghỉ nơi vĩnh hằng.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Mấy mươi năm chung bóng, hình bóng bà mãi khắc sâu trong tim tôi.",
        "tone": "memory"
      },
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Mong nơi suối vàng bà mỉm cười an lạc, lòng thanh thản tiêu dao.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Gửi hơi ấm nghĩa tình đến người vợ hiền suốt đời hy sinh vì gia đình.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-02-co-lien",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-02-co-lien-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-02-co-lien-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-02-co-lien",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-02-co-lien-missed",
      "accepted": "dlg-order-06-02-co-lien-accepted",
      "resonant": "dlg-order-06-02-co-lien-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Cô Liên cắm lưu ly làm quà chia tay con gái lên đường nhập học."
    ],
    "noteDetail": [
      "Cần 2 lưu ly, 2 hướng dương, thiệp ấm áp."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-02-co-lien-good",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-02-co-lien-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-huong-duong",
        "min": 4
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-02-co-lien-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-02-co-lien-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-02-co-lien-good-missed",
      "accepted": "dlg-order-06-02-co-lien-good-accepted",
      "resonant": "dlg-order-06-02-co-lien-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Cô Liên cảm ơn tiệm hoa đồng hành suốt tuần, đặt bó lưu ly và hướng dương 12-15 cành tri ân!"
    ],
    "noteDetail": [
      "Cần 4 lưu ly, 4 hướng dương, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-02-co-lien-strained",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "co-lien",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-02-co-lien-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "tag",
        "value": "mourning"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-02-co-lien-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-02-co-lien-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-02-co-lien-strained-missed",
      "accepted": "dlg-order-06-02-co-lien-strained-accepted",
      "resonant": "dlg-order-06-02-co-lien-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "co-lien",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Cô Liên lấy 3 cành lưu ly nhẹ nhàng gửi con gái."
    ],
    "noteDetail": [
      "Cần 2 lưu ly trong bình, tránh hoa tang."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Con gái yêu của mẹ, hãy vững lòng tin, mẹ luôn ở bên cạnh chở che cho con.",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chúc con gái vững bước trên đường đời, nụ cười của con là niềm tự hào lớn nhất của mẹ!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Kính trọng",
        "message": "Kính chúc quý thầy cô đồng nghiệp luôn dồi dào nhiệt huyết và an vui trong sự nghiệp.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gìn giữ từng kỷ niệm ấu thơ ngọt ngào dưới mái ấm thân thương này con nhé.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-03-chu-tu",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-03-chu-tu-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-03-chu-tu-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-03-chu-tu",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-03-chu-tu-missed",
      "accepted": "dlg-order-06-03-chu-tu-accepted",
      "resonant": "dlg-order-06-03-chu-tu-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Chú Tư cắm lưu ly tặng vợ làm kỷ niệm tình nghĩa tào khang bền chặt."
    ],
    "noteDetail": [
      "Cần 2 lưu ly, 2 hồng đỏ, thiệp ấm áp."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-03-chu-tu-good",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-03-chu-tu-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 4
      },
      {
        "kind": "flower",
        "value": "hoa-hong-do",
        "min": 4
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-03-chu-tu-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 4
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-03-chu-tu-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-03-chu-tu-good-missed",
      "accepted": "dlg-order-06-03-chu-tu-good-accepted",
      "resonant": "dlg-order-06-03-chu-tu-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "bouquet",
      "minStems": 12,
      "maxStems": 15
    },
    "noteOpening": [
      "Chú Tư tự hào đặt bó lưu ly phối hồng đỏ 12-15 cành hoành tráng nhất phố!"
    ],
    "noteDetail": [
      "Cần 4 lưu ly, 4 hồng đỏ, nơ hồng, thiệp ấm áp."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "rose",
      "requireCard": true,
      "targetTone": "warmth"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-03-chu-tu-strained",
    "dayId": "day-6",
    "shift": "living",
    "customerId": "chu-tu",
    "recipient": "living",
    "openingDialogueId": "dlg-order-06-03-chu-tu-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "warmth"
      }
    ],
    "taboos": [
      {
        "kind": "flower",
        "value": "hoa-cuc-trang"
      }
    ],
    "resonanceRules": [
      {
        "id": "rule-order-06-03-chu-tu-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-03-chu-tu-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-03-chu-tu-strained-missed",
      "accepted": "dlg-order-06-03-chu-tu-strained-accepted",
      "resonant": "dlg-order-06-03-chu-tu-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "chu-tu",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Chú Tư cẩn thận chọn 3 cành lưu ly tặng vợ."
    ],
    "noteDetail": [
      "Cần 2 lưu ly trong bình gốm mộc mạc."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "Dỗ dành",
        "message": "Anh biết lỗi rồi, bà xã đừng giận anh nữa nghen, thương em nhiều lắm!",
        "tone": "comfort"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Cảm ơn em đã chịu đựng anh suốt ba mươi năm qua, thương bà xã nhất trần đời!",
        "tone": "warmth"
      },
      {
        "id": "card-respect",
        "label": "Hiếu kính",
        "message": "Kính chúc mẹ già sống lâu trăm tuổi, luôn an vui hạnh phúc bên con cháu.",
        "tone": "respect"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Nhớ mãi ngày đầu gặp em bên bến phà xưa, ba chục năm tình nghĩa vẹn tròn.",
        "tone": "memory"
      }
    ]
  },
  {
    "id": "order-06-04-linh-hon",
    "dayId": "day-6",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-04-linh-hon-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      },
      {
        "kind": "flower",
        "value": "hoa-cuc-trang",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "comfort"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-06-04-linh-hon-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-04-linh-hon",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-04-linh-hon-missed",
      "accepted": "dlg-order-06-04-linh-hon-accepted",
      "resonant": "dlg-order-06-04-linh-hon-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Thi sĩ chuẩn bị bước qua cầu nại hà, cần lưu ly giữ lại ký ức đẹp cõi trần."
    ],
    "noteDetail": [
      "Cần 2 lưu ly, 2 cúc trắng, thiệp an ủi."
    ],
    "branch": "neutral",
    "requiredFinish": {
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-04-linh-hon-good",
    "dayId": "day-6",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-04-linh-hon-good-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 3
      },
      {
        "kind": "flower",
        "value": "hoa-sen-hong",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "comfort"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-06-04-linh-hon-good-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 3
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-04-linh-hon-good",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-04-linh-hon-good-missed",
      "accepted": "dlg-order-06-04-linh-hon-good-accepted",
      "resonant": "dlg-order-06-04-linh-hon-good-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "vase",
      "minStems": 6,
      "maxStems": 9
    },
    "noteOpening": [
      "Thi sĩ thanh thản buông bỏ mọi oán than, nhờ cắm lưu ly và sen hồng dẫn lối siêu thoát an yên!"
    ],
    "noteDetail": [
      "Cần 3 lưu ly, 2 sen hồng, nơ sage, thiệp an ủi."
    ],
    "branch": "good",
    "requiredFinish": {
      "ribbon": "sage",
      "requireCard": true,
      "targetTone": "comfort"
    },
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  },
  {
    "id": "order-06-04-linh-hon-strained",
    "dayId": "day-6",
    "shift": "dead",
    "customerId": "linh-hon-thi-si",
    "recipient": "deceased",
    "openingDialogueId": "dlg-order-06-04-linh-hon-strained-01",
    "explicitRequirements": [
      {
        "kind": "flower",
        "value": "hoa-luu-ly",
        "min": 2
      }
    ],
    "preferences": [
      {
        "kind": "tag",
        "value": "comfort"
      }
    ],
    "taboos": [],
    "resonanceRules": [
      {
        "id": "rule-order-06-04-linh-hon-strained-res",
        "requirements": [
          {
            "kind": "flower",
            "value": "hoa-luu-ly",
            "min": 2
          }
        ],
        "conditions": [
          {
            "flag": "flag_heard_detail_order-06-04-linh-hon-strained",
            "equals": true
          }
        ],
        "effects": []
      }
    ],
    "resultDialogueIds": {
      "missed": "dlg-order-06-04-linh-hon-strained-missed",
      "accepted": "dlg-order-06-04-linh-hon-strained-accepted",
      "resonant": "dlg-order-06-04-linh-hon-strained-resonant"
    },
    "effects": {
      "accepted": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 8
        }
      ],
      "resonant": [
        {
          "type": "relationship",
          "customerId": "linh-hon-thi-si",
          "amount": 15
        }
      ]
    },
    "arrangement": {
      "suggestedVessel": "jar",
      "minStems": 3,
      "maxStems": 5
    },
    "noteOpening": [
      "Thi sĩ lặng lẽ nhận 3 cành lưu ly trong sương lạnh trước khi rời đi."
    ],
    "noteDetail": [
      "Cần 2 cành lưu ly trong bình gốm."
    ],
    "branch": "strained",
    "cardChoices": [
      {
        "id": "card-comfort",
        "label": "An ủi",
        "message": "Trút bỏ hết oán than chốn nhân gian, nhẹ gót sen sang bến bờ giác ngộ.",
        "tone": "comfort"
      },
      {
        "id": "card-memory",
        "label": "Tưởng nhớ",
        "message": "Gửi lại cõi trần một kiếp thi ca, ngàn năm trăng sáng soi lòng tri âm.",
        "tone": "memory"
      },
      {
        "id": "card-respect",
        "label": "Kính tạ",
        "message": "Kính cẩn cúi đầu tạ từ cõi tạm, tạ ơn nhân duyên tao ngộ nghìn thu.",
        "tone": "respect"
      },
      {
        "id": "card-warmth",
        "label": "Ấm áp",
        "message": "Chút hơi ấm tình người nơi tiệm hoa sưởi ấm linh hồn cô độc nơi ranh giới.",
        "tone": "warmth"
      }
    ]
  }
];

export const orderMap: Record<string, OrderDefinition> = Object.fromEntries(
  orders.map((o) => [o.id, o]),
);

# Hoa Tích — Chuyện của hoa

## Trạng thái tài liệu

- **Loại:** design specification
- **Ngày:** 2026-10-12
- **Trạng thái:** design baseline để review
- **Project state:** repository hiện trống; chưa có source, package, asset pipeline hoặc runtime implementation.
- **Phạm vi tài liệu:** định nghĩa game concept, vertical slice, content model và hướng kỹ thuật web-first. Không phải implementation plan và không tạo code.

## 1. Tóm tắt

**Hoa Tích — Chuyện của hoa** là game narrative shopkeeping nhẹ trên web. Người chơi tiếp quản một tiệm hoa từ người cô đã qua đời. Một vật cô để lại cho nhân vật chính khả năng nhìn thấy cả hai phía của thế giới: người sống vào ban ngày và người chết vào buổi chiều/tối.

Người chơi lắng nghe khách, tìm hiểu hoàn cảnh, học ý nghĩa hoa, chọn hoa và tự sắp xếp bouquet. Bouquet không phải bài toán có một đáp án duy nhất; chất lượng chính nằm ở việc người chơi hiểu được điều khách muốn nói, điều họ chưa nói và mối quan hệ phía sau đơn hàng.

Web là nền tảng chính cho demo và bản chơi đầu tiên. Steam là hướng phát hành sau khi gameplay, content và art đã chứng minh được giá trị.

## 2. Ý định sản phẩm

### 2.1 Product promise

> Làm một bó hoa để giúp ai đó nói điều họ không thể tự nói.

Game phải khiến người chơi cảm thấy họ đang lắng nghe và giúp đỡ con người, không chỉ đang tối ưu đơn hàng.

### 2.2 Trải nghiệm ưu tiên

Thứ tự ưu tiên:

1. Lắng nghe và chữa lành.
2. Khám phá câu chuyện của khách và tiệm hoa.
3. Suy luận vừa đủ để hiểu nhu cầu ẩn.
4. Tự do tạo bouquet có cảm giác riêng.
5. Quản lý tiệm ở mức nhẹ, không biến thành game kinh doanh sâu.

### 2.3 Đối tượng và session

- Phù hợp với người thích narrative game, cozy game, visual novel nhẹ và interaction sáng tạo.
- Không dùng đồng hồ đếm ngược cho đọc truyện hoặc làm hoa.
- Người chơi có thể dừng ở cuối order, cuối buổi hoặc mốc save tự động.
- Lịch truyện được tổ chức theo tháng/chapter và ngày; thời lượng thực tế của mỗi ngày do nội dung quyết định.

## 3. Những gì đã chốt và những gì còn mở

### 3.1 Đã chốt theo brief

- Tên tạm: **Hoa Tích — Chuyện của hoa**.
- Nhân vật chính nhận lại tiệm hoa và một vật đặc biệt từ người cô làm hoa.
- Vật cho phép nhìn thấy âm và dương.
- Ban ngày làm hoa cho người sống.
- Buổi chiều/tối làm hoa cho người chết.
- Có hoa thật và hoa hư cấu; một phần hoa chỉ tồn tại hoặc có ý nghĩa ở cõi chết.
- Hand-drawn 2D.
- “2.5D” nằm ở interaction làm hoa: lớp, chiều sâu giả, sắp xếp, cầm, đặt, bó và gói; không yêu cầu world 3D.
- Web-first; Steam là bước phát hành sau.
- Người chơi được đọc truyện và tương tác thoải mái, không bị giới hạn theo phút.
- Nhiều khách hàng có tính cách và yêu cầu khác nhau.
- Có mục tiêu mở dần hoa và nội dung.
- Hướng kết thúc có ít nhất hai kết quả khác nhau, nhưng điều kiện và nội dung ending chưa khóa.

### 3.2 Quyết định thiết kế dùng cho baseline

Các điểm sau là lựa chọn kỹ thuật/thiết kế để làm baseline, có thể review nhưng cần giữ nhất quán nếu không đổi:

- 2.5D dùng scene 2D nhiều lớp, camera cố định hoặc room-based.
- Bouquet có nhiều kết quả hợp lý; không có điểm “đẹp” duy nhất dựa trên đối xứng.
- Khách có yêu cầu rõ và nhu cầu cảm xúc ẩn. Yêu cầu rõ có thể đáp ứng mà không cần khám phá hết bí mật.
- Sai hoặc thiếu context thay đổi phản hồi và narrative state, không khóa hỏng toàn bộ playthrough.
- Sáng/tối là nhịp truyện và nhóm khách, không phải cơ chế ép người chơi chạy deadline.
- Browser runtime không phụ thuộc Steam, backend hoặc account.
- Vertical slice dùng content data riêng, không hardcode toàn bộ dialogue vào scene.

### 3.3 Còn mở, không được giả làm requirement

- Nhân vật chết xuất hiện dưới dạng linh hồn rõ ràng, khách không biết mình đã chết, hay nhiều trạng thái kết hợp.
- Tên chính thức của nhân vật chính và cửa hàng.
- Mức độ graphic/dark của nội dung mất mát.
- Số tháng và số ngày của game hoàn chỉnh.
- Điều kiện chính xác của hai ending.
- Target mobile và controller.
- Danh sách hoa thật/hư cấu chính thức.
- Có dùng Ink/inkjs ngay từ vertical slice hay dùng schema dialogue TypeScript trước.

## 4. Bối cảnh và thế giới

### 4.1 Tiệm hoa

Tiệm là trung tâm của game và là không gian cố định để giảm scope art/runtime. Các lớp hình ảnh gồm:

1. Background kiến trúc.
2. Quầy tiếp khách.
3. Kệ hoa và sổ hoa.
4. Bàn làm bouquet.
5. Foreground/cửa/kính/ánh sáng theo buổi.
6. Nhân vật và vật thể tương tác.

Buổi sáng có ánh sáng, màu và âm thanh của thế giới người sống. Buổi chiều/tối thay đổi lớp ánh sáng, phản chiếu và khách; không cần đổi toàn bộ scene.

### 4.2 Âm và dương

Game cần giữ hai phía đủ khác nhau để người chơi nhận biết nhưng không biến mọi cảnh chết thành horror:

- Người sống: đơn hàng gắn với chăm sóc, tưởng nhớ, xin lỗi, tình yêu, nghi lễ hoặc đời sống thường ngày.
- Người chết: đơn hàng gắn với điều chưa nói, lời tạm biệt, ký ức, món nợ cảm xúc hoặc mong muốn được người sống nhớ đến.
- Một người sống có thể đặt hoa cho người chết.
- Một linh hồn có thể đặt hoa cho người sống.
- Không phải mọi đơn hàng người chết đều cần giải thích ngay tình trạng của họ.

Quy tắc siêu nhiên phải nhất quán: vật của người cô là điều kiện để nhìn thấy; hoa âm giới có dấu hiệu/luật riêng; người chơi được cung cấp đủ clue trước khi một luật được dùng để đánh giá order.

### 4.3 Người cô

Người cô là động lực narrative ban đầu và nguồn content knowledge:

- để lại tiệm;
- để lại vật nhìn được âm/dương;
- để lại sổ hoa hoặc ghi chép;
- có các đơn hàng dang dở;
- che giấu lý do từng làm hoa cho người chết.

Spec không chốt người cô là người tốt hoàn toàn, người can thiệp vào hai cõi hay người đã trả giá cho công việc này. Những lựa chọn đó thuộc narrative development sau vertical slice.

## 5. Nhân vật và nhóm khách

Board concept hiện có các archetype sau; đây là content direction, không phải toàn bộ cast bắt buộc:

- **Bà cô hàng xóm:** khẩu xà tâm phật, thân thiện, có thể là cầu nối với người cô.
- **Cụ ông mua hoa thăm mộ người vợ đã mất:** dạy người chơi rằng hoa cho người chết không chỉ do người chết đặt.
- **Khách bay bổng:** yêu cầu bằng cảm giác, thơ hoặc liên tưởng.
- **Kẻ sĩ tình:** yêu cầu cụ thể về đặc điểm, màu, mùi và chi tiết; dùng để test bouquet constraint.
- **Khách khó tính:** soi chi tiết, thay đổi yêu cầu, không thích hoa héo/lệch/không đúng màu; dùng để thử interaction và phản hồi, không dùng để phạt vô lý.
- **Chó của khách:** nhân vật nhí nhố hoặc linh hồn; tạo nhịp nhẹ giữa các đoạn grief.
- **Khách vãng lai:** nhóm mở rộng để giới thiệu các loại hoa và góc nhìn khác.
- **Hai người/đơn hàng giống nhau:** mystery có thể liên quan sinh đôi, người sống/người chết, hai thời điểm hoặc danh tính bị tráo; chưa đưa vào tutorial.

### 5.1 Nhân vật chính

Baseline từ concept board:

- khoảng 25 tuổi;
- mới bỏ việc hoặc đang tìm việc mới;
- tự ti, hơi hậu đậu nhưng hiền và chịu lắng nghe;
- chưa giỏi làm hoa lúc bắt đầu;
- có một hoa gắn với nhân vật, hiện là thủy tiên trong concept board.

Nhân vật chính và người chơi cùng học. Tutorial không giả định nhân vật đã là florist chuyên nghiệp.

## 6. Core loop

```text
Mở ngày
  -> nhận nhóm khách theo buổi
  -> nói chuyện, hỏi, quan sát và đọc clue
  -> xác định yêu cầu rõ + nhu cầu cảm xúc có thể có
  -> tra sổ hoa / mở knowledge mới
  -> chọn hoa, màu, lá, giấy và dây
  -> sắp xếp bouquet trên bàn
  -> xem lại và giao bouquet
  -> nhận phản hồi
  -> cập nhật inventory, journal, relationship và narrative flags
  -> auto-save
  -> chuyển khách tiếp theo hoặc kết thúc buổi
```

### 6.1 Sáng và chiều/tối

- Sáng: nhóm khách người sống.
- Chiều/tối: nhóm khách người chết hoặc các biểu hiện siêu nhiên.
- Người chơi không bị ép hoàn thành trong số phút cố định.
- Người chơi có thể xem lại journal và flower knowledge giữa các order.
- Chuyển buổi là một mốc narrative; game có thể yêu cầu người chơi xác nhận trước khi chuyển để tránh bỏ sót dialogue.

### 6.2 Tháng và ngày

- Tháng là chapter/mùa narrative.
- Ngày là đơn vị tổ chức khách và tiến trình.
- Không cần mô phỏng đủ từng ngày trong tháng; chỉ những ngày có content mới xuất hiện.
- Mở hoa có thể gắn với order, dialogue, khám phá hoặc mốc chapter.
- Bản demo nên chứng minh một chu kỳ tháng ngắn trước khi mở rộng nhiều tháng.

## 7. Bouquet interaction

### 7.1 Các bước

1. Chọn hoa từ stock hoặc catalog.
2. Đưa hoa lên bàn.
3. Kéo hoặc chọn-và-đặt để sắp xếp.
4. Đổi thứ tự lớp, xoay và tháo hoa.
5. Chọn lá/phụ kiện nếu order cho phép.
6. Chọn giấy/gói/dây.
7. Xem preview.
8. Giao hoặc quay lại chỉnh sửa.

Cần có undo/remove trước lúc giao. Không được làm người chơi mất inventory do click nhầm.

### 7.2 2.5D giả lập

- Hoa có lớp trước/sau.
- Vật thể có bóng nhẹ và thay đổi scale nhỏ theo depth layer.
- Tay nhân vật hoặc animation cầm/đặt là tùy chọn art, không phải physics thật.
- Bàn có thể dùng perspective giả; camera không xoay tự do.
- Drag/drop phải có phương án keyboard/click thay thế.

### 7.3 Đánh giá bouquet

Mỗi order có:

- `explicitRequirements`: yêu cầu khách nói rõ;
- `preferences`: sở thích hoặc điều kiện đã biết;
- `taboos`: hoa/màu/phụ kiện không nên dùng;
- `hiddenContext`: context chỉ có thể biết bằng dialogue/clue;
- `resonanceRules`: điều kiện mở phản ứng đặc biệt.

Kết quả baseline:

- `missed`: không đáp ứng yêu cầu rõ hoặc vi phạm điều kiện quan trọng;
- `accepted`: đáp ứng yêu cầu rõ; khách nhận bouquet;
- `resonant`: đáp ứng yêu cầu và chạm được context/relationship phù hợp.

`resonant` không có nghĩa mọi lựa chọn khác là sai. Một order có thể có nhiều bouquet hợp lệ và nhiều phản hồi hợp lý. Không dùng điểm thẩm mỹ duy nhất để quyết định chất lượng.

## 8. Flower system

### 8.1 Flower record

```ts
interface FlowerDefinition {
  id: string;
  displayName: string;
  world: "living" | "dead" | "both";
  colors: string[];
  meanings: string[];
  emotionalTags: string[];
  seasonTags: string[];
  availability: "stock" | "unlock" | "story";
  price?: number;
  companionFlowerIds?: string[];
  incompatibleFlowerIds?: string[];
  description: string;
  unlockCondition?: UnlockCondition;
}
```

Các trường trên là contract đề xuất; implementation plan có thể giản lược nếu vertical slice chưa dùng hết.

### 8.2 Hoa thật và hoa hư cấu

- Hoa thật dùng symbolism như context văn hóa, không tuyên bố là ý nghĩa duy nhất hoặc phổ quát.
- Hoa hư cấu phải có luật nhất quán và được giới thiệu bằng truyện/journal.
- Hoa âm giới có thể liên quan ký ức, ranh giới hoặc trạng thái linh hồn nhưng không tự động đồng nghĩa với “hoa xấu”.
- Người chơi học hoa bằng việc gặp khách, đọc sổ, thử nghiệm an toàn và mở content.
- Knowledge đã mở phải tra cứu lại được.

### 8.3 Quy mô content

Không khóa số lượng hoa của full game. Mục tiêu vertical slice đề xuất:

- 8–12 hoa tổng cộng;
- có hoa thật và ít nhất một hoa hư cấu;
- đủ flower tags để tạo order sống, order chết và order mâu thuẫn;
- mở dần từ content, không mở toàn bộ từ đầu.

## 9. Narrative architecture

### 9.1 Content ngoài code

Dialogue, order, flower và rule phải có ID ổn định, được validate trước build.

```ts
interface OrderDefinition {
  id: string;
  dayId: string;
  shift: "living" | "dead";
  customerId: string;
  recipient: "living" | "deceased" | "unknown";
  openingDialogueId: string;
  explicitRequirements: Requirement[];
  preferences: Requirement[];
  taboos: Requirement[];
  resonanceRules: Rule[];
  resultDialogueIds: {
    missed: string;
    accepted: string;
    resonant: string;
  };
}
```

```ts
interface DialogueNode {
  id: string;
  speakerId: string;
  text: string;
  choices?: DialogueChoice[];
  conditions?: Condition[];
  effects?: Effect[];
  tags?: string[];
}
```

### 9.2 Flags và relationship

State narrative gồm:

- `currentChapter`;
- `currentDay`;
- `currentShift`;
- `flags`;
- `relationshipScores`;
- `completedOrders`;
- `journalEntries`;
- `unlockedFlowers`;
- `endingSignals` khi game đã định nghĩa ending.

Flag phải có tên ổn định và validator phải bắt reference không tồn tại. Không để scene tự sửa flag bằng string rải rác trong nhiều file.

### 9.3 Ink/inkjs

Ink + inkjs là lựa chọn phù hợp khi dialogue đã nhiều nhánh:

- tác giả viết `.ink` và preview bằng Inky;
- build biên dịch story thành JSON;
- `inkjs` chạy story trong browser;
- game wrapper chuyển line/choice/tag thành UI và effects;
- narrative state có thể serialize riêng.

Baseline recommendation: **không bắt buộc Ink cho vertical slice đầu tiên**. Nếu content thử nghiệm đã có nhiều branch, dùng Ink sớm sẽ tốt hơn tự xây dialogue DSL. Dù chọn cách nào, inventory, bouquet evaluator, day/shift và save envelope vẫn thuộc TypeScript game layer.

Ranh giới:

```text
Ink/Dialogue layer:
  line, choice, condition, narrative variable, tag

Game layer:
  flower stock, bouquet composition, order evaluation,
  calendar, inventory, relationship projection, save repository
```

Không giữ cùng một flag ở cả Ink và TypeScript nếu không định nghĩa owner. Một flag narrative chỉ có một nguồn sự thật.

## 10. State và save

```ts
interface GameState {
  schemaVersion: number;
  savedAt: string;
  currentChapter: string;
  currentDay: string;
  currentShift: "living" | "dead";
  inventory: Record<string, number>;
  unlockedFlowerIds: string[];
  completedOrderIds: string[];
  relationshipScores: Record<string, number>;
  flags: Record<string, boolean | number | string>;
  journalEntryIds: string[];
  settings: {
    textSpeed: "slow" | "normal" | "fast";
    fontScale: number;
    musicVolume: number;
    sfxVolume: number;
    reducedMotion: boolean;
  };
}
```

### 10.1 Browser save

- Vertical slice dùng `localStorage` vì save nhỏ, local-first và không cần dependency DB.
- Save key có namespace và version.
- Save sau order, sau unlock quan trọng và trước chuyển chapter.
- Không test bằng `file://`; browser storage theo origin cần dev/HTTP server.
- Browser build không yêu cầu login hoặc backend.

### 10.2 Lỗi save

- JSON hỏng: không crash; báo recovery và thử backup gần nhất.
- `schemaVersion` cũ: chạy migration xác định.
- Migration thất bại: giữ raw save, tạo state mới chỉ sau khi người chơi xác nhận; không silently xóa progress.
- Storage bị chặn/đầy: báo rõ, cho phép tiếp tục session nhưng cảnh báo chưa save.
- Save không được chứa reference tới asset runtime không ổn định.

### 10.3 Steam save sau này

Steam Cloud là adapter sau, không phải core persistence:

```text
GameState JSON
  -> LocalSaveRepository trong browser/desktop
  -> optional SteamCloudRepository trong desktop build
```

Steam unavailable thì game vẫn chạy. Cloud conflict cần policy rõ khi triển khai, tối thiểu phải giữ bản local và báo người chơi trước khi chọn bản ghi đè.

## 11. Technical architecture

### 11.1 Runtime

Khuyến nghị:

- TypeScript.
- Phaser + Vite.
- Renderer 2D WebGL với fallback Canvas theo cấu hình engine.
- HTML/CSS overlay cho dialogue, journal và accessibility-critical controls.
- Static asset hosting cho browser.

Phaser phù hợp vì đây là game 2D web-first; official docs mô tả WebGL/Canvas, browser desktop/mobile và TypeScript support. Official Vite TypeScript template cung cấp dev server và production build.

### 11.2 Module boundaries

```text
src/
  main.ts
  game/
    createGame.ts
    scenes/
      BootScene.ts
      ShopScene.ts
      DialogueScene.ts
      BouquetScene.ts
      ResultScene.ts
    state/
      GameState.ts
      stateReducer.ts
      narrativeEffects.ts
    content/
      flowers.ts
      customers.ts
      orders.ts
      dialogue.ts
      validateContent.ts
    bouquet/
      BouquetModel.ts
      evaluateBouquet.ts
    save/
      SaveRepository.ts
      browserSaveRepository.ts
    ui/
      DialoguePanel.ts
      JournalPanel.ts
      AccessibilitySettings.ts
```

Tên file/symbol chỉ là target cho implementation plan, không phải source tồn tại hiện tại.

- Scene điều phối render và input, không sở hữu business rules.
- `evaluateBouquet` là pure logic, nhận order + bouquet + known context và trả result/events.
- `stateReducer` là pure transition.
- `content` chứa data và validator.
- `SaveRepository` cô lập persistence.
- UI có thể render bằng Phaser hoặc HTML/CSS; boundary không để game state phụ thuộc DOM.

### 11.3 Steam desktop

Khi web vertical slice ổn:

- đóng gói cùng web bundle trong Electron trước;
- giữ core Phaser build dùng được không có Steam;
- đặt Steam API trong desktop adapter/preload/main process theo security model phù hợp;
- dùng `steamworks.js` chỉ khi cần achievement, overlay hoặc Cloud;
- test Windows + Steam client trước khi mở target macOS/Linux.

Electron được ưu tiên hơn Tauri cho Steam phase đầu vì `steamworks.js` có native Electron path và redistributable binaries. Đây là lựa chọn phát hành sau, không phải dependency của web prototype.

## 12. Accessibility

Vertical slice phải có:

- tốc độ text;
- scale font;
- volume music/SFX;
- keyboard navigation cho dialogue, catalogue và bouquet actions;
- không dùng màu là tín hiệu duy nhất;
- text label/tooltip cho hoa và tags;
- reduced motion cho transition nếu có animation mạnh.

Controller remap, mobile touch polish, high contrast chuyên sâu và localization nhiều ngôn ngữ là scope sau, trừ khi product review thêm vào acceptance criteria.

## 13. Vertical slice

### 13.1 Mục tiêu

Chứng minh một session ngắn đã thể hiện được:

- người sống và người chết là hai nhóm trải nghiệm khác nhau;
- người chơi lắng nghe rồi mới làm hoa;
- bouquet có interaction 2.5D giả;
- kết quả bouquet tác động narrative;
- hoa thật và hoa hư cấu cùng tồn tại;
- save/load không làm mất tiến trình.

### 13.2 Nội dung tối thiểu

- 1 shop scene hand-drawn 2D layered.
- Sáng và chiều/tối trong cùng shop.
- Nhân vật chính.
- Người cô hiện diện qua vật, sổ hoặc ký ức.
- 3 order bắt buộc:
  1. người sống mua hoa thăm người đã mất;
  2. người sống tặng người sống;
  3. khách âm/dương hoặc order có thông tin mâu thuẫn.
- 3–5 khách với ít nhất một khách nhịp nhẹ.
- 8–12 flower definitions trong content fixture.
- Ít nhất một hoa hư cấu.
- Dialogue với một branch có điều kiện.
- Flower journal.
- Bouquet compose/edit/undo/deliver.
- `missed`, `accepted`, `resonant` result.
- local save/load.
- content validator.

Số lượng trên là target vertical slice để đo rủi ro, không phải cam kết quy mô full game.

### 13.3 Không thuộc vertical slice

- world map/open world;
- real-time timer;
- economy sâu, staff hoặc shop upgrade lớn;
- full voice acting;
- multiplayer;
- account/backend/analytics bắt buộc;
- 3D model, camera xoay, physics 3D;
- Steamworks integration;
- mobile-specific polish;
- full localization pipeline;
- chốt toàn bộ lore, cast và hai ending cuối.

## 14. Content operations và kho asset lớn

Người dùng đề xuất viết MCP/skill để truy cập kho đồ đạc lớn. Đây là **subsystem hỗ trợ sản xuất content**, không phải gameplay runtime và không đưa vào vertical slice cho tới khi kho, format và quyền truy cập được kiểm tra.

### 14.1 Vấn đề cần giải

Kho có thể chứa:

- concept board;
- character references;
- flower references;
- background/layer art;
- dialogue notes;
- sound/music references;
- asset versions và trạng thái duyệt.

Tìm file bằng tên thủ công sẽ nhanh chóng gây duplicate, dùng nhầm version hoặc mất liên kết giữa asset và content ID.

### 14.2 Đề xuất hướng tương lai

Tách thành hai phần:

1. **Skill workflow:** hướng dẫn assistant cách lập catalog, đặt ID, tìm asset, cập nhật metadata, kiểm tra reference và tạo content fixture.
2. **MCP server/tool:** cung cấp read-only search và metadata operations trên kho được cấp quyền; không cho model tự ý xóa/ghi đè asset.

MCP nên expose các thao tác hẹp:

```text
search_assets(query, type, tags, status)
get_asset(asset_id)
get_related_assets(asset_id)
search_content_references(content_id)
validate_asset_references(scope)
```

Các thao tác ghi như rename, move, delete, replace hoặc publish cần approval riêng, audit log và dry-run.

### 14.3 Định dạng catalog đề xuất

Mỗi asset cần metadata tối thiểu:

```json
{
  "id": "flower.mong-tan.v1",
  "kind": "flower-art",
  "path": "assets/flowers/mong-tan/v1/",
  "tags": ["dead-world", "purple", "story"],
  "status": "concept",
  "relatedContentIds": ["flower.mong-tan"],
  "source": "concept-board-2026-10-12",
  "license": "owned",
  "checksum": "..."
}
```

Catalog không được trở thành nguồn runtime duy nhất. Build game cần copy/pack asset đã được validate vào project versioned.

### 14.4 Security boundary

- MCP chạy local hoặc trong workspace được cấp quyền.
- Mặc định read-only.
- Path traversal phải bị chặn.
- Không gửi toàn bộ kho vào context; trả về result compact, có ID/path/metadata.
- Asset binary lớn chỉ lấy khi cần.
- Không cho tool execute arbitrary shell command.
- Chỉ index thư mục allowlist.
- Dữ liệu riêng tư/ý tưởng chưa công bố phải giữ local.

Chi tiết MCP/skill là design task riêng sau khi game spec được duyệt. Không cài MCP dependency trong project game lúc này.

## 15. Verification strategy

### 15.1 Content checks

Validator phải fail khi:

- order tham chiếu flower ID không tồn tại;
- dialogue choice trỏ tới node không tồn tại;
- result dialogue thiếu một trạng thái;
- unlock condition tham chiếu flag không tồn tại;
- asset ID không có catalog record;
- content ID bị duplicate.

### 15.2 Pure logic checks

Các behavior cần check:

- bouquet thiếu requirement rõ trả `missed`;
- bouquet đáp ứng requirement trả `accepted`;
- bouquet đáp ứng resonance rule với context đã biết trả `resonant`;
- taboo luôn được áp dụng trước preference;
- nhiều bouquet hợp lệ cho cùng order không bị loại vì khác thứ tự không quan trọng;
- evaluating bouquet không mutate inventory hoặc GameState trực tiếp.

### 15.3 Save checks

- save/load giữ chapter, day, shift, inventory, flags, relationships và journal;
- save cũ được migrate;
- JSON hỏng không crash;
- storage unavailable tạo thông báo rõ;
- reload sau order không mất result.

### 15.4 Browser smoke

Expected flow:

```text
npm install
npm run dev
open local dev URL
enter shop
complete living order
complete dead/evening order
reload
observe progress retained
npm run build
observe dist output created successfully
```

Exact command names phải lấy từ package.json sau khi scaffold; không claim command đã chạy khi project chưa tồn tại.

### 15.5 Steam smoke sau này

- build Windows từ production web bundle;
- launch trực tiếp không có Steam để chứng minh offline fallback;
- launch qua Steam client;
- kiểm tra overlay nếu đã bật;
- kiểm tra local save;
- kiểm tra Steam Cloud adapter không ghi đè local save không có consent.

## 16. Rủi ro và cách giảm

| Rủi ro | Tác động | Giảm rủi ro |
|---|---|---|
| “2.5D” biến thành 3D thật | Phaser không còn là lựa chọn tự nhiên | Khóa vertical slice ở layered 2D; làm visual prototype trước khi thêm 3D |
| Narrative quá nhiều branch | Content vượt khả năng viết/test | Dùng chapter/day IDs, branch nhỏ, validator, Ink chỉ khi thật sự cần |
| Bouquet thành puzzle đoán ý tác giả | Trái với mục tiêu chữa lành | Nhiều kết quả hợp lý; explicit requirement khác hidden context |
| Quá nhiều hoa | Asset/content burden lớn | Mở hoa theo chapter; flower schema thống nhất; fixture nhỏ trước |
| Siêu nhiên thành twist thiếu công bằng | Người chơi không hiểu luật | Gieo clue trước, journal ghi luật, không chấm hidden rule chưa được giới thiệu |
| Save hỏng khi schema đổi | Mất tiến trình | version envelope, migration, backup, recovery message |
| Steam wrapper làm bẩn web build | Demo web phụ thuộc native module | adapter boundary; Steam optional |
| Kho asset lộn xộn | Dùng nhầm file/version | catalog ID, checksum, status, validator; MCP read-only |
| Tool có quyền quá rộng | Xóa/đổi asset ngoài ý muốn | allowlist, read-only default, dry-run, approval và audit |

## 17. Research references

- Phaser overview: https://docs.phaser.io/phaser/getting-started/what-is-phaser
- Phaser TypeScript/Vite template: https://github.com/phaserjs/template-vite-ts
- Godot web export constraints: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html
- Electron overview: https://www.electronjs.org/docs/latest/
- Tauri overview: https://v2.tauri.app/start/
- Steamworks.js Electron integration: https://github.com/ceifa/steamworks.js
- Ink narrative language: https://github.com/inkle/ink
- inkjs browser runtime: https://github.com/y-lohse/inkjs
- Strange Horticulture reference: https://www.strangehorticulture.com/
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

Research conclusions used here:

- Phaser is a web-first 2D framework with WebGL/Canvas and TypeScript support.
- Godot web export requires WebAssembly/WebGL 2 and has web-specific audio/thread constraints; it is not the first choice for this web-first 2D scope.
- Electron gives a consistent Chromium runtime and has an existing Steamworks.js path, at the cost of a larger desktop package.
- Ink/inkjs can separate branching narrative authoring from game interaction, but adds a content compilation/runtime boundary.
- Browser localStorage is suitable for small versioned local saves but is origin-specific and should not be tested from `file://`.

## 18. Approval boundary

Approval of this document authorizes creation of an implementation plan only after this file is reviewed and accepted. It does not authorize:

- installing dependencies;
- scaffolding the game;
- creating MCP/skill tooling;
- importing the user’s asset archive;
- committing product code;
- selecting final ending/lore details not defined here.

Next review topics:

1. Có đúng tinh thần “lắng nghe và chữa lành” không?
2. Sáng/người sống và chiều tối/người chết có đúng nhịp game không?
3. Bouquet nhiều đáp án hợp lý có đúng ý hơn hệ thống công thức không?
4. Baseline Phaser + TypeScript + Vite có chấp nhận được không?
5. Vertical slice và ranh giới MCP/skill có đúng scope không?

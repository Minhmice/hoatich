import Phaser from 'phaser';
import { contentBundle } from '../content';
import { characterAssets } from '../content/characterAssets';
import { flowerAssets } from '../content/flowerAssets';
import { BouquetModel } from '../bouquet/BouquetModel';
import { GameSession } from '../GameSession';
import { AudioManager } from '../audio';
import { createBrowserSaveRepository } from '../save/browserSaveRepository';
import type { LoadResult, SaveRepository } from '../save/SaveRepository';
import { DialoguePanel } from '../ui/DialoguePanel';
import { JournalPanel } from '../ui/JournalPanel';
import { AccessibilitySettings } from '../ui/AccessibilitySettings';
import type { GameSettings } from '../state/GameState';

export class ShopScene extends Phaser.Scene {
  private session!: GameSession;
  private audio!: AudioManager;
  private saveRepo!: SaveRepository;
  private bouquet = new BouquetModel();
  private selectedItemId: string | null = null;

  // UI Panels
  private dialoguePanel!: DialoguePanel;
  private journalPanel!: JournalPanel;
  private settingsPanel!: AccessibilitySettings;

  // DOM Elements
  private uiContainer!: HTMLElement;
  private headerEl!: HTMLElement;
  private toolbarEl!: HTMLElement;
  private noticeEl!: HTMLElement;
  private flowerListEl!: HTMLElement;
  private bouquetControlsEl!: HTMLElement;
  private isModalOpen = false;

  // Phaser visual objects
  private shopBackground!: Phaser.GameObjects.Image;
  private playerSprite!: Phaser.GameObjects.Image;
  private customerSprite!: Phaser.GameObjects.Image;
  private deskContainer!: Phaser.GameObjects.Container;
  private bouquetItemObjects = new Map<string, Phaser.GameObjects.Container>();
  private selectionBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'ShopScene' });
  }

  async create(): Promise<void> {
    this.saveRepo = createBrowserSaveRepository();

    let initialLoad: LoadResult;
    try {
      initialLoad = await this.saveRepo.load();
    } catch {
      initialLoad = { status: 'empty' };
    }

    this.session = new GameSession(
      initialLoad.status === 'loaded' ? initialLoad.state : undefined,
      this.saveRepo,
      () => this.showNotice('Không thể lưu trò chơi vào trình duyệt.', 3000),
    );

    this.audio = new AudioManager(this.session.state.settings);

    this.createDomOverlay();
    this.createEnvironmentGraphics();
    this.createCharacterSprites();
    this.createBouquetWorkstation();
    this.setupKeyboardControls();

    if (initialLoad.status === 'loaded' && initialLoad.recovered) {
      this.showNotice('Tiến trình đã được khôi phục từ bản sao lưu an toàn.', 4000);
    } else if (initialLoad.status === 'error') {
      this.showRecoveryErrorDialog(initialLoad.message);
    }

    this.updateSceneState();
  }

  // --- Generated shop art ---
  private createEnvironmentGraphics(): void {
    const texture = this.session.state.currentShift === 'dead' ? 'shop-evening' : 'shop-day';
    this.shopBackground = this.add.image(640, 400, texture);
    this.shopBackground.setDisplaySize(1280, 800);
    this.shopBackground.setDepth(0);
  }

  private redrawEnvironment(): void {
    const texture = this.session.state.currentShift === 'dead' ? 'shop-evening' : 'shop-day';
    this.shopBackground.setTexture(texture);
  }
  private createCharacterSprites(): void {
    // Player portrait on the left
    this.playerSprite = this.add.image(210, 480, 'player-2');
    this.playerSprite.setDisplaySize(280, 420);
    this.playerSprite.setDepth(10);

    // Customer portrait on the right
    this.customerSprite = this.add.image(1070, 480, 'customer-one-1');
    this.customerSprite.setDisplaySize(280, 420);
    this.customerSprite.setDepth(10);
  }

  private updateCustomerPortrait(mood: 'neutral' | 'happy' | 'worried' = 'neutral'): void {
    const order = this.session.currentOrder;
    if (!order) {
      this.customerSprite.setVisible(false);
      return;
    }

    this.customerSprite.setVisible(true);
    const customer = contentBundle.customers.find((c) => c.id === order.customerId);
    const key = customer?.portraitKey ?? 'customer-one';

    let texture = `${key}-1`;
    if (key === 'customer-one') {
      texture = mood === 'worried' ? 'customer-one-2' : 'customer-one-1';
    } else if (key === 'passerby') {
      texture = mood === 'happy' ? 'passerby-1' : 'passerby-2';
    }

    if (this.textures.exists(texture)) {
      this.customerSprite.setTexture(texture);
    }

    // Ghostly spectral appearance in dead shift
    if (this.session.state.currentShift === 'dead' || order.recipient === 'deceased') {
      this.customerSprite.setAlpha(0.82);
      this.customerSprite.setTint(0x9fc5e8);
    } else {
      this.customerSprite.setAlpha(1);
      this.customerSprite.clearTint();
    }
  }

  // --- Bouquet Workstation ---

  private createBouquetWorkstation(): void {
    this.deskContainer = this.add.container(0, 0);
    this.deskContainer.setDepth(20);

    this.selectionBox = this.add.graphics();
    this.selectionBox.setDepth(25);

    // Handle desk click to deselect
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Check if click was inside desk mat area (360, 390, 560, 340)
      if (
        pointer.x >= 360 &&
        pointer.x <= 920 &&
        pointer.y >= 390 &&
        pointer.y <= 730
      ) {
        // If nothing directly clicked, deselect
        const clickedContainer = Array.from(this.bouquetItemObjects.values()).find((cont) =>
          cont.getBounds().contains(pointer.x, pointer.y),
        );
        if (!clickedContainer) {
          this.selectedItemId = null;
          this.updateSelectionBox();
          this.renderBouquetControls();
        }
      }
    });
  }


  private syncBouquetDisplay(): void {
    const activeIds = new Set(this.bouquet.items.map((it) => it.id));

    // Remove deleted items
    for (const [id, container] of this.bouquetItemObjects.entries()) {
      if (!activeIds.has(id)) {
        container.destroy();
        this.bouquetItemObjects.delete(id);
      }
    }

    // Add or update existing items
    this.bouquet.items.forEach((item) => {
      let container = this.bouquetItemObjects.get(item.id);
      if (!container) {
        container = this.add.container(item.position.x, item.position.y);
        const flowerAsset = flowerAssets[item.flowerId];
        if (!flowerAsset) throw new Error(`Thiếu hình ảnh cho hoa: ${item.flowerId}`);
        const flowerSprite = this.add.image(0, 0, flowerAsset.textureKey);
        flowerSprite.setDisplaySize(110, 110);
        container.add(flowerSprite);

        container.setSize(110, 110);
        container.setInteractive({ draggable: true, useHandCursor: true });
        container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          pointer.event.stopPropagation();
          this.selectedItemId = item.id;
          this.updateSelectionBox();
          this.renderBouquetControls();
        });

        this.input.setDraggable(container);
        container.on('dragstart', () => {
          this.selectedItemId = item.id;
          this.updateSelectionBox();
          this.renderBouquetControls();
          this.bouquet.beginGesture();
        });
        container.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          const clampedX = Math.max(380, Math.min(900, dragX));
          const clampedY = Math.max(410, Math.min(710, dragY));
          container!.setPosition(clampedX, clampedY);
          this.bouquet.move(item.id, clampedX, clampedY);
          this.updateSelectionBox();
        });
        container.on('dragend', () => this.bouquet.endGesture());
        this.deskContainer.add(container);
        this.bouquetItemObjects.set(item.id, container);
      }

      container.setPosition(item.position.x, item.position.y);
      container.setAngle(item.rotation);
      container.setDepth(item.layer + 20);
    });

    const sortedItems = [...this.bouquet.items].sort((a, b) => a.layer - b.layer);
    sortedItems.forEach((item, index) => {
      const c = this.bouquetItemObjects.get(item.id);
      if (c) {
        this.deskContainer.moveTo(c, index);
      }
    });

    if (this.selectedItemId && !activeIds.has(this.selectedItemId)) {
      this.selectedItemId = null;
    }
    this.updateSelectionBox();
    this.renderBouquetControls();
  }

  private updateSelectionBox(): void {
    this.selectionBox.clear();
    if (!this.selectedItemId) return;

    const item = this.bouquet.items.find((i) => i.id === this.selectedItemId);
    const container = this.bouquetItemObjects.get(this.selectedItemId);
    if (!item || !container) return;

    this.selectionBox.lineStyle(2, 0xe0a020, 0.9);
    this.selectionBox.strokeCircle(container.x, container.y, 45);
  }

  private cycleBouquetItem(delta: number): void {
    const items = this.bouquet.items;
    if (items.length === 0) return;
    if (!this.selectedItemId) {
      this.selectedItemId = delta >= 0 ? items[0].id : items[items.length - 1].id;
    } else {
      const idx = items.findIndex((i) => i.id === this.selectedItemId);
      if (idx === -1) {
        this.selectedItemId = items[0].id;
      } else {
        const nextIdx = (idx + delta + items.length) % items.length;
        this.selectedItemId = items[nextIdx].id;
      }
    }
    this.updateSelectionBox();
    this.renderBouquetControls();
  }

  // --- Keyboard & Actions ---

  private setupKeyboardControls(): void {
    if (!this.input.keyboard) return;

    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.isModalOpen) return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (tag === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) return;

      const id = this.selectedItemId;

      switch (event.key) {
        case 'Tab':
          if ((!target || target === this.game.canvas || target === document.body) && this.bouquet.items.length > 0) {
            event.preventDefault();
            this.cycleBouquetItem(event.shiftKey ? -1 : 1);
          }
          break;
        case 'n':
        case 'N':
          if (this.bouquet.items.length > 0) {
            this.cycleBouquetItem(1);
          }
          break;
        case 'p':
        case 'P':
          if (this.bouquet.items.length > 0) {
            this.cycleBouquetItem(-1);
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (id) {
            if (event.key === 'ArrowLeft') event.preventDefault();
            const it = this.bouquet.items.find((i) => i.id === id);
            if (it) this.bouquet.move(id, Math.max(380, it.position.x - 12), it.position.y);
            this.syncBouquetDisplay();
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (id) {
            if (event.key === 'ArrowRight') event.preventDefault();
            const it = this.bouquet.items.find((i) => i.id === id);
            if (it) this.bouquet.move(id, Math.min(900, it.position.x + 12), it.position.y);
            this.syncBouquetDisplay();
          }
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (id) {
            if (event.key === 'ArrowUp') event.preventDefault();
            const it = this.bouquet.items.find((i) => i.id === id);
            if (it) this.bouquet.move(id, it.position.x, Math.max(410, it.position.y - 12));
            this.syncBouquetDisplay();
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (id) {
            if (event.key === 'ArrowDown') event.preventDefault();
            const it = this.bouquet.items.find((i) => i.id === id);
            if (it) this.bouquet.move(id, it.position.x, Math.min(710, it.position.y + 12));
            this.syncBouquetDisplay();
          }
          break;
        case 'q':
        case 'Q':
        case '<':
          if (id) {
            this.bouquet.rotate(id, -15);
            this.syncBouquetDisplay();
          }
          break;
        case 'e':
        case 'E':
        case '>':
          if (id) {
            this.bouquet.rotate(id, 15);
            this.syncBouquetDisplay();
          }
          break;
        case ']':
        case 'PageUp':
          if (id) {
            this.bouquet.reorder(id, 1);
            this.syncBouquetDisplay();
          }
          break;
        case '[':
        case 'PageDown':
          if (id) {
            this.bouquet.reorder(id, -1);
            this.syncBouquetDisplay();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (id) {
            this.bouquet.remove(id);
            this.selectedItemId = null;
            this.syncBouquetDisplay();
          }
          break;
        case 'z':
        case 'Z':
        case 'u':
        case 'U':
          this.bouquet.undo();
          this.syncBouquetDisplay();
          break;
        case 'c':
        case 'C':
          this.bouquet.clear();
          this.selectedItemId = null;
          this.syncBouquetDisplay();
          break;
        case 'Enter': {
          const isWorkstationFocus = !target || target === this.game.canvas || target === document.body;
          if (isWorkstationFocus && this.bouquet.items.length > 0 && !this.session.dialogue) {
            event.preventDefault();
            this.handleDeliver();
          }
          break;
        }
      }
    });
  }

  // --- DOM Overlay and UI ---

  private createDomOverlay(): void {
    document.documentElement.style.setProperty('--font-scale', String(this.session.state.settings.fontScale ?? 1));
    const parentEl = this.game.canvas.parentElement ?? document.body;

    let shell = parentEl.querySelector<HTMLElement>('.game-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'game-shell';
      parentEl.appendChild(shell);
    }

    this.uiContainer = document.createElement('div');
    this.uiContainer.className = 'game-ui';
    shell.appendChild(this.uiContainer);

    // Header with title and progress
    this.headerEl = document.createElement('header');
    this.headerEl.className = 'game-header';
    this.uiContainer.appendChild(this.headerEl);

    // Toolbar
    this.toolbarEl = document.createElement('nav');
    this.toolbarEl.className = 'toolbar';
    this.toolbarEl.setAttribute('aria-label', 'Thanh công cụ');
    this.uiContainer.appendChild(this.toolbarEl);

    // Notice banner
    this.noticeEl = document.createElement('aside');
    this.noticeEl.className = 'notice';
    this.noticeEl.setAttribute('role', 'status');
    this.noticeEl.style.display = 'none';
    this.uiContainer.appendChild(this.noticeEl);

    // Flower Catalog list
    this.flowerListEl = document.createElement('section');
    this.flowerListEl.className = 'flower-list';
    this.flowerListEl.setAttribute('aria-label', 'Danh mục hoa có sẵn');
    this.uiContainer.appendChild(this.flowerListEl);

    // Bouquet controls
    this.bouquetControlsEl = document.createElement('footer');
    this.bouquetControlsEl.className = 'bouquet-controls';
    this.bouquetControlsEl.setAttribute('aria-label', 'Thao tác cắm hoa');
    this.uiContainer.appendChild(this.bouquetControlsEl);

    // Initialize UI Panels
    this.dialoguePanel = new DialoguePanel(this.uiContainer);
    this.journalPanel = new JournalPanel(this.uiContainer);
    this.settingsPanel = new AccessibilitySettings(this.uiContainer);

    this.renderToolbar();
  }

  private renderHeader(): void {
    const state = this.session.state;
    const isDead = state.currentShift === 'dead';
    const shiftLabel = isDead ? 'Buổi tối — Cõi âm' : 'Buổi sáng — Cõi trần';
    const dayLabel = state.currentDay === 'day-2' ? 'Ngày 2' : 'Ngày 1';
    const progress = this.session.progress;

    this.headerEl.innerHTML = `
      <div>
        <h1>Tiệm Hoa Tích</h1>
        <p>${dayLabel} • ${shiftLabel} • Tiến trình đơn hàng: ${progress.completed}/${progress.total}</p>
      </div>
    `;

    const shell = this.uiContainer.closest('.game-shell');
    if (shell) {
      if (isDead) {
        shell.classList.add('dead-shift');
      } else {
        shell.classList.remove('dead-shift');
      }
    }
  }

  private renderToolbar(): void {
    this.toolbarEl.innerHTML = '';

    const btnJournal = document.createElement('button');
    btnJournal.type = 'button';
    btnJournal.textContent = 'Sổ hoa';
    btnJournal.addEventListener('click', () => this.openJournal());
    this.toolbarEl.appendChild(btnJournal);

    const btnSettings = document.createElement('button');
    btnSettings.type = 'button';
    btnSettings.textContent = 'Cài đặt';
    btnSettings.addEventListener('click', () => this.openSettings());
    this.toolbarEl.appendChild(btnSettings);

    const btnShift = document.createElement('button');
    btnShift.type = 'button';
    btnShift.textContent = 'Chuyển buổi';
    btnShift.disabled = !this.session.isShiftComplete || Boolean(this.session.dialogue);
    btnShift.addEventListener('click', () => this.handleAdvanceShift());
    this.toolbarEl.appendChild(btnShift);

    const btnSave = document.createElement('button');
    btnSave.type = 'button';
    btnSave.textContent = 'Lưu';
    btnSave.addEventListener('click', async () => {
      try {
        await this.saveRepo.save(this.session.state);
        this.showNotice('Đã lưu tiến trình trò chơi thành công.', 2500);
      } catch {
        this.showNotice('Không thể lưu trò chơi vào trình duyệt.', 3000);
      }
    });
    this.toolbarEl.appendChild(btnSave);

    const btnRestart = document.createElement('button');
    btnRestart.type = 'button';
    btnRestart.textContent = 'Chơi lại';
    btnRestart.addEventListener('click', async () => {
      const ok = window.confirm('Bạn có chắc chắn muốn chơi lại từ đầu không? Toàn bộ tiến trình sẽ được đặt lại.');
      if (ok) {
        try {
          await this.session.resetGame();
          this.bouquet.clear();
          this.selectedItemId = null;
          document.documentElement.style.setProperty('--font-scale', String(this.session.state.settings.fontScale ?? 1));
          this.updateSceneState();
          this.showNotice('Đã bắt đầu lại trò chơi mới.', 2500);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Không thể đặt lại trò chơi.';
          this.showNotice(`Lỗi đặt lại: ${msg}`, 3500);
        }
      }
    });
    this.toolbarEl.appendChild(btnRestart);
  }

  private renderFlowerCatalog(): void {
    this.flowerListEl.innerHTML = '';
    const state = this.session.state;
    const hasActiveDialogue = Boolean(this.session.dialogue);

    const unlockedFlowers = contentBundle.flowers.filter((f) =>
      state.unlockedFlowerIds.includes(f.id),
    );

    unlockedFlowers.forEach((flower) => {
      const stock = state.inventory[flower.id] ?? 0;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flower-button';
      btn.disabled = stock <= 0 || hasActiveDialogue || this.isModalOpen;

      const worldBadge =
        flower.world === 'dead'
          ? '[Cõi âm]'
          : flower.world === 'both'
          ? '[Lưỡng giới]'
          : '[Cõi trần]';

      const flowerAsset = flowerAssets[flower.id];
      if (flowerAsset) {
        const thumbnail = document.createElement('img');
        thumbnail.src = flowerAsset.url;
        thumbnail.alt = '';
        thumbnail.width = 42;
        thumbnail.height = 42;
        thumbnail.decoding = 'async';
        btn.appendChild(thumbnail);
      }
      const name = document.createElement('strong');
      name.textContent = `${flower.displayName} ${worldBadge}`;
      const metadata = document.createElement('div');
      metadata.textContent = `Ý nghĩa: ${flower.meanings.slice(0, 2).join(', ')} • Còn lại: ${stock}`;
      btn.append(name, metadata);

      btn.addEventListener('click', () => {
        if (stock <= 0) return;
        // Add flower near center of workstation with pleasant offset
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        const item = this.bouquet.add(flower.id, { x: 640 + offsetX, y: 560 + offsetY });
        this.selectedItemId = item.id;
        this.audio.playPlacementSfx();
        this.syncBouquetDisplay();
      });

      this.flowerListEl.appendChild(btn);
    });
  }

  private renderBouquetControls(): void {
    this.bouquetControlsEl.innerHTML = '';
    const hasItems = this.bouquet.items.length > 0;
    const hasSelection = Boolean(this.selectedItemId);
    const hasActiveDialogue = Boolean(this.session.dialogue);

    const makeBtn = (text: string, onClick: () => void, disabled: boolean) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.disabled = disabled || hasActiveDialogue || this.isModalOpen;
      btn.addEventListener('click', onClick);
      this.bouquetControlsEl.appendChild(btn);
      return btn;
    };

    const itemSelect = document.createElement('select');
    itemSelect.className = 'bouquet-item-select';
    itemSelect.setAttribute('aria-label', 'Chọn cành hoa');
    itemSelect.disabled = !hasItems || hasActiveDialogue || this.isModalOpen;

    if (!hasItems) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '(Bình hoa trống)';
      itemSelect.appendChild(opt);
    } else {
      const placeholderOpt = document.createElement('option');
      placeholderOpt.value = '';
      placeholderOpt.textContent = '-- Chọn cành hoa --';
      itemSelect.appendChild(placeholderOpt);

      this.bouquet.items.forEach((item, index) => {
        const flower = contentBundle.flowers.find((f) => f.id === item.flowerId);
        const name = flower?.displayName ?? item.flowerId;
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `Cành ${index + 1}: ${name} (Lớp ${item.layer + 1})`;
        if (item.id === this.selectedItemId) {
          opt.selected = true;
        }
        itemSelect.appendChild(opt);
      });
    }

    itemSelect.addEventListener('change', () => {
      this.selectedItemId = itemSelect.value || null;
      this.updateSelectionBox();
      this.renderBouquetControls();
    });
    this.bouquetControlsEl.appendChild(itemSelect);

    makeBtn('Cành trước', () => this.cycleBouquetItem(-1), !hasItems);
    makeBtn('Cành tiếp', () => this.cycleBouquetItem(1), !hasItems);

    makeBtn('Xoay trái', () => {
      if (this.selectedItemId) {
        this.bouquet.rotate(this.selectedItemId, -15);
        this.syncBouquetDisplay();
      }
    }, !hasSelection);

    makeBtn('Xoay phải', () => {
      if (this.selectedItemId) {
        this.bouquet.rotate(this.selectedItemId, 15);
        this.syncBouquetDisplay();
      }
    }, !hasSelection);

    makeBtn('Lên lớp', () => {
      if (this.selectedItemId) {
        this.bouquet.reorder(this.selectedItemId, 1);
        this.syncBouquetDisplay();
      }
    }, !hasSelection);

    makeBtn('Xuống lớp', () => {
      if (this.selectedItemId) {
        this.bouquet.reorder(this.selectedItemId, -1);
        this.syncBouquetDisplay();
      }
    }, !hasSelection);

    makeBtn('Xóa cành', () => {
      if (this.selectedItemId) {
        this.bouquet.remove(this.selectedItemId);
        this.selectedItemId = null;
        this.syncBouquetDisplay();
      }
    }, !hasSelection);

    makeBtn('Hoàn tác', () => {
      this.bouquet.undo();
      this.syncBouquetDisplay();
    }, false);

    makeBtn('Xóa hết', () => {
      this.bouquet.clear();
      this.selectedItemId = null;
      this.syncBouquetDisplay();
    }, !hasItems);

    const deliverBtn = makeBtn('Trao hoa', () => {
      this.handleDeliver();
    }, !hasItems || !this.session.currentOrder);
    deliverBtn.style.fontWeight = 'bold';
  }

  // --- Flow & Event Handlers ---

  private updateSceneState(): void {
    // Auto-start next order before controls render, so dialogue always blocks composition.
    if (!this.session.isDemoComplete && !this.session.currentOrder && !this.session.dialogue) {
      try {
        this.session.startOrder();
      } catch {
        // No remaining order exists for this shift.
      }
    }

    this.renderHeader();
    this.renderToolbar();
    this.renderFlowerCatalog();
    this.renderBouquetControls();
    this.redrawEnvironment();
    this.syncBouquetDisplay();

    if (this.session.isDemoComplete) {
      this.showDemoCompleteNotice();
      return;
    }

    this.updateCustomerPortrait();

    // Present dialogue if active
    const activeDialogue = this.session.dialogue;
    if (activeDialogue) {
      let speakerName = 'Tôi';
      let portraitUrl = characterAssets.player.defaultPortrait;

      if (activeDialogue.speakerId !== 'player') {
        const cust = contentBundle.customers.find((c) => c.id === activeDialogue.speakerId);
        speakerName = cust?.name ?? activeDialogue.speakerId;
        const portKey = cust?.portraitKey ?? 'customer-one';
        portraitUrl = characterAssets[portKey].defaultPortrait;
      }

      this.dialoguePanel.show({
        speaker: speakerName,
        text: activeDialogue.text,
        portraitUrl,
        choices: this.session.currentChoices.map((c) => ({ id: c.id, text: c.text })),
        settings: this.session.state.settings,
        onChoice: (choiceId) => {
          this.session.advanceDialogue(choiceId);
          this.updateSceneState();
        },
        onContinue: () => {
          this.session.advanceDialogue();
          this.updateSceneState();
        },
      });
    } else {
      this.dialoguePanel.destroy();
    }
  }

  private handleDeliver(): void {
    if (!this.session.currentOrder) return;
    try {
      const result = this.session.deliver(this.bouquet);
      const isSuccess = result.outcome !== 'missed';
      this.audio.playDeliverySfx(isSuccess);

      const mood = result.outcome === 'resonant' ? 'happy' : result.outcome === 'accepted' ? 'neutral' : 'worried';
      this.updateCustomerPortrait(mood);

      if (isSuccess) {
        this.bouquet.clear();
        this.selectedItemId = null;
      }

      this.updateSceneState();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.showNotice(msg, 3500);
    }
  }

  private handleAdvanceShift(): void {
    try {
      this.session.advanceShift();
      this.showNotice('Đã chuyển sang buổi tiếp theo.', 2500);
      this.updateSceneState();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.showNotice(msg, 3500);
    }
  }

  private openJournal(): void {
    this.isModalOpen = true;
    this.dialoguePanel.setSuspended(true);
    const knownEntryIds = this.session.state.journalEntryIds;
    const knownEntries = contentBundle.journal
      .filter((j) => knownEntryIds.includes(j.id))
      .map((j) => ({ title: j.title, text: j.text }));

    const unlockedFlowers = contentBundle.flowers.filter((f) =>
      this.session.state.unlockedFlowerIds.includes(f.id),
    );

    this.journalPanel.show(knownEntries, unlockedFlowers, () => {
      this.isModalOpen = false;
      this.dialoguePanel.setSuspended(false);
      this.renderFlowerCatalog();
      this.renderBouquetControls();
    });
  }

  private openSettings(): void {
    this.isModalOpen = true;
    this.dialoguePanel.setSuspended(true);
    this.settingsPanel.show(
      this.session.state.settings,
      (patch: Partial<GameSettings>) => {
        this.session.applySettings(patch);
        if (patch.fontScale !== undefined) {
          document.documentElement.style.setProperty('--font-scale', String(patch.fontScale));
        }
        if (patch.musicVolume !== undefined) {
          this.audio.setMusicVolume(patch.musicVolume);
        }
        if (patch.sfxVolume !== undefined) {
          this.audio.setSfxVolume(patch.sfxVolume);
        }
      },
      () => {
        this.isModalOpen = false;
        this.dialoguePanel.setSuspended(false);
        this.renderFlowerCatalog();
        this.renderBouquetControls();
      },
    );
  }

  private showNotice(message: string, durationMs = 3000): void {
    this.noticeEl.textContent = message;
    this.noticeEl.style.display = 'block';
    if (durationMs > 0) {
      window.setTimeout(() => {
        if (this.noticeEl.textContent === message) {
          this.noticeEl.style.display = 'none';
        }
      }, durationMs);
    }
  }

  private showRecoveryErrorDialog(errorMessage: string): void {
    this.noticeEl.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = 'Lỗi khôi phục dữ liệu: ';
    const detail = document.createElement('span');
    detail.textContent = errorMessage;
    const actions = document.createElement('div');
    actions.style.cssText = 'margin-top: 0.5rem; display: flex; gap: 0.5rem;';
    const btnNew = document.createElement('button');
    btnNew.type = 'button';
    btnNew.textContent = 'Chơi ván mới (Xóa lưu lỗi)';
    btnNew.addEventListener('click', async () => {
      try {
        await this.session.resetGame();
        this.noticeEl.style.display = 'none';
        document.documentElement.style.setProperty('--font-scale', String(this.session.state.settings.fontScale ?? 1));
        this.updateSceneState();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Không thể xóa dữ liệu lưu.';
        this.showNotice(`Lỗi đặt lại: ${msg}`, 3500);
      }
    });
    const btnKeep = document.createElement('button');
    btnKeep.type = 'button';
    btnKeep.textContent = 'Giữ nguyên bản lưu lỗi';
    btnKeep.addEventListener('click', () => {
      this.noticeEl.style.display = 'none';
    });
    actions.append(btnNew, btnKeep);
    this.noticeEl.append(title, detail, actions);
    this.noticeEl.style.display = 'block';
  }

  private showDemoCompleteNotice(): void {
    this.noticeEl.innerHTML = `
      <h2>Hoàn thành bản chơi thử Tiệm Hoa Tích!</h2>
      <p>Bạn đã hoàn thành trọn vẹn bốn đơn hoa kết nối giữa cõi trần và cõi âm. Cảm ơn bạn đã trải nghiệm!</p>
      <div style="margin-top: 0.8rem;">
        <button id="btn-demo-restart" type="button">Bắt đầu lại từ đầu</button>
      </div>
    `;
    this.noticeEl.style.display = 'block';

    const btnRestart = this.noticeEl.querySelector<HTMLButtonElement>('#btn-demo-restart');
    btnRestart?.addEventListener('click', async () => {
      const ok = window.confirm('Bạn có muốn chơi lại bản chơi thử từ đầu không?');
      if (ok) {
        try {
          await this.session.resetGame();
          this.bouquet.clear();
          this.selectedItemId = null;
          this.noticeEl.style.display = 'none';
          document.documentElement.style.setProperty('--font-scale', String(this.session.state.settings.fontScale ?? 1));
          this.updateSceneState();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Không thể đặt lại trò chơi.';
          this.showNotice(`Lỗi đặt lại: ${msg}`, 3500);
        }
      }
    });
  }

  // --- Scene Cleanup ---

  shutdown(): void {
    this.audio.destroy();
    this.dialoguePanel.destroy();
    this.journalPanel.destroy();
    this.settingsPanel.destroy();
    if (this.uiContainer && this.uiContainer.parentElement) {
      this.uiContainer.parentElement.removeChild(this.uiContainer);
    }
  }
}

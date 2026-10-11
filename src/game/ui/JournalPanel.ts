import type { FlowerDefinition } from '../content/types';

export interface JournalEntryItem {
  title: string;
  text: string;
}

export class JournalPanel {
  private readonly parent: HTMLElement;
  private overlay: HTMLElement | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private activeTab: 'entries' | 'flowers' = 'entries';

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  show(entries: JournalEntryItem[], flowers: FlowerDefinition[], onClose: () => void): void {
    if (!this.previousActiveElement) {
      this.previousActiveElement = document.activeElement as HTMLElement | null;
    }

    const close = () => {
      this.destroy();
      onClose();
    };

    this.destroyDom();

    const overlay = document.createElement('div');
    overlay.className = 'journal-overlay';
    overlay.setAttribute('role', 'presentation');

    const dialog = document.createElement('div');
    dialog.className = 'journal-panel';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Sổ tay tiệm hoa');
    dialog.tabIndex = -1;

    // Header
    const header = document.createElement('header');
    header.className = 'journal-header';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'journal-title-wrap';

    const title = document.createElement('h2');
    title.className = 'journal-title';
    title.textContent = 'Sổ Tay Tiệm Hoa';
    titleWrap.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'journal-close-button';
    closeBtn.setAttribute('aria-label', 'Đóng sổ tay');
    closeBtn.textContent = 'Đóng (Esc)';
    closeBtn.addEventListener('click', close);

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);

    // Tab buttons
    const tabList = document.createElement('div');
    tabList.className = 'journal-tabs';
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', 'Phân loại sổ tay');

    const entriesTab = document.createElement('button');
    entriesTab.type = 'button';
    entriesTab.className = 'journal-tab-button';
    entriesTab.setAttribute('role', 'tab');
    entriesTab.setAttribute('aria-selected', this.activeTab === 'entries' ? 'true' : 'false');
    entriesTab.textContent = `Ghi chép (${entries.length})`;

    const flowersTab = document.createElement('button');
    flowersTab.type = 'button';
    flowersTab.className = 'journal-tab-button';
    flowersTab.setAttribute('role', 'tab');
    flowersTab.setAttribute('aria-selected', this.activeTab === 'flowers' ? 'true' : 'false');
    flowersTab.textContent = `Loài hoa (${flowers.length})`;

    tabList.appendChild(entriesTab);
    tabList.appendChild(flowersTab);

    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'journal-content';

    const renderTabContent = () => {
      entriesTab.setAttribute('aria-selected', this.activeTab === 'entries' ? 'true' : 'false');
      flowersTab.setAttribute('aria-selected', this.activeTab === 'flowers' ? 'true' : 'false');
      if (this.activeTab === 'entries') {
        entriesTab.classList.add('is-active');
        flowersTab.classList.remove('is-active');
      } else {
        flowersTab.classList.add('is-active');
        entriesTab.classList.remove('is-active');
      }

      contentContainer.replaceChildren();

      if (this.activeTab === 'entries') {
        contentContainer.appendChild(this.buildEntriesView(entries));
      } else {
        contentContainer.appendChild(this.buildFlowersView(flowers));
      }
    };

    entriesTab.addEventListener('click', () => {
      this.activeTab = 'entries';
      renderTabContent();
    });

    flowersTab.addEventListener('click', () => {
      this.activeTab = 'flowers';
      renderTabContent();
    });

    renderTabContent();

    dialog.appendChild(header);
    dialog.appendChild(tabList);
    dialog.appendChild(contentContainer);
    overlay.appendChild(dialog);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    this.keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'Tab') {
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
            event.preventDefault();
            first.focus();
          }
        }
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        if (document.activeElement === entriesTab || document.activeElement === flowersTab) {
          event.preventDefault();
          this.activeTab = this.activeTab === 'entries' ? 'flowers' : 'entries';
          renderTabContent();
          if (this.activeTab === 'entries') {
            entriesTab.focus();
          } else {
            flowersTab.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    this.overlay = overlay;
    this.parent.appendChild(overlay);

    closeBtn.focus();
  }

  private buildEntriesView(entries: JournalEntryItem[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'journal-entries-container';

    if (entries.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'journal-empty-state';
      empty.textContent = 'Chưa có ghi chép nhật ký nào trong hành trình.';
      container.appendChild(empty);
      return container;
    }

    const list = document.createElement('ul');
    list.className = 'journal-entry-list';

    entries.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'journal-entry-item';

      const h3 = document.createElement('h3');
      h3.className = 'journal-entry-title';
      h3.textContent = item.title;

      const p = document.createElement('p');
      p.className = 'journal-entry-text';
      p.textContent = item.text;

      li.appendChild(h3);
      li.appendChild(p);
      list.appendChild(li);
    });

    container.appendChild(list);
    return container;
  }

  private buildFlowersView(flowers: FlowerDefinition[]): HTMLElement {
    const container = document.createElement('div');
    container.className = 'journal-flowers-container';

    if (flowers.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'journal-empty-state';
      empty.textContent = 'Chưa khám phá loài hoa nào trong tiệm.';
      container.appendChild(empty);
      return container;
    }

    const list = document.createElement('div');
    list.className = 'journal-flower-list';

    flowers.forEach((flower) => {
      const card = document.createElement('article');
      card.className = `journal-flower-card is-${flower.world}`;

      const cardHeader = document.createElement('div');
      cardHeader.className = 'journal-flower-card-header';

      const name = document.createElement('h3');
      name.className = 'journal-flower-name';
      name.textContent = flower.displayName;

      const category = document.createElement('span');
      category.className = `journal-category-badge is-${flower.world}`;
      category.textContent = this.getWorldCategoryLabel(flower.world);

      cardHeader.appendChild(name);
      cardHeader.appendChild(category);

      const desc = document.createElement('p');
      desc.className = 'journal-flower-description';
      desc.textContent = flower.description;

      const meta = document.createElement('dl');
      meta.className = 'journal-flower-meta';

      this.addMetaRow(meta, 'Ý nghĩa biểu trưng', flower.meanings.join(' • '));
      this.addMetaRow(meta, 'Sắc thái cảm xúc', flower.emotionalTags.join(' • '));
      this.addMetaRow(meta, 'Thời vụ ngát hương', flower.seasonTags.join(' • '));
      this.addMetaRow(meta, 'Giá tiệm', `${flower.price} xu`);

      card.appendChild(cardHeader);
      card.appendChild(desc);
      card.appendChild(meta);
      list.appendChild(card);
    });

    container.appendChild(list);
    return container;
  }

  private addMetaRow(dl: HTMLElement, label: string, value: string): void {
    if (!value) return;
    const row = document.createElement('div');
    row.className = 'journal-meta-row';

    const dt = document.createElement('dt');
    dt.className = 'journal-meta-label';
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.className = 'journal-meta-value';
    dd.textContent = value;

    row.appendChild(dt);
    row.appendChild(dd);
    dl.appendChild(row);
  }

  private getWorldCategoryLabel(world: 'living' | 'dead' | 'both'): string {
    switch (world) {
      case 'living':
        return 'Dương gian';
      case 'dead':
        return 'Âm giới';
      case 'both':
        return 'Lưỡng giới';
      default:
        return 'Không rõ';
    }
  }

  private destroyDom(): void {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
  }

  destroy(): void {
    this.destroyDom();
    if (this.previousActiveElement && this.previousActiveElement.isConnected) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }
}

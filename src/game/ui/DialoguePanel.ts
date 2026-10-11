import type { GameState } from '../state/GameState';

export interface DialogueChoiceItem {
  id: string;
  text: string;
}

export interface DialogueShowPayload {
  speaker: string;
  text: string;
  portraitUrl?: string;
  choices: DialogueChoiceItem[];
  onChoice: (id: string) => void;
  onContinue?: () => void;
  settings: GameState['settings'];
}

export class DialoguePanel {
  private readonly parent: HTMLElement;
  private container: HTMLElement | null = null;
  private portraitEl: HTMLImageElement | null = null;
  private portraitWrapper: HTMLElement | null = null;
  private speakerEl: HTMLElement | null = null;
  private textEl: HTMLElement | null = null;
  private actionsEl: HTMLElement | null = null;
  private continueBtn: HTMLButtonElement | null = null;
  private choiceButtons: HTMLButtonElement[] = [];

  private timerId: number | null = null;
  private isTyping = false;
  private isSuspended = false;
  private currentFullText = '';
  private currentPayload: DialogueShowPayload | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  show(payload: DialogueShowPayload): void {
    this.clearTimer();
    this.currentPayload = payload;

    if (!this.previousActiveElement) {
      this.previousActiveElement = document.activeElement as HTMLElement | null;
    }

    if (!this.container) {
      this.createDom();
      this.attachListeners();
    }

    if (this.container && !this.container.isConnected) {
      this.parent.appendChild(this.container);
    }

    this.renderContent(payload);
  }

  setSuspended(suspended: boolean): void {
    this.isSuspended = suspended;
    if (this.container) {
      if (suspended) {
        this.container.setAttribute('aria-hidden', 'true');
        (this.container as HTMLElement & { inert?: boolean }).inert = true;
      } else {
        this.container.removeAttribute('aria-hidden');
        (this.container as HTMLElement & { inert?: boolean }).inert = false;
        if (!this.isTyping) {
          if (this.choiceButtons.length > 0) {
            this.choiceButtons[0]?.focus();
          } else if (this.continueBtn) {
            this.continueBtn.focus();
          }
        }
      }
    }
  }

  private createDom(): void {
    const section = document.createElement('section');
    section.className = 'dialogue-panel';
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', 'Khung hội thoại');
    section.tabIndex = -1;

    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'dialogue-body';

    const portraitWrap = document.createElement('div');
    portraitWrap.className = 'dialogue-portrait-wrapper';
    portraitWrap.setAttribute('aria-hidden', 'true');

    const portrait = document.createElement('img');
    portrait.className = 'dialogue-portrait';
    portrait.alt = '';
    portraitWrap.appendChild(portrait);

    const mainCol = document.createElement('div');
    mainCol.className = 'dialogue-main-column';

    const header = document.createElement('div');
    header.className = 'dialogue-header';

    const speaker = document.createElement('h2');
    speaker.className = 'dialogue-speaker';
    header.appendChild(speaker);

    const message = document.createElement('div');
    message.className = 'dialogue-text';
    message.setAttribute('aria-live', 'polite');

    const actions = document.createElement('div');
    actions.className = 'dialogue-actions';

    mainCol.appendChild(header);
    mainCol.appendChild(message);
    mainCol.appendChild(actions);

    bodyWrap.appendChild(portraitWrap);
    bodyWrap.appendChild(mainCol);
    section.appendChild(bodyWrap);

    this.container = section;
    this.portraitWrapper = portraitWrap;
    this.portraitEl = portrait;
    this.speakerEl = speaker;
    this.textEl = message;
    this.actionsEl = actions;

    this.parent.appendChild(this.container);
  }

  private attachListeners(): void {
    this.keydownHandler = (event: KeyboardEvent) => {
      this.handleKeydown(event);
    };
    window.addEventListener('keydown', this.keydownHandler);

    if (this.container) {
      this.container.addEventListener('click', (event) => {
        // Only trigger panel click if not clicking on real action buttons
        const target = event.target as HTMLElement | null;
        if (target && target.tagName.toLowerCase() === 'button') {
          return;
        }
        if (this.isTyping) {
          event.stopPropagation();
          this.revealFullText();
        }
      });
    }
  }

  private renderContent(payload: DialogueShowPayload): void {
    if (!this.speakerEl || !this.textEl || !this.actionsEl || !this.portraitWrapper || !this.portraitEl) {
      return;
    }

    this.speakerEl.textContent = payload.speaker || '';

    if (payload.portraitUrl) {
      this.portraitEl.src = payload.portraitUrl;
      this.portraitEl.alt = `Chân dung ${payload.speaker}`;
      this.portraitWrapper.style.display = 'flex';
      this.portraitWrapper.removeAttribute('aria-hidden');
    } else {
      this.portraitEl.src = '';
      this.portraitEl.alt = '';
      this.portraitWrapper.style.display = 'none';
      this.portraitWrapper.setAttribute('aria-hidden', 'true');
    }

    this.actionsEl.replaceChildren();
    this.choiceButtons = [];
    this.continueBtn = null;

    this.currentFullText = payload.text || '';
    const speedMs = this.getSpeedMs(payload.settings);

    if (speedMs === 0 || payload.settings.reducedMotion) {
      this.textEl.textContent = this.currentFullText;
      this.isTyping = false;
      this.renderControls(payload);
    } else {
      this.renderTypingControl();
      this.startTypewriter(this.currentFullText, speedMs, payload);
    }
  }

  private getSpeedMs(settings: GameState['settings']): number {
    switch (settings.textSpeed) {
      case 'slow':
        return 45;
      case 'fast':
        return 10;
      case 'normal':
      default:
        return 22;
    }
  }

  private renderTypingControl(): void {
    if (!this.actionsEl) return;

    const revealButton = document.createElement('button');
    revealButton.type = 'button';
    revealButton.className = 'dialogue-continue-button';
    revealButton.textContent = 'Hiện hết chữ';
    revealButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.revealFullText();
    });

    this.actionsEl.replaceChildren(revealButton);
    this.continueBtn = revealButton;
    if (!this.isSuspended) {
      revealButton.focus();
    }
  }

  private startTypewriter(fullText: string, speedMs: number, payload: DialogueShowPayload): void {
    if (!this.textEl) return;

    this.isTyping = true;
    this.textEl.textContent = '';
    let charIndex = 0;

    const step = () => {
      if (!this.textEl) return;
      charIndex += 1;
      this.textEl.textContent = fullText.slice(0, charIndex);

      if (charIndex >= fullText.length) {
        this.clearTimer();
        this.isTyping = false;
        this.renderControls(payload);
      } else {
        this.timerId = window.setTimeout(step, speedMs);
      }
    };

    this.timerId = window.setTimeout(step, speedMs);
  }

  private revealFullText(): void {
    this.clearTimer();
    this.isTyping = false;
    if (this.textEl) {
      this.textEl.textContent = this.currentFullText;
    }
    if (this.currentPayload) {
      this.renderControls(this.currentPayload);
    }
  }

  private renderControls(payload: DialogueShowPayload): void {
    if (!this.actionsEl) return;
    this.actionsEl.replaceChildren();
    this.choiceButtons = [];
    this.continueBtn = null;

    if (payload.choices && payload.choices.length > 0) {
      const choicesGroup = document.createElement('div');
      choicesGroup.className = 'dialogue-choices';
      choicesGroup.setAttribute('role', 'group');
      choicesGroup.setAttribute('aria-label', 'Lựa chọn phản hồi');

      payload.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dialogue-choice-button';
        btn.setAttribute('data-choice-id', choice.id);

        const badge = document.createElement('span');
        badge.className = 'dialogue-choice-index';
        badge.textContent = `${index + 1}`;
        btn.appendChild(badge);

        const textSpan = document.createElement('span');
        textSpan.className = 'dialogue-choice-text';
        textSpan.textContent = choice.text;
        btn.appendChild(textSpan);

        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          payload.onChoice(choice.id);
        });

        choicesGroup.appendChild(btn);
        this.choiceButtons.push(btn);
      });

      this.actionsEl.appendChild(choicesGroup);

      if (!this.isSuspended && this.choiceButtons.length > 0) {
        this.choiceButtons[0].focus();
      }
    } else {
      const continueBtn = document.createElement('button');
      continueBtn.type = 'button';
      continueBtn.className = 'dialogue-continue-button';
      continueBtn.textContent = 'Tiếp tục';

      continueBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.isTyping) {
          this.revealFullText();
          return;
        }
        if (payload.onContinue) {
          payload.onContinue();
        }
      });

      this.actionsEl.appendChild(continueBtn);
      this.continueBtn = continueBtn;
      if (!this.isSuspended) {
        continueBtn.focus();
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.isSuspended || !this.container || !this.container.isConnected) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      if (this.isTyping) {
        event.preventDefault();
        this.revealFullText();
        return;
      }
      if (!this.currentPayload?.choices?.length && this.continueBtn && document.activeElement !== this.continueBtn) {
        event.preventDefault();
        this.continueBtn.click();
        return;
      }
    }

    if (!this.isTyping && this.currentPayload?.choices && this.currentPayload.choices.length > 0) {
      const digit = parseInt(event.key, 10);
      if (!isNaN(digit) && digit >= 1 && digit <= this.choiceButtons.length) {
        event.preventDefault();
        this.choiceButtons[digit - 1]?.click();
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        this.focusRelativeChoice(1);
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        this.focusRelativeChoice(-1);
      }
    }
  }

  private focusRelativeChoice(direction: number): void {
    if (this.choiceButtons.length === 0) return;
    const currentIndex = this.choiceButtons.findIndex((btn) => btn === document.activeElement);
    if (currentIndex === -1) {
      this.choiceButtons[0]?.focus();
      return;
    }
    const nextIndex = (currentIndex + direction + this.choiceButtons.length) % this.choiceButtons.length;
    this.choiceButtons[nextIndex]?.focus();
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  destroy(): void {
    this.clearTimer();
    this.isTyping = false;
    this.currentPayload = null;

    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.portraitEl = null;
    this.portraitWrapper = null;
    this.speakerEl = null;
    this.textEl = null;
    this.actionsEl = null;
    this.continueBtn = null;
    this.choiceButtons = [];

    if (this.previousActiveElement && this.previousActiveElement.isConnected) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }
}

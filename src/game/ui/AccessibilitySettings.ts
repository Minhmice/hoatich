import type { GameState } from '../state/GameState';

export class AccessibilitySettings {
  private readonly parent: HTMLElement;
  private overlay: HTMLElement | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  show(
    settings: GameState['settings'],
    onChange: (patch: Partial<GameState['settings']>) => void,
    onClose: () => void
  ): void {
    if (!this.previousActiveElement) {
      this.previousActiveElement = document.activeElement as HTMLElement | null;
    }

    this.destroyDom();

    const close = () => {
      this.destroy();
      onClose();
    };

    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.setAttribute('role', 'presentation');

    const dialog = document.createElement('div');
    dialog.className = 'settings-panel';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Cài đặt hỗ trợ tiếp cận');
    dialog.tabIndex = -1;

    // Header
    const header = document.createElement('header');
    header.className = 'settings-header';

    const title = document.createElement('h2');
    title.className = 'settings-title';
    title.textContent = 'Cài Đặt Tiếp Cận & Âm Thanh';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'settings-close-button';
    closeBtn.setAttribute('aria-label', 'Đóng cài đặt');
    closeBtn.textContent = 'Đóng (Esc)';
    closeBtn.addEventListener('click', close);

    header.appendChild(title);
    header.appendChild(closeBtn);

    const form = document.createElement('form');
    form.className = 'settings-form';
    form.addEventListener('submit', (e) => e.preventDefault());

    // 1. Text Speed
    const textSpeedGroup = document.createElement('div');
    textSpeedGroup.className = 'settings-group';

    const textSpeedLabel = document.createElement('label');
    textSpeedLabel.className = 'settings-label';
    textSpeedLabel.htmlFor = 'setting-text-speed';
    textSpeedLabel.textContent = 'Tốc độ hiển thị chữ hội thoại';

    const textSpeedSelect = document.createElement('select');
    textSpeedSelect.id = 'setting-text-speed';
    textSpeedSelect.className = 'settings-select';

    const speedOptions: { value: GameState['settings']['textSpeed']; label: string }[] = [
      { value: 'slow', label: 'Chậm rãi' },
      { value: 'normal', label: 'Vừa phải (chuẩn)' },
      { value: 'fast', label: 'Nhanh' },
    ];

    speedOptions.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === settings.textSpeed) {
        option.selected = true;
      }
      textSpeedSelect.appendChild(option);
    });

    textSpeedSelect.addEventListener('change', () => {
      const val = textSpeedSelect.value as GameState['settings']['textSpeed'];
      onChange({ textSpeed: val });
    });

    textSpeedGroup.appendChild(textSpeedLabel);
    textSpeedGroup.appendChild(textSpeedSelect);
    form.appendChild(textSpeedGroup);

    // 2. Font Scale (0.85 - 1.5)
    const fontScaleGroup = this.createSliderGroup({
      id: 'setting-font-scale',
      label: 'Cỡ chữ giao diện',
      min: 0.85,
      max: 1.5,
      step: 0.05,
      value: settings.fontScale,
      formatValue: (v) => `${Math.round(v * 100)}%`,
      onValueChange: (val) => {
        onChange({ fontScale: val });
      },
    });
    form.appendChild(fontScaleGroup);

    // 3. Music Volume (0 - 1)
    const musicGroup = this.createSliderGroup({
      id: 'setting-music-volume',
      label: 'Âm lượng nhạc nền',
      min: 0,
      max: 1,
      step: 0.05,
      value: settings.musicVolume,
      formatValue: (v) => `${Math.round(v * 100)}%`,
      onValueChange: (val) => {
        onChange({ musicVolume: val });
      },
    });
    form.appendChild(musicGroup);

    // 4. SFX Volume (0 - 1)
    const sfxGroup = this.createSliderGroup({
      id: 'setting-sfx-volume',
      label: 'Âm lượng hiệu ứng',
      min: 0,
      max: 1,
      step: 0.05,
      value: settings.sfxVolume,
      formatValue: (v) => `${Math.round(v * 100)}%`,
      onValueChange: (val) => {
        onChange({ sfxVolume: val });
      },
    });
    form.appendChild(sfxGroup);

    // 5. Reduced Motion (checkbox)
    const motionGroup = document.createElement('div');
    motionGroup.className = 'settings-group settings-checkbox-group';

    const motionLabel = document.createElement('label');
    motionLabel.className = 'settings-checkbox-label';

    const motionCheckbox = document.createElement('input');
    motionCheckbox.type = 'checkbox';
    motionCheckbox.id = 'setting-reduced-motion';
    motionCheckbox.className = 'settings-checkbox';
    motionCheckbox.checked = Boolean(settings.reducedMotion);

    motionCheckbox.addEventListener('change', () => {
      onChange({ reducedMotion: motionCheckbox.checked });
    });

    const motionText = document.createElement('span');
    motionText.className = 'settings-checkbox-text';
    motionText.textContent = 'Giảm chuyển động (tắt hiệu ứng rung/lướt nhanh)';

    motionLabel.appendChild(motionCheckbox);
    motionLabel.appendChild(motionText);
    motionGroup.appendChild(motionLabel);
    form.appendChild(motionGroup);

    // Footer actions
    const footer = document.createElement('footer');
    footer.className = 'settings-footer';

    const doneBtn = document.createElement('button');
    doneBtn.type = 'button';
    doneBtn.className = 'settings-done-button';
    doneBtn.textContent = 'Áp dụng & Đóng';
    doneBtn.addEventListener('click', close);

    footer.appendChild(doneBtn);

    dialog.appendChild(header);
    dialog.appendChild(form);
    dialog.appendChild(footer);
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
      }
    };
    window.addEventListener('keydown', this.keydownHandler);

    this.overlay = overlay;
    this.parent.appendChild(overlay);

    closeBtn.focus();
  }

  private createSliderGroup(config: {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    formatValue: (v: number) => string;
    onValueChange: (v: number) => void;
  }): HTMLElement {
    const group = document.createElement('div');
    group.className = 'settings-group';

    const labelRow = document.createElement('div');
    labelRow.className = 'settings-group-header';

    const label = document.createElement('label');
    label.className = 'settings-label';
    label.htmlFor = config.id;
    label.textContent = config.label;

    const valueBadge = document.createElement('span');
    valueBadge.className = 'settings-value-badge';
    valueBadge.textContent = config.formatValue(config.value);

    labelRow.appendChild(label);
    labelRow.appendChild(valueBadge);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = config.id;
    slider.className = 'settings-slider';
    slider.min = config.min.toString();
    slider.max = config.max.toString();
    slider.step = config.step.toString();
    slider.value = config.value.toString();
    slider.setAttribute('aria-label', config.label);
    slider.setAttribute('aria-valuetext', config.formatValue(config.value));

    const handleInput = () => {
      const val = parseFloat(slider.value);
      valueBadge.textContent = config.formatValue(val);
      slider.setAttribute('aria-valuetext', config.formatValue(val));
      config.onValueChange(val);
    };

    slider.addEventListener('input', handleInput);
    slider.addEventListener('change', handleInput);

    group.appendChild(labelRow);
    group.appendChild(slider);
    return group;
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

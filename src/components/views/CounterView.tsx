'use client';

import type { ActiveView, GameRuntime } from '../../game/GameRuntime';
import { DialogueBox } from '../ui/DialogueBox';
import { OrderNote } from '../ui/OrderNote';
import { contentBundle } from '../../game/content';
import { characterAssets } from '../../game/content/characterAssets';
export interface CounterViewProps {
  runtime: GameRuntime;
  onNavigate: (view: ActiveView) => void;
  onOpenJournal: () => void;
  onDeliver?: () => void;
  isModalOpen: boolean;
  onOpenSettings?: () => void;
}

export function CounterView({
  runtime,
  onNavigate,
  onOpenJournal,
  onDeliver: _onDeliver,
  isModalOpen,
  onOpenSettings,
}: CounterViewProps) {
  const order = runtime.currentOrder;
  const customer = order
    ? contentBundle.customers.find((c) => c.id === order.customerId)
    : undefined;
  const portKey = customer?.portraitKey ?? 'customer-one';
  const customerPortrait = characterAssets[portKey]?.defaultPortrait;
  const hasBouquet = runtime.bouquetItems.length > 0;
  const hasActiveDialogue = Boolean(runtime.dialogue);
  const isGhost = runtime.snapshot.currentShift === 'dead';
  const isDetailHeard = runtime.isOrderDetailHeard;
  const orderPrompt = order
    ? contentBundle.dialogue.find((d) => d.id === order.openingDialogueId)?.text ?? customer?.description ?? ''
    : '';
  return (
    <section className="view-counter gpgp-counter-stage" aria-label="Quầy tiếp khách">
      {/* Subtle top action bar for accessibility & navigation */}
      <div className="view-top-bar">
        <button
          type="button"
          className="action-button"
          onClick={() => onNavigate('lobby')}
          title="Trở về mặt tiền sảnh tiệm"
        >
          ← Sảnh tiệm
        </button>

        <span className="view-title">
          {customer ? `Quầy tiếp khách • ${customer.name}` : 'Quầy tiếp khách'}
        </span>

        <div className="view-top-actions">
          <button
            type="button"
            className="action-button"
            onClick={onOpenJournal}
          >
            Sổ hoa
          </button>
          {onOpenSettings && (
            <button
              type="button"
              className="action-button"
              onClick={onOpenSettings}
              title="Cài đặt trò chơi"
            >
              ⚙️
            </button>
          )}
          {runtime.canCompose && (
            <button
              type="button"
              className="action-button primary-action"
              onClick={() => onNavigate('workspace')}
            >
              Sang bàn cắm hoa →
            </button>
          )}
        </div>
      </div>

      {/* Customer Avatar & Stage area behind the counter */}
      <div className="counter-stage">
        <div className="counter-customer-frame" aria-hidden="true">
          {customer && customerPortrait ? (
            <div className={`customer-avatar-wrapper ${isGhost ? 'spectral-aura' : ''}`}>
              <img
                src={customerPortrait}
                alt=""
                className="counter-customer-img"
              />
              <div className="customer-nametag">
                <span>{customer.name}</span>
                {order && (
                  <small className="nametag-sub">
                    {isGhost ? 'Hồn cõi âm' : 'Khách cõi trần'}
                  </small>
                )}
              </div>
            </div>
          ) : (
            <div className="customer-placeholder">
              <span className="shop-peace-icon">🪷</span>
            </div>
          )}
        </div>

        {/* Floating Center Speech Bubble (Good Pizza, Great Pizza style) */}
        <div className="counter-bubble-anchor">
          {hasActiveDialogue && runtime.dialogue && (
            <DialogueBox
              dialogue={runtime.dialogue}
              choices={runtime.currentChoices}
              settings={runtime.snapshot.settings}
              onChoice={(choiceId) => runtime.advanceDialogue(choiceId)}
              onContinue={() => runtime.advanceDialogue()}
              isSuspended={isModalOpen}
            />
          )}

          {!hasActiveDialogue && order && (
            <article className="dialogue-panel gpgp-speech-bubble counter-order-card" role="region" aria-label="Yêu cầu của khách">
              <div className="speech-bubble-tail" aria-hidden="true" />
              <div className="dialogue-main-column">
                <div className="dialogue-header">
                  <span className="speaker-badge">{customer?.name ?? 'Khách ghé tiệm'}</span>
                  <span className="order-recipient-tag">
                    {order.recipient === 'deceased' ? 'Gửi người cõi âm' : 'Gửi người cõi trần'}
                  </span>
                </div>

                <div className="dialogue-text">
                  <p className="order-prompt">“{orderPrompt}”</p>
                  <OrderNote runtime={runtime} showArrangement={true} />
                </div>

                <div className="dialogue-actions gpgp-bubble-actions">
                  <div className="gpgp-button-row">
                    <button
                      type="button"
                      className="gpgp-action-btn btn-okay primary-action"
                      autoFocus
                      onClick={() => onNavigate('workspace')}
                    >
                      {hasBouquet ? 'Tiếp tục cắm hoa' : 'Sang bàn cắm hoa →'}
                    </button>

                    {!isDetailHeard && (
                      <button
                        type="button"
                        className="gpgp-action-btn btn-what"
                        onClick={() => runtime.askOrderDetail()}
                        title="Hỏi thêm chi tiết để hiểu rõ tâm nguyện"
                      >
                        Hỏi thêm chi tiết
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {!hasActiveDialogue && !order && (
            <div className="dialogue-panel gpgp-speech-bubble counter-idle-card" role="region" aria-label="Quầy tiệm thanh tĩnh">
              <div className="speech-bubble-tail" aria-hidden="true" />
              <div className="dialogue-main-column">
                <div className="dialogue-header">
                  <span className="speaker-badge">Tiệm Hoa Tích</span>
                </div>
                <div className="dialogue-text">
                  <h3>Quầy tiệm đang thanh tĩnh</h3>
                  <p>
                    {runtime.isShiftComplete
                      ? 'Tất cả khách trong buổi đã được tiếp đón chu toàn. Bạn có thể về sảnh tiệm để chuyển buổi.'
                      : 'Đang đợi vị khách tiếp theo bước vào tiệm...'}
                  </p>
                </div>
                <div className="dialogue-actions gpgp-button-row">
                  <button
                    type="button"
                    className="gpgp-action-btn btn-okay"
                    onClick={() => onNavigate('lobby')}
                  >
                    Về sảnh tiệm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Foreground Wooden Counter Table with Props */}
        <div className="counter-wooden-tabletop" aria-hidden="true">
          {/* Left props: Antique Bell */}
          <div className="table-prop-group prop-left">
            <div className="prop-bell" title="Chuông đồng tiếp tân">
              🛎️
            </div>
          </div>

          {/* Right props: 3 Spice/Powder Jars & Small Vase */}
          <div className="table-prop-group prop-right">
            <div className="prop-spice-jar jar-pollen" title="Bột phấn hoa cúc" />
            <div className="prop-spice-jar jar-petals" title="Cánh hoa sấy khô" />
            <div className="prop-spice-jar jar-essence" title="Nước dưỡng cành hoa" />
            <div className="prop-vase" title="Lọ hoa nhỏ trên bàn">
              🌸
            </div>
          </div>
        </div>

        {/* Right Edge Utility Dock (Lucky Cat & Tip Jar in Good Pizza, Great Pizza style) */}
        <aside className="counter-right-dock" aria-label="Tiện ích quầy">
          <div
            className="dock-item dock-lucky-cat"
            title="Mèo sứ chiêu tài — Lời dặn Cô Năm"
            role="button"
            tabIndex={0}
            onClick={onOpenJournal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenJournal();
            }}
          >
            <div className="dock-icon-circle">
              <span className="cat-icon">🐱</span>
              <span className="dock-notification-dot" aria-hidden="true">!</span>
            </div>
            <span className="dock-timer-badge">
              {runtime.progress.completed}/{runtime.progress.total}
            </span>
          </div>

        </aside>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { DialogueChoice, DialogueNode } from '../../game/content/types';
import type { GameSettings } from '../../game/state/GameState';
import { characterAssets } from '../../game/content/characterAssets';
import { contentBundle } from '../../game/content';

export interface DialogueBoxProps {
  dialogue: DialogueNode;
  choices: DialogueChoice[];
  settings: GameSettings;
  onChoice: (choiceId: string) => void;
  onContinue: () => void;
  isSuspended?: boolean;
}

export function DialogueBox({
  dialogue,
  choices,
  settings,
  onChoice,
  onContinue,
  isSuspended = false,
}: DialogueBoxProps) {
  let speakerName = 'Tôi';
  let portraitUrl = characterAssets.player.defaultPortrait;

  if (dialogue.speakerId !== 'player') {
    const cust = contentBundle.customers.find((c) => c.id === dialogue.speakerId);
    speakerName = cust?.name ?? dialogue.speakerId;
    const portKey = cust?.portraitKey ?? 'customer-one';
    portraitUrl = characterAssets[portKey].defaultPortrait;
  }

  const [charIndex, setCharIndex] = useState(0);
  const text = dialogue.text;

  const isTyping = charIndex < text.length && !settings.reducedMotion;

  const showAll = useCallback(() => {
    setCharIndex(text.length);
  }, [text.length]);

  useEffect(() => {
    if (settings.reducedMotion) {
      setCharIndex(text.length);
      return;
    }

    setCharIndex(0);
    const speedMs = settings.textSpeed === 'slow' ? 45 : settings.textSpeed === 'fast' ? 10 : 25;

    const timer = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= text.length) {
          clearInterval(timer);
          return text.length;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(timer);
  }, [dialogue.id, text, settings.textSpeed, settings.reducedMotion]);

  // Keyboard controls for dialogue
  useEffect(() => {
    if (isSuspended) return;

    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (isTyping) {
          e.preventDefault();
          showAll();
        } else if (choices.length === 0) {
          e.preventDefault();
          onContinue();
        }
        return;
      }

      const num = parseInt(e.key, 10);
      if (!isTyping && num >= 1 && num <= choices.length) {
        e.preventDefault();
        const choice = choices[num - 1];
        if (choice) {
          onChoice(choice.id);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isSuspended, isTyping, choices, showAll, onContinue, onChoice]);

  return (
    <section
      className="dialogue-panel gpgp-speech-bubble"
      role="region"
      aria-label="Khung hội thoại"
      tabIndex={-1}
      aria-hidden={isSuspended}
    >
      <div className="speech-bubble-tail" aria-hidden="true" />

      {/* Accessible portrait reference for tests/screen readers */}
      <div className="dialogue-portrait-wrapper" aria-hidden="true">
        <img
          src={portraitUrl}
          alt=""
          className="dialogue-portrait"
          decoding="async"
        />
      </div>

      <div className="dialogue-main-column">
        <div className="dialogue-header">
          <span className="speaker-badge">{speakerName}</span>
        </div>

        <div className="dialogue-text" aria-live="polite">
          {text.slice(0, charIndex)}
        </div>

        <div className="dialogue-actions gpgp-bubble-actions">
          {isTyping ? (
            <div className="gpgp-button-row">
              <button
                type="button"
                className="gpgp-action-btn btn-what"
                onClick={showAll}
              >
                Hiện hết chữ
              </button>
              <button
                type="button"
                className="gpgp-action-btn btn-okay"
                onClick={showAll}
              >
                Được rồi
              </button>
            </div>
          ) : choices.length > 0 ? (
            <div className="dialogue-choices gpgp-choices-stack">
              {choices.map((choice, i) => (
                <button
                  key={choice.id}
                  type="button"
                  className="dialogue-choice-button gpgp-choice-pill"
                  autoFocus={i === 0}
                  onClick={() => onChoice(choice.id)}
                >
                  <span className="choice-index">{i + 1}</span>
                  <span className="choice-label">{choice.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="gpgp-button-row">
              <button
                type="button"
                className="gpgp-action-btn btn-okay primary-action"
                autoFocus
                onClick={onContinue}
              >
                Được rồi
              </button>
              <button
                type="button"
                className="gpgp-action-btn btn-what"
                onClick={showAll}
              >
                Sao cơ?
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

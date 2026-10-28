'use client';

import { useState } from 'react';
import { contentBundle } from '../../game/content';
import { INTRO_DIALOGUE_NODE } from '../../game/GameSession';

export function DialogueDebug() {
  const allNodes = [...contentBundle.dialogue, INTRO_DIALOGUE_NODE];
  const [selectedId, setSelectedId] = useState<string>(allNodes[0]?.id ?? '');

  const node = allNodes.find((n) => n.id === selectedId);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'serif' }}>
      <h2>Thử nghiệm Hội Thoại (Dialogue Debug)</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Chọn node thoại:{' '}
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {allNodes.map((n) => (
              <option key={n.id} value={n.id}>{`${n.id} (${n.speakerId})`}</option>
            ))}
          </select>
        </label>
      </div>

      {node && (
        <div style={{ background: '#f4edd6', padding: '1rem', border: '1px solid #c7bb94', borderRadius: '4px' }}>
          <h3>Người nói: {node.speakerId}</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>{node.text}</p>
          {node.choices && node.choices.length > 0 && (
            <div>
              <h4>Các lựa chọn:</h4>
              <ul>
                {node.choices.map((c) => (
                  <li key={c.id}>
                    <strong>{c.text}</strong> → Nhảy tới: <code>{c.nextId ?? 'kết thúc'}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {node.nextId && (
            <p>
              Chuyển tiếp tự động tới: <code>{node.nextId}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

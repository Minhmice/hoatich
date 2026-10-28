'use client';

import { useState, useEffect } from 'react';
import { GameSession } from '../../game/GameSession';
import { contentBundle } from '../../game/content';
import { createInitialGameState } from '../../game/state/GameState';
import { createSandboxStorage } from '../../debug/sandboxStorage';
import { createBrowserSaveRepository } from '../../game/save/browserSaveRepository';
import { validateSave, migrateSave } from '../../game/save/migrations';
import type { GameState } from '../../game/state/GameState';

export function StateDebugPanel() {
  const [storage] = useState(() => createSandboxStorage());
  const [repo] = useState(() => createBrowserSaveRepository(storage));
  const [session, setSession] = useState(() => new GameSession());
  const [status, setStatus] = useState<string>('');
  const [jsonText, setJsonText] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(contentBundle.orders[0]?.id ?? '');

  useEffect(() => {
    setJsonText(JSON.stringify(session.state, null, 2));
  }, [session]);

  const jumpToOrder = () => {
    const order = contentBundle.orders.find((o) => o.id === selectedOrderId);
    if (!order) return;
    const nextState = createInitialGameState();
    nextState.flags.flag_intro_seen = true;
    nextState.currentDay = order.dayId;
    nextState.currentShift = order.shift;
    nextState.currentOrderId = order.id;
    nextState.activeDialogueId = order.openingDialogueId;
    setSession(new GameSession(validateSave(nextState)));
    setStatus(`Đã nhảy tới đơn ${order.id}`);
  };

  const advanceShift = () => {
    const nextState: GameState = {
      ...session.state,
      currentShift: session.state.currentShift === 'living' ? 'dead' : 'living',
      currentDay: session.state.currentShift === 'living' ? 'day-2' : session.state.currentDay,
      currentOrderId: undefined,
      activeDialogueId: undefined,
    };
    setSession(new GameSession(validateSave(nextState)));
    setStatus(`Đã chuyển ca: ${nextState.currentShift}`);
  };

  const fillStock = () => {
    const nextState = structuredClone(session.state);
    for (const f of contentBundle.flowers) {
      nextState.inventory[f.id] = 99;
      if (!nextState.unlockedFlowerIds.includes(f.id)) nextState.unlockedFlowerIds.push(f.id);
      if (f.unlockFlag) nextState.flags[f.unlockFlag] = true;
    }
    setSession(new GameSession(validateSave(nextState)));
    setStatus('Đã mở khóa và nạp 99 cành mỗi loại hoa.');
  };

  const saveSandbox = async () => {
    await repo.save(session.state);
    setStatus('Đã lưu vào sandbox storage.');
  };

  const loadSandbox = async () => {
    const res = await repo.load();
    if (res.status === 'loaded') {
      setSession(new GameSession(res.state));
      setStatus(res.recovered ? 'Khôi phục từ backup sandbox thành công.' : 'Tải sandbox thành công.');
    } else if (res.status === 'error') {
      setStatus(`Lỗi tải: ${res.message}`);
    } else {
      setStatus('Bản lưu sandbox trống.');
    }
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'monospace' }}>
      <h2>Thử nghiệm State & Lưu Trữ Sandbox</h2>
      <p style={{ color: 'green' }}>{status || 'Sandbox đang hoạt động trong bộ nhớ tab.'}</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}>
          {contentBundle.orders.map((o) => (
            <option key={o.id} value={o.id}>{`${o.id} (${o.dayId} · ${o.shift})`}</option>
          ))}
        </select>
        <button onClick={jumpToOrder}>Nhảy tới đơn</button>
        <button onClick={advanceShift}>Nhảy ca</button>
        <button onClick={fillStock}>Đầy kho & mở hoa</button>
        <button onClick={saveSandbox}>Lưu sandbox</button>
        <button onClick={loadSandbox}>Tải sandbox</button>
        <button onClick={() => setSession(new GameSession())}>Đặt lại mới</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3>State JSON</h3>
          <textarea
            style={{ width: '100%', height: '400px', fontFamily: 'monospace' }}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button onClick={() => {
            try {
              const parsed = JSON.parse(jsonText);
              setSession(new GameSession(migrateSave(parsed)));
              setStatus('Áp dụng JSON thành công.');
            } catch (err) {
              setStatus(`Lỗi JSON: ${String(err)}`);
            }
          }}>
            Nhập & Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}

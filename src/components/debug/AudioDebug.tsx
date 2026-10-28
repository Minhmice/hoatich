'use client';

import { useState, useEffect, useRef } from 'react';
import { AudioManager } from '../../game/audio';

export function AudioDebug() {
  const [started, setStarted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(1);
  const [sfxVolume, setSfxVolume] = useState(1);
  const [shift, setShift] = useState<'living' | 'dead'>('living');

  const audioRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    const audio = new AudioManager({ musicVolume: 0.7, sfxVolume: 0.7 });
    audioRef.current = audio;
    return () => {
      audio.destroy();
      audioRef.current = null;
    };
  }, []);

  const syncVolumes = () => {
    if (!audioRef.current) return;
    audioRef.current.setMusicVolume(masterVolume * musicVolume);
    audioRef.current.setSfxVolume(masterVolume * sfxVolume);
  };

  const handleStart = () => {
    if (!audioRef.current) return;
    audioRef.current.startAmbient();
    setStarted(true);
    syncVolumes();
  };

  const handleChangeShift = (s: 'living' | 'dead') => {
    setShift(s);
    audioRef.current?.setShift(s);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'serif' }}>
      <h2>Thử nghiệm Âm Thanh (Audio Debug)</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={handleStart} disabled={started}>
          {started ? 'Đã khởi động synth' : 'Khởi động âm thanh (AudioContext)'}
        </button>
        <button onClick={() => handleChangeShift('living')}>Ca sống (ban ngày)</button>
        <button onClick={() => handleChangeShift('dead')}>Ca linh hồn (buổi tối)</button>
        <button onClick={() => audioRef.current?.playPlacementSfx()}>Tiếng cắm hoa (SFX)</button>
        <button onClick={() => audioRef.current?.playDeliverySfx(true)}>Giao hoa thành công</button>
        <button onClick={() => audioRef.current?.playDeliverySfx(false)}>Giao hoa lệch ý</button>
      </div>
      <p style={{ margin: '0.5rem 0' }}>Ca làm việc hiện tại: <strong>{shift === 'living' ? 'Ca sống (ban ngày)' : 'Ca linh hồn (buổi tối)'}</strong></p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
        <label>
          Âm lượng tổng: {Math.round(masterVolume * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={masterVolume}
            onChange={(e) => {
              setMasterVolume(parseFloat(e.target.value));
              syncVolumes();
            }}
          />
        </label>
        <label>
          Nhạc nền: {Math.round(musicVolume * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={(e) => {
              setMusicVolume(parseFloat(e.target.value));
              syncVolumes();
            }}
          />
        </label>
        <label>
          Hiệu ứng: {Math.round(sfxVolume * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={(e) => {
              setSfxVolume(parseFloat(e.target.value));
              syncVolumes();
            }}
          />
        </label>
      </div>
    </div>
  );
}

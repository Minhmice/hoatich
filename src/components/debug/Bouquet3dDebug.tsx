'use client';

import { useEffect, useRef, useState } from 'react';
import { Color, Scene, WebGLRenderer } from 'three';
import {
  BouquetModel,
  type VesselKind,
} from '../../game/bouquet/BouquetModel';
import { contentBundle } from '../../game/content';
import { createDioramaCamera } from '../../render3d/DioramaCamera';
import { DioramaLighting } from '../../render3d/DioramaLighting';
import { Workstation3D } from '../../render3d/Workstation3D';
import { WorkstationInteraction } from '../../render3d/WorkstationInteraction';

export function Bouquet3dDebug() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bouquet] = useState(
    () => new BouquetModel({ vessel: 'bouquet', stemCount: 5 }),
  );
  const [, setVersion] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFlowerId, setSelectedFlowerId] = useState<string>(
    contentBundle.flowers[0]?.id ?? '',
  );
  const [vessel, setVessel] = useState<VesselKind>('bouquet');
  const [stemCount, setStemCount] = useState<number>(5);

  const triggerUpdate = () => setVersion((v) => v + 1);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;

    let disposed = false;
    const scene = new Scene();
    scene.background = new Color(0xede6ce);

    const camera = createDioramaCamera();
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    parent.appendChild(renderer.domElement);

    const lights = new DioramaLighting();
    scene.add(lights);

    const workstation = new Workstation3D(scene);
    workstation.load();

    const interaction = new WorkstationInteraction(
      renderer.domElement,
      camera,
      workstation,
      bouquet,
      {
        enabled: () => true,
        onChange: (id) => {
          setSelectedId(id);
          triggerUpdate();
        },
        onSlotClick: () => {
          if (!bouquet.isFull) {
            try {
              const item = bouquet.add(selectedFlowerId);
              setSelectedId(item.id);
              triggerUpdate();
            } catch {
              // ignore
            }
          }
        },
      },
    );

    const onResize = () => {
      const w = parent.clientWidth || 800;
      const h = parent.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener('resize', onResize);

    renderer.setAnimationLoop(() => {
      if (!disposed) {
        workstation.sync(bouquet, selectedId);
        renderer.render(scene, camera);
      }
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      interaction.dispose();
      workstation.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [bouquet, selectedId, selectedFlowerId]);

  const handleConfigChange = (newVessel: VesselKind, newCount: number) => {
    setVessel(newVessel);
    setStemCount(newCount);
    bouquet.configure({ vessel: newVessel, stemCount: newCount });
    setSelectedId(null);
    triggerUpdate();
  };

  const handleAdd = () => {
    try {
      const item = bouquet.add(selectedFlowerId);
      setSelectedId(item.id);
      triggerUpdate();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const finish = bouquet.finish;
  const isFull = bouquet.isFull;

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'serif' }}>
      <h2>Thử nghiệm Bàn Cắm Hoa 3D (Bouquet 3D Slot Debug)</h2>

      {/* Row 1: Configuration */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <strong>Bình / Dạng:</strong>
        <select
          value={vessel}
          onChange={(e) => handleConfigChange(e.target.value as VesselKind, stemCount)}
        >
          <option value="bouquet">Bó hoa (Bouquet)</option>
          <option value="vase">Bình gốm (Vase)</option>
          <option value="jar">Hũ thủy tinh (Jar)</option>
        </select>

        <strong>Số cành (1..24):</strong>
        <select
          value={stemCount}
          onChange={(e) => handleConfigChange(vessel, Number(e.target.value))}
        >
          {[1, 3, 5, 8, 12, 15, 20, 24].map((n) => (
            <option key={n} value={n}>
              {n} cành
            </option>
          ))}
        </select>

        <span>
          Đã cắm: {bouquet.items.length}/{bouquet.configuration?.stemCount ?? 0} {isFull ? '(ĐẦY)' : ''}
        </span>
      </div>

      {/* Row 2: Stem actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <select
          value={selectedFlowerId}
          onChange={(e) => setSelectedFlowerId(e.target.value)}
        >
          {contentBundle.flowers.map((f) => (
            <option key={f.id} value={f.id}>
              {f.displayName}
            </option>
          ))}
        </select>
        <button onClick={handleAdd} disabled={isFull}>
          Cắm vào ô trống tiếp theo
        </button>
        <button
          onClick={() => {
            if (selectedId) {
              bouquet.rotate(selectedId, -10);
              triggerUpdate();
            }
          }}
          disabled={!selectedId}
        >
          Xoay trái (-10°)
        </button>
        <button
          onClick={() => {
            if (selectedId) {
              bouquet.rotate(selectedId, 10);
              triggerUpdate();
            }
          }}
          disabled={!selectedId}
        >
          Xoay phải (+10°)
        </button>
        <button
          onClick={() => {
            if (selectedId) {
              bouquet.remove(selectedId);
              setSelectedId(null);
              triggerUpdate();
            }
          }}
          disabled={!selectedId}
        >
          Rút cành (Lift/Remove)
        </button>
        <button
          onClick={() => {
            bouquet.undo();
            triggerUpdate();
          }}
        >
          Hoàn tác (Undo)
        </button>
        <button
          onClick={() => {
            bouquet.clear();
            setSelectedId(null);
            triggerUpdate();
          }}
        >
          Nhấc hết cành (Clear)
        </button>
        <button
          onClick={() => {
            bouquet.reset();
            bouquet.configure({ vessel, stemCount });
            setSelectedId(null);
            triggerUpdate();
          }}
        >
          Đặt lại (Reset)
        </button>
      </div>

      {/* Row 3: Finish actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <strong>Giấy gói:</strong>
        <button
          onClick={() => {
            bouquet.setPaper('none');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.paper === 'none' ? 'bold' : 'normal' }}
        >
          Không
        </button>
        <button
          onClick={() => {
            bouquet.setPaper('kraft');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.paper === 'kraft' ? 'bold' : 'normal' }}
        >
          Kraft
        </button>
        <button
          onClick={() => {
            bouquet.setPaper('cream');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.paper === 'cream' ? 'bold' : 'normal' }}
        >
          Kem
        </button>

        <span style={{ marginLeft: '1rem' }}><strong>Ruy-băng:</strong></span>
        <button
          onClick={() => {
            bouquet.setRibbon('none');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.ribbon === 'none' ? 'bold' : 'normal' }}
        >
          Không
        </button>
        <button
          onClick={() => {
            bouquet.setRibbon('sage');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.ribbon === 'sage' ? 'bold' : 'normal' }}
        >
          Xanh xô (Sage)
        </button>
        <button
          onClick={() => {
            bouquet.setRibbon('rose');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.ribbon === 'rose' ? 'bold' : 'normal' }}
        >
          Hồng tro (Rose)
        </button>

        <button
          onClick={() => {
            bouquet.advanceBow();
            triggerUpdate();
          }}
          disabled={finish.ribbon === 'none' || finish.bowStep >= 3}
          style={{ marginLeft: '0.5rem' }}
        >
          Thắt nơ ({finish.bowStep}/3: {finish.bowStep === 0 ? 'Chưa thắt' : finish.bowStep === 1 ? 'Quấn' : finish.bowStep === 2 ? 'Tạo tai' : 'Siết'})
        </button>

        <span style={{ marginLeft: '1rem' }}><strong>Thiệp:</strong></span>
        <button
          onClick={() => {
            bouquet.setCard(null);
            triggerUpdate();
          }}
          style={{ fontWeight: finish.cardId === null ? 'bold' : 'normal' }}
        >
          Không
        </button>
        <button
          onClick={() => {
            bouquet.setCard('card-01');
            triggerUpdate();
          }}
          style={{ fontWeight: finish.cardId !== null ? 'bold' : 'normal' }}
        >
          Gắn thiệp
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '520px',
          border: '1px solid #c7bb94',
          borderRadius: '4px',
          position: 'relative',
        }}
      />
    </div>
  );
}

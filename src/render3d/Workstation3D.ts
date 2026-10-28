import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  SRGBColorSpace,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  type Object3D,
  type Scene,
  type Texture,
} from 'three';
import type {
  BouquetConfiguration,
  BouquetFinish,
  BouquetItem,
  BouquetModel,
  BouquetSlot,
} from '../game/bouquet/BouquetModel';
import { flowerAssets } from '../game/content/flowerAssets';
import { FlowerCard3D, computeStemTransform } from './FlowerCard3D';

const FINISH_COLORS = {
  paper: {
    kraft: 0x9e7350,
    cream: 0xf6f1e3,
  },
  ribbon: {
    sage: 0x6a8d73,
    rose: 0xc27384,
  },
};

export class Workstation3D {
  readonly group = new Group();
  readonly pickables: Object3D[] = [];

  private readonly cards = new Map<string, FlowerCard3D>();
  private readonly textures = new Map<string, Texture>();
  private readonly geometry = new PlaneGeometry(1, 1).translate(0, 0.5, 0);
  private readonly table = new Mesh(
    new BoxGeometry(8.6, 0.3, 5.6),
    new MeshStandardMaterial({ color: 0x70503c, roughness: 1 }),
  );

  // Vessel Meshes
  private readonly vesselGroup = new Group();
  private readonly bouquetVessel = new Mesh(
    new CylinderGeometry(0.75, 0.22, 1.25, 24, 1, true),
    new MeshStandardMaterial({ color: 0xdfd4be, roughness: 0.85, side: DoubleSide }),
  );
  private readonly vaseVessel = new Mesh(
    new CylinderGeometry(0.42, 0.36, 1.35, 24),
    new MeshStandardMaterial({ color: 0xe8e6df, roughness: 0.35, metalness: 0.1 }),
  );
  private readonly jarVessel = new Mesh(
    new CylinderGeometry(0.55, 0.5, 0.85, 24),
    new MeshStandardMaterial({
      color: 0xc8e0e8,
      roughness: 0.15,
      transparent: true,
      opacity: 0.65,
    }),
  );
  private readonly vaseMouth = new Mesh(
    new RingGeometry(0, 0.38, 24),
    new MeshStandardMaterial({ color: 0x221c17, roughness: 0.9, side: DoubleSide }),
  );
  private readonly jarMouth = new Mesh(
    new RingGeometry(0, 0.48, 24),
    new MeshStandardMaterial({ color: 0x243238, roughness: 0.8, side: DoubleSide }),
  );
  // Finishing Meshes
  private readonly paperMesh = new Mesh(
    new CylinderGeometry(0.78, 0.24, 1.2, 24, 1, true),
    new MeshStandardMaterial({ roughness: 0.9, side: DoubleSide }),
  );
  private readonly ribbonGroup = new Group();
  private readonly ribbonBand = new Mesh(
    new TorusGeometry(0.36, 0.035, 16, 32),
    new MeshStandardMaterial({ roughness: 0.6 }),
  );
  private readonly bowKnot = new Mesh(
    new SphereGeometry(0.075, 16, 16),
    new MeshStandardMaterial({ roughness: 0.6 }),
  );
  private readonly bowEarGeometry = new TorusGeometry(0.1, 0.025, 12, 24);
  private readonly bowTailGeometry = new BoxGeometry(0.06, 0.26, 0.01);
  private readonly bowEarsGroup = new Group();
  private readonly bowTailsGroup = new Group();
  // Card Mesh
  private readonly cardMesh = new Mesh(
    new BoxGeometry(0.35, 0.22, 0.015),
    new MeshStandardMaterial({ color: 0xfffdfa, roughness: 0.9 }),
  );

  // Slot rings
  private readonly slotRingGroup = new Group();
  private readonly slotRingPool: Mesh<RingGeometry, MeshStandardMaterial>[] = [];
  private readonly ringGeometry = new RingGeometry(0.18, 0.25, 24);
  private readonly ringMaterial = new MeshStandardMaterial({
    color: 0xc2a66e,
    roughness: 0.6,
    transparent: true,
    opacity: 0.75,
    side: DoubleSide,
  });

  private disposed = false;

  constructor(scene: Scene) {
    this.table.position.y = -0.18;
    this.table.receiveShadow = true;
    this.group.add(this.table);

    // Setup vessels
    this.bouquetVessel.rotation.x = Math.PI / 2.3;
    this.bouquetVessel.position.set(0, 0.05, 0.35);
    this.bouquetVessel.visible = false;
    this.vesselGroup.add(this.bouquetVessel);

    this.vaseVessel.position.set(0, 0.45, -0.2);
    this.vaseVessel.visible = false;
    this.vesselGroup.add(this.vaseVessel);
    this.vaseMouth.position.set(0, 1.126, -0.2);
    this.vaseMouth.rotation.x = -Math.PI / 2;
    this.vaseMouth.visible = false;
    this.vesselGroup.add(this.vaseMouth);

    this.jarVessel.position.set(0, 0.28, 0.1);
    this.jarVessel.visible = false;
    this.vesselGroup.add(this.jarVessel);

    this.jarMouth.position.set(0, 0.706, 0.1);
    this.jarMouth.rotation.x = -Math.PI / 2;
    this.jarMouth.visible = false;
    this.vesselGroup.add(this.jarMouth);

    this.group.add(this.vesselGroup);

    // Setup Paper
    this.paperMesh.rotation.x = Math.PI / 2.3;
    this.paperMesh.position.set(0, 0.06, 0.33);
    this.paperMesh.visible = false;
    this.group.add(this.paperMesh);

    // Setup Ribbon & Bow
    this.ribbonBand.rotation.x = Math.PI / 2.3;
    this.ribbonBand.position.set(0, 0.12, 0.55);
    this.ribbonGroup.add(this.ribbonBand);

    this.bowKnot.position.set(0, 0.15, 0.6);
    this.bowKnot.visible = false;
    this.ribbonGroup.add(this.bowKnot);

    // Bow Ears (two loops)
    const leftEar = new Mesh(this.bowEarGeometry, this.ribbonBand.material);
    leftEar.position.set(-0.11, 0.16, 0.61);
    leftEar.rotation.z = Math.PI / 6;
    const rightEar = new Mesh(this.bowEarGeometry, this.ribbonBand.material);
    rightEar.position.set(0.11, 0.16, 0.61);
    rightEar.rotation.z = -Math.PI / 6;
    this.bowEarsGroup.add(leftEar, rightEar);
    this.ribbonGroup.add(this.bowEarsGroup);

    // Bow Tails (hanging ends)
    const leftTail = new Mesh(this.bowTailGeometry, this.ribbonBand.material);
    leftTail.position.set(-0.07, 0.05, 0.63);
    leftTail.rotation.z = Math.PI / 8;
    const rightTail = new Mesh(this.bowTailGeometry, this.ribbonBand.material);
    rightTail.position.set(0.07, 0.05, 0.63);
    rightTail.rotation.z = -Math.PI / 8;
    this.bowTailsGroup.add(leftTail, rightTail);
    this.ribbonGroup.add(this.bowTailsGroup);

    this.ribbonGroup.visible = false;
    this.group.add(this.ribbonGroup);

    // Setup Card
    this.cardMesh.position.set(0.48, 0.12, 0.42);
    this.cardMesh.rotation.set(-Math.PI / 3, 0, -Math.PI / 12);
    this.cardMesh.visible = false;
    this.group.add(this.cardMesh);

    // Setup Slot Rings
    this.group.add(this.slotRingGroup);

    scene.add(this.group);
  }

  async load(): Promise<void> {
    const loader = new TextureLoader();
    const loadPromises: Promise<void>[] = [];

    for (const [id, asset] of Object.entries(flowerAssets)) {
      // Center texture
      loadPromises.push(
        loader.loadAsync(asset.url).then((texture) => {
          if (this.disposed) {
            texture.dispose();
            return;
          }
          texture.colorSpace = SRGBColorSpace;
          this.textures.set(`${id}:center`, texture);
          this.textures.set(id, texture);
        }),
      );

      // Variant textures (left, right, down)
      if (asset.variants) {
        if (asset.variants.left) {
          loadPromises.push(
            loader.loadAsync(asset.variants.left).then((texture) => {
              if (this.disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = SRGBColorSpace;
              this.textures.set(`${id}:left`, texture);
            }),
          );
        }
        if (asset.variants.right) {
          loadPromises.push(
            loader.loadAsync(asset.variants.right).then((texture) => {
              if (this.disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = SRGBColorSpace;
              this.textures.set(`${id}:right`, texture);
            }),
          );
        }
        if (asset.variants.down) {
          loadPromises.push(
            loader.loadAsync(asset.variants.down).then((texture) => {
              if (this.disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = SRGBColorSpace;
              this.textures.set(`${id}:down`, texture);
            }),
          );
        }
      }
    }

    await Promise.all(loadPromises);
  }

  sync(
    target: BouquetModel | readonly BouquetItem[],
    selectedId: string | null,
    configOverride?: BouquetConfiguration | null,
    finishOverride?: BouquetFinish,
    slotsOverride?: readonly BouquetSlot[],
  ): void {
    if (this.disposed) return;

    let items: readonly BouquetItem[];
    let config: BouquetConfiguration | null = null;
    let finish: BouquetFinish = {
      paper: 'none',
      ribbon: 'none',
      bowStep: 0,
      cardId: null,
    };
    let slots: readonly BouquetSlot[] = [];

    if ('items' in target && Array.isArray((target as BouquetModel).items)) {
      const model = target as BouquetModel;
      items = model.items;
      config = model.configuration;
      finish = model.finish;
      slots = model.slots;
    } else {
      items = target as readonly BouquetItem[];
      config = configOverride ?? null;
      finish = finishOverride ?? finish;
      slots = slotsOverride ?? [];
    }

    const currentVessel = config?.vessel ?? 'bouquet';

    // 1. Sync Vessel
    this.bouquetVessel.visible = currentVessel === 'bouquet';
    this.vaseVessel.visible = currentVessel === 'vase';
    this.vaseMouth.visible = currentVessel === 'vase';
    this.jarVessel.visible = currentVessel === 'jar';
    this.jarMouth.visible = currentVessel === 'jar';
    // 2. Sync Paper Finish
    if (finish.paper !== 'none') {
      const paperColor = FINISH_COLORS.paper[finish.paper];
      this.paperMesh.material.color.setHex(paperColor);
      this.paperMesh.visible = true;
    } else {
      this.paperMesh.visible = false;
    }

    // 3. Sync Ribbon & Bow Finish
    if (finish.ribbon !== 'none') {
      const ribbonColor = FINISH_COLORS.ribbon[finish.ribbon];
      this.ribbonBand.material.color.setHex(ribbonColor);
      this.bowKnot.material.color.setHex(ribbonColor);
      this.ribbonGroup.visible = true;
      this.bowKnot.visible = finish.bowStep >= 1;
      this.bowEarsGroup.visible = finish.bowStep >= 2;
      this.bowTailsGroup.visible = finish.bowStep >= 3;
    } else {
      this.ribbonGroup.visible = false;
    }

    // 4. Sync Message Card
    this.cardMesh.visible = finish.cardId !== null;

    // 5. Sync Flower Cards
    const ids = new Set(items.map((item) => item.id));
    for (const [id, card] of this.cards) {
      if (!ids.has(id)) {
        card.dispose();
        this.cards.delete(id);
      }
    }

    for (const item of items) {
      let card = this.cards.get(item.id);
      const poseKey = `${item.flowerId}:${item.pose}`;
      const texture =
        this.textures.get(poseKey) ??
        this.textures.get(`${item.flowerId}:center`) ??
        this.textures.get(item.flowerId);

      if (!card) {
        if (!texture) {
          throw new Error(`Chưa tải texture hoa: ${item.flowerId}`);
        }
        card = new FlowerCard3D(item, texture, this.geometry, currentVessel);
        this.cards.set(item.id, card);
        this.group.add(card);
      }
      card.sync(item, selectedId === item.id, texture, currentVessel);
    }

    // 6. Sync Slot Rings (vacant indicators)
    const occupiedSlots: Record<number, true> = {};
    for (const item of items) {
      occupiedSlots[item.slotIndex] = true;
    }

    // Adjust ring pool size
    while (this.slotRingPool.length < slots.length) {
      const ring = new Mesh(this.ringGeometry, this.ringMaterial);
      this.slotRingPool.push(ring);
      this.slotRingGroup.add(ring);
    }

    for (let i = 0; i < this.slotRingPool.length; i++) {
      const ring = this.slotRingPool[i];
      if (i < slots.length) {
        const slot = slots[i];
        const isVacant = !occupiedSlots[slot.index];
        ring.visible = isVacant;
        if (isVacant) {
          const stemTransform = computeStemTransform(
            slot.position,
            slot.layer,
            slot.rotation,
            currentVessel,
            false,
          );
          ring.position.copy(stemTransform.headPosition);
          ring.rotation.set(-Math.PI / 4, 0, stemTransform.rotation.z);
          ring.userData.slotIndex = slot.index;
          ring.userData.isSlotRing = true;
        }
      } else {
        ring.visible = false;
      }
    }

    // 7. Update pickables (active cards + visible vacant slot rings)
    this.pickables.length = 0;
    this.pickables.push(...this.cards.values());
    for (let i = 0; i < slots.length; i++) {
      const ring = this.slotRingPool[i];
      if (ring && ring.visible) {
        this.pickables.push(ring);
      }
    }
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    for (const card of this.cards.values()) {
      card.dispose();
    }
    this.cards.clear();
    this.pickables.length = 0;

    const uniqueTextures = new Set(this.textures.values());
    for (const texture of uniqueTextures) {
      texture.dispose();
    }
    this.textures.clear();

    this.ringGeometry.dispose();
    this.ringMaterial.dispose();
    this.geometry.dispose();
    this.table.geometry.dispose();
    this.table.material.dispose();
    this.bouquetVessel.geometry.dispose();
    this.bouquetVessel.material.dispose();
    this.vaseVessel.geometry.dispose();
    this.vaseVessel.material.dispose();
    this.vaseMouth.geometry.dispose();
    this.vaseMouth.material.dispose();
    this.jarMouth.geometry.dispose();
    this.jarMouth.material.dispose();
    this.jarVessel.geometry.dispose();
    this.jarVessel.material.dispose();
    this.paperMesh.geometry.dispose();
    this.paperMesh.material.dispose();
    this.ribbonBand.geometry.dispose();
    this.ribbonBand.material.dispose();
    this.bowKnot.geometry.dispose();
    this.bowKnot.material.dispose();
    this.bowEarGeometry.dispose();
    this.bowTailGeometry.dispose();
    this.cardMesh.geometry.dispose();
    this.cardMesh.material.dispose();

    this.group.removeFromParent();
  }
}

import {
  DoubleSide,
  Euler,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Vector3,
  type Texture,
} from 'three';
import type { BouquetItem, VesselKind } from '../game/bouquet/BouquetModel';

export interface StemTransform {
  readonly position: Vector3;
  readonly rotation: Euler;
  readonly headPosition: Vector3;
}

const tempHeadOffset = new Vector3();

export function computeStemTransform(
  position: { readonly x: number; readonly y: number },
  layer: number,
  rotationDelta: number,
  vesselKind: VesselKind,
  selected: boolean,
): StemTransform {
  let baseX = 0;
  let baseY = 0;
  let baseZ = 0;
  let pitchX = 0;
  let rollZ = 0;
  let yawY = 0;
  let stemLength = 1.85;

  if (vesselKind === 'vase') {
    const dx = (position.x - 640) / 140;
    const dy = (position.y - 500) / 95;

    // Stem bottoms converge inside vase neck (mouth at Y=1.125, Z=-0.2)
    baseX = dx * 0.08;
    baseY = 1.04 + layer * 0.025 + (selected ? 0.35 : 0);
    baseZ = -0.2 + dy * 0.06;

    // Upright fan cluster facing diorama camera (camera at Y=10, Z=12)
    pitchX = -0.46 - dy * 0.14;
    rollZ = -dx * 0.38 - (rotationDelta * Math.PI) / 180;
    yawY = dx * 0.15;
    stemLength = 1.85;
  } else if (vesselKind === 'jar') {
    const dx = (position.x - 640) / 160;
    const dy = (position.y - 520) / 75;

    // Stem bottoms converge inside jar mouth (mouth at Y=0.705, Z=0.1)
    baseX = dx * 0.12;
    baseY = 0.62 + layer * 0.025 + (selected ? 0.35 : 0);
    baseZ = 0.1 + dy * 0.08;

    pitchX = -0.44 - dy * 0.14;
    rollZ = -dx * 0.42 - (rotationDelta * Math.PI) / 180;
    yawY = dx * 0.16;
    stemLength = 1.75;
  } else {
    // Bouquet: stems converge at ribbon tie point (Y=0.14, Z=0.52)
    const dx = (position.x - 640) / 140;
    const dy = (position.y - 510) / 90;

    baseX = dx * 0.05;
    baseY = 0.14 + layer * 0.02 + (selected ? 0.22 : 0);
    baseZ = 0.52 + dy * 0.04 - (selected ? 0.12 : 0);

    // Fan rests inside wrapping cone angled on table
    pitchX = -1.18 - dy * 0.12;
    rollZ = -dx * 0.48 - (rotationDelta * Math.PI) / 180;
    yawY = dx * 0.14;
    stemLength = 1.95;
  }

  const basePos = new Vector3(baseX, baseY, baseZ);
  const rot = new Euler(pitchX, yawY, rollZ, 'YXZ');

  // Compute flower head position by extending along stem vector (+Y in local card space)
  tempHeadOffset.set(0, stemLength, 0).applyEuler(rot);
  const headPos = basePos.clone().add(tempHeadOffset);

  return {
    position: basePos,
    rotation: rot,
    headPosition: headPos,
  };
}

export class FlowerCard3D extends Mesh<PlaneGeometry, MeshStandardMaterial> {
  private currentTexture: Texture;
  private currentVessel: VesselKind = 'bouquet';

  constructor(
    item: BouquetItem,
    texture: Texture,
    geometry: PlaneGeometry,
    vesselKind: VesselKind = 'bouquet',
  ) {
    super(
      geometry,
      new MeshStandardMaterial({
        map: texture,
        alphaTest: 0.5,
        side: DoubleSide,
        roughness: 0.85,
      }),
    );
    this.currentTexture = texture;
    this.currentVessel = vesselKind;
    this.updateScale(texture, vesselKind);
    this.castShadow = true;
    this.receiveShadow = true;
    this.userData.itemId = item.id;
    this.userData.slotIndex = item.slotIndex;
    this.sync(item, false, texture, vesselKind);
  }

  private updateScale(texture: Texture, vesselKind: VesselKind): void {
    const image = texture.image as HTMLImageElement | undefined;
    // Scale up from 1.35 to 2.3–2.5 so blooms are lush, prominent, and occupy layout
    const baseHeight = vesselKind === 'vase' ? 2.45 : vesselKind === 'jar' ? 2.3 : 2.5;
    const aspect = image && image.width && image.height ? image.width / image.height : 0.75;
    this.scale.set(baseHeight * aspect, baseHeight, 1);
  }

  sync(
    item: BouquetItem,
    selected: boolean,
    texture?: Texture,
    vesselKind: VesselKind = this.currentVessel,
  ): void {
    if (vesselKind !== this.currentVessel) {
      this.currentVessel = vesselKind;
      this.updateScale(this.currentTexture, vesselKind);
    }

    if (texture && texture !== this.currentTexture) {
      this.currentTexture = texture;
      this.material.map = texture;
      this.material.needsUpdate = true;
      this.updateScale(texture, this.currentVessel);
    }

    // Compute stem transform: stem base converges at vessel mouth, head fans into slot layout
    const transform = computeStemTransform(
      item.position,
      item.layer,
      item.rotation,
      this.currentVessel,
      selected,
    );

    this.position.copy(transform.position);
    this.rotation.copy(transform.rotation);

    // Emissive feedback when lifted/selected
    this.material.emissive.setHex(selected ? 0x554422 : 0x000000);
  }

  dispose(): void {
    this.material.dispose();
    this.removeFromParent();
  }
}

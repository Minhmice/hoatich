import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, type Camera, type Scene, type Texture } from 'three';
import { characterAssets, type CharacterId } from '../game/content/characterAssets';

export class CharacterBillboard {
  private readonly textures = new Map<string, Texture>();
  private readonly mesh = new Mesh(new PlaneGeometry(2.5, 3.8), new MeshBasicMaterial({ transparent: true, alphaTest: 0.1 }));
  private disposed = false;
  constructor(scene: Scene, camera: Camera, x: number) {
    this.mesh.position.set(x, 2, -3.8);
    this.mesh.quaternion.copy(camera.quaternion);
    scene.add(this.mesh);
  }
  async load(): Promise<void> {
    await Promise.all(Object.values(characterAssets).flatMap((entry) => entry.urls).map(async (url) => {
      const texture = await new TextureLoader().loadAsync(url);
      if (this.disposed) { texture.dispose(); return; }
      texture.colorSpace = SRGBColorSpace;
      this.textures.set(url, texture);
    }));
  }
  sync(id: CharacterId | null, ghost: boolean, mood = 'neutral', visible = true): void {
    this.mesh.visible = visible && id !== null;
    if (!id) return;
    const asset = characterAssets[id];
    const texture = this.textures.get(asset.variants.find((variant) => variant.mood === mood)?.url ?? asset.defaultPortrait);
    if (this.mesh.material.map !== texture) { this.mesh.material.map = texture ?? null; this.mesh.material.needsUpdate = true; }
    this.mesh.material.color.setHex(ghost ? 0x9fc5e8 : 0xffffff);
    this.mesh.material.opacity = ghost ? 0.82 : 1;
    if (texture) { const image = texture.image as HTMLImageElement; this.mesh.scale.x = image.width / image.height / (2.5 / 3.8); }
  }
  updateOrientation(camera: Camera): void {
    if (this.disposed) return;
    this.mesh.quaternion.copy(camera.quaternion);
  }
  dispose(): void {
    this.disposed = true;
    for (const texture of this.textures.values()) texture.dispose();
    this.mesh.geometry.dispose(); this.mesh.material.dispose(); this.mesh.removeFromParent();
  }
}

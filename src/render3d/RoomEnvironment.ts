import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3, type PerspectiveCamera, type Camera, type Scene, type Texture } from 'three';
import type { Shift } from '../game/content/types';

export class RoomEnvironment {
  private readonly plane = new Mesh(new PlaneGeometry(32, 20), new MeshBasicMaterial({ color: 0xffffff }));
  private readonly textures: Texture[] = [];
  private readonly forward = new Vector3();
  private disposed = false;
  constructor(scene: Scene, camera: Camera) {
    this.plane.position.set(0, 0, -9);
    this.plane.quaternion.copy(camera.quaternion);
    scene.add(this.plane);
  }
  async load(): Promise<void> {
    await Promise.all(['day', 'evening'].map(async (time, index) => {
      const texture = await new TextureLoader().loadAsync(`/assets/generated/shop/shop-${time}.png`);
      if (this.disposed) { texture.dispose(); return; }
      texture.colorSpace = SRGBColorSpace;
      this.textures[index] = texture;
    }));
    if (!this.disposed) this.setShift('living');
  }
  setShift(shift: Shift): void {
    const texture = this.textures[shift === 'dead' ? 1 : 0];
    if (this.plane.material.map !== texture) { this.plane.material.map = texture; this.plane.material.needsUpdate = true; }
    if (texture) { const image = texture.image as HTMLImageElement; this.plane.scale.x = this.plane.scale.y * (image.width / image.height) / (32 / 20); }
  }
  resize(camera: PerspectiveCamera): void {
    const distance = 80;
    const height = 2 * Math.tan(camera.fov * Math.PI / 360) * distance;
    const image = this.plane.material.map?.image as HTMLImageElement | undefined;
    const aspect = image ? image.width / image.height : 1.6;
    const fitHeight = Math.max(height, height * camera.aspect / aspect);
    this.plane.scale.set(fitHeight * aspect / 32, fitHeight / 20, 1);
    this.plane.position.copy(camera.position).addScaledVector(camera.getWorldDirection(this.forward), distance);
    this.plane.quaternion.copy(camera.quaternion);
  }
  dispose(): void {
    this.disposed = true;
    this.textures.forEach((texture) => texture.dispose());
    this.plane.geometry.dispose(); this.plane.material.dispose(); this.plane.removeFromParent();
  }
}

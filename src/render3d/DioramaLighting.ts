import { AmbientLight, DirectionalLight, Group } from 'three';
import type { Shift } from '../game/content/types';

export class DioramaLighting extends Group {
  private readonly ambient = new AmbientLight(0xffedce, 2);
  private readonly key = new DirectionalLight(0xffe0aa, 3);
  constructor() {
    super();
    this.key.position.set(-4, 9, 5);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(1024, 1024);
    Object.assign(this.key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.1, far: 30 });
    this.key.shadow.bias = -0.001;
    this.add(this.ambient, this.key);
  }
  setShift(shift: Shift, intensity = 1): void {
    this.ambient.color.setHex(shift === 'dead' ? 0xbac8ef : 0xffedce);
    this.key.color.setHex(shift === 'dead' ? 0xa0b7e8 : 0xffe0aa);
    this.ambient.intensity = (shift === 'dead' ? 1.2 : 2) * intensity;
    this.key.intensity = (shift === 'dead' ? 2 : 3) * intensity;
  }
  dispose(): void { this.key.shadow.map?.dispose(); this.removeFromParent(); }
}

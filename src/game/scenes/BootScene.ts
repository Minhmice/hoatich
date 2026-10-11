import Phaser from 'phaser';
import { characterAssets } from '../content/characterAssets';
import { flowerAssets } from '../content/flowerAssets';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('shop-day', '/assets/generated/shop/shop-day.png');
    this.load.image('shop-evening', '/assets/generated/shop/shop-evening.png');

    for (const character of Object.values(characterAssets)) {
      for (const [index, url] of character.urls.entries()) {
        this.load.image(`${character.id}-${index + 1}`, url);
      }
    }

    for (const flower of Object.values(flowerAssets)) {
      this.load.image(flower.textureKey, flower.url);
    }
  }

  create(): void {
    this.scene.start('ShopScene');
  }
}

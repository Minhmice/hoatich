import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ShopScene } from './scenes/ShopScene';

export function createGame(parent: HTMLElement): Phaser.Game {
  parent.classList.add('game-container');

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 800,
    parent,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, ShopScene],
  };

  return new Phaser.Game(config);
}

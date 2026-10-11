import './style.css';
import { createGame } from './game/createGame';

function bootstrap(): void {
  const parent =
    document.getElementById('game-container') ??
    document.getElementById('app') ??
    document.body;

  createGame(parent);
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

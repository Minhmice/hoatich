import type { ActiveView } from '../../game/GameRuntime';

export interface ViewContextProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

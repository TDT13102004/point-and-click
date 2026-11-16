import React from 'react';
import { GameSettings, SceneView } from '../state/gameState';

interface TopHeaderBarProps {
  currentView: SceneView;
  room1305Unlocked: boolean;
  demoCompleted: boolean;
  settings: GameSettings;
  onSwitchView: (view: SceneView) => void;
  onToggleShowHotspots: () => void;
  onToggleMute: () => void;
  onOpenEnding: () => void;
  onOpenTitleMenu: () => void;
  onRequestReset: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  currentView,
  room1305Unlocked,
  demoCompleted,
  settings,
  onSwitchView,
  onToggleShowHotspots,
  onToggleMute,
  onOpenEnding,
  onOpenTitleMenu,
  onRequestReset,
}) => {
  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <button
          type="button"
          className="brand-btn"
          onClick={onOpenTitleMenu}
          title="Về màn hình chính"
        >
          <span className="brand-badge">AN LINH</span>
          <span className="brand-title">Bóng Người Tầng 13</span>
        </button>
      </div>

      <nav className="top-bar-nav" aria-label="Điều hướng khu vực">
        <button
          type="button"
          className={`nav-btn ${currentView === 'station' ? 'active' : ''}`}
          onClick={() => onSwitchView('station')}
        >
          Tầng 12
        </button>
        <button
          type="button"
          className={`nav-btn ${currentView === 'corridor' ? 'active' : ''}`}
          onClick={() => onSwitchView('corridor')}
        >
          Hành lang 13
        </button>
        {room1305Unlocked && (
          <button
            type="button"
            className={`nav-btn ${currentView === 'room1305' ? 'active' : ''}`}
            onClick={() => onSwitchView('room1305')}
          >
            Căn 1305
          </button>
        )}
      </nav>

      <div className="top-bar-controls">
        {demoCompleted && (
          <button type="button" className="ctrl-btn ending-btn" onClick={onOpenEnding}>
            Kết thúc
          </button>
        )}

        <button
          type="button"
          className={`ctrl-btn ${settings.showHotspots ? 'active' : ''}`}
          onClick={onToggleShowHotspots}
          aria-pressed={settings.showHotspots}
        >
          {settings.showHotspots ? 'Ẩn điểm bấm' : 'Hiện điểm bấm'}
        </button>

        <button
          type="button"
          className={`ctrl-btn ${settings.muted ? 'muted' : ''}`}
          onClick={onToggleMute}
          aria-pressed={settings.muted}
        >
          {settings.muted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}
        </button>

        <button type="button" className="ctrl-btn danger-outline" onClick={onRequestReset}>
          Chơi lại
        </button>
      </div>
    </header>
  );
};

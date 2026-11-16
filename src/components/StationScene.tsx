import React from 'react';
import { INTEGRATION_CONFIG, SceneHotspot } from '../assets/assetRegistry';
import { QuestionId } from '../data/puzzleConfig';
import { AspectStage, StageOverlay } from './AspectStage';
import { soundManager } from '../audio/soundManager';

interface StationSceneProps {
  hauntingTriggered: boolean;
  demoCompleted: boolean;
  showHotspots: boolean;
  onGoToCorridor: () => void;
  onOpenDossier: (docId: string) => void;
  onTriggerPuzzle: (qId: QuestionId) => void;
}

export const StationScene: React.FC<StationSceneProps> = ({
  hauntingTriggered,
  demoCompleted,
  showHotspots,
  onGoToCorridor,
  onOpenDossier,
  onTriggerPuzzle,
}) => {
  const stationConfig = INTEGRATION_CONFIG.scenes.station;

  const overlays: StageOverlay[] = [];
  if (hauntingTriggered && !demoCompleted) {
    overlays.push({
      id: 'OV-SHADOW',
      box: stationConfig.shadow_box,
      opacity: 0.62,
      className: 'shadow-flicker-subtle',
    });
    overlays.push({
      id: 'OV-VIGNETTE',
      opacity: 0.42,
    });
  }

  const handleHotspotClick = (spot: SceneHotspot) => {
    soundManager.playSfx('SFX-CLICK');
    if (spot.action === 'go-corridor') {
      onGoToCorridor();
      return;
    }
    if (spot.action === 'puzzle-garage') {
      onTriggerPuzzle('Q-GARAGE');
      return;
    }
    if (spot.action === 'open-dossier') {
      soundManager.playSfx('SFX-PAPER');
      onOpenDossier('DOC-01');
      return;
    }
    if (spot.action === 'open-tools') {
      soundManager.playSfx('SFX-PAPER');
      onOpenDossier('DOC-10');
    }
  };

  return (
    <section className="scene-container scene-fade-in" aria-label="Chiếu nghỉ tầng 12">
      <div className="scene-stage-wrap">
        <AspectStage
          baseImageId={stationConfig.base}
          alt="Bàn theo dõi tại chiếu nghỉ cầu thang tầng 12"
          overlays={overlays}
          hotspots={stationConfig.hotspots}
          showHotspots={showHotspots}
          onHotspotClick={handleHotspotClick}
        />
      </div>

      <div className="scene-bottom-panel">
        <div className="dialogue-box">
          <div className="dialogue-header">
            <span className="location-tag">CHIẾU NGHỈ TẦNG 12 — KHỐI C AN VÂN</span>
            {hauntingTriggered && !demoCompleted && (
              <span className="alert-tag">CÓ BÓNG NGƯỜI ĐỨNG Ở ĐẦU CẦU THANG</span>
            )}
          </div>
          <p className="dialogue-body">
            {hauntingTriggered && !demoCompleted
              ? 'Một bóng người mờ đang đứng ở đầu cầu thang phía sau lưng bạn.'
              : 'Bàn theo dõi đặt tại chiếu nghỉ tầng 12. Đi lên cầu thang để kiểm tra hành lang tầng 13 hoặc bấm vào đồ vật trên bàn và cửa sổ.'}
          </p>
        </div>

        <div className="scene-quick-actions">
          <button
            type="button"
            className="primary-btn small-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onGoToCorridor();
            }}
          >
            ↑ Lên tầng 13
          </button>
        </div>
      </div>
    </section>
  );
};

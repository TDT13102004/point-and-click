import React, { useState } from 'react';
import { INTEGRATION_CONFIG, SceneHotspot } from '../assets/assetRegistry';
import { QuestionId } from '../data/puzzleConfig';
import { AspectStage, StageOverlay } from './AspectStage';
import { soundManager } from '../audio/soundManager';

interface CorridorSceneProps {
  unlockedDocs: string[];
  solvedQuestions: QuestionId[];
  room1305Unlocked: boolean;
  demoCompleted: boolean;
  showHotspots: boolean;
  onGoToStation: () => void;
  onGoToRoom1305: () => void;
  onCollectAndOpenDoc: (docId: string) => void;
  onTriggerPuzzle: (qId: QuestionId) => void;
}

export const CorridorScene: React.FC<CorridorSceneProps> = ({
  unlockedDocs,
  solvedQuestions,
  room1305Unlocked,
  demoCompleted,
  showHotspots,
  onGoToStation,
  onGoToRoom1305,
  onCollectAndOpenDoc,
  onTriggerPuzzle,
}) => {
  const corridorCfg = INTEGRATION_CONFIG.scenes.corridor;
  const [caption, setCaption] = useState<string>(
    'Hành lang tầng 13 tối và ẩm mốc. Dọc tường vẫn còn vết tháo dỡ của đội thợ và những cánh cửa khóa kín.'
  );

  const door1313Opened = solvedQuestions.includes('Q-WHAT') && unlockedDocs.includes('DOC-15');
  const whoSolved = solvedQuestions.includes('Q-WHO');

  const overlays: StageOverlay[] = [];
  if (!demoCompleted) {
    overlays.push({
      id: 'OV-SHADOW',
      box: corridorCfg.shadow_box,
      opacity: whoSolved ? 0.35 : 0.65,
      className: 'shadow-flicker-subtle',
    });
  }

  // Cập nhật nhãn động phù hợp trạng thái cửa trên tầng 13
  const dynamicHotspots: SceneHotspot[] = corridorCfg.hotspots
    .filter((spot) => !(demoCompleted && spot.id === 'shadow_figure'))
    .map((spot) => {
      if (spot.id === 'door1313') {
        return {
          ...spot,
          label: demoCompleted
            ? 'Phòng 1313 (Đã thanh tẩy)'
            : door1313Opened
            ? 'Phòng 1313 — Thanh tẩy tầng 13'
            : 'Cửa phòng 1313',
        };
      }
      if (spot.id === 'door1305') {
        return {
          ...spot,
          label: room1305Unlocked ? 'Vào căn 1305' : 'Cửa phòng 1305',
        };
      }
      if (spot.id === 'sheetrock_pile' && unlockedDocs.includes('DOC-07')) {
        return { ...spot, label: 'Xem lại vết khắc trên vách' };
      }
      if (spot.id === 'graffiti_wall' && unlockedDocs.includes('DOC-08')) {
        return { ...spot, label: 'Xem lại chữ Graffiti trên tường' };
      }
      return spot;
    });

  const handleHotspotClick = (spot: SceneHotspot) => {
    soundManager.playSfx('SFX-CLICK');

    if (spot.action === 'go-station') {
      onGoToStation();
      return;
    }

    if (spot.action === 'collect-scratches') {
      soundManager.playSfx('SFX-PAPER');
      setCaption('Bạn nhặt lên mảnh vách thạch cao có khắc nhiều ký tự kỳ lạ.');
      onCollectAndOpenDoc('DOC-07');
      return;
    }

    if (spot.action === 'collect-graffiti') {
      soundManager.playSfx('SFX-PAPER');
      setCaption('Trên mảng tường vừa sơn lại hiện rõ những dòng chữ vẽ nguệch ngoạc.');
      onCollectAndOpenDoc('DOC-08');
      return;
    }

    if (spot.action === 'puzzle-who') {
      onTriggerPuzzle('Q-WHO');
      return;
    }

    if (spot.action === 'door-1305') {
      if (room1305Unlocked) {
        soundManager.playSfx('SFX-CREAK');
        onGoToRoom1305();
      } else {
        onTriggerPuzzle('Q-READ');
      }
      return;
    }

    if (spot.action === 'door-1313') {
      if (demoCompleted) {
        setCaption('Không khí quanh phòng 1313 đã hoàn toàn nhẹ nhõm.');
        onCollectAndOpenDoc('DOC-16');
      } else if (door1313Opened) {
        onTriggerPuzzle('Q-CLEANSE');
      } else {
        onTriggerPuzzle('Q-WHAT');
      }
      return;
    }

    if (spot.action === 'inspect-1307') {
      setCaption('Cửa phòng 1307 khóa chặt, không có dấu hiệu bất thường.');
    }
  };

  return (
    <section className="scene-container scene-fade-in" aria-label="Hành lang tầng 13">
      <div className="scene-stage-wrap">
        <AspectStage
          baseImageId={corridorCfg.base}
          alt="Hành lang tầng 13 khối C"
          overlays={overlays}
          hotspots={dynamicHotspots}
          showHotspots={showHotspots}
          onHotspotClick={handleHotspotClick}
        >
          {corridorCfg.doorPlates.map((plate) => (
            <div
              key={plate.room}
              className="cctv-door-plate"
              style={{
                left: `${plate.rect[0] * 100}%`,
                top: `${plate.rect[1] * 100}%`,
                width: `${plate.rect[2] * 100}%`,
                height: `${plate.rect[3] * 100}%`,
              }}
            >
              {plate.room}
            </div>
          ))}
        </AspectStage>
      </div>

      <div className="scene-bottom-panel">
        <div className="dialogue-box">
          <div className="dialogue-header">
            <span className="location-tag">HÀNH LANG TẦNG 13 — KHỐI C AN VÂN</span>
          </div>
          <p className="dialogue-body">{caption}</p>
        </div>

        <div className="scene-quick-actions">
          <button
            type="button"
            className="secondary-btn small-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onGoToStation();
            }}
          >
            ↓ Xuống tầng 12
          </button>
          {room1305Unlocked && (
            <button
              type="button"
              className="primary-btn small-btn"
              onClick={() => {
                soundManager.playSfx('SFX-CREAK');
                onGoToRoom1305();
              }}
            >
              Vào căn 1305 →
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

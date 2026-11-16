import React, { useEffect, useState } from 'react';
import { INTEGRATION_CONFIG, SceneHotspot } from '../assets/assetRegistry';
import { HatchState } from '../state/gameState';
import { AspectStage, StageOverlay } from './AspectStage';
import { soundManager } from '../audio/soundManager';

interface Room1305SceneProps {
  inspectedHotspots: string[];
  hatchCloseupOpen: boolean;
  hatchState: HatchState;
  hasRedBook: boolean;
  hauntingTriggered: boolean;
  doorwayShadowInspected: boolean;
  showHotspots: boolean;
  onInspectHotspot: (hotspotId: string) => void;
  onOpenHatchCloseup: () => void;
  onCloseHatchCloseup: () => void;
  onAdvanceHatchToOpen: () => void;
  onTakeRedBook: () => void;
  onInspectDoorwayShadow: () => void;
  onGoToCorridor: () => void;
}

export const Room1305Scene: React.FC<Room1305SceneProps> = ({
  inspectedHotspots,
  hatchCloseupOpen,
  hatchState,
  hasRedBook,
  hauntingTriggered,
  doorwayShadowInspected,
  showHotspots,
  onInspectHotspot,
  onOpenHatchCloseup,
  onCloseHatchCloseup,
  onAdvanceHatchToOpen,
  onTakeRedBook,
  onInspectDoorwayShadow,
  onGoToCorridor,
}) => {
  const [caption, setCaption] = useState<string>(
    'Căn hộ 1305 bỏ trống nhiều năm với lớp bụi dày trên nền gạch và bức tường vàng kem bong tróc.'
  );
  const [knockCount, setKnockCount] = useState(0);

  useEffect(() => {
    return () => {
      soundManager.clearKnockTimers();
    };
  }, []);

  const roomCfg = INTEGRATION_CONFIG.scenes.room1305;
  const showDoorwayShadow = hauntingTriggered && !doorwayShadowInspected;

  const roomOverlays: StageOverlay[] = [];
  if (hauntingTriggered) {
    roomOverlays.push({ id: 'OV-VIGNETTE', opacity: 0.35 });
  }
  if (showDoorwayShadow) {
    roomOverlays.push({
      id: 'OV-SHADOW',
      box: roomCfg.shadow_box,
      opacity: 0.55,
      className: 'shadow-flicker-subtle',
    });
  }

  const triggerKnockSequence = () => {
    setKnockCount(0);
    soundManager.playKnocksWithVisualCues(
      (idx) => setKnockCount(idx),
      () => {
        window.setTimeout(() => setKnockCount(0), 1200);
      }
    );
  };

  const handleHotspotClick = (spot: SceneHotspot) => {
    if (spot.id === 'window') {
      soundManager.playSfx('SFX-CLICK');
      onInspectHotspot('window');
      setCaption(
        'Cửa sổ khung gỗ có song sắt nhìn ra sân khu tập thể. Đèn tuýp vẫn sáng lờ mờ.'
      );
      return;
    }

    if (spot.id === 'table') {
      soundManager.playSfx('SFX-CLICK');
      onInspectHotspot('table');
      setCaption(
        'Bàn gỗ nhỏ giữa hai ghế nhựa xanh tím phủ đầy bụi. Có dấu cốc cũ để lại từ lâu.'
      );
      return;
    }

    if (spot.id === 'bedroom') {
      soundManager.playSfx('SFX-CREAK');
      onInspectHotspot('bedroom');
      if (showDoorwayShadow) {
        onInspectDoorwayShadow();
        setCaption('Bóng người ở khuôn cửa phòng ngủ vừa lùi vào bóng tối rồi biến mất.');
      } else {
        setCaption('Bên trong phòng ngủ chỉ có chiếc giường gỗ đệm mỏng tối om.');
      }
      return;
    }

    if (spot.id === 'hatch') {
      onInspectHotspot('hatch');
      if (hatchState === 'closed') {
        triggerKnockSequence();
        setCaption('Từ sau nắp ô kỹ thuật vang lên ba tiếng gõ.');
      } else if (hatchState === 'open') {
        soundManager.playSfx('SFX-CLICK');
        setCaption('Bên trong ô kỹ thuật có một cuốn sách bìa đỏ.');
      } else {
        soundManager.playSfx('SFX-CLICK');
        setCaption('Ô kỹ thuật trên vách hiện đã trống.');
      }
      onOpenHatchCloseup();
    }
  };

  const hatchAssetId =
    hatchState === 'closed'
      ? 'CL-HATCH-CLOSED'
      : hatchState === 'open'
      ? 'CL-HATCH-OPEN'
      : 'CL-HATCH-EMPTY';

  return (
    <section className="scene-container scene-fade-in" aria-label="Căn hộ 1305">
      <div className="scene-stage-wrap">
        {!hatchCloseupOpen ? (
          <AspectStage
            baseImageId={roomCfg.base}
            alt="Phòng sinh hoạt căn hộ 1305"
            overlays={roomOverlays}
            hotspots={roomCfg.hotspots}
            showHotspots={showHotspots}
            inspectedHotspotIds={inspectedHotspots}
            onHotspotClick={handleHotspotClick}
          />
        ) : (
          <AspectStage
            baseImageId={hatchAssetId}
            alt="Cận cảnh ô kỹ thuật căn 1305"
            overlays={hauntingTriggered ? [{ id: 'OV-VIGNETTE', opacity: 0.25 }] : []}
          >
            {knockCount > 0 && (
              <div className="knock-visual-banner" role="status" aria-live="polite">
                {Array.from({ length: knockCount }, (_, i) => (
                  <span key={i} className="knock-pulse-word">
                    CỐC!
                  </span>
                ))}
              </div>
            )}

            {hatchState === 'closed' && (
              <button
                type="button"
                className="closeup-action-hotspot"
                style={{ left: '26%', top: '8%', width: '48%', height: '84%' }}
                onClick={() => {
                  soundManager.playSfx('SFX-CREAK');
                  onAdvanceHatchToOpen();
                  setCaption('Nắp ô kỹ thuật bật ra. Bên trong có một cuốn sách bìa đỏ cũ.');
                }}
                aria-label="Mở nắp ô kỹ thuật"
              >
                <span className="closeup-tag">Mở nắp ô kỹ thuật</span>
              </button>
            )}

            {hatchState === 'open' && !hasRedBook && (
              <button
                type="button"
                className="closeup-action-hotspot"
                style={{ left: '30%', top: '54%', width: '40%', height: '29%' }}
                onClick={() => {
                  soundManager.playSfx('SFX-PAPER');
                  onTakeRedBook();
                  setCaption('Bạn đã nhặt cuốn sách bìa đỏ cất vào túi đồ.');
                }}
                aria-label="Lấy cuốn sách đỏ"
              >
                <span className="closeup-tag">Lấy cuốn sách đỏ</span>
              </button>
            )}
          </AspectStage>
        )}
      </div>

      <div className="scene-bottom-panel">
        <div className="dialogue-box">
          <div className="dialogue-header">
            <span className="location-tag">
              CĂN HỘ 1305 — {hatchCloseupOpen ? 'Ô KỸ THUẬT' : 'PHÒNG SINH HOẠT'}
            </span>
          </div>
          <p className="dialogue-body">{caption}</p>
        </div>

        <div className="scene-quick-actions">
          {hatchCloseupOpen ? (
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => {
                soundManager.playSfx('SFX-CLICK');
                onCloseHatchCloseup();
              }}
            >
              ← Quay lại phòng
            </button>
          ) : (
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => {
                soundManager.playSfx('SFX-CREAK');
                onGoToCorridor();
              }}
            >
              ← Ra hành lang tầng 13
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

import React, { useCallback, useEffect, useState } from 'react';
import { getAssetPath, INTEGRATION_CONFIG } from './assets/assetRegistry';
import { soundManager } from './audio/soundManager';
import { CorridorScene } from './components/CorridorScene';
import { DemoEndingModal } from './components/DemoEndingModal';
import { DossierModal } from './components/DossierModal';
import { InventoryBar } from './components/InventoryBar';
import { PuzzlePromptModal } from './components/PuzzlePromptModal';
import { RedBookModal } from './components/RedBookModal';
import { Room1305Scene } from './components/Room1305Scene';
import { StationScene } from './components/StationScene';
import { TopHeaderBar } from './components/TopHeaderBar';
import { INVESTIGATION_PUZZLES, QuestionId } from './data/puzzleConfig';
import {
  clearSavedState,
  GameState,
  INITIAL_GAME_STATE,
  loadSavedState,
  saveGameState,
  SceneView,
} from './state/gameState';

export const App: React.FC = () => {
  const [{ state: initialState }] = useState(() => loadSavedState());
  const [state, setState] = useState<GameState>(initialState);
  const [titleMenuOpen, setTitleMenuOpen] = useState<boolean>(() => !initialState.hasStarted);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  const [activePuzzleId, setActivePuzzleId] = useState<QuestionId | null>(null);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  useEffect(() => {
    soundManager.updateSettings({
      muted: state.settings.muted,
      volume: INTEGRATION_CONFIG.audio.defaultVolume,
    });
  }, [state.settings.muted]);

  const handleStartGame = () => {
    soundManager.unlockAndStartAmbience();
    soundManager.playSfx('SFX-CLICK');
    setState((prev) => ({
      ...prev,
      hasStarted: true,
    }));
    setTitleMenuOpen(false);
  };

  const handleConfirmReset = () => {
    soundManager.stopAllPlayback();
    clearSavedState();
    const fresh: GameState = {
      ...INITIAL_GAME_STATE,
      hasStarted: true,
      settings: state.settings,
    };
    setState(fresh);
    setActivePuzzleId(null);
    setResetConfirmOpen(false);
    setTitleMenuOpen(false);
    soundManager.playSfx('SFX-CLICK');
  };

  const handleSwitchView = useCallback((view: SceneView) => {
    soundManager.unlockAndStartAmbience();
    setState((prev) => {
      if (view === 'room1305' && !prev.room1305Unlocked) return prev;
      return {
        ...prev,
        currentView: view,
        hatchCloseupOpen: view === 'room1305' ? prev.hatchCloseupOpen : false,
      };
    });
  }, []);

  const handleCollectAndOpenDoc = useCallback((docId: string) => {
    soundManager.unlockAndStartAmbience();
    setActivePuzzleId(null);
    setState((prev) => {
      const unlockedDocs = prev.unlockedDocs.includes(docId)
        ? prev.unlockedDocs
        : [...prev.unlockedDocs, docId];
      return {
        ...prev,
        unlockedDocs,
        activeDocId: docId,
        bookModalOpen: false,
        endingModalOpen: false,
      };
    });
  }, []);

  const handleOpenDoc = useCallback((docId: string) => {
    soundManager.unlockAndStartAmbience();
    setActivePuzzleId(null);
    setState((prev) => {
      if (!prev.unlockedDocs.includes(docId)) return prev;
      return {
        ...prev,
        activeDocId: docId,
        bookModalOpen: false,
        endingModalOpen: false,
      };
    });
  }, []);

  const handleMarkDocViewed = useCallback((docId: string) => {
    setState((prev) => {
      if (prev.viewedDocs.includes(docId)) return prev;
      return {
        ...prev,
        viewedDocs: [...prev.viewedDocs, docId],
      };
    });
  }, []);

  const handleSolveQuestion = useCallback((qId: QuestionId) => {
    const puzzle = INVESTIGATION_PUZZLES[qId];
    setState((prev) => {
      if (prev.solvedQuestions.includes(qId)) return prev;
      const solvedQuestions = [...prev.solvedQuestions, qId];
      const unlockedDocs =
        puzzle.unlockedDocId && !prev.unlockedDocs.includes(puzzle.unlockedDocId)
          ? [...prev.unlockedDocs, puzzle.unlockedDocId]
          : prev.unlockedDocs;
      const room1305Unlocked = prev.room1305Unlocked || Boolean(puzzle.unlocksRoom1305);
      const demoCompleted = prev.demoCompleted || Boolean(puzzle.completesGame);

      return {
        ...prev,
        solvedQuestions,
        unlockedDocs,
        room1305Unlocked,
        demoCompleted,
      };
    });
  }, []);

  const handleInspectHotspot = useCallback((hotspotId: string) => {
    setState((prev) => ({
      ...prev,
      inspectedRoomHotspots: prev.inspectedRoomHotspots.includes(hotspotId)
        ? prev.inspectedRoomHotspots
        : [...prev.inspectedRoomHotspots, hotspotId],
    }));
  }, []);

  const handleTakeRedBook = useCallback(() => {
    setState((prev) => {
      if (!prev.room1305Unlocked || prev.hasRedBook || prev.hatchState === 'empty') return prev;
      const unlockedDocs = prev.unlockedDocs.includes('DOC-13')
        ? prev.unlockedDocs
        : [...prev.unlockedDocs, 'DOC-13'];
      return {
        ...prev,
        hatchState: 'empty',
        hasRedBook: true,
        bookModalOpen: true,
        hauntingTriggered: true,
        unlockedDocs,
      };
    });
  }, []);

  return (
    <div className="app-shell">
      <TopHeaderBar
        currentView={state.currentView}
        room1305Unlocked={state.room1305Unlocked}
        demoCompleted={state.demoCompleted}
        settings={state.settings}
        onSwitchView={handleSwitchView}
        onToggleShowHotspots={() => {
          soundManager.playSfx('SFX-CLICK');
          setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, showHotspots: !prev.settings.showHotspots },
          }));
        }}
        onToggleMute={() => {
          soundManager.unlockAndStartAmbience();
          setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, muted: !prev.settings.muted },
          }));
        }}
        onOpenEnding={() => {
          soundManager.playSfx('SFX-CLICK');
          setState((prev) => ({ ...prev, endingModalOpen: true }));
        }}
        onOpenTitleMenu={() => {
          soundManager.playSfx('SFX-CLICK');
          setTitleMenuOpen(true);
        }}
        onRequestReset={() => {
          soundManager.playSfx('SFX-CLICK');
          setResetConfirmOpen(true);
        }}
      />

      <main className="main-stage">
        {state.currentView === 'station' && (
          <StationScene
            key="station"
            hauntingTriggered={state.hauntingTriggered}
            demoCompleted={state.demoCompleted}
            showHotspots={state.settings.showHotspots}
            onGoToCorridor={() => handleSwitchView('corridor')}
            onOpenDossier={handleOpenDoc}
            onTriggerPuzzle={(qId) => setActivePuzzleId(qId)}
          />
        )}

        {state.currentView === 'corridor' && (
          <CorridorScene
            key="corridor"
            unlockedDocs={state.unlockedDocs}
            solvedQuestions={state.solvedQuestions}
            room1305Unlocked={state.room1305Unlocked}
            demoCompleted={state.demoCompleted}
            showHotspots={state.settings.showHotspots}
            onGoToStation={() => handleSwitchView('station')}
            onGoToRoom1305={() => handleSwitchView('room1305')}
            onCollectAndOpenDoc={handleCollectAndOpenDoc}
            onTriggerPuzzle={(qId) => setActivePuzzleId(qId)}
          />
        )}

        {state.currentView === 'room1305' && (
          <Room1305Scene
            key="room1305"
            inspectedHotspots={state.inspectedRoomHotspots}
            hatchCloseupOpen={state.hatchCloseupOpen}
            hatchState={state.hatchState}
            hasRedBook={state.hasRedBook}
            hauntingTriggered={state.hauntingTriggered}
            doorwayShadowInspected={state.doorwayShadowInspected}
            showHotspots={state.settings.showHotspots}
            onInspectHotspot={handleInspectHotspot}
            onOpenHatchCloseup={() => setState((prev) => ({ ...prev, hatchCloseupOpen: true }))}
            onCloseHatchCloseup={() => setState((prev) => ({ ...prev, hatchCloseupOpen: false }))}
            onAdvanceHatchToOpen={() =>
              setState((prev) => ({
                ...prev,
                hatchState: prev.hatchState === 'closed' ? 'open' : prev.hatchState,
              }))
            }
            onTakeRedBook={handleTakeRedBook}
            onInspectDoorwayShadow={() =>
              setState((prev) => ({ ...prev, doorwayShadowInspected: true }))
            }
            onGoToCorridor={() => handleSwitchView('corridor')}
          />
        )}
      </main>

      <InventoryBar
        unlockedDocs={state.unlockedDocs}
        viewedDocs={state.viewedDocs}
        hasRedBook={state.hasRedBook}
        onOpenDossierGroup={handleOpenDoc}
        onOpenDoc={handleOpenDoc}
        onOpenRedBookModal={() => setState((prev) => ({ ...prev, bookModalOpen: true }))}
      />

      <DossierModal
        activeDocId={state.activeDocId}
        unlockedDocs={state.unlockedDocs}
        viewedDocs={state.viewedDocs}
        onSelectDoc={(docId) => setState((prev) => ({ ...prev, activeDocId: docId }))}
        onMarkDocViewed={handleMarkDocViewed}
        onClose={() => setState((prev) => ({ ...prev, activeDocId: null }))}
      />

      <PuzzlePromptModal
        questionId={activePuzzleId}
        state={state}
        onClose={() => setActivePuzzleId(null)}
        onSolveQuestion={handleSolveQuestion}
        onOpenDoc={handleOpenDoc}
        onEnterRoom1305={() => {
          setActivePuzzleId(null);
          handleSwitchView('room1305');
        }}
        onOpenEnding={() => {
          setActivePuzzleId(null);
          setState((prev) => ({ ...prev, endingModalOpen: true }));
        }}
      />

      <RedBookModal
        isOpen={state.bookModalOpen}
        onClose={() => setState((prev) => ({ ...prev, bookModalOpen: false }))}
        onOpenDoc13={() => handleOpenDoc('DOC-13')}
      />

      <DemoEndingModal
        isOpen={state.endingModalOpen}
        onViewDoc16={() => handleOpenDoc('DOC-16')}
        onCloseReview={() => setState((prev) => ({ ...prev, endingModalOpen: false }))}
        onRequestRestart={() => setResetConfirmOpen(true)}
      />

      {titleMenuOpen && (
        <div
          className="modal-backdrop title-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-title-heading"
        >
          <div
            className="title-bg-preview"
            style={{ backgroundImage: `url(${getAssetPath('BG-STATION')})` }}
            aria-hidden="true"
          />
          <div className="modal-card title-card">
            <div className="title-eyebrow">NHÓM AN LINH • KHỐI C AN VÂN</div>
            <h1 id="game-title-heading">AN LINH — BÓNG NGƯỜI TẦNG 13</h1>
            <p className="title-subtitle">Khu tập thể An Vân, Hà Nội</p>

            <div className="title-briefing">
              <p>
                Các gia đình tại khối C khu tập thể An Vân nhờ nhóm An Linh kiểm tra tầng 13 bỏ
                trống sau khi đội thợ tháo vách nhìn thấy hai bóng người lạ lướt qua hành lang.
              </p>
              <p>
                Bạn đặt bàn theo dõi ở chiếu nghỉ tầng 12. Hãy khám xét từng khu vực, nhặt các vật
                chứng trên tầng 13 và mở túi đồ bên dưới để xem tài liệu bất kỳ lúc nào.
              </p>
            </div>

            <div className="title-actions">
              <button type="button" className="primary-btn large-btn" onClick={handleStartGame}>
                {state.hasStarted ? 'Tiếp tục điều tra' : 'Bắt đầu điều tra'}
              </button>

              {state.hasStarted && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    soundManager.playSfx('SFX-CLICK');
                    setResetConfirmOpen(true);
                  }}
                >
                  Chơi lại từ đầu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {resetConfirmOpen && (
        <div
          className="modal-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
        >
          <div className="modal-card confirm-modal">
            <h2 id="reset-confirm-title">Xác nhận chơi lại từ đầu?</h2>
            <p>Toàn bộ tiến độ hiện tại sẽ bị xóa để bắt đầu lại từ đầu.</p>
            <div className="modal-footer">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  soundManager.playSfx('SFX-CLICK');
                  setResetConfirmOpen(false);
                }}
              >
                Hủy
              </button>
              <button type="button" className="danger-btn" onClick={handleConfirmReset}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

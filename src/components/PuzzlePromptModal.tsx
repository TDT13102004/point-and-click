import React, { useEffect, useState } from 'react';
import {
  INVESTIGATION_PUZZLES,
  isQuestionAvailable,
  normalizePuzzleAnswer,
  QuestionId,
} from '../data/puzzleConfig';
import { GameState } from '../state/gameState';
import { soundManager } from '../audio/soundManager';

interface PuzzlePromptModalProps {
  questionId: QuestionId | null;
  state: GameState;
  onClose: () => void;
  onSolveQuestion: (qId: QuestionId) => void;
  onOpenDoc: (docId: string) => void;
  onEnterRoom1305: () => void;
  onOpenEnding: () => void;
}

export const PuzzlePromptModal: React.FC<PuzzlePromptModalProps> = ({
  questionId,
  state,
  onClose,
  onSolveQuestion,
  onOpenDoc,
  onEnterRoom1305,
  onOpenEnding,
}) => {
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setAnswer('');
    setErrorMsg(null);
  }, [questionId]);

  if (!questionId) return null;

  const puzzle = INVESTIGATION_PUZZLES[questionId];
  const isSolved = state.solvedQuestions.includes(questionId);
  const available = isQuestionAvailable(questionId, {
    solvedQuestions: state.solvedQuestions,
    unlockedDocs: state.unlockedDocs,
    hasRedBook: state.hasRedBook,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!available || isSolved) return;

    const normalized = normalizePuzzleAnswer(answer);
    if (!normalized) {
      soundManager.playSfx('SFX-CLICK');
      setErrorMsg('Vui lòng nhập đáp án.');
      return;
    }

    if (normalized === puzzle.canonicalAnswer) {
      soundManager.playSfx('SFX-PAPER');
      setErrorMsg(null);
      setAnswer('');
      onSolveQuestion(questionId);
    } else {
      soundManager.playSfx('SFX-CLICK');
      setErrorMsg('Chưa chính xác. Hãy kiểm tra lại các tư liệu trong túi đồ.');
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="puzzle-modal-title">
      <div className="modal-card puzzle-prompt-modal">
        <div className="modal-header">
          <h2 id="puzzle-modal-title">{puzzle.promptTitle}</h2>
          <button
            type="button"
            className="close-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onClose();
            }}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <blockquote className="question-original-prompt">“{puzzle.originalPrompt}”</blockquote>

        {!available && !isSolved && (
          <div className="puzzle-feedback warning" role="status">
            <p>{puzzle.lockedReason}</p>
          </div>
        )}

        {available && !isSolved && (
          <form className="question-answer-form" onSubmit={handleSubmit}>
            <p className="question-format-hint">{puzzle.formatLabel}</p>
            <div className="answer-input-row">
              <input
                type="text"
                className="answer-text-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập đáp án..."
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
              <button type="submit" className="primary-btn">
                Xác nhận
              </button>
            </div>
            {errorMsg && (
              <div className="puzzle-feedback warning" role="status">
                <p>{errorMsg}</p>
              </div>
            )}
          </form>
        )}

        {isSolved && (
          <div className="puzzle-feedback success" role="status">
            <p>{puzzle.successMessage}</p>
            <div className="feedback-actions">
              {puzzle.unlocksRoom1305 && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    soundManager.playSfx('SFX-CREAK');
                    onEnterRoom1305();
                  }}
                >
                  Bước vào Căn 1305 →
                </button>
              )}
              {puzzle.unlockedDocId && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    soundManager.playSfx('SFX-PAPER');
                    onOpenDoc(puzzle.unlockedDocId!);
                  }}
                >
                  Xem vật chứng vừa thu được →
                </button>
              )}
              {puzzle.completesGame && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    soundManager.playSfx('SFX-CLICK');
                    onOpenEnding();
                  }}
                >
                  Kết thúc vụ án
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

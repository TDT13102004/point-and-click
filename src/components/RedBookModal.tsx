import React from 'react';
import { getAssetPath } from '../assets/assetRegistry';
import { getOriginalDocById } from '../data/storyData';
import { soundManager } from '../audio/soundManager';

interface RedBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDoc13: () => void;
}

export const RedBookModal: React.FC<RedBookModalProps> = ({
  isOpen,
  onClose,
  onOpenDoc13,
}) => {
  if (!isOpen) return null;

  const doc13 = getOriginalDocById('DOC-13');

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="red-book-title">
      <div className="modal-card book-modal">
        <div className="modal-header">
          <div>
            <h2 id="red-book-title">Cuốn sách bìa đỏ (INCANTATIONS)</h2>
          </div>
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

        <div className="book-modal-body">
          <div className="book-visual-col">
            <div className="book-prop-frame">
              <img
                src={getAssetPath('PROP-RED-BOOK')}
                alt="Cuốn sách bìa đỏ cũ"
                className="book-prop-img"
              />
            </div>
          </div>

          <div className="book-note-col">
            <div className="paper-note-sheet">
              <div className="paper-note-header">
                <h3>Mảnh giấy kẹp bên trong</h3>
              </div>
              {doc13?.viSupportParagraphs.map((line, i) => (
                <p key={i} className={i >= 2 ? 'paper-note-clue-line' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc13();
            }}
          >
            Xem bản ảnh gốc →
          </button>
        </div>
      </div>
    </div>
  );
};

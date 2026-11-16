import React, { useEffect, useRef, useState } from 'react';
import { getOriginalDocById, ORIGINAL_DOCUMENTS } from '../data/storyData';
import { soundManager } from '../audio/soundManager';

interface DossierModalProps {
  activeDocId: string | null;
  unlockedDocs: string[];
  viewedDocs: string[];
  onSelectDoc: (docId: string) => void;
  onMarkDocViewed: (docId: string) => void;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  activeDocId,
  unlockedDocs,
  viewedDocs,
  onSelectDoc,
  onMarkDocViewed,
  onClose,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    sl: number;
    st: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    sl: 0,
    st: 0,
  });

  const visibleDocuments = ORIGINAL_DOCUMENTS.filter((doc) => unlockedDocs.includes(doc.id));
  const activeDoc = activeDocId ? getOriginalDocById(activeDocId) : undefined;

  useEffect(() => {
    if (activeDoc && unlockedDocs.includes(activeDoc.id) && !viewedDocs.includes(activeDoc.id)) {
      onMarkDocViewed(activeDoc.id);
    }
  }, [activeDoc, unlockedDocs, viewedDocs, onMarkDocViewed]);

  useEffect(() => {
    setZoom(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeDocId]);

  if (!activeDocId || !activeDoc) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el || zoom <= 1) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      sl: el.scrollLeft,
      st: el.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el || !dragState.current.active) return;
    el.scrollLeft = dragState.current.sl - (e.clientX - dragState.current.startX);
    el.scrollTop = dragState.current.st - (e.clientY - dragState.current.startY);
  };

  const handleMouseUp = () => {
    dragState.current.active = false;
  };

  return (
    <div
      className="modal-backdrop dossier-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
    >
      <div className="modal-card dossier-modal">
        <div className="modal-header">
          <div>
            <h2 id="dossier-title">{activeDoc.title}</h2>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onClose();
            }}
            aria-label="Đóng tài liệu"
          >
            ×
          </button>
        </div>

        <div className="dossier-tabs-strip" role="tablist" aria-label="Danh sách tài liệu đang có">
          {visibleDocuments.map((doc) => (
            <button
              key={doc.id}
              type="button"
              role="tab"
              aria-selected={doc.id === activeDoc.id}
              className={`dossier-tab-pill ${doc.id === activeDoc.id ? 'active' : ''}`}
              onClick={() => {
                soundManager.playSfx('SFX-PAPER');
                onSelectDoc(doc.id);
              }}
            >
              {doc.shortTitle}
            </button>
          ))}
        </div>

        <div className="doc-viewer-toolbar">
          <div className="zoom-controls">
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => setZoom(1)}
              disabled={zoom === 1}
            >
              Vừa khung
            </button>
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
              disabled={zoom <= 0.75}
            >
              Thu nhỏ (-)
            </button>
            <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className="secondary-btn small-btn"
              onClick={() => setZoom((z) => Math.min(2.25, +(z + 0.25).toFixed(2)))}
              disabled={zoom >= 2.25}
            >
              Phóng to (+)
            </button>
          </div>

          <div className="reader-extra-controls">
            <button
              type="button"
              className={`secondary-btn small-btn ${showTranslation ? 'active' : ''}`}
              aria-pressed={showTranslation}
              onClick={() => {
                soundManager.playSfx('SFX-PAPER');
                setShowTranslation((v) => !v);
              }}
            >
              {showTranslation ? 'Ẩn bản dịch' : 'Bản dịch tiếng Việt'}
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className={`doc-image-scroll-area dossier-scroll-area ${zoom > 1 ? 'can-drag' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="doc-image-canvas" style={{ width: `${zoom * 100}%` }}>
            <img
              src={activeDoc.imagePath}
              alt={activeDoc.title}
              className="original-doc-img"
              draggable={false}
            />
          </div>
        </div>

        {showTranslation && (
          <div className="doc-translation-drawer">
            <h4>{activeDoc.viSupportTitle}</h4>
            {activeDoc.viSupportParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

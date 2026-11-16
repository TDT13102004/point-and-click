import React from 'react';
import { getAssetPath } from '../assets/assetRegistry';
import { ORIGINAL_DOCUMENTS } from '../data/storyData';
import { soundManager } from '../audio/soundManager';

interface InventoryBarProps {
  unlockedDocs: string[];
  viewedDocs: string[];
  hasRedBook: boolean;
  onOpenDossierGroup: (defaultDocId: string) => void;
  onOpenDoc: (docId: string) => void;
  onOpenRedBookModal: () => void;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({
  unlockedDocs,
  viewedDocs,
  hasRedBook,
  onOpenDossierGroup,
  onOpenDoc,
  onOpenRedBookModal,
}) => {
  const hasUnviewedDossier = ['DOC-01', 'DOC-02', 'DOC-03', 'DOC-06'].some(
    (id) => unlockedDocs.includes(id) && !viewedDocs.includes(id)
  );
  const hasEvp2 = unlockedDocs.includes('DOC-12');
  const hasScratches = unlockedDocs.includes('DOC-07');
  const hasGraffiti = unlockedDocs.includes('DOC-08');
  const hasVinyl = unlockedDocs.includes('DOC-14');
  const hasLetter1313 = unlockedDocs.includes('DOC-15');
  const hasEndingDoc = unlockedDocs.includes('DOC-16');

  const countCollected = unlockedDocs.filter((id) =>
    ORIGINAL_DOCUMENTS.some((d) => d.id === id)
  ).length;

  return (
    <aside className="inventory-bar" aria-label="Túi đồ điều tra">
      <div className="inventory-label">
        TÚI ĐỒ ({countCollected})
      </div>

      <div className="inventory-slots" role="list">
        {/* Các trang bị điều tra mang theo ban đầu */}
        <button
          type="button"
          className="inv-slot"
          onClick={() => {
            soundManager.playSfx('SFX-PAPER');
            onOpenDossierGroup('DOC-01');
          }}
        >
          <img src={getAssetPath('ICON-FOLDER')} alt="" className="inv-slot-icon" />
          <span>Hồ sơ vụ án</span>
          {hasUnviewedDossier && <span className="inv-dot" aria-label="Có mục mới" />}
        </button>

        <button
          type="button"
          className="inv-slot"
          onClick={() => {
            soundManager.playSfx('SFX-CLICK');
            onOpenDoc(hasEvp2 ? 'DOC-12' : 'DOC-09');
          }}
        >
          <img src={getAssetPath('ICON-RECORDER')} alt="" className="inv-slot-icon" />
          <span>{hasEvp2 ? 'Máy ghi âm (2 băng)' : 'Máy ghi âm EVP'}</span>
          {hasEvp2 && !viewedDocs.includes('DOC-12') && <span className="inv-dot" />}
        </button>

        <button
          type="button"
          className="inv-slot"
          onClick={() => {
            soundManager.playSfx('SFX-PAPER');
            onOpenDoc('DOC-10');
          }}
        >
          <img src={getAssetPath('ICON-NOTES')} alt="" className="inv-slot-icon" />
          <span>Bảng dụng cụ</span>
        </button>

        {/* Các vật chứng thu thập tại hiện trường */}
        {hasScratches && (
          <button
            type="button"
            className="inv-slot collected"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc('DOC-07');
            }}
          >
            <img src={getAssetPath('ICON-NOTES')} alt="" className="inv-slot-icon" />
            <span>Mảnh vách khắc</span>
          </button>
        )}

        {hasGraffiti && (
          <button
            type="button"
            className="inv-slot collected"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc('DOC-08');
            }}
          >
            <img src={getAssetPath('ICON-NOTES')} alt="" className="inv-slot-icon" />
            <span>Ảnh Graffiti</span>
          </button>
        )}

        {hasRedBook && (
          <button
            type="button"
            className="inv-slot collected special"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenRedBookModal();
            }}
          >
            <img src={getAssetPath('PROP-RED-BOOK')} alt="" className="inv-slot-icon" />
            <span>Sách đỏ</span>
          </button>
        )}

        {hasVinyl && (
          <button
            type="button"
            className="inv-slot collected"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc('DOC-14');
            }}
          >
            <img src={getAssetPath('ICON-BOOK')} alt="" className="inv-slot-icon" />
            <span>Đĩa than cũ</span>
          </button>
        )}

        {hasLetter1313 && (
          <button
            type="button"
            className="inv-slot collected"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc('DOC-15');
            }}
          >
            <img src={getAssetPath('ICON-NOTES')} alt="" className="inv-slot-icon" />
            <span>Bức thư 1313</span>
          </button>
        )}

        {hasEndingDoc && (
          <button
            type="button"
            className="inv-slot collected"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onOpenDoc('DOC-16');
            }}
          >
            <img src={getAssetPath('ICON-BOOK')} alt="" className="inv-slot-icon" />
            <span>Hồ sơ kết thúc</span>
          </button>
        )}
      </div>
    </aside>
  );
};

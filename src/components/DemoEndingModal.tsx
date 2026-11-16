import React from 'react';
import { soundManager } from '../audio/soundManager';

interface DemoEndingModalProps {
  isOpen: boolean;
  onViewDoc16: () => void;
  onCloseReview: () => void;
  onRequestRestart: () => void;
}

export const DemoEndingModal: React.FC<DemoEndingModalProps> = ({
  isOpen,
  onViewDoc16,
  onCloseReview,
  onRequestRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ending-title">
      <div className="modal-card ending-modal">
        <div className="ending-banner">AN LINH — BÓNG NGƯỜI TẦNG 13</div>
        <h2 id="ending-title">VỤ ÁN KHÉP LẠI</h2>

        <div className="ending-story-box">
          <p>
            Nghi thức thanh tẩy hoàn tất ngay tại căn phòng 1313. Thực thể tà ác bị trục xuất,
            còn hai bóng người bước ra từ căn 1305, hòa vào nhau thì thầm “Cảm ơn” rồi tan biến.
          </p>
          <p>Tầng 13 khối C khu tập thể An Vân cuối cùng đã yên tĩnh trở lại.</p>
        </div>

        <div className="modal-footer ending-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              soundManager.playSfx('SFX-PAPER');
              onViewDoc16();
            }}
          >
            Đọc hồ sơ kết thúc
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onCloseReview();
            }}
          >
            Xem lại hiện trường
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              soundManager.playSfx('SFX-CLICK');
              onRequestRestart();
            }}
          >
            Chơi lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
};

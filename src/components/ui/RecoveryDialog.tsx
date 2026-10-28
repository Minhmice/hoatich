'use client';


export interface RecoveryDialogProps {
  message: string | null;
  onReset: () => void;
  onKeep: () => void;
}

export function RecoveryDialog({ message, onReset, onKeep }: RecoveryDialogProps) {
  if (!message) return null;

  return (
    <div className="recovery-overlay" role="presentation">
      <div
        className="recovery-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label="Khôi phục dữ liệu lưu"
        tabIndex={-1}
      >
        <h2 className="recovery-title">Sự cố khôi phục bản lưu</h2>
        <p className="recovery-detail">{message}</p>
        <div className="recovery-actions">
          <button
            type="button"
            className="action-button primary-action"
            autoFocus
            onClick={onReset}
          >
            Chơi ván mới (Xóa lưu lỗi)
          </button>
          <button
            type="button"
            className="action-button secondary-action"
            onClick={onKeep}
          >
            Giữ nguyên bản lưu lỗi
          </button>
        </div>
      </div>
    </div>
  );
}

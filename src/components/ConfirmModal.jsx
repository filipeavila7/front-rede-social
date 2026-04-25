import { createPortal } from "react-dom";
import "../styles/ConfirmModal.css";

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="overlay-modal" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>

        <div className="btn-confirm-container">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmModal;

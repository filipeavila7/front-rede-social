import '../styles/ConfirmModal.css'

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="overlay-modal" onClick={onCancel}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>

        <div className='btn-confirm-container'>
          <button className='btn-cancel' onClick={onCancel}>Cancelar</button>
          <button className='btn-confirm' onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "#000000",
  padding: "100px",
  borderRadius: "10px",
};

export default ConfirmModal
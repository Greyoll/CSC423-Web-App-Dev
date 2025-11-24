import './ConfirmationModal.css';

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        
        <div className="confirmation-buttons">
          <button 
            className="confirmation-btn cancel-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirmation-btn confirm-btn ${isDangerous ? 'dangerous' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
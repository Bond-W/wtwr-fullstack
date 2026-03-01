import "./ConfirmModal.css";

function ConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal_opened">
      <div className="modal__content modal__content_type_confirm">
        <button
          className="modal__close modal__close-preview"
          onClick={onClose}
          type="button"
        ></button>
        <p className="modal__confirm-title">
          Are you sure you want to delete "{itemName}"? This action is
          irreversible.
        </p>
        <div className="modal__confirm-actions">
          <button className="modal__delete-button-confirm" onClick={onConfirm}>
            Yes, delete item
          </button>
          <button className="modal__cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
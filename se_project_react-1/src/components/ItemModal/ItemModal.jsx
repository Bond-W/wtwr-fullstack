import "./ItemModal.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemModal({ activeModal, onClose, card, onDeleteRequest }) {
  const currentUser = useContext(CurrentUserContext);

  if (!card) return null;
  console.log("previewing card:", card);

  const isOwner =
  currentUser?._id && card?.owner
    ? String(card.owner) === String(currentUser._id)
    : false;

  return (
    <div className={`modal ${activeModal === "preview" && "modal_opened"}`}>
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          type="button"
          className="modal__close modal__close-preview"
        ></button>
        <img src={card.link} alt={card.name} className="modal__image" />
        <div className="modal__footer">
          {isOwner && (
          <button
            className="modal__delete-button"
            onClick={() => onDeleteRequest(card)}
          >
            Delete Item
          </button>
          )}
          <h2 className="modal__caption">{card.name}</h2>
          <p className="modal__weather">Weather:{card.weather}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;

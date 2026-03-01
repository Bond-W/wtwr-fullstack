import "./ItemCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike, isLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);

  const isLiked =
    currentUser?._id && item.likes
      ? item.likes.some((id) => String(id) === String(currentUser._id))
      : false;

  const itemLikeButtonClassName = `card__like-button ${
    isLiked ? "card__like-button_liked" : ""
  }`;

  const handleLike = () => onCardLike(item);

  return (
    <li className="clothing__item card">
      <div className="card__header">
        <p className="card__name">{item.name}</p>

        {isLoggedIn && (
          <button
            type="button"
            className={itemLikeButtonClassName}
            onClick={handleLike}
            aria-label="Like item"
          />
        )}
      </div>

      <img
        onClick={() => onCardClick(item)}
        className="card__image"
        src={item.link || item.imageUrl}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;


import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ClothesSection({
  onCardClick,
  onAddClick,
  clothingItems,
  onCardLike,
  isLoggedIn,
}) {

  const currentUser = useContext(CurrentUserContext);

  const userItems =
  currentUser?._id
    ? clothingItems.filter((item) => String(item.owner) === String(currentUser._id))
    : [];

  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <p className="clothes-section__title">Your Items</p>
        {isLoggedIn && ( 
        <button className="clothes-section__button" onClick={onAddClick}>
          + Add New
        </button>
        )}
      </div>
      <ul className="clothes-section__items">
        {userItems.map((item) => (
          <ItemCard
            key={item._id}
            item={item}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </ul>
    </div>
  );
}

export default ClothesSection;

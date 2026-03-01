import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.png";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  handleAddClick,
  weatherData,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) {
  const currentUser = useContext(CurrentUserContext);

  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });

  const userName = currentUser?.name || "";
  const userAvatar = currentUser?.avatar || "";

  const placeholderLetter = userName && typeof userName === "string" ? userName.charAt(0).toUpperCase() : "?";

  return (
    <header className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="WTW Logo" />
      </Link>

      <p className="header__date-and-location">
        {currentDate}, {weatherData.city}
      </p>
      <ToggleSwitch />
      {isLoggedIn && (
        <button
          onClick={handleAddClick}
          type="button"
          className="header__add-clothes-btn"
        >
          + ADD CLOTHES
        </button>
      )}
      <div className="header__user-container">
        {!isLoggedIn && (
          <div className="header__auth-buttons">
            <button className="header__button" onClick={onLoginClick}>
              Sign In
            </button>
            <button className="header__button" onClick={onRegisterClick}>
              Sign Up
            </button>
          </div>
        )}

        {isLoggedIn && (
          <>
            <Link to="/profile" className="header__link">
              <p className="header__username">{userName}</p>

              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="header__avatar"
                />
              ) : (
                <div className="header__avatar header__avatar_placeholder">
                  {placeholderLetter}
                </div>
              )}
            </Link>

            <button className="header__button" onClick={onLogout}>
              Log Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

import "./SideBar.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";



function SideBar(onEditProfile) {
    const currentUser = useContext(CurrentUserContext);

    const userName = currentUser?.name || "User";
    const userAvatar = currentUser?.avatar || "";

    const placeholderLetter =userName.charAt(0).toUpperCase();

    return (
    <div className="sidebar">
        {userAvatar ? (
        <img src={userAvatar} alt={userName} className="sidebar__avatar" />
        ) : (
        <div className="siderbar__avatar sidebar__avatar-placeholder">{placeholderLetter}</div>
        )}
        <p className="sidebar__username">{userName}</p>
        <button className="sidebar__edit-button" onClick={onEditProfile}>
            Edit Profile
        </button>
        <button type="button" className="sidebar__logout-button" onClick={onLogout}>
            Sign Out
        </button>
    </div>
    );
}


export default SideBar;
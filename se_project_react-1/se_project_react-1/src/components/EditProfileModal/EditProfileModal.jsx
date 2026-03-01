import react, { useState, useContext, useEffect } from "react";
import "./EditProfileModal.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { use } from "react";

function EditProfileModal({ isOpen, onClose, onSubmit }) {
    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (isOpen && currentUser) {
            setName(currentUser.name || "");
            setAvatar(currentUser.avatar || "");
        }
    }, [isOpen, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, avatar });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal modal_opened">
            <div className="modal__content">
                <button className="modal__close-button" type="button" onClick={onClose}>
                    </button>
                <h2 className="modal__title">Edit Profile</h2>
                <form className="modal__form" onSubmit={handleSubmit}>
                    <label className="modal__label">
                        Name
                        <input
                            type="text"
                            value={name}
                            minLength="2"
                            maxLength="30"
                            onChange={(e) => setName(e.target.value)}
                            required
                            />
                    </label>
                    <label className="modal__label">
                        Avatar URL  
                        <input
                            type="url"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            required
                            />
                    </label>
                    <button className="modal__submit" type="submit">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import {
  coordinates,
  apiKey,
  defaultClothingItems,
} from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, removeItem, addItem, updateUser, addCardLike, removeCardLike, normalizeItem } from "../../utils/api";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import { signup, signin, checkToken } from "../../utils/auth";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
  });

  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveModal("add-garment");
  };

  const closeActiveModals = () => {
    setActiveModal("");
    setShowConfirmModal(false);
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setIsEditProfileModalOpen(false);
    
  };

  const handleDeleteClick = (card) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setItemToDelete(card);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    const token = localStorage.getItem('jwt');
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    removeItem(itemToDelete._id, token)
      .then(() => {
        const updatedItems = clothingItems.filter(
          (item) => item._id !== itemToDelete._id
        );
        setClothingItems(updatedItems);
        setItemToDelete(null);
        setShowConfirmModal(false);
        closeActiveModals();
      })
      .catch(console.error);
  };

  

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

 const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    setIsLoginModalOpen(true);
    return;
  }

  addItem({ name, weather, link: imageUrl }, token)
    .then((newItemFromServer) => {
      const normalized = normalizeItem(newItemFromServer);
      setClothingItems((prevItems) => [normalized, ...prevItems]);
      closeActiveModals();
    })
    .catch(console.error);
};


  const handleRegister = ({ name, email, password, avatar }) => {
    signup({ name, email, password, avatar })
      .then(() => {
        setIsRegisterModalOpen(false);
        return handleLogin({ email, password });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleLogin = ({ email, password }) => {
    signin({ email, password })
      .then((res) => {
        if (!res.token) {
          throw new Error('No token received');
        }
        localStorage.setItem('jwt', res.token);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        return checkToken(res.token);       
    })
    .then((userData) => {
      setCurrentUser(userData);
    })
    .catch((err) => {
      console.error(err);
    });
}

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser(null);
  }

  const handleEditProfile = ({ name, avatar }) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    updateUser({ name, avatar }, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditProfileModalOpen(false);
      })
      .catch((err) => console.error(err));
  };

const handleCardLike = (item) => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    setIsLoginModalOpen(true);
    return;
  }

  if (!currentUser?._id) return;

  const isLiked = (item.likes || []).some(
    (id) => String(id) === String(currentUser._id)
  );

  const request = !isLiked
    ? addCardLike(item._id, token)
    : removeCardLike(item._id, token);

  request
    .then((updatedCard) => {
      setClothingItems((prev) =>
        prev.map((c) => (c._id === item._id ? updatedCard : c))
      );
    })
    .catch(console.error);
};


  useEffect(() => {
    getWeather(coordinates, apiKey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);


  useEffect(() => {
    getItems()
      .then((data) => {
        const transformed = data.map((item) => ({
          ...item,
          _id: item.id || item._id,
          link: item.link || item.imageUrl,
        }));

        setClothingItems(transformed);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken(token)
        .then((userData) => {
          setIsLoggedIn(true);
          setCurrentUser(userData);
        })
        .catch((err) => {
          console.error("Token check failed:", err);
          localStorage.removeItem('jwt');
          setIsLoggedIn(false);
          setCurrentUser(null);
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="app">
        <div className="app__content">
          <Header
            handleAddClick={handleAddClick}
            weatherData={weatherData}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onRegisterClick={() => setIsRegisterModalOpen(true)}
            onLogout={handleLogout}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  clothingItems={clothingItems}
                  handleCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes isLoggedIn={isLoggedIn}>
                  <Profile
                    currentUser={currentUser}
                    onCardClick={handleCardClick}
                    handleAddClick={handleAddClick}
                    clothingItems={clothingItems}
                    onCardDelete={handleDeleteClick}
                    onEditProfile={() => setIsEditProfileModalOpen(true)}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn}
                    onLogout={handleLogout}
                  />
                </ProtectedRoutes>
              }
            />
          </Routes>

          <Footer />
        </div>
        <AddItemModal
          onClose={closeActiveModals}
          isOpen={activeModal === "add-garment"}
          onAddItemModalSubmit={handleAddItemModalSubmit}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModals}
          onDeleteRequest={handleDeleteClick}
        />
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete?.name}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={handleRegister}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSubmit={handleEditProfile}
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;

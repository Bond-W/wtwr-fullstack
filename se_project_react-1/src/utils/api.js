const baseUrl = 'http://localhost:3001';

const handleServerResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

const normalizeItem = (item) => ({
  ...item,
  _id: item._id || item.id,
  link: item.link || item.imageUrl,
});

const getItems = () =>
  fetch(`${baseUrl}/items`, { headers: { "Content-Type": "application/json" } })
    .then(handleServerResponse)
    .then((items) => items.map(normalizeItem));

const addItem = ({ name, weather, link }, token) =>
  fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, weather, imageUrl: link }),
  })
    .then(handleServerResponse)
    .then(normalizeItem);


const removeItem = (id, token) => {
    return fetch(`${baseUrl}/items/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
            , authorization: `Bearer ${token}`,
        }
    }).then(handleServerResponse);
}


const updateUser = ({ name, avatar}, token) => {
    return fetch(`${baseUrl}/users/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,       
            avatar
        })
    }).then(handleServerResponse);
}

const addCardLike = (id, token) => {
    return fetch(`${baseUrl}/items/${id}/likes`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        }
    }).then(handleServerResponse);
}

const removeCardLike = (id, token) => {
    return fetch(`${baseUrl}/items/${id}/likes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        }
    }).then(handleServerResponse);
}

export { getItems, addItem, removeItem, handleServerResponse, updateUser, addCardLike, removeCardLike, normalizeItem };
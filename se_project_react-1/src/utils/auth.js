const BASE_URL = 'http://localhost:3000';

function checkResponse(res) {
    if (res.ok) {
        return res.json();
    }
    return res.json().catch(() => {
        throw new Error(`Error: ${res.status}`);
}).then((err) => {
        throw new Error(err.message || `Error: ${res.status}`);
    });
}

export function signup({ name, email, password, avatar }) {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, avatar }),
    }).then(checkResponse);
} 

export function signin({ email, password }) {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    }).then(checkResponse);
}

export function checkToken(token) {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    }).then(checkResponse);
}
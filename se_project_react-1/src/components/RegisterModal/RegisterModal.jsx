import React, { useState } from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [avatar, setAvatar] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ name, email, password, avatar });
  }


    return (
        <ModalWithForm
            title="Sign up"
            buttonText="Sign up"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
                    <label className='modal__label'>
                        Name
                        <input
                        className='modal__input'
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength='2'
                            maxLength='30'
                            />
                    </label>

                    <label className='modal__label'>
                        Avatar URL
                        <input
                        className='modal__input'
                            type="url"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            required
                            />
                    </label>

                    <label className='modal__label'>
                        Email
                        <input
                        className='modal__input'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </label>

                    <label className='modal__label'>
                        Password
                        <input
                        className='modal__input'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength='6'
                            />
                    </label>

                    <button className='modal__switch-button' type="button" onClick={onSwitchToLogin}>
                        Already have an account? Log in
                    </button>
                </ModalWithForm>
    );
}

export default RegisterModal;
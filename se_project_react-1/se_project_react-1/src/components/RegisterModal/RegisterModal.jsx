import React, { useState } from 'react';

function RegisterModal({ isOpen, onClose, onRegister }) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [avatar, setAvatar] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ name, email, password, avatar });
  }

  if(!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal__content">
                <button className='modal__close' type='button' onClick={onClose}>
                    ×
                    </button>
                <h2 className='modal__title'>Sign up</h2>
                <form className='modal__form' onSubmit={handleSubmit}>
                    <label className='modal__label'>
                        Name
                        <input
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
                            type="url"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            required
                            />
                    </label>

                    <label className='modal__label'>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                    </label>

                    <label className='modal__label'>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength='6'
                            />
                    </label>

                    <button className='modal__submit' type="submit">Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;
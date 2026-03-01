import React, {useState} from 'react';

function LoginModal({ isOpen, onClose, onLogin }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onLogin({ email, password });
    }

    if(!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal__content">
                <button className='modal__close' type='button' onClick={onClose}>
                    ×
                    </button>
                <h2 className='modal__title'>Sign in</h2>
                <form className='modal__form' onSubmit={handleSubmit}>
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
                            />
                    </label>

                    <button className='modal__submit' type='submit'>Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;
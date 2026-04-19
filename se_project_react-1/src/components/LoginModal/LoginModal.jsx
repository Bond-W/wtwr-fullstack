import React, {useState} from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onLogin({ email, password });
    }


    return (
        <ModalWithForm
            title="Sign in"
            buttonText="Sign in"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >
        
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
                            />
                    </label>

                    <button className='modal__switch-button' type='button' onClick={onSwitchToRegister}>
                        Don't have an account? Sign up
                    </button>
            </ModalWithForm>    
    );
}

export default LoginModal;
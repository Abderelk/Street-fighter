// Inscription.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import "./../../public/assets/css/login.css"
import { Link } from 'react-router-dom';

const Inscription = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const hashPassword = (password) => {
        return sha256(password).toString();
    };

    const handleRegistration = (event) => {
        event.preventDefault();
        const hashedPassword = hashPassword(password);
        // Stocker le nom d'utilisateur et le mot de passe haché dans le localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('hashedPassword', hashedPassword);
        navigate(-1); // Rediriger vers la page de connexion une fois l'inscription réussie
    };

    return (
        <div className="login-container">
            <audio id="backgroundMusic" autoPlay loop>
                <source src="src/assets/audio/acceuil.mp3" type="audio/mpeg" />
            </audio>
            <header>
                <img id="logo" src="/assets/img/logo.png" alt="logo street fighter" />
                <nav>
                    <ul>
                        <li><Link to={`/`}>Connexion</Link></li>
                        <li><Link to={`/inscription`}>Inscription</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <img className='backgroundImage' src="/assets/img/imageDeFond.jpeg" alt="fond" />
                <div className="form-container">
                    <form onSubmit={handleRegistration}>
                        <h1>Insciption</h1>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit">Se connecter</button>
                    </form>
                    {error && <p className="error">{error}</p>}
                </div>
            </main>
        </div >
    );
}

export default Inscription;

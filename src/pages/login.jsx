
// login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import '../assets/css/login.css';

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const hashPassword = (password) => {
        return sha256(password).toString();
    };


    const handleLogin = (event) => {
        event.preventDefault();
        const storedUsername = localStorage.getItem('username');
        const storedHashedPassword = localStorage.getItem('hashedPassword');

        if (username === storedUsername && hashPassword(password) === storedHashedPassword) {
            navigate('/home');
            setIsLoggedIn(true); // Mettre à jour l'état d'authentification
            localStorage.setItem("isLogin", "true")
            // suppression automatique apres une heure
            setTimeout(() => {
                localStorage.removeItem("isLogin");
            }, 60 * 60 * 1000); // 1 hour in milliseconds
        } else if (!storedUsername || !storedHashedPassword) {
            setError('Veuillez vous inscrire');
        }
        else {
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
        }

    };

    return (
        <div className="login-container">
            <audio id="backgroundMusic" autoPlay loop>
                <source src="src/assets/audio/acceuil.mp3" type="audio/mpeg" />
            </audio>
            <header>
                <img id="logo" src="../src/assets/img/logo.png" alt="logo street fighter" />
                <nav>
                    <ul>
                        <li><Link to={`/`}>Connexion</Link></li>
                        <li><Link to={`/inscription`}>Inscription</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <img className='backgroundImage' src="../src/assets/img/imageDeFond.jpeg" alt="fond" />
                <div className="form-container">
                    <form onSubmit={handleLogin}>
                        <h1>Connexion</h1>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <p><Link to={`/inscription`}>Créer un compte</Link></p>
                        <button type="submit">Se connecter</button>
                    </form>
                    {error && <p className="error">{error}</p>}
                </div>
            </main>
        </div >
    );
};

export default Login;
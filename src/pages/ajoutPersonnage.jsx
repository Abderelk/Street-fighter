import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/ajoutPersonnage.css';

const AjoutPersonnage = () => {
    const [name, setName] = useState('');
    const [gif, setGif] = useState('');
    const [strength, setStrength] = useState('');
    const [stamina, setStamina] = useState('');
    const [defense, setDefense] = useState('');
    const [speed, setSpeed] = useState('');
    const [img, setImg] = useState('');
    const [techniques, setTechniques] = useState(['attaque 1', 'attaque 2', 'attaque 3', 'attaque 4']);
    const navigate = useNavigate();

    const handleAjouter = (event) => {
        event.preventDefault();

        // Récupérer les personnages existants depuis le local storage
        const personnagesExistants = JSON.parse(localStorage.getItem('personnages')) || [];

        const nouveauPersonnage = {
            id: personnagesExistants.length, // Utilisation de la longueur du tableau + 1 comme ID
            name: name,
            gif: gif,
            img: img,
            strength: parseInt(strength),
            stamina: parseInt(stamina),
            defense: parseInt(defense),
            speed: parseInt(speed),
            techniques: techniques
        };

        // Ajouter le nouveau personnage au tableau existant
        const nouveauTableau = [...personnagesExistants, nouveauPersonnage];

        // Mettre à jour le local storage avec le nouveau tableau
        localStorage.setItem('personnages', JSON.stringify(nouveauTableau));
        //  retour à la page précédente (fonctionnalité non présente sur chatgpt)
        navigate(-1)
    };
    const handleLogout = () => {
        localStorage.removeItem("isLogin"); // Supprimer l'entrée isLogin du localStorage
        navigate("/"); // Rediriger vers la page de connexion
    };
    return (
        <div className="ajout-personnage-container">
            <audio id="backgroundMusic" autoPlay loop>
                <source src="src/assets/audio/ajoutPersonnage.mp3" type="audio/mpeg" />
            </audio>
            <img className="backgroundImage" src="../src/assets/img/imageDeFond.jpeg" alt="fond" />
            <header>
                <Link to="/home">
                    <img id="logo" src="../src/assets/img/logo.png" alt="logo street fighter" />
                </Link>
                <nav>
                    <ul>
                        <li><Link to="/home">Choix du personnage</Link></li>
                        <li><Link to="/" onClick={handleLogout}>Déconnexion</Link></li>
                    </ul>
                </nav>
            </header>
            <form className='ajoutPersonnage' onSubmit={handleAjouter}>
                <h2>Ajouter un personnage</h2>
                <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" placeholder='Jin' value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>URL de l'animation (GIF) :</label>
                    <input type="text" value={gif} placeholder='https://www.fightersgeneration.com/news2022/char/jin-kazama-fan-2d-sprite-animation.gif' onChange={(e) => setGif(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>URL de l'image (Jpeg) :</label>
                    <input type="text" placeholder='https://www.fightersgeneration.com/news2022/char/jin-kazama-fa' value={img} onChange={(e) => setImg(e.target.value)} required />
                </div>
                <div className="form-group button-group">
                    <div>
                        <label>Force :</label>
                        <input type="number" value={strength} placeholder='1005' onChange={(e) => setStrength(e.target.value)} min="900" max="1050" required />
                    </div>
                    <div>
                        <label>Endurance :</label>
                        <input type="number" value={stamina} placeholder='4507' onChange={(e) => setStamina(e.target.value)} min="3900" max="4700" required />
                    </div>
                </div>
                <div className="form-group button-group">
                    <div>
                        <label>Défense :</label>
                        <input type="number" value={defense} placeholder='157' onChange={(e) => setDefense(e.target.value)} min="150" max="300" required />
                    </div>
                    <div>
                        <label>Vitesse :</label>
                        <input type="number" value={speed} placeholder='935' onChange={(e) => setSpeed(e.target.value)} min="800" max="1000" required />
                    </div>
                </div>
                <button type="submit">Ajouter</button>
            </form>
        </div>

    );
};

export default AjoutPersonnage;

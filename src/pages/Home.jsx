import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Data from "../service/data.json";
import { Link } from "react-router-dom";
import AjoutPersonnage from "./AjoutPersonnage";
import * as ACTION from "../redux/article";
import "../../public/assets/css/home.css"
import { faCircleInfo, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Home() {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.article.data);

    // État local pour stocker le personnage sélectionné
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [localStorageCharacter, setLocalStorageCharacter] = useState(null);
    const [personnages, setPersonnages] = useState([]);
    useEffect(() => {
        dispatch(ACTION.FETCH_DATA(Data));

        // Récupérer le personnage depuis le localStorage
        const localStorageData = localStorage.getItem("nouveauPersonnage");
        if (localStorageData) {
            const parsedData = JSON.parse(localStorageData);
            setLocalStorageCharacter(parsedData);
        }
    }, [dispatch]);
    useEffect(() => {
        // Récupérer les personnages depuis le stockage local
        const personnagesDuLocalStorage = JSON.parse(localStorage.getItem('personnages')) || [];
        setPersonnages(personnagesDuLocalStorage);
    }, []);

    // Gestionnaire d'événements pour afficher les informations du personnage
    const handleInfoClick = (character) => {
        setSelectedCharacter(character);
    };

    const deleteCharacter = (index) => {
        const updatedCharacters = [...personnages];
        updatedCharacters.splice(index, 1);
        setPersonnages(updatedCharacters);
        localStorage.setItem('personnages', JSON.stringify(updatedCharacters));
    };
    const handleLogout = () => {
        localStorage.removeItem("isLogin"); // Supprimer l'entrée isLogin du localStorage
        navigate("/"); // Rediriger vers la page de connexion
    };

    return (
        <div className="home">
            <audio id="backgroundMusic" autoPlay loop>
                <source src="src/assets/audio/home.mp3" type="audio/mpeg" />
            </audio>
            {/* header */}
            <img className="backgroundImage" src="/assets/img/imageDeFond.jpeg" alt="fond" />
            <header>
                <img id="logo" src="/assets/img/logo.png" alt="logo street fighter" />

                <nav>
                    <ul>
                        <li>
                            <Link to="/ajoutPersonnage">Ajouter un personnage
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={handleLogout}>Déconnexion</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            {/* affichage du perso */}
            <div className="gifs">
                {
                    selectedCharacter && (
                        <div className="character-info">
                            <h2>{selectedCharacter.name}</h2>
                            <div className="personnage">
                                <img src={selectedCharacter.gif} alt="" />
                                <div className="caracteristique">
                                    <p>Speed: {selectedCharacter.speed}</p>
                                    <p>Stamina: {selectedCharacter.stamina}</p>
                                    <p>Defense: {selectedCharacter.defense}</p>
                                    <p>Strength: {selectedCharacter.strength}</p>
                                </div>
                            </div>
                            {/* Bouton pour fermer les informations */}
                            {personnages.includes(selectedCharacter) ? (
                                <Link to={`/fight/ls${selectedCharacter.id}`}>
                                    <button>Combattre</button>
                                </Link>
                            ) : (
                                <Link to={`/fight/${selectedCharacter.id}`}>
                                    <button>Combattre</button>
                                </Link>
                            )}
                        </div>
                    )
                }

                {/* Afficher les personnages depuis le state local personnages */}
            </div>
            {/* card */}
            <div className="cards">

                {store
                    ? store.map((item, index) => (
                        <div className="card" key={index}>
                            <div className="bouton" onClick={() => handleInfoClick(item)}>
                                <img src={item.img} alt="" width={75} />
                            </div>
                        </div>
                    ))
                    : null}

                {/* Afficher les personnages depuis le state local personnages */}
                {personnages.map((personnage, index) => (
                    <div className="card" key={index}>
                        <p className="icone" onClick={() => deleteCharacter(index)}><FontAwesomeIcon icon={faTrash} /></p>
                        <div className="bouton" onClick={() => handleInfoClick(personnage)}>
                            <img src={personnage.img} alt={personnage.name} width={75} />
                        </div>
                    </div>
                ))}
            </div>


        </div >
    );
}
export default Home;

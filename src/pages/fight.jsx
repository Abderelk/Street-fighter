import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Data from "../service/data.json";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import * as ACTION from "../redux/article";
import CharacterCard from "../components/characterCard";
import { useNavigate } from "react-router-dom";
import "../assets/css/fight.css";

function Fight() {
    const location = useSelector((state) => state.article.data);
    const { index } = useParams();
    const dispatch = useDispatch();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [randomIndex, setRandomIndex] = useState(Math.floor(Math.random() * 16));
    const [selectedCharacter, setSelectedCharacter] = useState(null); //
    const [attackMessage, setAttackMessage] = useState("");
    const [characterFirst, setCharacterFirst] = useState(null);
    const [randomCharacterStamina, setRandomCharacterStamina] = useState(null);
    const [selectedCharacterStamina, setSelectedCharacterStamina] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState("");
    const [looser, setLooser] = useState("");
    const [attack3Used, setAttack3Used] = useState(true);
    const [attack4Used, setAttack4Used] = useState(true);
    const [criticalHit, setCriticalHit] = useState(false);
    const [combatStarted, setCombatStarted] = useState(false);
    const [arenaImage, setArenaImage] = useState("");
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Modification ici
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [playerAttacking, setPlayerAttacking] = useState(false);
    const [enemyAttacking, setEnemyAttacking] = useState(false);
    const navigate = useNavigate()
    const [isPaused, setIsPaused] = useState(false);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    // Obtention de l'index du personnage sélectionné qu'il provienne du local storage ou du data.json
    useEffect(() => {
        if (window.location.href.includes("ls")) {
            const indexFromUrl = parseInt(window.location.href.split("ls")[1], 10);
            // Si l'URL inclut "ls", cela signifie que le personnage vient du local storage
            const localStorageData = localStorage.getItem("personnages");
            const parsedData = JSON.parse(localStorageData);
            const selectedCharacterFromLocalStorage = parsedData.find((character, index) => index === indexFromUrl);
            setSelectedCharacter(selectedCharacterFromLocalStorage);
        } else {
            dispatch(ACTION.FETCH_SUCCESS(Data));
            setSelectedIndex(index);
            setSelectedCharacter(location && location[index]);
        }
    }, [dispatch, index, location]);

    // Obtention de l'index aléatoire du personnage affronté ainsi que de l'arène
    useEffect(() => {
        const randomIdx = Math.floor(Math.random() * 16);
        setRandomIndex(randomIdx);
        const randomArenaIdx = Math.floor(Math.random() * 5 + 1);
        setArenaImage(`../src/assets/img/arene${randomArenaIdx}.gif`);

    }, []);

    // Obtention des personnages aléatoires
    const randomCharacter = location && location[randomIndex];

    // Choix du personnage qui va commencer le combat en fonction de la vitesse
    useEffect(() => {
        if (selectedCharacter && randomCharacter) {
            if (selectedCharacter.speed < randomCharacter.speed) {
                setIsPlayerTurn(false);
            }
            else {
                setIsPlayerTurn(true);
            }
        }
    }, [selectedCharacter, randomCharacter]);

    // Vérification de la fin du combat
    useEffect(() => {
        if (selectedCharacterStamina !== null && selectedCharacterStamina <= 0) {
            setWinner(randomCharacter);
            setLooser(selectedCharacter);
            setIsGameOver(true);
        } else if (randomCharacterStamina !== null && randomCharacterStamina <= 0) {
            setWinner(selectedCharacter);
            setLooser(randomCharacter);

            setIsGameOver(true);
        }
    }, [selectedCharacterStamina, randomCharacterStamina, selectedCharacter, randomCharacter]);

    // Choix du personnage qui va commencer le combat en fonction de la vitesse.
    useEffect(() => {
        if (selectedCharacter && randomCharacter) {
            const characterFirstMessage = selectedCharacter.speed >= randomCharacter.speed ? (`${selectedCharacter.name} est plus rapide donc attaque en premier`) : (`${randomCharacter.name} est plus rapide donc attaque en premier`);
            setCharacterFirst(characterFirstMessage);
        }

    }, [selectedIndex, randomIndex, location]);
    // Utilisation de useEffect pour gérer les animations
    useEffect(() => {
        // Animation lorsque le joueur attaque
        if (playerAttacking) {
            const timer = setTimeout(() => {
                setPlayerAttacking(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [playerAttacking]);
    useEffect(() => {
        // Animation lorsque l'ennemi attaque
        if (enemyAttacking) {
            const timer = setTimeout(() => {
                setEnemyAttacking(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [enemyAttacking]);
    // Démarre le minuteur
    useEffect(() => {
        const timer = setInterval(() => {
            // Vérifiez si le minuteur n'est pas en pause
            if (timeRemaining > 0 && !isTimerPaused) {
                setTimeRemaining(time => time - 1);
            } else if (timeRemaining <= 0) {
                clearInterval(timer);
                // Si le temps restant atteint 0, vérifiez les points de vie pour déterminer le perdant
                (selectedCharacterStamina <= randomCharacterStamina) ? setWinner(randomCharacter) && setLooser(selectedCharacter) : setWinner(selectedCharacter) && setLooser(randomCharacter);
                setIsGameOver(true); // Déclare la fin du jeu
            }
        }, 1000);
        // Nettoie le timer lorsque le composant est démonté
        return () => clearInterval(timer);
    }, [timeRemaining, selectedCharacterStamina, randomCharacterStamina, selectedCharacter, randomCharacter, isTimerPaused]);
    // fonction pour gérer les attaques aléatoires de l'adversaire
    const randomAttack = () => {
        if (!isPlayerTurn && randomCharacter && !isGameOver) {
            const randomTechniqueIndex = Math.floor(Math.random() * randomCharacter.techniques.length);
            const techniqueUsed = randomCharacter.techniques[randomTechniqueIndex];
            let damage = 0;
            let health = 0;
            let regenMessage = '';
            setEnemyAttacking(true);
            switch (randomTechniqueIndex) {
                case 0:
                    damage = randomCharacter.strength;
                    break;
                case 1:
                    damage = randomCharacter.strength;
                    break;
                case 2:
                    // Regeneration technique
                    health = randomCharacter.defense;
                    regenMessage = ` et récupère ${health} points de vie !`;
                    break;
                case 3:
                    // Regeneration with damage technique
                    damage = randomCharacter.strength;
                    health = randomCharacter.defense;
                    regenMessage = ` et récupère ${health} points de vie !`;
                    break;
                default:
                    break;
            }

            const isCriticalHit = Math.random() < 0.2;
            if (isCriticalHit) {
                damage *= 2;
                health *= 2;
                setCriticalHit(true);
            } else {
                setCriticalHit(false);
            }

            setAttackMessage(`${randomCharacter.name} lance ${techniqueUsed} et inflige ${damage} points de dégâts${regenMessage} ${isCriticalHit ? "(Coup critique !)" : ""}`);
            const newSelectedCharacterStamina = selectedCharacterStamina !== null ? selectedCharacterStamina - damage : selectedCharacter.stamina - damage;
            setSelectedCharacterStamina(Math.max(newSelectedCharacterStamina, 0));

            // Update random character's stamina with health regeneration
            const newRandomCharacterStamina = randomCharacterStamina !== null ? randomCharacterStamina + health : randomCharacter.stamina + health;
            setRandomCharacterStamina(Math.min(newRandomCharacterStamina, randomCharacter.stamina));

            setIsPlayerTurn(true);

            if (newSelectedCharacterStamina <= 0) {
                setWinner(randomCharacter);
                setLooser(selectedCharacter)
                setIsGameOver(true);
            }

            setCombatStarted(true);
        }

    };
    const handleLogout = () => {
        localStorage.removeItem("isLogin"); // Supprimer l'entrée isLogin du localStorage
        navigate("/")
    };
    // fonction pour gérer les attaques du joueur

    const handleAttack = (techniqueIndex) => {
        if (isPlayerTurn && selectedCharacter && randomCharacter) {
            const techniqueUsed = selectedCharacter.techniques[techniqueIndex];
            let damage = 0;
            let health = 0;
            let regenMessage = '';
            setPlayerAttacking(true);
            if (techniqueIndex === 0) {
                damage = selectedCharacter.strength - randomCharacter.defense;
                setAttack3Used(false);
                setAttack4Used(false);
            } else if (techniqueIndex === 1) {
                damage = selectedCharacter.strength;
                setAttack3Used(false);
                setAttack4Used(false);
            } else if (techniqueIndex === 2 && !attack3Used) {
                health = selectedCharacter.stamina / 4;
                regenMessage = ` et récupère ${health} points de vie !`;
                setAttack3Used(true);
                setAttack4Used(false);
            } else if (techniqueIndex === 3 && !attack4Used) {
                damage = selectedCharacter.strength - randomCharacter.defense;
                health = selectedCharacter.defense;
                regenMessage = ` et récupère ${health} points de vie !`;
                setAttack3Used(false);
                setAttack4Used(true);
            } else {
                return;
            }
            const isCriticalHit = Math.random() < 0.2;
            if (isCriticalHit) {
                damage *= 2;
                health *= 2;
                setCriticalHit(true);
            } else {
                setCriticalHit(false);
            }

            setAttackMessage(`${selectedCharacter.name} lance ${techniqueUsed} et inflige ${damage} points de dégâts${regenMessage} ${isCriticalHit ? "(Coup critique !)" : ""}`);
            const newRandomCharacterStamina = randomCharacterStamina !== null ? randomCharacterStamina - damage : randomCharacter.stamina - damage;
            const newSelectedCharacterStamina = selectedCharacterStamina !== null ? selectedCharacterStamina + health : selectedCharacter.stamina + health;

            setRandomCharacterStamina(Math.max(newRandomCharacterStamina, 0));
            setSelectedCharacterStamina(Math.max(newSelectedCharacterStamina, 0));
            setIsPlayerTurn(false);

            if (newRandomCharacterStamina <= 0) {
                setWinner(selectedCharacter);
                setLooser(randomCharacter);

                setIsGameOver(true);
            }
            setCombatStarted(true);
        }
    };
    // fonction pour recommencer une partie
    const handleRestart = () => {
        setIsGameOver(false);
        setRandomIndex(Math.floor(Math.random() * 16));
        const randomArenaIdx = Math.floor(Math.random() * 5 + 1);
        setArenaImage(`../src/assets/img/arene${randomArenaIdx}.gif`);
        setSelectedCharacterStamina(null);
        setRandomCharacterStamina(null);
        setAttackMessage("");
        setWinner("");
        setAttack3Used(true);
        setAttack4Used(true);
        setTimeRemaining(60);
        if (selectedCharacter && randomCharacter) {
            const characterFirstMessage = selectedCharacter.speed > randomCharacter.speed ? (`${selectedCharacter.name} est plus rapide donc attaque en premier`) : (`${randomCharacter.name} est plus rapide donc attaque en premier`);
            setCharacterFirst(characterFirstMessage);
        }
    };
    const handlePause = () => {
        setIsPaused(true);
    };
    const handlePauseTimer = () => {
        setIsTimerPaused(prevState => !prevState); // Inversez l'état actuel de pause du minuteur
        setIsPaused(prevState => !prevState); // Mettez à jour l'état de pause du menu de pause
    };

    const handleClosePauseMenu = () => {
        setIsPaused(false);
    };
    // fonction pour calculer le pourcentage de vie
    const calculateHealthPercentage = (currentHealth, maxHealth) => {
        return (currentHealth / maxHealth) * 100;
    };
    // affichage de la page de combat

    return (
        <div >
            <audio autoPlay loop>
                <source src="/src/assets/audio/fight.mp3" type="audio/mpeg" />
            </audio>
            {/* header */}
            <header>
                <Link to="/home">
                    <img id="logo" src="../src/assets/img/logo.png" alt="logo street fighter" />
                </Link>
                <nav>
                    <ul>
                        <li><Link to="/home">Choix du personnage</Link></li>
                        <li onClick={handleRestart}>Rejouer une partie</li>
                        <li onClick={handlePause && handlePauseTimer}>PAUSE</li>

                        <li>
                            <Link to="/" onClick={handleLogout}>Déconnexion</Link>
                        </li>
                    </ul>
                </nav>
            </header >
            {/* page de combat */}
            {
                !isGameOver && (

                    <div className="pageFight">

                        {/* affichage de l'arène en fond */}
                        {arenaImage && <img className='backgroundImage' src={arenaImage} alt="fond" />}
                        {/* personnage séléctionné */}
                        <div className="fight">

                            <CharacterCard
                                character={selectedCharacter}
                                stamina={selectedCharacterStamina}
                                isPlayer={true}
                                calculateHealthPercentage={calculateHealthPercentage}
                                className={enemyAttacking ? 'attaque' : ''}
                                classNameb={playerAttacking ? 'attaqueb' : ''}
                                damage={selectedCharacter && selectedCharacter.damage}
                            />
                            {/* Minuteur */}
                            <div className="centre">
                                <div className="timer">
                                    <h1>{timeRemaining}</h1>
                                </div>
                                {/* message d'attaque ou message de personnage qui commence */}
                                <div
                                    className="banniere"
                                    style={{
                                        backgroundImage: `url(../src/assets/img/banniere.png)`,
                                    }}
                                >
                                    {!attackMessage ? <h3>{characterFirst}</h3> : <h3>{attackMessage}</h3>}
                                </div>
                            </div>
                            {/* personnage adverse */}
                            <CharacterCard
                                character={randomCharacter}
                                stamina={randomCharacterStamina}
                                attackMessage={attackMessage}
                                isPlayer={false}
                                calculateHealthPercentage={calculateHealthPercentage}
                                isRandomCharacter={true}
                                className={playerAttacking ? 'attaque  ' : ''}
                                classNameb={enemyAttacking ? 'attaquec' : ''}
                                damage={selectedCharacter && selectedCharacter.damage}

                            />
                        </div>
                        {/* techniques d'attaques */}
                        {selectedCharacter && selectedCharacter.techniques && (
                            <div>
                                <button onClick={() => handleAttack(0)} disabled={!isPlayerTurn}>{selectedCharacter.techniques[0]}</button>
                                <button onClick={() => handleAttack(1)} disabled={!isPlayerTurn}>{selectedCharacter.techniques[1]}</button>
                                <button onClick={() => handleAttack(2)} disabled={!isPlayerTurn || attack3Used}>{selectedCharacter.techniques[2]}</button>
                                <button onClick={() => handleAttack(3)} disabled={!isPlayerTurn || attack4Used}>{selectedCharacter.techniques[3]}</button>
                                {/* l'adversaire qui attaque */}
                                <button onClick={() => randomAttack()} disabled={isPlayerTurn}>L'adversaire attaque</button>
                            </div>
                        )}
                    </div>
                )
            }
            {/* page de game-over */}
            {
                isGameOver && (
                    <div className="pageFight gameOver">
                        <img className="backgroundImage" src="../src/assets/img/imageDeFond.jpeg" alt="fond" />
                        <div className="fight">
                            <div className="winner">
                                <div >

                                    <img
                                        src={winner.gif}
                                        alt="winner"
                                    />
                                </div>
                                <h2>Winner</h2>
                            </div>

                            <div className="gameOver">
                                <div
                                    className="banniere"
                                    style={{
                                        backgroundImage: `url(../src/assets/img/banniere.png)`,
                                    }}
                                >
                                    <h3> {winner.name} a remporté la victoire !</h3>
                                </div>

                                <div className="restart">
                                    <button onClick={handleRestart}>Rejouer une partie</button>
                                    <button><Link to="/home">Repartir au choix du personnage</Link></button>
                                </div>
                            </div>
                            <div className="looser">
                                <div >
                                    <img
                                        src={looser.gif}
                                        alt="winner"
                                        style={randomCharacter && { transform: "scaleX(-1)" }} />
                                </div>
                                <h2>Looser</h2>
                            </div>
                        </div>
                    </div>

                )
            }
            {
                isPaused && (
                    <div className="pauseMenu ">

                        <div className="banniere">

                            <h3>Menu Pause</h3>
                            <section>
                                <p>Attaque 1 : La force du combattant moins la défense de l'adversaire.</p>
                                <p>Attaque 2 : La force brute du combattant.</p>
                                <p>Attaque 3 : Le combattant récupère deux fois sa défense en points de vie.</p>
                                <p>Attaque 4 : Le combattant effectue une attaque infligeant des dégâts égaux à sa force en récupérant sa défense en points de vie.</p>
                            </section>
                            <div className="button">
                                <button onClick={handleClosePauseMenu && handlePauseTimer}>Reprendre</button>
                                <button><Link to="/home">Repartir au choix du personnage</Link></button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
}
export default Fight;
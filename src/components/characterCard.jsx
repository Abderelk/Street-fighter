import React from "react";
import "../assets/css/fight.css";

const CharacterCard = ({ character, stamina, calculateHealthPercentage, isRandomCharacter, className, classNameb, damage }) => {

    const combinedClassName = `character-card ${className} ${classNameb}`;
    return (
        <div className={combinedClassName}>
            {character && (
                <>
                    <div>
                        <div className="stamina-bar-container">
                            <div className="stamina-bar" style={{ width: `${calculateHealthPercentage(stamina, character.stamina)}%` }}></div>
                        </div>
                        <div className="infoVie">
                            <h2>{character.name}</h2>
                            <h4> {stamina !== null ? `${stamina}/${character.stamina}` : `${character.stamina}/${character.stamina}`}</h4>
                        </div>
                    </div>
                    <div className="degats">
                    </div>
                    <div className="img">
                        <img
                            src={character.gif}
                            alt={`Photo de ${character.name}`}
                            style={isRandomCharacter && { transform: "scaleX(-1)" }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default CharacterCard;

import { useEffect, useState } from "react";
// Component
import BouncingPokeball from "./others/BouncingPokeball/BouncingPokeball";
import ToggleShiny from "./others/ToggleShiny/ToggleShiny";
import Modal from "./modal/Modal";
// Service
import { getPokemonData } from "../service/pokeapi.js";
// Utils
import { removeHyphen, capitalize } from "../utils/StringUtils.js";
// Assets
import { ReactComponent as Wave1 } from '../img/wave1.svg';
import { ReactComponent as Wave2 } from '../img/wave2.svg';
import { ReactComponent as Wave3 } from '../img/wave3.svg';
import Default from '../img/default.png';
// CSS
import './PokeCard.css';

const PokeCard = ({ name }) => {
  const [pokeData, setPokeData] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPokemonData();
  }, [name]);

  const fetchPokemonData = async () => {
    try {
        setLoading(true);

        const apiData = await getPokemonData(name);
        setPokeData(apiData);

        setTimeout(function() {
          setLoading(false);

          setIsVisible(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 600);
        }, 3000);

    } catch (error) {
        console.error("fetchPokemonData: err: " + error);
    }
  }

  const setFlash = () => isVisible ? 'flash' : '';
  const getPokemonImage = () => isShiny ? pokeData?.artwork.shiny.front : pokeData?.artwork.default.front;
  const getBackgroundColor = () => pokeData ? pokeData?.color : 'default';
  const getPokemonHeight = (height) => height + 250;
  
  return (
    <>
    <div 
      key={name} 
      className={`card bg-${getBackgroundColor()} ${setFlash()}`}
      onClick={() => setIsModalOpen(true)}
    >
      { !loading ? (
          <>
            {pokeData?.hasShinyVer && (
              <ToggleShiny 
                showShiny={isShiny} 
                setShowShiny={(value) => setIsShiny(value)} 
              />
            )}
            <p className="id">{`#${pokeData?.id || 'N/A'}`}</p>
            <p className="name-en">{capitalize(removeHyphen(name))}</p>
            <p className="region">{`Region: ${capitalize(pokeData?.region)}`}</p>
            <p className="height">{`Height: ${pokeData?.height || 'N/A'}`}</p>
            <p className="weight">{`Weight: ${pokeData?.weight || 'N/A'}`}</p>
            {pokeData ? (
              <img 
                src={getPokemonImage()} 
                alt={`${pokeData?.id}-${pokeData?.name.en}-sprite`} 
                style={{height: getPokemonHeight(pokeData?.height)}}
              />
            ) : (
              <img 
                src={Default} 
                alt={`unavailable-pokemon-sprite`} 
                style={{height: 200}}
              />
            )}
            <p className="name-jp">{pokeData?.name.jp}</p>
          </>
      ) : (
        <BouncingPokeball />
      )}
    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>

    <div className="waves">
      <Wave1 className={`wave1 c-${getBackgroundColor()}`}/>
      <Wave2 className={`wave2 c-${getBackgroundColor()}`}/>
      <Wave3 className={`wave3 c-${getBackgroundColor()}`}/>
      <div className={`bottom bg-${getBackgroundColor()}`}></div>
    </div>

    </Modal>
    
    </>
  );
}

export default PokeCard;
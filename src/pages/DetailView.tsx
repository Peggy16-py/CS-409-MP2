import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PokemonDetails, PokemonListItem } from '../types/pokemon';
import '../App.css';

const DetailView = () => {
  const { pokemonId } = useParams();
  const location = useLocation();
  const passedList: (PokemonDetails[] | PokemonListItem[]) | undefined = location.state?.list;

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pokemonId) {
      setLoading(true);
      axios.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => setPokemon(response.data))
        .catch(err => setPokemon(null))
        .finally(() => setLoading(false));
    }
  }, [pokemonId]);

  if (loading) return <div className="centered-message">Loading Pokemon details...</div>;
  if (!pokemon) return <div className="centered-message">Pokemon with this ID not found.</div>;

  let prevId: number | null = null;
  let nextId: number | null = null;

  if (passedList?.length) {
    const currentIndex = passedList.findIndex(item => {
      const itemId = 'url' in item ? parseInt(item.url.split('/')[6]) : item.id;
      return itemId === pokemon.id;
    });
    if (currentIndex !== -1) {
      const prevItem = passedList[currentIndex - 1];
      const nextItem = passedList[currentIndex + 1];
      if (prevItem) prevId = 'url' in prevItem ? parseInt(prevItem.url.split('/')[6]) : prevItem.id;
      if (nextItem) nextId = 'url' in nextItem ? parseInt(nextItem.url.split('/')[6]) : nextItem.id;
    }
  } else {
    const currentId = pokemon.id;
    prevId = currentId > 1 ? currentId - 1 : null;
    nextId = currentId < 151 ? currentId + 1 : null;
  }

  return (
    <div className="detail-container">
      <h1 className="pokemon-name">{pokemon.name} (#{pokemon.id})</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image-large" />
      
      <div className="pokemon-info-grid">
        <div className="info-box">
          <h2>Basic Info</h2>
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
        </div>
        <div className="info-box">
          <h2>Types</h2>
          <p className="pokemon-types">{pokemon.types.map(t => t.type.name).join(', ')}</p>
        </div>
        <div className="info-box">
          <h2>Abilities</h2>
          <p className="pokemon-abilities">{pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        </div>
        <div className="info-box stats-box">
          <h2>Base Stats</h2>
          <div className="stats-container">
            {pokemon.stats.map(s => (
              <div className="stat-row" key={s.stat.name}>
                <span className="stat-name">{s.stat.name}</span>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar" 
                    style={{ width: `${(s.base_stat / 255) * 100}%` }}
                  >
                    {s.base_stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        {prevId ? (
          <Link to={`/details/${prevId}`} state={{ list: passedList }} className="button-link">← Previous (#{prevId})</Link>
        ) : <div />}
        
        <Link to="/" className="button-link">Back to List</Link>

        {nextId ? (
          <Link to={`/details/${nextId}`} state={{ list: passedList }} className="button-link">Next (#{nextId}) →</Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default DetailView;
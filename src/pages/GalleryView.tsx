import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PokemonListItem, PokemonDetails } from '../types/pokemon';
import '../App.css';

const pokemonTypes = [
  'grass', 'poison', 'fire', 'flying', 'water', 'bug', 'normal', 'electric', 'ground',
  'fairy', 'fighting', 'psychic', 'rock', 'steel', 'ice', 'ghost', 'dragon'
];

const GalleryView = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllPokemonDetails = async () => {
      setLoading(true);
      const listResponse = await axios.get<{ results: PokemonListItem[] }>('https://pokeapi.co/api/v2/pokemon?limit=151');
      const detailRequests = listResponse.data.results.map(p => axios.get<PokemonDetails>(p.url));
      const detailResponses = await Promise.all(detailRequests);
      const pokemonDetails = detailResponses.map(res => res.data);
      setPokemons(pokemonDetails);
      setLoading(false);
    };
    fetchAllPokemonDetails();
  }, []);

  const handleTypeFilterChange = (type: string) => {
    setSelectedTypes(prevTypes => {
      if (prevTypes.includes(type)) return prevTypes.filter(t => t !== type);
      else return [...prevTypes, type];
    });
  };

  const filteredPokemons = useMemo(() => {
    if (selectedTypes.length === 0) return pokemons;
    return pokemons.filter(pokemon =>
      pokemon.types.some(typeInfo => selectedTypes.includes(typeInfo.type.name))
    );
  }, [pokemons, selectedTypes]);

  if (loading) {
    return <div>Loading Pokemon Gallery...</div>;
  }

  return (
    <div>
      <h1>Pokemon Gallery View</h1>
      <div className="sort-controls">
        <div className="sort-group">
          <label>Filter by type:</label>
          <button
            onClick={() => setSelectedTypes([])}
            className={selectedTypes.length === 0 ? 'active' : ''}
          >
            All
          </button>
        </div>
        <div className="sort-group">
          {pokemonTypes.map(type => (
            <button
              key={type}
              onClick={() => handleTypeFilterChange(type)}
              className={`type-filter-btn ${selectedTypes.includes(type) ? 'active' : ''} ${type}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="gallery-container">
        {/* Pokemon cards rendering */}
        {filteredPokemons.map(p => (
          <Link 
            to={`/details/${p.id}`} 
            key={p.id} 
            className="gallery-card-link"
            state={{ list: filteredPokemons }}
          >
            <div className="gallery-card">
              <img src={p.sprites.front_default} alt={p.name} />
              <p>#{p.id}</p>
              <p className="pokemon-name-capitalize">{p.name}</p>
              <div className="pokemon-types">
                {p.types.map(t => t.type.name).join(', ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GalleryView;
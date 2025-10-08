import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PokemonListItem } from '../types/pokemon';
import '../App.css';

const getPokemonIdFromUrl = (url: string) => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
};

const ListView = () => {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'id' | 'name' | null>(null);
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

  useEffect(() => {
    axios.get<{ results: PokemonListItem[] }>('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => {
        setPokemons(response.data.results);
      })
      .catch(error => {
        console.error("Failed to fetch Pokemon data:", error);
      });
  }, []);
  
  useEffect(() => {
    setSortKey(null);
  }, [searchTerm]);

  const processedPokemons = useMemo(() => {
    let processablePokemons = [...pokemons];
    if (searchTerm) {
      processablePokemons = processablePokemons.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortKey) {
      processablePokemons.sort((a, b) => {
        const aValue = sortKey === 'id' ? getPokemonIdFromUrl(a.url) : a.name;
        const bValue = sortKey === 'id' ? getPokemonIdFromUrl(b.url) : b.name;
        if (aValue < bValue) return sortDirection === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processablePokemons;
  }, [pokemons, searchTerm, sortKey, sortDirection]);

  return (
    <div>
      <h1>My Pokemon Pokedex (List View)</h1>
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {searchTerm && (
        <div className="sort-controls">
          <div className="sort-group">
            <span>Sort by:</span>
            <button 
              onClick={() => setSortKey('id')}
              className={sortKey === 'id' ? 'active' : ''}
            >
              ID
            </button>
            <button 
              onClick={() => setSortKey('name')}
              className={sortKey === 'name' ? 'active' : ''}
            >
              Name
            </button>
          </div>
          <div className="sort-group">
            <span>Sort direction:</span>
            <button 
              onClick={() => setSortDirection('ascending')}
              className={sortDirection === 'ascending' ? 'active' : ''}
              disabled={!sortKey}
            >
              Ascending
            </button>
            <button 
              onClick={() => setSortDirection('descending')}
              className={sortDirection === 'descending' ? 'active' : ''}
              disabled={!sortKey}
            >
              Descending
            </button>
          </div>
        </div>
      )}

      <div className="list-container">
        {processedPokemons.map(pokemon => {
          const id = getPokemonIdFromUrl(pokemon.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return (
            <Link to={`/details/${id}`} key={pokemon.name} className="list-item-link" state={{ list: processedPokemons }}>
              <div className="list-item">
                <img src={imageUrl} alt={pokemon.name} className="list-item-image" />
                <p>
                  #{id} - {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
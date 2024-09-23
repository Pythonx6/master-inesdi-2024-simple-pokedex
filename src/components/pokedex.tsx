import c from "classnames";
import { useTheme } from "contexts/use-theme";
import { usePokemon, usePokemonList, useTextTransition } from "hooks";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { LedDisplay } from "./led-display";

import "./pokedex.css";

// Definición del tipo para un Pokémon
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{ type: { name: string } }>;
}

// Función para obtener las debilidades en base a los tipos del Pokémon
const getWeaknesses = (types: Array<{ type: { name: string } }>) => {
  const typeWeaknesses: { [key: string]: string[] } = {
    grass: ["fire", "ice", "flying", "bug"],
    fire: ["water", "ground", "rock"],
    water: ["electric", "grass"],
    bug: ["fire", "flying", "rock"],
    poison: ["ground", "psychic"],
    flying: ["electric", "ice", "rock"],
    electric: ["ground"],
    rock: ["water", "grass", "fighting", "ground", "steel"],
    ground: ["water", "grass", "ice"],
    psychic: ["bug", "ghost", "dark"],
    ghost: ["ghost", "dark"],
    dark: ["fighting", "bug", "fairy"],
    steel: ["fire", "fighting", "ground"],
    ice: ["fire", "fighting", "rock", "steel"],
    dragon: ["ice", "dragon", "fairy"],
    fairy: ["poison", "steel"],
    fighting: ["flying", "psychic", "fairy"],
    normal: ["fighting"],
    // Añade más tipos y debilidades según sea necesario
  };

  const weaknesses = new Set<string>();

  types.forEach((typeInfo) => {
    const weaknessesForType = typeWeaknesses[typeInfo.type.name];
    if (weaknessesForType) {
      weaknessesForType.forEach((weakness) => weaknesses.add(weakness));
    }
  });

  return weaknesses.size > 0
    ? Array.from(weaknesses)
    : ["Debilidades no definidas"];
};

export function Pokedex() {
  const { theme } = useTheme();
  const { ready, resetTransition } = useTextTransition();
  const { pokemonList } = usePokemonList();
  const [i, setI] = useState(0);
  const [team, setTeam] = useState<Pokemon[]>([]); // Estado del equipo con el tipo Pokémon definido
  const [buttonDisabled, setButtonDisabled] = useState(false); // Estado para deshabilitar el botón

  const { pokemon: selectedPokemon } = usePokemon(pokemonList[i]);
  const { pokemon: nextPokemon } = usePokemon(pokemonList[i + 1]);

  const prev = () => {
    resetTransition();
    if (i === 0) {
      setI(pokemonList.length - 1);
    }
    setI((i) => i - 1);
  };

  const next = () => {
    resetTransition();
    if (i === pokemonList.length - 1) {
      setI(0);
    }
    setI((i) => i + 1);
  };

  // Función para agregar un Pokémon al equipo
  const addToTeam = () => {
    if (
      selectedPokemon &&
      team.length < 6 &&
      !team.some((p) => p.id === selectedPokemon.id)
    ) {
      setTeam([...team, selectedPokemon]);
    }
  };

  // Efecto que deshabilita el botón si el equipo está lleno
  useEffect(() => {
    if (team.length >= 6) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [team.length]);

  return (
    <div className="container">
      {/* Nueva tabla para mostrar el equipo a la izquierda */}
      <div className="team-table">
        <h4>Equipo seleccionado:</h4>
        <div className="team-grid">
          {team.map((pokemon) => (
            <img
              key={pokemon.id}
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="team-member"
            />
          ))}
        </div>

        {/* Mensaje de equipo completo */}
        {team.length >= 6 && <div className="team-full">*Equipo completo*</div>}
      </div>

      <div className={c("pokedex", `pokedex-${theme}`)}>
        <div className="panel left-panel">
          <div className="screen main-screen">
            {selectedPokemon && (
              <img
                className={c("sprite", ready ? "ready" : "obfuscated")}
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
              />
            )}
          </div>

          {/* Encasillado que contiene el nombre y los tipos */}
          <div className="screen name-display">
            <div className="name">{selectedPokemon?.name}</div>
            <div className="pokemon-types">
              {selectedPokemon?.types?.map((typeInfo) => (
                <span
                  key={typeInfo.type.name}
                  className={`type-${typeInfo.type.name}`}
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Contenedor para la palabra "Debilidades" y las debilidades */}
          <div className="weaknesses-container">
            <div className="weaknesses-label">Debilidades:</div>
            <div className="pokemon-weaknesses">
              {selectedPokemon?.types &&
                getWeaknesses(selectedPokemon.types).map((weakness) => (
                  <span key={weakness}>{weakness}</span>
                ))}
            </div>
          </div>

          {/* Botón para agregar al equipo */}
          <Button onClick={addToTeam} disabled={buttonDisabled}>
            Agregar al equipo
          </Button>
        </div>
        <div className="panel right-panel">
          <div className="controls leds">
            <LedDisplay color="blue" />
            <LedDisplay color="red" />
            <LedDisplay color="yellow" />
          </div>
          <div className="screen second-screen">
            {nextPokemon && (
              <img
                className={c("sprite", ready ? "ready" : "obfuscated")}
                src={nextPokemon.sprites.front_default}
                alt={nextPokemon.name}
              />
            )}
          </div>
          <div className="controls">
            {/* Botón prev con una flecha hacia la izquierda */}
            <Button onClick={prev}>←</Button>

            {/* Botón next con una flecha hacia la derecha */}
            <Button onClick={next}>→</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

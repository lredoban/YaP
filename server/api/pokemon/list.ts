import { defineEventHandler, createError } from "h3";
import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "~/utils/getLanguageEntry";

const P = new Pokedex();

const getPokemonDetails = async (pokemon: Pokedex.NamedAPIResource) => {
  const details = await P.getPokemonByName(pokemon.name);
  const species = await P.getPokemonSpeciesByName(details.id);
  return {
    id: details.id,
    name: getLanguageEntry(species.names, "fr", "name"),
    sprites: details.sprites,
    types: details.types,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const response = await P.getPokemonsList({ limit: 15, offset: 0 });
    const pokemons = await Promise.all(
      response.results.map(async (pokemon) => await getPokemonDetails(pokemon))
    );
    return pokemons;
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

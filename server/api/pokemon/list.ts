import { defineEventHandler, createError } from "h3";
import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "~/utils/getLanguageEntry";

const P = new Pokedex();

const getPokemonDetails = async (
  pokemon: Pokedex.NamedAPIResource,
  locale: string
) => {
  const details = await P.getPokemonByName(pokemon.name);
  const species = await P.getPokemonSpeciesByName(details.id);

  return {
    id: details.id,
    name: getLanguageEntry(species.names, locale, "name"),
    sprites: details.sprites,
    types: details.types,
  };
};

export default defineEventHandler(async (event) => {
  const locale = getHeader(event, "accept-language") ?? "en";

  try {
    const response = await P.getPokemonsList({ limit: 151, offset: 0 });
    const pokemons = await Promise.all(
      response.results.map(
        async (pokemon) => await getPokemonDetails(pokemon, locale)
      )
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

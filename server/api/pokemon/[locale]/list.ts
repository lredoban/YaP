import { defineEventHandler, createError } from "h3";
import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "#shared/utils/getLanguageEntry";

const P = new Pokedex();

const getPokemonDetails = async (
  pokemon: Pokedex.NamedAPIResource,
  locale: string
) => {
  const details = await P.getPokemonByName(pokemon.name);
  const species = await P.getPokemonSpeciesByName(details.id);
  const artwork = details.sprites.other["official-artwork"];

  return {
    id: details.id,
    name: getLanguageEntry(species.names, locale, "name"),
    // Only ship the artwork actually displayed, the full sprites object is huge
    sprites: {
      other: {
        "official-artwork": {
          front_default: artwork.front_default,
          front_shiny: artwork.front_shiny,
        },
      },
    },
    types: details.types,
  };
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // The locale lives in the path (instead of a header) so that each language
  // gets its own URL: required for static generation, where responses are
  // cached and emitted per-URL.
  const locale = getRouterParam(event, "locale") ?? "en";

  try {
    const response = await P.getPokemonsList({
      limit: Number(config.public.maxPokemon),
      offset: 0,
    });
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

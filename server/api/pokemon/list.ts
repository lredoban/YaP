import { defineEventHandler, createError } from "h3";
import Pokedex from "pokedex-promise-v2";

const P = new Pokedex();

export default defineEventHandler(async (event) => {
  try {
    const response = await P.getPokemonsList({ limit: 151, offset: 0 });
    const pokemons = await Promise.all(
      response.results.map(
        async (pokemon) => await P.getPokemonByName(pokemon.name)
      )
    );
    return pokemons.map(({ name, sprites, id }) => ({
      id,
      name,
      sprite: sprites.other["official-artwork"].front_default,
    }));
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

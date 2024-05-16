import Pokedex from "pokedex-promise-v2";

const P = new Pokedex();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    return createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: "Pokémon id is required",
    });
  }

  try {
    const pokemonDetails = await P.getPokemonByName(id);
    return pokemonDetails;
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

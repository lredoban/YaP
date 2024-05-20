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

    const abilities = await Promise.all(
      pokemonDetails.abilities.map(async (ability) => {
        const abilityDetails = await P.getAbilityByName(ability.ability.name);
        return {
          name: ability.ability.name,
          description: abilityDetails.effect_entries.find(
            (entry) => entry.language.name === "en"
          )?.effect,
        };
      })
    );

    return {
      ...pokemonDetails,
      abilities,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

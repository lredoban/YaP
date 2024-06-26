import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "~/utils/getLanguageEntry";

const P = new Pokedex();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const locale = getHeader(event, "accept-language") ?? "en";

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
          name: getLanguageEntry(abilityDetails.names, locale, "name"),
          description: getLanguageEntry(
            abilityDetails.effect_entries,
            locale,
            "effect"
          ),
        };
      })
    );
    const speciesRes = await P.getPokemonSpeciesByName(id);

    return {
      ...pokemonDetails,
      abilities,
      name: getLanguageEntry(speciesRes.names, locale, "name"),
      flavor_text: getLanguageEntry(
        speciesRes.flavor_text_entries,
        locale,
        "flavor_text"
      ),
      speciesRes,
      color: speciesRes.color.name,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

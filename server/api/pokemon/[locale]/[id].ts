import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "#shared/utils/getLanguageEntry";

const P = new Pokedex();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  // The locale lives in the path (instead of a header) so that each language
  // gets its own URL: required for static generation, where responses are
  // cached and emitted per-URL.
  const locale = getRouterParam(event, "locale") ?? "en";

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

    const artwork = pokemonDetails.sprites.other["official-artwork"];
    // Keep only the flat sprite URLs (sprites tab) and the displayed artwork:
    // the nested `versions`/`other` objects weigh hundreds of kB per Pokémon
    const flatSprites = Object.fromEntries(
      Object.entries(pokemonDetails.sprites).filter(
        ([, value]) => typeof value === "string"
      )
    );

    return {
      id: pokemonDetails.id,
      name: getLanguageEntry(speciesRes.names, locale, "name"),
      height: pokemonDetails.height,
      weight: pokemonDetails.weight,
      base_experience: pokemonDetails.base_experience,
      stats: pokemonDetails.stats,
      types: pokemonDetails.types,
      cries: pokemonDetails.cries,
      sprites: {
        ...flatSprites,
        other: {
          "official-artwork": {
            front_default: artwork.front_default,
            front_shiny: artwork.front_shiny,
          },
        },
      },
      abilities,
      flavor_text: getLanguageEntry(
        speciesRes.flavor_text_entries,
        locale,
        "flavor_text"
      ),
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

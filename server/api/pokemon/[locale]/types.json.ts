import Pokedex from "pokedex-promise-v2";
import getLanguageEntry from "#shared/utils/getLanguageEntry";
import pokemonTypes from "#shared/utils/pokemonTypes";

const P = new Pokedex();

export default defineEventHandler(async (event) => {
  // The locale lives in the path (instead of a header) so that each language
  // gets its own URL: required for static generation, where responses are
  // cached and emitted per-URL.
  const locale = getRouterParam(event, "locale") ?? "en";

  try {
    const entries = await Promise.all(
      pokemonTypes.map(async (type) => {
        const details = await P.getTypeByName(type);
        return [type, getLanguageEntry(details.names, locale, "name")];
      })
    );
    return Object.fromEntries(entries);
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: error.message,
    });
  }
});

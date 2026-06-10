export default function (
  entries: { language: { name: string }; [key: string]: any }[],
  lang: string,
  key: string
): string {
  const entry =
    entries.find((entry) => entry.language.name === lang) ||
    entries.find((entry) => entry.language.name === "en");
  return entry?.[key];
}

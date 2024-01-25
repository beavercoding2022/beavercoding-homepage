export default function getMostPreferredLanguage(
  acceptLanguage: string | null,
  defaultLanguage = 'en',
) {
  if (!acceptLanguage) {
    return [defaultLanguage, 'q=1'];
  }
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [language, qFactor = 'q=1'] = lang.split(';');
      return [language, qFactor];
    })
    .sort((a, b) => {
      const aQFactor = Number(a[1].split('=')[1]);
      const bQFactor = Number(b[1].split('=')[1]);
      return bQFactor - aQFactor;
    });

  const language = languages[0];
  return language;
}

import type { Language } from '../config/siteConfig';

export async function getI18nContent(lang: Language = 'en') {
  try {
    const content = await import(`../data/json-files/${lang}/i18n.json`);
    return content.default;
  } catch (error) {
    console.error(`Failed to load i18n content for ${lang}:`, error);
    // Fallback to English if the requested language file doesn't exist
    const fallbackContent = await import(`../data/json-files/en/i18n.json`);
    return fallbackContent.default;
  }
}
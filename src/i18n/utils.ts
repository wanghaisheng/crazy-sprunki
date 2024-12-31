import { ui, defaultLang, showDefaultLang } from './ui';
import { i18n as i18nData, type I18nData } from './data';
import {  routes } from './route';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in i18nData) return lang as keyof typeof i18nData;
  return defaultLang;
}

// For reusable UI translations (labels, buttons, etc.)
export function useUITranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

// For site-specific content
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

type NestedValueOf<ObjectType, Path extends string> = 
  Path extends keyof ObjectType 
    ? ObjectType[Path]
    : Path extends `${infer K}.${infer R}`
      ? K extends keyof ObjectType
        ? NestedValueOf<ObjectType[K], R>
        : never
      : never;

function getNestedValue<T>(obj: Record<string, any>, path: string | undefined): T | undefined {
  if (!path) return obj as T;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) as T | undefined;
}

export function i18n<Path extends NestedKeyOf<I18nData> | undefined = undefined>(
  path?: Path,
  url?: URL
): Path extends undefined 
  ? I18nData 
  : Path extends NestedKeyOf<I18nData> 
    ? NestedValueOf<I18nData, Path> 
    : never {
  // Use provided URL or fallback to default language
  const currentLang = url ? getLangFromUrl(url) : defaultLang;
  
  if (!path) {
    return (i18nData[currentLang] || i18nData[defaultLang]) as any;
  }

  const value = getNestedValue<NestedValueOf<I18nData, Path extends NestedKeyOf<I18nData> ? Path : never>>(
    i18nData[currentLang],
    path
  ) || getNestedValue<NestedValueOf<I18nData, Path extends NestedKeyOf<I18nData> ? Path : never>>(
    i18nData[defaultLang],
    path
  );

  return value as any;
}

// Type helpers
export type HomeSection = I18nData['home'];

// Typed helper for site-specific content
export function i18nPath<Path extends NestedKeyOf<I18nData>>(
  path: Path,
  url?: URL
): NestedValueOf<I18nData, Path> {
  return i18n(path, url);
}





export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll('/', '')
    const hasTranslation = defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined
    const translatedPath = hasTranslation ? '/' + routes[l][pathName] : path

    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`
  }
}



export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    return route[path] !== undefined ? route[path] : undefined;
  }

  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined  => {
      return Object.keys(obj).find((key) => obj[key] === value);
  }

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}
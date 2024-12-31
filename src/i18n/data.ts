import enData from '../data/json-files/en/i18n.json';
import zhData from '../data/json-files/zh/i18n.json';
import frData from '../data/json-files/fr/i18n.json';
import {defaultLang} from './ui'
export const languages = {
  en: 'English',
  fr: 'Français',
  zh: '中文'
} as const;


export const i18n = {
  en: enData,
  fr: frData,
  zh: zhData,
} as const;

// Type for accessing translations
export type I18nData = typeof i18n[typeof defaultLang];
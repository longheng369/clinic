// ponytail: only shared chrome strings are keyed so far; page-level literals
// stay English until a second pass extracts them into resources/js/locales.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import km from '@/locales/km.json';

const stored = localStorage.getItem('lang');
const lng =
  stored === 'km' || stored === 'en'
    ? stored
    : navigator.language.startsWith('km')
      ? 'km'
      : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
  },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const setLang = (lang: 'en' | 'km') => {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  void i18n.changeLanguage(lang);
};

document.documentElement.lang = lng;

export default i18n;

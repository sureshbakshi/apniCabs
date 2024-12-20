import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import en from './src/translations/en.json';
import hi from './src/translations/hi-in.json';

// Detect the device language
const resources = { en: { translation: en }, hi: { translation: hi } };

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // Ensure compatibility
    fallbackLng: 'en', // Default language
    lng: 'en', // Set the current language
    resources, // Add all translations
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { LANGUAGES } from 'consts/languages.const';

const options = {
  fallbackLng: LANGUAGES.HE,
  supportedLngs: [LANGUAGES.HE],
  debug: true,
  lng: LANGUAGES.HE,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: true,
  },
};
i18n.use(HttpApi).use(initReactI18next).init(options);

export default i18n;

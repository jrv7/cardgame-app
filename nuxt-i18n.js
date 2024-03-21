

import enUS from './locales/en-US.json';
import frFR from './locales/fr-FR.json';
export default {
    legacy: false,
    locale: 'en-US',
    detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'fid_language',
        alwaysRedirect: true,
        fallbackLocale: 'en-US'
    },
    messages: {
        "en-US": enUS,
        "fr-FR": frFR
    },
    missing: (e, word) => {
        const stateHandler = useStateHandler();
        stateHandler.logMissingTranslation(e, word);
    }
}
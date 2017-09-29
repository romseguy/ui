import getLang from 'helpers/getLang'
import { settingsActions } from 'core/settings'


const i18nOptions = {
  fallbackLng: 'en',

  lng: getLang(),

  whitelist: ['en', 'fr'],

  react: {
    wait: true, // globally set to wait for loaded translations in translate hoc
    // exposeNamespace: true // exposes namespace on data-i18next-options to be used in eg. locize-editor
  },

  // have a common namespace used around the full app
  ns: ['common', 'canvas', 'errors', 'form', 'header', 'map'],
  defaultNS: 'common',

  backend: {
    loadPath: `${process.env.REACT_APP_LOCALES_URL}/{{lng}}/{{ns}}.json`,
    crossDomain: true
  },

  debug: window.log && process.env.NODE_ENV === 'development',

  // cache: {
  //   enabled: true
  // },

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: function(value, format, lng) {
      if (format === 'uppercase') return value.toUpperCase()
      return value
    }
  }
}

export default function initializeI18n(i18n, store) {
  i18n.init(i18nOptions, function i18nInitialized() {
    store.dispatch(settingsActions.i18nInitialized())
  })
}

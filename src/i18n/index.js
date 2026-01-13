import { createI18n } from 'vue-i18n'
import zhTW from './zh-TW'
import enUS from './en-US'

const savedLocale = localStorage.getItem('maplio_locale')
const browserLocale = navigator.language.includes('en') ? 'en-US' : 'zh-TW'

const i18n = createI18n({
    legacy: false,
    locale: savedLocale || browserLocale,
    fallbackLocale: 'en-US',
    messages: {
        'zh-TW': zhTW,
        'en-US': enUS
    }
})

export default i18n

import i18n from '../i18n'

export const getDayDate = (startDate, dayIndex) => {
    if (!startDate) return ''
    const date = new Date(startDate)
    date.setDate(date.getDate() + dayIndex)

    const currentLocale = i18n.global.locale.value
    const weekdayFormat = currentLocale === 'zh-TW' ? 'narrow' : 'short'

    const dayName = date.toLocaleDateString(currentLocale, { weekday: weekdayFormat })
    return `${date.getMonth() + 1}/${date.getDate()} (${dayName})`
}

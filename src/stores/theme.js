import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { themes } from '../utils/themeUtils'

export const useThemeStore = defineStore('theme', () => {
    const activeTheme = ref(localStorage.getItem('maplio_theme') || 'dark')

    const activeThemeConfig = computed(() => themes[activeTheme.value] || themes.dark)

    function setTheme(themeKey) {
        if (themes[themeKey]) {
            activeTheme.value = themeKey
        }
    }

    function updateBodyClass() {
        const body = document.body
        Object.values(themes).forEach((config) => {
            const classes = config.appClass.split(' ')
            body.classList.remove(...classes)
        })
        const activeClasses = activeThemeConfig.value.appClass.split(' ')
        body.classList.add(...activeClasses)
        body.classList.add('transition-colors', 'duration-500')
    }

    watch(
        activeTheme,
        (newTheme) => {
            localStorage.setItem('maplio_theme', newTheme)
            updateBodyClass()
        },
        { immediate: true }
    )

    return {
        activeTheme,
        activeThemeConfig,
        setTheme
    }
})

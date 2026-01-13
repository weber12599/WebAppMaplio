<template>
    <header
        :class="[
            'p-4 md:p-6 md:px-10 flex justify-between items-center z-30 shrink-0 border-b transition-colors duration-500',
            themeClass
        ]"
        :style="{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }"
    >
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 select-none hover:opacity-80 transition-opacity">
                <img
                    :src="logoSrc"
                    alt="Maplio"
                    class="h-8 md:h-10 w-auto object-contain"
                    @click="$emit('back')"
                />
            </div>

            <span v-if="currentTrip" class="hidden md:block opacity-20">/</span>
            <span
                v-if="currentTrip"
                class="hidden md:block font-bold truncate max-w-[200px] opacity-60"
                >{{ currentTrip.name }}</span
            >
        </div>

        <div class="flex items-center gap-3 md:gap-4">
            <div
                class="relative flex items-center justify-center opacity-40 hover:opacity-100 transition-all px-2 cursor-pointer"
                :title="$t('app.change_lang')"
            >
                <i class="fa-solid fa-globe text-lg"></i>
                <select
                    v-model="$i18n.locale"
                    @change="handleLanguageChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
                >
                    <option value="zh-TW">繁體中文</option>
                    <option value="en-US">English</option>
                </select>
            </div>

            <div
                class="relative flex items-center justify-center hover:opacity-100 transition-all px-2 cursor-pointer"
                :title="$t('app.change_theme')"
            >
                <i
                    class="fa-solid text-lg opacity-40"
                    :class="currentTheme === 'muji' ? 'fa-sun' : 'fa-moon'"
                ></i>

                <select
                    :value="currentTheme"
                    @change="$emit('update-theme', $event.target.value)"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
                >
                    <option v-for="(t, key) in themeOptions" :key="key" :value="key">
                        {{ $t(`theme.${key}`) }}
                    </option>
                </select>
            </div>

            <button
                @click="showVersionInfo"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                :title="$t('app.about')"
            >
                <i class="fa-solid fa-circle-info"></i>
            </button>

            <button
                @click="$emit('logout')"
                class="opacity-40 hover:opacity-100 hover:text-red-400 transition-all px-2"
                :title="$t('app.logout')"
            >
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>

            <button
                v-if="!currentTrip"
                @click="$emit('import')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                :title="$t('app.import_json')"
            >
                <i class="fa-solid fa-file-import"></i>
            </button>

            <button
                v-if="currentTrip"
                @click="$emit('share')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                :title="$t('app.share_trip')"
            >
                <i class="fa-solid fa-share-nodes"></i>
            </button>

            <button
                v-if="showAddButton"
                @click="$emit('create')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                :title="$t('app.new_trip')"
            >
                <i class="fa-solid fa-plus mr-1"></i>
            </button>
        </div>
    </header>
</template>

<script>
import { themes } from '../../utils/themeUtils'
import { useI18n } from 'vue-i18n'

export default {
    emits: ['back', 'update-theme', 'logout', 'import', 'share', 'create'],
    props: [
        'user',
        'currentTrip',
        'isDemo',
        'showAddButton',
        'currentTheme',
        'themeClass',
        'appVersion'
    ],
    setup() {
        const { t, locale } = useI18n()

        const handleLanguageChange = (e) => {
            const lang = e.target.value
            localStorage.setItem('maplio_locale', lang)
        }

        return { t, locale, handleLanguageChange }
    },
    data() {
        return { themeOptions: themes }
    },
    computed: {
        logoSrc() {
            return this.currentTheme === 'muji' ? '/logos/logo.svg?v=2' : '/logos/logo-dark.svg?v=2'
        }
    },
    methods: {
        showVersionInfo() {
            const mode = this.isDemo ? this.t('app.mode_demo') : this.t('app.mode_cloud')
            const unknown = this.t('app.unknown')

            alert(
                `Maplio ${this.t('app.version_info')}\n${this.t('app.current_version')}: ${this.appVersion || unknown}\n${this.t('app.env')}: ${mode}`
            )
        }
    }
}
</script>

<template>
    <header
        :class="[
            'p-4 md:p-6 md:px-10 flex justify-between items-center z-30 shrink-0 border-b transition-colors duration-500',
            themeClass
        ]"
        :style="{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }"
    >
        <div class="flex items-center gap-4">
            <!-- <h1
                class="text-xl md:text-2xl font-bold cursor-pointer tracking-tight select-none"
                @click="$emit('back')"
            >
                Maplio
            </h1> -->

            <router-link
                to="/"
                class="flex items-center gap-2 select-none hover:opacity-80 transition-opacity"
            >
                <img :src="logoSrc" alt="Maplio" class="h-8 md:h-10 w-auto object-contain" />
            </router-link>

            <select
                :value="currentTheme"
                @change="$emit('update-theme', $event.target.value)"
                class="bg-transparent border border-current opacity-40 rounded px-2 py-1 text-[10px] outline-none cursor-pointer hover:opacity-100 transition-opacity"
            >
                <option
                    v-for="(t, key) in themeOptions"
                    :key="key"
                    :value="key"
                    class="text-stone-800"
                >
                    {{ t.name }}
                </option>
            </select>

            <span v-if="currentTrip" class="hidden md:block opacity-20">/</span>
            <span
                v-if="currentTrip"
                class="hidden md:block font-bold truncate max-w-[200px] opacity-60"
                >{{ currentTrip.name }}</span
            >
        </div>

        <div class="flex items-center gap-3 md:gap-4">
            <button
                @click="showVersionInfo"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                title="關於 Maplio"
            >
                <i class="fa-solid fa-circle-info"></i>
            </button>

            <button
                @click="$emit('logout')"
                class="opacity-40 hover:opacity-100 hover:text-red-400 transition-all px-2"
                title="登出"
            >
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>

            <button
                v-if="!currentTrip"
                @click="$emit('import')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                title="從剪貼簿匯入 JSON"
            >
                <i class="fa-solid fa-file-import"></i>
            </button>

            <button
                v-if="currentTrip"
                @click="$emit('share')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                title="分享旅程"
            >
                <i class="fa-solid fa-share-nodes"></i>
            </button>

            <button
                v-if="showAddButton"
                @click="$emit('create')"
                class="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all px-2"
                title="新增旅程"
            >
                <i class="fa-solid fa-plus mr-1"></i>
            </button>
        </div>
    </header>
</template>

<script>
import { themes } from '../../utils/themeUtils'
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
    data() {
        return { themeOptions: themes }
    },
    computed: {
        logoSrc() {
            const config = this.themeOptions[this.currentTheme]

            if (!config) return '/logos/logo-dark.svg?v=2'

            return config.name === '淺色' ? '/logos/logo.svg?v=2' : '/logos/logo-dark.svg?v=2'
        }
    },
    methods: {
        showVersionInfo() {
            alert(
                `Maplio 版本資訊\n當前版本: ${this.appVersion || '未知'}\n環境: ${this.isDemo ? 'Demo 模式' : '雲端同步模式'}`
            )
        }
    }
}
</script>

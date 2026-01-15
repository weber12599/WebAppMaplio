<template>
    <div class="relative">
        <div class="relative">
            <div
                class="absolute left-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none z-10"
            >
                <i
                    v-if="!loading"
                    :class="[
                        'fa-solid fa-magnifying-glass transition-colors',
                        themeConfig.searchIconClass
                    ]"
                ></i>
                <i
                    v-else
                    :class="[
                        'fa-solid fa-circle-notch fa-spin transition-colors',
                        themeConfig.loadingIconClass
                    ]"
                ></i>
            </div>

            <input
                v-model="query"
                @keydown.enter="$emit('search', query)"
                :placeholder="$t('planner.search_placeholder')"
                :class="[
                    'w-full pl-12 pr-12 py-4 rounded-2xl text-sm outline-none border transition-all duration-500 shadow-sm',
                    themeConfig.inputClass
                ]"
            />

            <button
                v-if="query"
                @click="clear"
                :class="[
                    'absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-black/5 active:scale-90',
                    themeConfig.searchIconClass
                ]"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div
            v-if="results.length > 0"
            :class="[
                'absolute w-full mt-2 border rounded-2xl shadow-2xl z-[100] overflow-hidden transition-colors duration-500',
                themeConfig.cardClass
            ]"
        >
            <button
                v-for="res in results"
                :key="res.place_id"
                @click="$emit('select', res)"
                :class="[
                    'w-full text-left px-4 py-4 border-b last:border-none transition-colors',
                    themeConfig.dropdownItemClass
                ]"
            >
                <div class="font-bold text-sm">
                    {{ res.display_name.split(',')[0] }}
                </div>
                <div class="text-[10px] opacity-50 truncate">
                    {{ res.display_name }}
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    results: Array,
    loading: Boolean,
    themeConfig: Object
})

const emit = defineEmits(['search', 'select', 'clear'])

const query = ref('')

const clear = () => {
    query.value = ''
    emit('clear')
}

defineExpose({
    clear
})
</script>

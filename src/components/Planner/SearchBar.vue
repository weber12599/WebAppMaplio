<template>
    <div class="relative">
        <div class="relative">
            <i
                v-if="!loading"
                :class="[
                    'fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
                    themeConfig.searchIconClass
                ]"
            ></i>
            <i
                v-else
                :class="[
                    'fa-solid fa-circle-notch fa-spin absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
                    themeConfig.loadingIconClass
                ]"
            ></i>

            <input
                v-model="query"
                @keydown.enter="$emit('search', query)"
                :placeholder="$t('planner.search_placeholder')"
                :class="[
                    'w-full pl-12 pr-4 py-4 rounded-2xl text-sm outline-none border transition-all duration-500 shadow-sm',
                    themeConfig.inputClass
                ]"
            />
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

<script>
export default {
    props: {
        results: Array,
        loading: Boolean,
        themeConfig: Object
    },
    data() {
        return { query: '' }
    },
    methods: {
        clear() {
            this.query = ''
        }
    }
}
</script>

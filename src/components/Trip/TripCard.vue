<template>
    <div
        @click="$emit('select', trip)"
        :class="[
            'p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer group shadow-lg flex flex-col h-full justify-between',
            themeConfig.cardClass
        ]"
    >
        <div class="flex flex-col h-full justify-between">
            <div>
                <h3 class="font-bold text-2xl transition-colors tracking-tight">
                    {{ trip.name }}
                </h3>
                <div class="mt-4 flex items-center gap-3 opacity-50 text-sm font-medium">
                    <span class="flex items-center gap-1.5">
                        <i class="fa-regular fa-calendar"></i> {{ trip.startDate }}
                    </span>
                    <span class="opacity-30">·</span>
                    <span>{{ trip.itinerary.length }} {{ $t('common.days') }}</span>
                </div>
            </div>
            <div class="mt-8 flex justify-between items-center">
                <button
                    @click.stop="confirmDelete"
                    class="opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                >
                    <i class="fa-solid fa-trash-can"></i>
                </button>

                <div
                    :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        themeConfig.actionBtnClass
                    ]"
                >
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
    props: {
        trip: Object,
        themeConfig: Object
    },
    emits: ['select', 'delete'],
    setup() {
        const { t } = useI18n()
        return { t }
    },
    methods: {
        confirmDelete() {
            if (confirm(this.t('trip_card.delete_confirm', { name: this.trip.name }))) {
                this.$emit('delete', this.trip.id)
            }
        }
    }
}
</script>

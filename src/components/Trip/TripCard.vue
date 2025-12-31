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
                    <span>{{ trip.itinerary.length }} 天</span>
                </div>
            </div>
            <div class="mt-8 flex justify-between items-center">
                <button
                    @click.stop="$emit('delete', trip.id)"
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
export default {
    props: {
        trip: Object,
        themeConfig: Object
    },
    emits: ['select', 'delete']
}
</script>

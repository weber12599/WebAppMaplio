<template>
    <div
        v-if="isOpen"
        :class="[
            'fixed inset-0 z-[30000] flex items-center justify-center p-4 transition-colors duration-500',
            themeConfig.dialogOverlayClass
        ]"
    >
        <div
            :class="[
                'w-full max-w-sm rounded-[2rem] p-6 border transition-all duration-500 space-y-4',
                themeConfig.dialogContainerClass
            ]"
        >
            <h3 :class="['text-lg font-bold text-center', themeConfig.dialogTitleClass]">
                {{ $t('planner.copy_dialog_title') }}
            </h3>

            <div class="py-2">
                <p class="text-xs opacity-60 mb-3 text-center">
                    {{ $t('planner.copy_dialog_hint') }}
                </p>
                <div
                    class="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scroll"
                >
                    <button
                        v-for="(day, index) in totalDays"
                        :key="index"
                        @click="toggleDay(index)"
                        :disabled="index === currentDay"
                        :class="[
                            'py-2.5 rounded-xl border text-sm font-bold transition-all relative',
                            index === currentDay
                                ? 'opacity-30 cursor-not-allowed border-transparent bg-stone-200/50 text-stone-500'
                                : selectedDays.includes(index)
                                  ? themeConfig.primaryBtnClass
                                  : themeConfig.secondaryBtnClass
                        ]"
                    >
                        {{ $t('planner.day_n', { n: index + 1 }) }}
                        <i
                            v-if="selectedDays.includes(index)"
                            class="fa-solid fa-check absolute top-1 right-1 text-[8px]"
                        ></i>
                    </button>
                </div>
            </div>

            <div class="flex gap-3 pt-2">
                <button
                    @click="$emit('close')"
                    :class="[
                        'flex-grow py-2.5 font-bold rounded-xl transition-colors',
                        themeConfig.dialogCancelBtnClass
                    ]"
                >
                    {{ $t('common.cancel') }}
                </button>
                <button
                    @click="confirm"
                    :disabled="selectedDays.length === 0"
                    :class="[
                        'flex-grow py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95',
                        selectedDays.length === 0
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                            : themeConfig.primaryBtnClass
                    ]"
                >
                    {{ $t('planner.copy_dialog_confirm', { count: selectedDays.length }) }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    totalDays: Number,
    currentDay: Number,
    themeConfig: Object
})

const emit = defineEmits(['close', 'confirm'])

const selectedDays = ref([])

watch(
    () => props.isOpen,
    (val) => {
        if (val) {
            selectedDays.value = []
        }
    }
)

const toggleDay = (idx) => {
    if (idx === props.currentDay) return
    const pos = selectedDays.value.indexOf(idx)
    if (pos > -1) {
        selectedDays.value.splice(pos, 1)
    } else {
        selectedDays.value.push(idx)
    }
}

const confirm = () => {
    emit('confirm', selectedDays.value)
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.3);
    border-radius: 20px;
}
</style>

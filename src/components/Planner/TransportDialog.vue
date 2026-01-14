<template>
    <div
        :class="[
            'fixed inset-0 z-[30000] flex items-center justify-center p-4 transition-colors duration-500',
            themeConfig.dialogOverlayClass
        ]"
    >
        <div
            :class="[
                'w-full max-w-md rounded-[2.5rem] p-8 border transition-all duration-500 space-y-6',
                themeConfig.dialogContainerClass
            ]"
        >
            <h3 :class="['text-xl font-black transition-colors', themeConfig.dialogTitleClass]">
                {{ $t('planner.transport_dialog.title') }}
            </h3>

            <div class="space-y-4">
                <div>
                    <label
                        :class="[
                            'text-[10px] font-black uppercase ml-1 transition-colors',
                            themeConfig.dialogLabelClass
                        ]"
                        >{{ $t('planner.transport_dialog.label_mode') }}</label
                    >
                    <select
                        v-model="localSpot.travelMode"
                        :class="[
                            'w-full rounded-xl px-4 py-3 outline-none border transition-all cursor-pointer font-bold',
                            themeConfig.dialogInputClass
                        ]"
                    >
                        <option value="auto">{{ $t('planner.transport.auto') }}</option>
                        <option value="driving">{{ $t('planner.transport.driving') }}</option>
                        <option value="transit">{{ $t('planner.transport.transit') }}</option>
                        <option value="walking">{{ $t('planner.transport.walking') }}</option>
                    </select>
                </div>

                <div class="flex gap-4">
                    <div class="flex-grow">
                        <label
                            :class="[
                                'text-[10px] font-black uppercase ml-1 transition-colors',
                                themeConfig.dialogLabelClass
                            ]"
                            >{{ $t('planner.transport_dialog.label_departure') }}</label
                        >
                        <input
                            type="time"
                            v-model="localSpot.transStart"
                            :class="[
                                'w-full rounded-xl px-3 py-2 text-[11px] outline-none border transition-all',
                                themeConfig.dialogInputClass
                            ]"
                        />
                    </div>
                    <div class="flex-grow">
                        <label
                            :class="[
                                'text-[10px] font-black uppercase ml-1 transition-colors',
                                themeConfig.dialogLabelClass
                            ]"
                            >{{ $t('planner.transport_dialog.label_arrival') }}</label
                        >
                        <input
                            type="time"
                            v-model="localSpot.transEnd"
                            :class="[
                                'w-full rounded-xl px-3 py-2 text-[11px] outline-none border transition-all',
                                themeConfig.dialogInputClass
                            ]"
                        />
                    </div>
                </div>

                <div>
                    <label
                        :class="[
                            'text-[10px] font-black uppercase ml-1 transition-colors',
                            themeConfig.dialogLabelClass
                        ]"
                        >{{ $t('planner.transport_dialog.label_notes') }}</label
                    >
                    <textarea
                        v-model="localSpot.transportNotes"
                        :placeholder="$t('planner.transport_dialog.placeholder_notes')"
                        :class="[
                            'w-full rounded-xl px-4 py-3 text-xs outline-none resize-none h-24 border transition-all',
                            themeConfig.dialogInputClass
                        ]"
                    ></textarea>
                </div>
            </div>

            <div class="flex gap-4 pt-2">
                <button
                    @click="$emit('cancel')"
                    :class="[
                        'flex-grow py-3 font-bold transition-colors',
                        themeConfig.dialogCancelBtnClass
                    ]"
                >
                    {{ $t('common.cancel') }}
                </button>
                <button
                    @click="$emit('confirm', localSpot)"
                    :class="[
                        'flex-grow py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95',
                        themeConfig.primaryBtnClass
                    ]"
                >
                    {{ $t('planner.transport_dialog.btn_save') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: Object,
        themeConfig: Object
    },
    data() {
        return {
            localSpot: JSON.parse(JSON.stringify(this.modelValue))
        }
    }
}
</script>

<template>
    <div
        :class="[
            'fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-colors duration-500',
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
                編輯交通資訊
            </h3>

            <div class="space-y-4">
                <div>
                    <label
                        :class="[
                            'text-[10px] font-black uppercase ml-1 transition-colors',
                            themeConfig.dialogLabelClass
                        ]"
                        >交通方式</label
                    >
                    <select
                        v-model="localSpot.travelMode"
                        :class="[
                            'w-full rounded-xl px-4 py-3 outline-none border transition-all cursor-pointer font-bold',
                            themeConfig.dialogInputClass
                        ]"
                    >
                        <option value="auto">✨ 自動模式</option>
                        <option value="driving">🚗 點對點開車</option>
                        <option value="transit">🚌 大眾運輸</option>
                        <option value="walking">🚶 徒步前往</option>
                    </select>
                </div>

                <div class="flex gap-4">
                    <div class="flex-grow">
                        <label
                            :class="[
                                'text-[10px] font-black uppercase ml-1 transition-colors',
                                themeConfig.dialogLabelClass
                            ]"
                            >預計出發</label
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
                            >預計抵達</label
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
                        >交通備註</label
                    >
                    <textarea
                        v-model="localSpot.transportNotes"
                        placeholder="例如：搭乘 307 號公車、在板橋站轉乘..."
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
                    取消
                </button>
                <button
                    @click="$emit('confirm', localSpot)"
                    :class="[
                        'flex-grow py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95',
                        themeConfig.primaryBtnClass
                    ]"
                >
                    儲存資訊
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
            // 深拷貝，避免在按下確認前直接修改原始資料
            localSpot: JSON.parse(JSON.stringify(this.modelValue))
        }
    }
}
</script>

<template>
    <div
        :class="[
            'font-sans h-dvh flex flex-col overflow-hidden selection:bg-blue-500/30 transition-colors duration-500',
            activeThemeConfig.appClass
        ]"
    >
        <LoginScreen
            v-if="!authStore.user"
            :themeConfig="activeThemeConfig"
            @login="authStore.loginGoogle"
            @demo="authStore.enterDemoMode"
            :appVersion="appVersion"
        />

        <div v-else class="flex flex-col h-full overflow-hidden">
            <AppHeader
                :user="authStore.user"
                :currentTrip="tripStore.currentTrip"
                :isDemo="authStore.isDemoMode"
                :showAddButton="!tripStore.currentTrip && !showCreateForm"
                :currentTheme="themeStore.activeTheme"
                :themeClass="activeThemeConfig.headerClass"
                :appVersion="appVersion"
                @logout="authStore.logout"
                @back="backToList"
                @create="showCreateForm = true"
                @update-theme="themeStore.setTheme"
                @import="handleImportTrip"
                @share="handleShareTrip"
            />

            <main
                class="flex-grow flex flex-col md:flex-row overflow-hidden relative"
                style="
                    padding-left: env(safe-area-inset-left);
                    padding-right: env(safe-area-inset-right);
                "
            >
                <div
                    v-if="!tripStore.currentTrip"
                    class="flex-grow overflow-y-auto p-6 md:p-10 no-scrollbar"
                >
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                    >
                        <TripCard
                            v-for="trip in tripStore.trips"
                            :key="trip.id"
                            :trip="trip"
                            :themeConfig="activeThemeConfig"
                            @select="handleSelectTrip"
                            @delete="tripStore.deleteTrip"
                        />
                    </div>
                </div>

                <template v-else>
                    <aside
                        :class="[
                            'w-full md:w-[450px] lg:w-[500px] flex flex-col h-full md:border-r z-20 shrink-0 transition-colors',
                            activeThemeConfig.sidebarClass
                        ]"
                    >
                        <div
                            class="block md:hidden h-[220px] w-full shrink-0 border-b border-stone-200/50"
                        >
                            <LeafletMap
                                mapId="mobile-map"
                                :spots="tripStore.currentDaySpots"
                                :currentTheme="themeStore.activeTheme"
                            />
                        </div>

                        <DayTabs
                            :itinerary="tripStore.currentTrip.itinerary"
                            v-model:activeDay="tripStore.activeDay"
                            :startDate="tripStore.currentTrip.startDate"
                            :themeConfig="activeThemeConfig"
                            @add-day="tripStore.addDay"
                            @delete-day="tripStore.removeDay"
                        />

                        <div class="flex-grow overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
                            <SearchBar
                                ref="searchBar"
                                :loading="isSearching"
                                :results="searchResults"
                                :themeConfig="activeThemeConfig"
                                @search="handleSearch"
                                @select="handleLocationSelect"
                            />

                            <draggable
                                v-model="currentDaySpotsWritable"
                                group="spots"
                                item-key="id"
                                handle=".drag-handle"
                            >
                                <template #item="{ element, index }">
                                    <SpotItem
                                        :spot="element"
                                        :nextSpot="tripStore.currentDaySpots[index + 1]"
                                        :isLast="index === tripStore.currentDaySpots.length - 1"
                                        :themeConfig="activeThemeConfig"
                                        @edit="startEditSpot"
                                        @copy="initiateCopySpot"
                                        @remove="handleRemoveSpot(index)"
                                        @open-map="openSpotOnMaps"
                                        @update-data="tripStore.saveData"
                                        @edit-transport="startEditTransport"
                                        @navigate="
                                            handleNavigate(
                                                element,
                                                tripStore.currentDaySpots[index + 1]
                                            )
                                        "
                                    />
                                </template>
                            </draggable>

                            <div
                                v-if="tripStore.currentDaySpots.length === 0"
                                :class="[
                                    'text-center py-20 border-2 border-dashed rounded-[3rem] opacity-30',
                                    activeThemeConfig.secondaryBorderClass
                                ]"
                            >
                                <p class="text-sm font-bold">今天還沒安排行程，試試搜尋景點吧！</p>
                            </div>

                            <div
                                v-if="
                                    tripStore.currentTrip &&
                                    tripStore.currentTrip.itinerary.length > 1
                                "
                                class="flex justify-center pt-8"
                            >
                                <button
                                    @click="tripStore.removeDay"
                                    :class="[
                                        'text-xs font-bold transition-all flex items-center gap-2 py-2 px-4 rounded-xl border opacity-40 hover:opacity-100',
                                        themeStore.activeTheme === 'muji'
                                            ? 'border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                                            : 'border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-900/10'
                                    ]"
                                >
                                    <i class="fa-solid fa-trash-can"></i>
                                    刪除 Day {{ tripStore.activeDay + 1 }} 整天行程
                                </button>
                            </div>
                        </div>
                    </aside>

                    <LeafletMap
                        mapId="desktop-map"
                        :spots="tripStore.currentDaySpots"
                        :currentTheme="themeStore.activeTheme"
                        class="hidden md:block"
                    />
                </template>

                <TripCreateForm
                    v-if="showCreateForm"
                    :isDemo="authStore.isDemoMode"
                    :user="authStore.user"
                    :themeConfig="activeThemeConfig"
                    @cancel="showCreateForm = false"
                    @created="handleTripCreated"
                />

                <SpotDialog
                    v-if="showManualSpotForm"
                    v-model="manualSpot"
                    :themeConfig="activeThemeConfig"
                    @cancel="showManualSpotForm = false"
                    @confirm="addManualSpot"
                />

                <TransportDialog
                    v-if="showTransportDialog"
                    v-model="editingTransportSpot"
                    :themeConfig="activeThemeConfig"
                    @cancel="showTransportDialog = false"
                    @confirm="updateTransportInfo"
                />

                <ShareDialog
                    v-if="showShareDialog"
                    :themeConfig="activeThemeConfig"
                    @cancel="showShareDialog = false"
                    @choice="handleShareChoice"
                />

                <CopySpotDialog
                    :isOpen="showCopyDialog"
                    :totalDays="tripStore.currentTrip?.itinerary.length || 0"
                    :currentDay="tripStore.activeDay"
                    :themeConfig="activeThemeConfig"
                    @close="showCopyDialog = false"
                    @confirm="executeCopySpot"
                />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { parseGoogleMapUrl, getNavUrl } from './utils/mapUtils' //

import LoginScreen from './components/Auth/LoginScreen.vue'
import AppHeader from './components/Layout/AppHeader.vue'
import TripCard from './components/Trip/TripCard.vue'
import TripCreateForm from './components/Trip/TripCreateForm.vue'
import SpotItem from './components/Planner/SpotItem.vue'
import SpotDialog from './components/Trip/SpotDialog.vue'
import DayTabs from './components/Planner/DayTabs.vue'
import SearchBar from './components/Planner/SearchBar.vue'
import LeafletMap from './components/Map/LeafletMap.vue'
import TransportDialog from './components/Planner/TransportDialog.vue'
import ShareDialog from './components/Trip/ShareDialog.vue'
import CopySpotDialog from './components/Planner/CopySpotDialog.vue'

import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { useTripStore } from './stores/trip'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const themeStore = useThemeStore()
const tripStore = useTripStore()

const { activeThemeConfig } = storeToRefs(themeStore)
const { user } = storeToRefs(authStore)

const showCreateForm = ref(false)
const showManualSpotForm = ref(false)
const showTransportDialog = ref(false)
const showShareDialog = ref(false)
const showCopyDialog = ref(false)
const manualSpot = ref({})
const editingTransportSpot = ref(null)
const spotToCopy = ref(null)
const searchResults = ref([])
const isSearching = ref(false)
const isEditingExistingSpot = ref(false)
const searchBar = ref(null)

const appVersion = import.meta.env.VITE_APP_VERSION || 'v0.0.0'

const currentDaySpotsWritable = computed({
    get: () => tripStore.currentDaySpots,
    set: (val) => tripStore.updateCurrentDaySpots(val)
})

onMounted(async () => {
    const currentUser = await authStore.initAuthListener()
    if (currentUser || authStore.isDemoMode) {
        tripStore.initTripsListener()
        if (route.params.id) {
            tripStore.checkAndJoinTrip(route.params.id)
        }
    }
})

watch(
    () => route.params.id,
    (newId) => {
        if (!newId) {
            tripStore.currentTrip = null
        } else {
            tripStore.checkAndJoinTrip(newId)
        }
    }
)

watch(user, (newUser) => {
    if (newUser) {
        console.log('偵測到登入，開始載入行程...')
        tripStore.initTripsListener()

        if (route.params.id) {
            tripStore.checkAndJoinTrip(route.params.id)
        }
    } else {
        tripStore.trips = []
        tripStore.currentTrip = null
    }
})

const handleSelectTrip = (trip) => {
    tripStore.selectTrip(trip.id)
    router.push({ name: 'trip', params: { id: trip.id } })
}

const backToList = () => {
    tripStore.currentTrip = null
    router.push('/')
}

const handleTripCreated = () => {
    showCreateForm.value = false
}

const handleSearch = (query) => {
    if (query.startsWith('http')) {
        const parsed = parseGoogleMapUrl(query)
        manualSpot.value = parsed
            ? {
                  ...parsed,
                  url: query,
                  notes: '',
                  timeStart: '',
                  timeEnd: '',
                  showOnMap: true,
                  source: 'google_parsed'
              }
            : {
                  name: '',
                  url: query,
                  notes: '',
                  timeStart: '',
                  timeEnd: '',
                  showOnMap: false,
                  lat: null,
                  lng: null,
                  source: 'url_only'
              }
        isEditingExistingSpot.value = false
        showManualSpotForm.value = true
    } else {
        performKeywordSearch(query)
    }
}

const performKeywordSearch = async (q) => {
    isSearching.value = true
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
        )
        searchResults.value = await res.json()
    } finally {
        isSearching.value = false
    }
}

const handleLocationSelect = (res) => {
    const lat = parseFloat(res.lat)
    const lng = parseFloat(res.lon)
    manualSpot.value = {
        name: res.display_name.split(',')[0],
        lat: isNaN(lat) ? null : lat,
        lng: isNaN(lng) ? null : lng,
        url: `http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`,
        notes: '',
        timeStart: '',
        timeEnd: '',
        showOnMap: true,
        source: 'search'
    }
    showManualSpotForm.value = true
    searchResults.value = []
    if (searchBar.value) searchBar.value.clear()
}

const addManualSpot = (spotData) => {
    const spots = [...tripStore.currentDaySpots]
    if (isEditingExistingSpot.value) {
        const idx = spots.findIndex((s) => s.id === spotData.id)
        if (idx !== -1) spots[idx] = { ...spotData }
    } else {
        const spot = {
            ...spotData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            travelMode: 'auto',
            showOnMap: !!(spotData.lat && spotData.lng)
        }
        spots.push(spot)
    }
    tripStore.updateCurrentDaySpots(spots)
    if (searchBar.value) searchBar.value.clear()
    showManualSpotForm.value = false
}

const startEditSpot = (spot) => {
    manualSpot.value = JSON.parse(JSON.stringify(spot))
    isEditingExistingSpot.value = true
    showManualSpotForm.value = true
}

const handleRemoveSpot = (index) => {
    const spots = [...tripStore.currentDaySpots]
    spots.splice(index, 1)
    tripStore.updateCurrentDaySpots(spots)
}

const startEditTransport = (spot) => {
    editingTransportSpot.value = spot
    showTransportDialog.value = true
}

const updateTransportInfo = (updatedSpotData) => {
    const spots = [...tripStore.currentDaySpots]
    const idx = spots.findIndex((s) => s.id === updatedSpotData.id)
    if (idx !== -1) {
        spots[idx] = { ...updatedSpotData }
        tripStore.updateCurrentDaySpots(spots)
    }
    showTransportDialog.value = false
    editingTransportSpot.value = null
}

const initiateCopySpot = (spot) => {
    spotToCopy.value = spot
    showCopyDialog.value = true
}

const executeCopySpot = async (targetDayIndexes) => {
    if (!spotToCopy.value || !tripStore.currentTrip) return
    try {
        const newItinerary = JSON.parse(JSON.stringify(tripStore.currentTrip.itinerary))

        targetDayIndexes.forEach((dayIdx) => {
            const newSpot = JSON.parse(JSON.stringify(spotToCopy.value))
            newSpot.id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
            if (!newItinerary[dayIdx]) newItinerary[dayIdx] = { spots: [] }
            newItinerary[dayIdx].spots.push(newSpot)
        })

        tripStore.currentTrip.itinerary = newItinerary
        await tripStore.saveData()
        alert(`成功複製景點到 ${targetDayIndexes.length} 個日期！`)
    } catch (error) {
        console.error('複製失敗', error)
        alert('複製失敗，請稍後再試')
    } finally {
        showCopyDialog.value = false
        spotToCopy.value = null
    }
}

const handleImportTrip = async () => {
    try {
        let text = ''
        if (navigator.clipboard && window.isSecureContext) {
            text = await navigator.clipboard.readText()
        } else {
            text = prompt('請在此貼上行程 JSON：')
        }
        if (!text) return

        const importedData = JSON.parse(text)
        if (!importedData.name || !Array.isArray(importedData.itinerary)) {
            throw new Error('無效的行程格式')
        }

        const newTrip = {
            ...importedData,
            id: 'imp_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
            createdAt: new Date().toISOString(),
            members: authStore.isDemoMode ? ['demo-user'] : [authStore.user.uid]
        }

        if (authStore.isDemoMode) {
            tripStore.addLocalTrip(newTrip)
            alert(`成功匯入：${newTrip.name}`)
        } else {
            await saveTripData(newTrip.id, newTrip)
            alert(`行程「${newTrip.name}」已同步至雲端！`)
        }
    } catch (err) {
        console.error('匯入失敗:', err)
        alert('匯入失敗，格式錯誤或權限不足')
    }
}

const handleShareTrip = async () => {
    if (!tripStore.currentTrip) return
    if (authStore.isDemoMode) {
        const tripJson = JSON.stringify(tripStore.currentTrip, null, 2)
        await executeShare('行程 JSON 資料', tripJson, true)
    } else {
        showShareDialog.value = true
    }
}

const handleShareChoice = async (choice) => {
    showShareDialog.value = false
    if (choice === 'url') {
        await executeShare('旅程連結', window.location.href, false)
    } else if (choice === 'json') {
        const tripJson = JSON.stringify(tripStore.currentTrip, null, 2)
        await executeShare('行程 JSON 資料', tripJson, true)
    }
}

const executeShare = async (label, content, isText) => {
    const title = `Maplio ${label}: ${tripStore.currentTrip.name}`
    if (navigator.share) {
        try {
            await navigator.share({ title, [isText ? 'text' : 'url']: content })
            return
        } catch (err) {
            if (err.name === 'AbortError') return
        }
    }
    try {
        await navigator.clipboard.writeText(content)
        alert(`${label} 已複製到剪貼簿！`)
    } catch (err) {
        alert('複製失敗')
    }
}

const openSpotOnMaps = (spot) => {
    window.open(
        spot.url || `http://googleusercontent.com/maps.google.com/?q=${spot.lat},${spot.lng}`,
        '_blank'
    )
}

const handleNavigate = (start, end) => {
    window.open(getNavUrl(start, end, start.travelMode), '_blank')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

<style>
input[type='date'],
input[type='time'],
input[type='number'] {
    -webkit-appearance: none;
    min-width: 0;
    box-sizing: border-box;
    min-height: 2.75rem;
    line-height: 1.25rem;
}
input[type='date'] {
    display: flex;
    align-items: center;
}
</style>

<template>
    <div :id="mapId" class="w-full h-full bg-slate-900 min-h-[220px]"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { themes } from '../../utils/themeUtils'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

export default {
    name: 'LeafletMap',
    props: {
        spots: { type: Array, default: () => [] },
        mapId: { type: String, required: true },
        currentTheme: String
    },
    data() {
        return { map: null, markers: [], tileLayer: null }
    },
    watch: {
        spots: {
            deep: true,
            handler() {
                this.renderMarkers()
            }
        },
        currentTheme(newTheme) {
            this.updateTileLayer(newTheme)
        }
    },
    mounted() {
        this.initMap()
    },
    beforeUnmount() {
        if (this.map) this.map.remove()
    },
    methods: {
        initMap() {
            this.$nextTick(() => {
                if (this.map) return
                this.map = L.map(this.mapId, {
                    zoomControl: false,
                    tap: false,
                    fadeAnimation: true
                }).setView([25.03, 121.56], 13)
                this.updateTileLayer(this.currentTheme)
                const ro = new ResizeObserver(() => {
                    if (this.map) this.map.invalidateSize()
                })
                ro.observe(this.$el)
                this.map.whenReady(() => this.renderMarkers())
            })
        },
        updateTileLayer(themeKey) {
            if (!this.map) return
            if (this.tileLayer) this.map.removeLayer(this.tileLayer)
            const tileUrl = themes[themeKey]?.mapTile || themes.dark.mapTile
            this.tileLayer = L.tileLayer(tileUrl, { updateWhenIdle: true, keepBuffer: 2 }).addTo(
                this.map
            )
        },
        renderMarkers() {
            if (!this.map) return
            this.markers.forEach((m) => this.map.removeLayer(m))
            this.markers = []
            const latlngs = []
            this.spots.forEach((s) => {
                const lat = parseFloat(s.lat)
                const lng = parseFloat(s.lng)
                if (!isNaN(lat) && !isNaN(lng) && s.showOnMap !== false) {
                    const m = L.marker([lat, lng])
                        .addTo(this.map)
                        .bindPopup(`<b style="color:#1e1b4b">${s.name}</b>`)
                    this.markers.push(m)
                    latlngs.push([lat, lng])
                }
            })
            if (latlngs.length > 0 && this.map.getSize().x > 0) {
                this.map.flyToBounds(L.latLngBounds(latlngs), {
                    padding: [30, 30],
                    duration: 0.6,
                    maxZoom: 15
                })
            }
        }
    }
}
</script>

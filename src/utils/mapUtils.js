export const parseGoogleMapUrl = (url) => {
    // 1. 嘗試抓取「標記地點」的座標 (通常在 data 參數中，以 !3d 和 !4d 開頭)
    const pinLatMatch = url.match(/!3d(-?\d+\.\d+)/)
    const pinLngMatch = url.match(/!4d(-?\d+\.\d+)/)

    // 2. 這是原本的邏輯：抓取「視野中心」座標 (作為備用)
    const viewportMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)

    let lat, lng

    // 優先使用標記地點的座標
    if (pinLatMatch && pinLngMatch) {
        lat = parseFloat(pinLatMatch[1])
        lng = parseFloat(pinLngMatch[1])
    }
    // 如果沒有標記座標 (例如只是一個單純的移動地圖連結)，則使用視野中心
    else if (viewportMatch) {
        lat = parseFloat(viewportMatch[1])
        lng = parseFloat(viewportMatch[2])
    }
    // 都沒抓到則回傳 null
    else {
        return null
    }

    // 解析地點名稱 (維持原本邏輯)
    let name = ''
    const nameMatch = url.match(/\/place\/([^\/]+)\//)
    if (nameMatch) name = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '))

    return {
        lat: lat,
        lng: lng,
        name: name || '地圖點'
    }
}

export const parseClipboardCoords = (text) => {
    const regex = /\(?\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\)?/
    const match = text.match(regex)
    return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null
}

export const getNavUrl = (start, end, mode) => {
    if (!start.lat || !start.lng || !end.lat || !end.lng) return ''
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}`
    const modes = { driving: 'driving', transit: 'transit', walking: 'walking' }
    if (modes[mode]) url += `&travelmode=${modes[mode]}`
    return url
}

export const parseGoogleMapUrl = (url) => {
    const pinLatMatch = url.match(/!3d(-?\d+\.\d+)/)
    const pinLngMatch = url.match(/!4d(-?\d+\.\d+)/)

    const viewportMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)

    let lat, lng

    if (pinLatMatch && pinLngMatch) {
        lat = parseFloat(pinLatMatch[1])
        lng = parseFloat(pinLngMatch[1])
    } else if (viewportMatch) {
        lat = parseFloat(viewportMatch[1])
        lng = parseFloat(viewportMatch[2])
    } else {
        return null
    }

    let name = ''
    const nameMatch = url.match(/\/place\/([^\/]+)\//)
    if (nameMatch) name = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '))

    return {
        lat: lat,
        lng: lng,
        name: name || ''
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

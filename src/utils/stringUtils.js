export function formatNote(note) {
    if (!note) return ''

    // 1. Basic XSS protection
    let text = note
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

    // 2. Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    text = text.replace(urlRegex, (url) => {
        return `<a href="${url}" onclick="event.stopPropagation()" target="_blank" rel="noopener noreferrer" class="hover:underline break-all">${url}</a>`
    })

    // 3. Convert newlines to <br>
    return text.replace(/\n/g, '<br>')
}

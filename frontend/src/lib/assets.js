export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
export const API_ORIGIN = API_BASE.replace(/\/?api\/?$/, '')

export function assetUrl(url) {
  if (!url) return null
  if (/^https?:\/\//.test(url)) return url
  return `${API_ORIGIN}${url}`
}

// Simple inline SVG placeholder as default image
export const defaultImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='#222'/>
      <stop offset='100%' stop-color='#000'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='#FFD20A'>No Image</text>
</svg>
`)}`
// YYYY-MM-DD for "today" in the local timezone — used when an action (like
// adding an activity or saving an edit) should bump a lead's Last Activity date.
export function todayISO() {
  const d = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.round((d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / 86400000)

  const display = new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  if (diffDays === 0) return `Today`
  if (diffDays === 1) return `Tomorrow`
  if (diffDays === -1) return `Yesterday`
  return display
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  d.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)
  return d.getTime() < now.getTime()
}

export function relativeFromNow(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.round((now.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Deterministic pastel avatar color from a string, for visual scanning of "Owner" column
const AVATAR_PALETTE = [
  { bg: '#EEEEFE', fg: '#5B5FEF' },
  { bg: '#E5F7F0', fg: '#16A37A' },
  { bg: '#FCEFE5', fg: '#E07A2C' },
  { bg: '#FCEAEA', fg: '#D64545' },
  { bg: '#E8F1FD', fg: '#2F80ED' },
  { bg: '#F4ECFB', fg: '#8B5CF6' },
]

export function avatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

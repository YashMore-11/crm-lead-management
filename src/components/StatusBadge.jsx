const STATUS_STYLES = {
  New: 'bg-status-newBg text-status-new dark:bg-ink-700 dark:text-ink-200',
  Contacted: 'bg-status-contactedBg text-status-contacted dark:bg-blue-500/10 dark:text-blue-300',
  Qualified: 'bg-status-qualifiedBg text-status-qualified dark:bg-emerald-500/10 dark:text-emerald-300',
  Lost: 'bg-status-lostBg text-status-lost dark:bg-red-500/10 dark:text-red-300',
}

const STATUS_DOT = {
  New: 'bg-status-new',
  Contacted: 'bg-status-contacted',
  Qualified: 'bg-status-qualified',
  Lost: 'bg-status-lost',
}

export default function StatusBadge({ status, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1.5' : 'text-xs px-2.5 py-1 gap-1.5'
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${sizeClasses} ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
      {status}
    </span>
  )
}

import { X } from 'lucide-react'
import { STATUSES } from '../data/mockData'

export default function BulkActionBar({ count, onClear, onBulkStatus }) {
  if (count === 0) return null

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 lg:left-[calc(50%+8rem)] z-30 animate-fade-in
        flex items-center gap-3 bg-ink-800 text-white rounded-xl shadow-panel px-4 py-3 max-w-[calc(100vw-2rem)]"
      role="region"
      aria-label="Bulk actions"
    >
      <span className="text-sm font-medium whitespace-nowrap">{count} selected</span>
      <div className="h-5 w-px bg-white/20" />
      <label className="sr-only" htmlFor="bulk-status">Change status for selected leads</label>
      <select
        id="bulk-status"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            onBulkStatus(e.target.value)
            e.target.value = ''
          }
        }}
        className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 border border-white/20 focus:border-accent-dark"
      >
        <option value="" disabled>Set status to…</option>
        {STATUSES.map((s) => (
          <option key={s} value={s} className="text-ink-800">{s}</option>
        ))}
      </select>
      <button
        onClick={onClear}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Clear selection"
      >
        <X size={16} />
      </button>
    </div>
  )
}

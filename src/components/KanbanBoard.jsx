import { useState } from 'react'
import { Phone } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, isOverdue, initials, avatarColor } from '../utils/helpers'
import { STATUSES } from '../data/mockData'

const COLUMN_ACCENT = {
  New: 'border-t-status-new',
  Contacted: 'border-t-status-contacted',
  Qualified: 'border-t-status-qualified',
  Lost: 'border-t-status-lost',
}

export default function KanbanBoard({ leads, onOpenLead, onStatusChange }) {
  const [dragOverCol, setDragOverCol] = useState(null)
  const [draggingId, setDraggingId] = useState(null)

  const columns = STATUSES.map((status) => ({
    status,
    items: leads.filter((l) => l.status === status),
  }))

  if (leads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-6 py-16">
        <p className="text-sm text-ink-400 dark:text-ink-300">No leads match your filters.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 sm:px-6 py-4">
      <div className="flex gap-4 h-full min-w-max">
        {columns.map(({ status, items }) => (
          <div
            key={status}
            className={`
              flex flex-col w-72 shrink-0 bg-ink-50/60 dark:bg-ink-700/40 rounded-xl border-t-[3px] ${COLUMN_ACCENT[status]}
              ${dragOverCol === status ? 'ring-2 ring-accent ring-offset-1' : ''}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(status) }}
            onDragLeave={() => setDragOverCol((c) => (c === status ? null : c))}
            onDrop={(e) => {
              e.preventDefault()
              const id = e.dataTransfer.getData('text/plain') || draggingId
              if (id) onStatusChange(id, status)
              setDragOverCol(null)
              setDraggingId(null)
            }}
          >
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={status} size="sm" />
              </div>
              <span className="text-xs font-semibold text-ink-400 dark:text-ink-300 bg-white dark:bg-ink-800 rounded-full px-2 py-0.5">
                {items.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-[120px]">
              {items.length === 0 && (
                <div className="text-xs text-ink-300 dark:text-ink-500 text-center py-8 border border-dashed border-ink-200 dark:border-ink-600 rounded-lg">
                  Drop a lead here
                </div>
              )}
              {items.map((lead) => {
                const overdue = isOverdue(lead.nextFollowUpDate)
                const avatar = avatarColor(lead.owner)
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', lead.id)
                      setDraggingId(lead.id)
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className={`
                      group relative bg-white dark:bg-ink-800 rounded-lg p-3 shadow-soft cursor-grab active:cursor-grabbing
                      hover:shadow-md hover:-translate-y-0.5 transition-all
                      ${draggingId === lead.id ? 'opacity-40' : ''}
                      ${overdue ? 'border-l-2 border-l-status-lost' : ''}
                    `}
                  >
                    <button
                      onClick={() => onOpenLead(lead)}
                      className="absolute inset-0 w-full h-full rounded-lg text-left"
                      aria-label={`Open ${lead.name} from ${lead.company}, status ${status}`}
                    >
                      <span className="sr-only">Open lead details</span>
                    </button>
                    <p className="font-semibold text-sm text-ink-800 dark:text-white truncate pointer-events-none">{lead.name}</p>
                    <p className="text-xs text-ink-400 dark:text-ink-300 truncate mt-0.5 pointer-events-none">{lead.company}</p>
                    <div className="flex items-center gap-1 text-xs text-ink-400 dark:text-ink-300 mt-2 pointer-events-none">
                      <Phone size={11} aria-hidden="true" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-ink-50 dark:border-ink-700">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold pointer-events-none"
                        style={{ backgroundColor: avatar.bg, color: avatar.fg }}
                        aria-hidden="true"
                        title={lead.owner}
                      >
                        {initials(lead.owner)}
                      </div>
                      {lead.nextFollowUpDate && (
                        <span className={`text-[11px] font-medium ${overdue ? 'text-status-lost' : 'text-ink-400 dark:text-ink-300'}`}>
                          {formatDate(lead.nextFollowUpDate)}
                        </span>
                      )}
                    </div>

                    {/* Keyboard-accessible alternative to drag-and-drop */}
                    <label className="relative z-10 mt-2 flex items-center gap-1 text-[11px] font-medium text-ink-400 dark:text-ink-300 hover:text-accent cursor-pointer w-fit">
                      Move to…
                      <select
                        value={lead.status}
                        onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Move ${lead.name} to a different status column`}
                        className="bg-transparent border border-ink-200 dark:border-ink-600 rounded px-1 py-0.5 text-[11px] focus:border-accent"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

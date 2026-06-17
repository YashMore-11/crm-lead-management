import { Inbox, SearchX, Mail, Phone } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, isOverdue, initials, avatarColor } from '../utils/helpers'

export default function LeadTable({
  leads,
  loading,
  onOpenLead,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  query,
}) {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.has(l.id))

  if (loading) {
    return <TableSkeleton />
  }

  if (leads.length === 0) {
    return query ? <NoResultsState query={query} /> : <EmptyState />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop table */}
      <div className="hidden md:block flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-canvas-light dark:bg-canvas-dark z-10">
            <tr className="text-left text-xs font-semibold text-ink-400 dark:text-ink-300 uppercase tracking-wide border-b border-ink-100 dark:border-ink-700">
              <th scope="col" className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleSelectAll(leads)}
                  aria-label="Select all visible leads"
                  className="w-4 h-4 rounded border-ink-300 text-accent focus:ring-accent cursor-pointer"
                />
              </th>
              <th scope="col" className="py-3 pr-4 min-w-[200px]">Lead Details</th>
              <th scope="col" className="py-3 pr-4 min-w-[160px]">Company</th>
              <th scope="col" className="py-3 pr-4 min-w-[120px]">Status</th>
              <th scope="col" className="py-3 pr-4 min-w-[140px]">Owner</th>
              <th scope="col" className="py-3 pr-4 min-w-[110px]">Last activity</th>
              <th scope="col" className="py-3 pr-4 min-w-[110px]">Next follow-up</th>
              <th scope="col" className="py-3 pr-4 min-w-[200px]">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const overdue = isOverdue(lead.nextFollowUpDate)
              const avatar = avatarColor(lead.owner)
              return (
                <tr
                  key={lead.id}
                  onClick={() => onOpenLead(lead)}
                  className={`
                    group cursor-pointer border-b border-ink-50 dark:border-ink-700/60
                    hover:bg-accent-subtle dark:hover:bg-ink-700/50 transition-colors
                    ${overdue ? 'border-l-2 border-l-status-lost' : 'border-l-2 border-l-transparent'}
                    ${selectedIds.has(lead.id) ? 'bg-accent-subtle/60 dark:bg-ink-700/40' : ''}
                  `}
                >
                  <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => onToggleSelect(lead.id)}
                      aria-label={`Select ${lead.name}`}
                      className="w-4 h-4 rounded border-ink-300 text-accent focus:ring-accent cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4 max-w-[220px] relative">
                    {/* Covers the row so keyboard users can open the detail view by tabbing to one
                        control per row, while screen readers still read each cell's own content. */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenLead(lead) }}
                      className="absolute inset-0 w-full h-full text-left z-0"
                      aria-label={`Open details for ${lead.name}, ${lead.company}, status ${lead.status}`}
                    />
                    <div className="relative font-semibold text-ink-800 dark:text-white pointer-events-none">{lead.name}</div>
                    <div className="relative flex items-center gap-1 text-xs text-ink-400 dark:text-ink-300 mt-0.5 pointer-events-none">
                      <Phone size={11} aria-hidden="true" /> {lead.phone}
                    </div>
                    <div className="relative flex items-center gap-1 text-xs text-ink-400 dark:text-ink-300 mt-0.5 truncate pointer-events-none">
                      <Mail size={11} aria-hidden="true" /> {lead.email}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-600 dark:text-ink-200">{lead.company}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: avatar.bg, color: avatar.fg }}
                        aria-hidden="true"
                      >
                        {initials(lead.owner)}
                      </div>
                      <span className="text-ink-600 dark:text-ink-200 truncate">{lead.owner}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-500 dark:text-ink-300 whitespace-nowrap">
                    {formatDate(lead.lastActivityDate)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {lead.nextFollowUpDate ? (
                      <span className={overdue ? 'text-status-lost font-semibold' : 'text-ink-500 dark:text-ink-300'}>
                        {formatDate(lead.nextFollowUpDate)}
                        {overdue && <span className="ml-1.5 text-[10px] uppercase tracking-wide bg-status-lostBg dark:bg-red-500/10 text-status-lost px-1.5 py-0.5 rounded">Overdue</span>}
                      </span>
                    ) : (
                      <span className="text-ink-300 dark:text-ink-500">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-ink-500 dark:text-ink-300 max-w-[220px] truncate">
                    {lead.remarks || <span className="text-ink-300 dark:text-ink-500">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8} className="text-center pt-3 pb-2">
                <p className="text-xs text-ink-300 dark:text-ink-500">
                  Showing all {leads.length} lead{leads.length === 1 ? '' : 's'}
                </p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex-1 overflow-auto px-4 py-3 space-y-2">
        {leads.map((lead) => {
          const overdue = isOverdue(lead.nextFollowUpDate)
          const avatar = avatarColor(lead.owner)
          return (
            <button
              key={lead.id}
              onClick={() => onOpenLead(lead)}
              className={`
                w-full text-left bg-white dark:bg-ink-800 rounded-xl p-4 shadow-soft
                border-l-[3px] ${overdue ? 'border-l-status-lost' : 'border-l-transparent'}
                active:scale-[0.99] transition-transform
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-800 dark:text-white">{lead.name}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-300">{lead.company}</p>
                </div>
                <StatusBadge status={lead.status} size="sm" />
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-ink-400 dark:text-ink-300">
                <span className="flex items-center gap-1"><Phone size={12} aria-hidden="true" />{lead.phone}</span>
                <span className="flex items-center gap-1 truncate"><Mail size={12} aria-hidden="true" />{lead.email}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-50 dark:border-ink-700">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: avatar.bg, color: avatar.fg }}
                    aria-hidden="true"
                  >
                    {initials(lead.owner)}
                  </div>
                  <span className="text-xs text-ink-500 dark:text-ink-300">{lead.owner}</span>
                </div>
                <span className={`text-xs font-medium ${overdue ? 'text-status-lost' : 'text-ink-400 dark:text-ink-300'}`}>
                  {lead.nextFollowUpDate ? `Follow up: ${formatDate(lead.nextFollowUpDate)}` : 'No follow-up'}
                </span>
              </div>
            </button>
          )
        })}

        {/* End-of-list marker — scrolls with content rather than sitting in a fixed footer,
            so the table gets the full height for scrolling (infinite-scroll style). */}
        <div className="pt-2 pb-1 text-center">
          <p className="text-xs text-ink-300 dark:text-ink-500">
            Showing all {leads.length} lead{leads.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-3" aria-busy="true" aria-label="Loading leads">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
          <div className="skeleton w-4 h-4 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="skeleton h-3.5 w-32 rounded" />
            <div className="skeleton h-2.5 w-24 rounded" />
            <div className="skeleton h-2.5 w-28 rounded hidden sm:block" />
          </div>
          <div className="skeleton h-3.5 w-28 rounded hidden sm:block" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-3.5 w-24 rounded hidden md:block" />
          <div className="skeleton h-3.5 w-20 rounded hidden lg:block" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-14 h-14 rounded-2xl bg-accent-subtle dark:bg-ink-700 flex items-center justify-center mb-4">
        <Inbox size={24} className="text-accent dark:text-accent-dark" aria-hidden="true" />
      </div>
      <h3 className="font-display font-semibold text-ink-800 dark:text-white">No leads yet</h3>
      <p className="text-sm text-ink-400 dark:text-ink-300 mt-1 max-w-xs">
        New leads from your forms, imports, and campaigns will appear here as soon as they come in.
      </p>
    </div>
  )
}

function NoResultsState({ query }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-14 h-14 rounded-2xl bg-ink-50 dark:bg-ink-700 flex items-center justify-center mb-4">
        <SearchX size={24} className="text-ink-400 dark:text-ink-300" aria-hidden="true" />
      </div>
      <h3 className="font-display font-semibold text-ink-800 dark:text-white">No matching leads</h3>
      <p className="text-sm text-ink-400 dark:text-ink-300 mt-1 max-w-xs">
        Nothing matches "{query}". Try a different name, phone number, or email.
      </p>
    </div>
  )
}

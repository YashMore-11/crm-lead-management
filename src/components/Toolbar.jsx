import { Search, ArrowDownUp, Menu, Table2, KanbanSquare, X } from 'lucide-react'
import { STATUSES } from '../data/mockData'

export default function Toolbar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortDir,
  onToggleSort,
  view,
  onViewChange,
  onOpenMobileNav,
  resultCount,
}) {
  return (
    <div className="sticky top-0 z-20 bg-canvas-light/95 dark:bg-canvas-dark/95 backdrop-blur-sm border-b border-ink-100 dark:border-ink-700 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="font-display font-bold text-lg sm:text-xl text-ink-800 dark:text-white mr-auto">
          Leads
          <span className="ml-2 text-sm font-medium text-ink-400 dark:text-ink-300">
            {resultCount}
          </span>
        </h1>

        {/* View switcher */}
        <div
          className="hidden sm:flex items-center bg-ink-100 dark:bg-ink-700 rounded-lg p-1 gap-1"
          role="group"
          aria-label="View"
        >
          <button
            onClick={() => onViewChange('list')}
            aria-pressed={view === 'list'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-white dark:bg-ink-800 text-ink-800 dark:text-white shadow-soft'
                : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-100'
            }`}
          >
            <Table2 size={15} /> List
          </button>
          <button
            onClick={() => onViewChange('kanban')}
            aria-pressed={view === 'kanban'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'kanban'
                ? 'bg-white dark:bg-ink-800 text-ink-800 dark:text-white shadow-soft'
                : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-100'
            }`}
          >
            <KanbanSquare size={15} /> Board
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, phone or email"
            aria-label="Search leads by name, phone or email"
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm placeholder:text-ink-300 dark:placeholder:text-ink-400 focus:border-accent transition-colors"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500 dark:hover:text-ink-100"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <label className="sr-only" htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm font-medium focus:border-accent transition-colors"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Sort by last activity */}
        {view === 'list' && (
          <button
            onClick={onToggleSort}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm font-medium hover:border-accent transition-colors"
            aria-label={`Sort by last activity, currently ${sortDir === 'desc' ? 'newest first' : 'oldest first'}`}
          >
            <ArrowDownUp size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Last activity</span>
            <span className="text-ink-400 dark:text-ink-300 text-xs">
              {sortDir === 'desc' ? 'Newest' : 'Oldest'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

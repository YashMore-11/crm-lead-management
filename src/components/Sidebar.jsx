import { Users, LayoutGrid, BarChart3, Settings, Sun, Moon, Zap } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Leads', icon: Users, active: true },
  { label: 'Pipeline', icon: BarChart3, active: false },
  { label: 'Boards', icon: LayoutGrid, active: false },
  { label: 'Settings', icon: Settings, active: false },
]

export default function Sidebar({ darkMode, onToggleDark, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-slide-in-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 shrink-0 flex flex-col
          bg-ink-800 text-ink-50
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-white" size={18} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Pulse CRM</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Sections">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              aria-current={active ? 'page' : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${active
                  ? 'bg-white/10 text-white'
                  : 'text-ink-300 hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-3">
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white transition-colors"
            aria-pressed={darkMode}
          >
            {darkMode ? <Sun size={18} strokeWidth={2} aria-hidden="true" /> : <Moon size={18} strokeWidth={2} aria-hidden="true" />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
            <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-sm font-semibold text-white">
              AM
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Aarav Mehta</p>
              <p className="text-xs text-ink-300 truncate">Sales Executive</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

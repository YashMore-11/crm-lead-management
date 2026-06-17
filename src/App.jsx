import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import LeadTable from './components/LeadTable'
import KanbanBoard from './components/KanbanBoard'
import LeadDetailDrawer from './components/LeadDetailDrawer'
import BulkActionBar from './components/BulkActionBar'
import { LEADS } from './data/mockData'
import { todayISO } from './utils/helpers'

export default function App() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortDir, setSortDir] = useState('desc')
  const [view, setView] = useState('list')
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  // Activities added via the "Add activity" form, keyed by lead id.
  // generateActivities() returns deterministic mock data, so anything added
  // during the session is layered on top here rather than mutating that data.
  const [extraActivities, setExtraActivities] = useState({})

  // Simulate initial API fetch (loading state)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLeads(LEADS)
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  // Apply dark mode class to <html> for Tailwind darkMode: 'class'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const filteredLeads = useMemo(() => {
    let result = leads

    if (statusFilter !== 'All') {
      result = result.filter((l) => l.status === statusFilter)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
          l.email.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(a.lastActivityDate) - new Date(b.lastActivityDate)
      return sortDir === 'desc' ? -diff : diff
    })

    return result
  }, [leads, query, statusFilter, sortDir])

  function handleStatusChange(leadId, newStatus) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))
    setSelectedLead((prev) => (prev && prev.id === leadId ? { ...prev, status: newStatus } : prev))
  }

  function handleBulkStatus(newStatus) {
    setLeads((prev) =>
      prev.map((l) => (selectedIds.has(l.id) ? { ...l, status: newStatus } : l))
    )
    setSelectedIds(new Set())
  }

  function handleUpdateLead(leadId, updates) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l)))
    setSelectedLead((prev) => (prev && prev.id === leadId ? { ...prev, ...updates } : prev))
  }

  function handleAddActivity(leadId, activity) {
    setExtraActivities((prev) => ({
      ...prev,
      [leadId]: [activity, ...(prev[leadId] || [])],
    }))
    // Adding an activity is itself "activity" on the lead, so bump Last Activity to today
    handleUpdateLead(leadId, { lastActivityDate: todayISO() })
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll(visibleLeads) {
    setSelectedIds((prev) => {
      const allSelected = visibleLeads.every((l) => prev.has(l.id))
      const next = new Set(prev)
      visibleLeads.forEach((l) => (allSelected ? next.delete(l.id) : next.add(l.id)))
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas-light dark:bg-canvas-dark">
      <Sidebar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Toolbar
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortDir={sortDir}
          onToggleSort={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          view={view}
          onViewChange={setView}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          resultCount={loading ? '' : filteredLeads.length}
        />

        {view === 'list' ? (
          <LeadTable
            leads={filteredLeads}
            loading={loading}
            onOpenLead={setSelectedLead}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            query={query}
          />
        ) : (
          <KanbanBoard
            leads={filteredLeads}
            onOpenLead={setSelectedLead}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onUpdateLead={handleUpdateLead}
          onAddActivity={handleAddActivity}
          extraActivities={extraActivities[selectedLead.id] || []}
        />
      )}

      <BulkActionBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onBulkStatus={handleBulkStatus}
      />
    </div>
  )
}

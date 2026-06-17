import { useEffect, useRef, useState } from 'react'
import { X, Phone, Mail, Pencil, Plus, RefreshCw, Building2, Check, StickyNote, MessageCircle, Users } from 'lucide-react'
import StatusBadge from './StatusBadge'
import ActivityTimeline from './ActivityTimeline'
import { generateActivities, STATUSES } from '../data/mockData'
import { initials, avatarColor, todayISO } from '../utils/helpers'

const ACTIVITY_TYPES = [
  { value: 'note', label: 'Note', icon: StickyNote },
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'meeting', label: 'Meeting', icon: Users },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
]

export default function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
  onUpdateLead,
  onAddActivity,
  extraActivities = [],
}) {
  const [activeAction, setActiveAction] = useState(null) // null | 'edit' | 'activity'
  const activeActionRef = useRef(null)
  activeActionRef.current = activeAction
  const [editValues, setEditValues] = useState(null)
  const [activityType, setActivityType] = useState('note')
  const [activityNote, setActivityNote] = useState('')
  const closeBtnRef = useRef(null)
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const firstFieldRef = useRef(null)

  useEffect(() => {
    // Remember what had focus before the drawer opened, so we can restore it on close
    previouslyFocusedRef.current = document.activeElement
    closeBtnRef.current?.focus()
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeActionRef.current) {
          setActiveAction(null)
        } else {
          onClose()
        }
        return
      }

      // Trap focus inside the drawer while it's open
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      // Return focus to whatever opened the drawer (e.g. the table row's "Open details" button)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [onClose])

  // Move focus into whichever form just opened, so keyboard users land on the first field
  useEffect(() => {
    if (activeAction === 'edit' || activeAction === 'activity') {
      firstFieldRef.current?.focus()
    }
  }, [activeAction])

  if (!lead) return null

  const baseActivities = generateActivities(lead.id)
  const activities = [...extraActivities, ...baseActivities]
  const avatar = avatarColor(lead.owner)

  function startEdit() {
    setEditValues({
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      email: lead.email,
      remarks: lead.remarks || '',
    })
    setActiveAction('edit')
  }

  function startAddActivity() {
    setActivityType('note')
    setActivityNote('')
    setActiveAction('activity')
  }

  function cancelAction() {
    setActiveAction(null)
    setEditValues(null)
  }

  function saveEdit(e) {
    e.preventDefault()
    if (!editValues.name.trim() || !editValues.company.trim()) return
    onUpdateLead(lead.id, {
      name: editValues.name.trim(),
      company: editValues.company.trim(),
      phone: editValues.phone.trim(),
      email: editValues.email.trim(),
      remarks: editValues.remarks.trim(),
    })
    setActiveAction(null)
    setEditValues(null)
  }

  function submitActivity(e) {
    e.preventDefault()
    if (!activityNote.trim()) return
    const config = ACTIVITY_TYPES.find((t) => t.value === activityType)
    onAddActivity(lead.id, {
      id: `${lead.id}-extra-${Date.now()}`,
      type: activityType,
      title: `${config.label} added`,
      body: activityNote.trim(),
      author: lead.owner,
      timestamp: todayISO(),
    })
    setActivityType('note')
    setActivityNote('')
    setActiveAction(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="lead-detail-title">
      <div
        className="absolute inset-0 bg-black/30 animate-slide-in-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div ref={panelRef} className="relative w-full max-w-lg h-full bg-white dark:bg-ink-800 shadow-panel animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-5 border-b border-ink-100 dark:border-ink-700">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: avatar.bg, color: avatar.fg }}
              aria-hidden="true"
            >
              {initials(lead.name)}
            </div>
            <div className="min-w-0">
              <h2 id="lead-detail-title" className="font-display font-bold text-lg text-ink-800 dark:text-white truncate">
                {lead.name}
              </h2>
              <p className="text-sm text-ink-400 dark:text-ink-300 flex items-center gap-1.5 mt-0.5 truncate">
                <Building2 size={13} aria-hidden="true" /> {lead.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs font-mono text-ink-300 dark:text-ink-500 bg-ink-50 dark:bg-ink-700/60 rounded px-1.5 py-0.5">
              {lead.id}
            </span>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
              aria-label="Close lead details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Summary */}
          <div className="px-5 sm:px-6 py-5 space-y-4 border-b border-ink-100 dark:border-ink-700">
            {activeAction === 'edit' ? (
              <EditLeadForm
                values={editValues}
                onChange={setEditValues}
                onSave={saveEdit}
                onCancel={cancelAction}
                firstFieldRef={firstFieldRef}
              />
            ) : (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <StatusBadge status={lead.status} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-400 dark:text-ink-300">Owned by</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ backgroundColor: avatar.bg, color: avatar.fg }}
                        aria-hidden="true"
                      >
                        {initials(lead.owner)}
                      </div>
                      <span className="text-sm font-medium text-ink-700 dark:text-ink-100">{lead.owner}</span>
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-ink-300 dark:text-ink-400" aria-hidden="true" />
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a href={`tel:${lead.phone}`} className="text-ink-700 dark:text-ink-100 hover:text-accent">{lead.phone}</a>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={14} className="text-ink-300 dark:text-ink-400 shrink-0" aria-hidden="true" />
                    <dt className="sr-only">Email</dt>
                    <dd className="truncate">
                      <a href={`mailto:${lead.email}`} className="text-ink-700 dark:text-ink-100 hover:text-accent">{lead.email}</a>
                    </dd>
                  </div>
                </dl>

                {lead.remarks && (
                  <p className="text-sm text-ink-500 dark:text-ink-300 bg-ink-50 dark:bg-ink-700/50 rounded-lg px-3 py-2">
                    {lead.remarks}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="px-5 sm:px-6 py-4 border-b border-ink-100 dark:border-ink-700">
            <div className="flex flex-wrap gap-2">
              <ActionButton
                icon={Pencil}
                label="Edit lead"
                onClick={() => (activeAction === 'edit' ? cancelAction() : startEdit())}
                active={activeAction === 'edit'}
              />
              <ActionButton
                icon={Plus}
                label="Add activity"
                onClick={() => (activeAction === 'activity' ? cancelAction() : startAddActivity())}
                active={activeAction === 'activity'}
                primary
              />
              <StatusChanger lead={lead} onStatusChange={onStatusChange} />
            </div>

            {activeAction === 'activity' && (
              <AddActivityForm
                activityType={activityType}
                onTypeChange={setActivityType}
                note={activityNote}
                onNoteChange={setActivityNote}
                onSubmit={submitActivity}
                onCancel={cancelAction}
                firstFieldRef={firstFieldRef}
              />
            )}
          </div>

          {/* Activity timeline */}
          <div className="px-5 sm:px-6 py-5">
            <h3 className="font-display font-semibold text-sm text-ink-800 dark:text-white mb-4">
              Activity timeline
            </h3>
            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, label, onClick, primary, active }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${active
          ? 'bg-accent text-white hover:bg-accent/90'
          : primary
            ? 'bg-accent text-white hover:bg-accent/90'
            : 'border border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-100 hover:border-accent hover:text-accent'}
      `}
    >
      <Icon size={15} aria-hidden="true" />
      {label}
    </button>
  )
}

function StatusChanger({ lead, onStatusChange }) {
  return (
    <label className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-100 hover:border-accent hover:text-accent cursor-pointer transition-colors">
      <RefreshCw size={15} aria-hidden="true" />
      Change status
      <select
        value={lead.status}
        onChange={(e) => onStatusChange(lead.id, e.target.value)}
        aria-label="Change lead status"
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </label>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-400 dark:text-ink-300 mb-1">{label}</span>
      {children}
    </label>
  )
}

const fieldClasses =
  'w-full px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-sm text-ink-800 dark:text-white focus:border-accent transition-colors'

function EditLeadForm({ values, onChange, onSave, onCancel, firstFieldRef }) {
  if (!values) return null

  function set(field, value) {
    onChange({ ...values, [field]: value })
  }

  return (
    <form onSubmit={onSave} className="animate-fade-in space-y-3" aria-label="Edit lead">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-ink-800 dark:text-white">Edit lead</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
          aria-label="Cancel editing"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Lead name">
          <input
            ref={firstFieldRef}
            type="text"
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            className={fieldClasses}
          />
        </FormField>
        <FormField label="Company">
          <input
            type="text"
            required
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
            className={fieldClasses}
          />
        </FormField>
        <FormField label="Phone">
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            className={fieldClasses}
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            className={fieldClasses}
          />
        </FormField>
      </div>

      <FormField label="Remarks">
        <textarea
          value={values.remarks}
          onChange={(e) => set('remarks', e.target.value)}
          rows={2}
          className={`${fieldClasses} resize-none`}
        />
      </FormField>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
        >
          <Check size={15} aria-hidden="true" />
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function AddActivityForm({ activityType, onTypeChange, note, onNoteChange, onSubmit, onCancel, firstFieldRef }) {
  return (
    <form onSubmit={onSubmit} className="animate-fade-in mt-3 space-y-3" aria-label="Add activity">
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Activity type">
        {ACTIVITY_TYPES.map(({ value, label, icon: Icon }, i) => (
          <button
            key={value}
            type="button"
            ref={i === 0 ? firstFieldRef : undefined}
            role="radio"
            aria-checked={activityType === value}
            onClick={() => onTypeChange(value)}
            className={`
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${activityType === value
                ? 'bg-accent text-white'
                : 'border border-ink-200 dark:border-ink-600 text-ink-500 dark:text-ink-300 hover:border-accent hover:text-accent'}
            `}
          >
            <Icon size={13} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <FormField label="What happened?">
        <textarea
          required
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
          placeholder="e.g. Called to confirm requirements, will send proposal tomorrow"
          className={`${fieldClasses} resize-none`}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
        >
          <Plus size={15} aria-hidden="true" />
          Add activity
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-lg text-sm font-medium text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

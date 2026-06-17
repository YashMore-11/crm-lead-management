import {
  StickyNote, Paperclip, Phone, Users, MapPin, MessageCircle, Mail, RefreshCw,
} from 'lucide-react'
import { relativeFromNow } from '../utils/helpers'

const ICON_MAP = {
  note: { icon: StickyNote, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  attachment: { icon: Paperclip, color: 'text-ink-500 dark:text-ink-300', bg: 'bg-ink-100 dark:bg-ink-700' },
  call: { icon: Phone, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  meeting: { icon: Users, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  visit: { icon: MapPin, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  whatsapp: { icon: MessageCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  email: { icon: Mail, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10' },
  status: { icon: RefreshCw, color: 'text-accent dark:text-accent-dark', bg: 'bg-accent-subtle dark:bg-accent/10' },
}

export default function ActivityTimeline({ activities }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-ink-400 dark:text-ink-300 py-6 text-center">
        No activity recorded for this lead yet.
      </p>
    )
  }

  return (
    <ol className="relative">
      {activities.map((activity, idx) => {
        const config = ICON_MAP[activity.type] || ICON_MAP.note
        const Icon = config.icon
        const isLast = idx === activities.length - 1
        return (
          <li key={activity.id} className="relative pl-10 pb-5">
            {!isLast && (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-ink-100 dark:bg-ink-700"
                aria-hidden="true"
              />
            )}
            <span
              className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}
              aria-hidden="true"
            >
              <Icon size={15} strokeWidth={2} />
            </span>
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <p className="text-sm font-semibold text-ink-800 dark:text-white">{activity.title}</p>
              <time className="text-xs text-ink-400 dark:text-ink-300 whitespace-nowrap" dateTime={activity.timestamp}>
                {relativeFromNow(activity.timestamp)}
              </time>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5">{activity.body}</p>
            <p className="text-xs text-ink-300 dark:text-ink-500 mt-1">by {activity.author}</p>
          </li>
        )
      })}
    </ol>
  )
}

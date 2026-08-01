import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAdminData } from '../../../hooks/useAdminData'
import { adminService, type BackendLead } from '../../../services/adminService'
import type { LeadStatus } from '../../../context/AdminContext'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Map backend enum → display label
const backendToDisplay: Record<BackendLead['status'], LeadStatus> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CLOSED: 'Closed',
}

// Map display label → backend enum
const displayToBackend: Record<LeadStatus, BackendLead['status']> = {
  New: 'NEW',
  Contacted: 'CONTACTED',
  Closed: 'CLOSED',
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
  )
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Closed']

const statusStyle: Record<LeadStatus, string> = {
  New: 'bg-blue-500/15 text-blue-400',
  Contacted: 'bg-amber-500/15 text-amber-400',
  Closed: 'bg-emerald-500/15 text-emerald-400',
}

// ---------------------------------------------------------------------------
// Message popover
// ---------------------------------------------------------------------------

function MessageCell({ message }: { message: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const TRUNCATE = 55
  const isLong = message.length > TRUNCATE

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative max-w-[240px]">
      <button
        type="button"
        onClick={() => isLong && setOpen((o) => !o)}
        className={`text-left text-sm text-white/70 ${isLong ? 'cursor-pointer hover:text-white' : 'cursor-default'}`}
      >
        {isLong && !open ? message.slice(0, TRUNCATE) + '…' : message}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-2 w-72 rounded-card border border-white/[0.08] bg-brand-darkCard p-4 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Full Message</p>
              <button type="button" onClick={() => setOpen(false)} className="rounded p-0.5 text-white/30 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-white/80">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline status dropdown
// ---------------------------------------------------------------------------

function StatusDropdown({
  status,
  onChange,
}: {
  status: LeadStatus
  onChange: (s: LeadStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80 ${statusStyle[status]}`}
      >
        {status}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute left-0 z-50 mt-1.5 min-w-[110px] overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard shadow-xl"
          >
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/5 ${opt === status ? 'text-brand-gold' : 'text-white/70'}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${opt === 'New' ? 'bg-blue-400' : opt === 'Contacted' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  {opt}
                  {opt === status && <span className="ml-auto text-[10px]">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export default function AdminLeadsView() {
  const { data, isLoading, refreshLeads } = useAdminData()

  // Local state for optimistic status updates
  const [localLeads, setLocalLeads] = useState<BackendLead[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All')

  // Sync from hook when data arrives
  useEffect(() => {
    setLocalLeads(data.leads)
  }, [data.leads])

  const updateStatus = async (id: number, displayStatus: LeadStatus) => {
    const backendStatus = displayToBackend[displayStatus]
    // Optimistic update
    setLocalLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: backendStatus } : l))
    try {
      await adminService.updateLeadStatus(id, backendStatus)
    } catch {
      // Revert on failure
      await refreshLeads()
    }
  }

  // Map to display format
  const displayLeads = localLeads.map((l) => ({
    ...l,
    displayStatus: backendToDisplay[l.status] ?? 'New' as LeadStatus,
  }))

  const filtered = displayLeads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
    const matchStatus = statusFilter === 'All' || l.displayStatus === statusFilter
    return matchSearch && matchStatus
  })

  const counts: Record<LeadStatus | 'All', number> = {
    All:       displayLeads.length,
    New:       displayLeads.filter((l) => l.displayStatus === 'New').length,
    Contacted: displayLeads.filter((l) => l.displayStatus === 'Contacted').length,
    Closed:    displayLeads.filter((l) => l.displayStatus === 'Closed').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Leads</h2>
        <p className="mt-0.5 text-sm text-white/40">
          {isLoading ? 'Loading…' : `${displayLeads.length} enquiries · click status pill to update inline`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="h-10 w-56 rounded-button border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/20 sm:w-64"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
          {(['All', ...STATUS_OPTIONS] as (LeadStatus | 'All')[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setStatusFilter(opt)}
              className={`relative rounded-button px-3.5 py-1.5 text-xs font-medium transition-colors ${statusFilter === opt ? 'text-brand-dark' : 'text-white/50 hover:text-white'}`}
            >
              {statusFilter === opt && (
                <motion.span
                  layoutId="leads-filter-pill"
                  className="absolute inset-0 rounded-button bg-brand-gold"
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">
                {opt}
                <span className="ml-1 opacity-60">({counts[opt]})</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-white/5" />
          ))}
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  {['Name', 'Phone', 'Message', 'Submitted', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 text-center text-sm text-gray-400">No leads match your filters</td>
                  </tr>
                ) : (
                  filtered.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: i * 0.04 }}
                      className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{lead.name}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-gray-600">{lead.phone}</td>
                      <td className="px-5 py-3.5">
                        <MessageCell message={lead.message} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500">
                        {fmtDate(lead.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusDropdown
                          status={lead.displayStatus}
                          onChange={(s) => updateStatus(lead.id, s)}
                        />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { motion } from 'framer-motion'
import {
  Activity,
  Building2,
  DollarSign,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAdminData } from '../../../hooks/useAdminData'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtL(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  return `₹${(n / 100000).toFixed(1)}L`
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

type StatCardProps = {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  iconBg?: string
  iconColor?: string
  delay?: number
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg = 'bg-brand-gold/10',
  iconColor = 'text-brand-gold',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay }}
      className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-white/50">{label}</p>
      <p className="mt-2 text-xs text-white/30">{sub}</p>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Revenue bar chart — sample data (no monthly revenue API endpoint)
// ---------------------------------------------------------------------------

const chartData = [
  { month: 'Mar', revenue: 18.4 },
  { month: 'Apr', revenue: 24.2 },
  { month: 'May', revenue: 31.5 },
  { month: 'Jun', revenue: 38.0 },
  { month: 'Jul', revenue: 27.8 },
  { month: 'Aug', revenue: 42.6 },
]

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-card border border-white/10 bg-brand-dark px-4 py-2.5 shadow-xl">
      <p className="text-xs text-white/40">{label} 2025</p>
      <p className="mt-0.5 text-sm font-bold text-brand-gold">
        ₹{payload[0].value.toFixed(1)}L
      </p>
    </div>
  )
}

function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
      className="overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Revenue Collected</p>
          <p className="mt-0.5 text-xs text-white/40">Sample — 6 months (₹ Lakhs)</p>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
          Illustrative
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v}L`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 6 }} />
          <Bar dataKey="revenue" fill="#C9974A" radius={[6, 6, 0, 0]} opacity={0.9} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton for loading state
// ---------------------------------------------------------------------------

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-card border border-white/[0.08] bg-brand-darkCard p-6 animate-pulse">
          <div className="mb-4 h-11 w-11 rounded-xl bg-white/5" />
          <div className="h-6 w-24 rounded bg-white/5" />
          <div className="mt-2 h-3 w-32 rounded bg-white/5" />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AdminOverviewView
// ---------------------------------------------------------------------------

export default function AdminOverviewView() {
  const { data, isLoading } = useAdminData()
  const overview = data.overview

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-white">Overview</h2>
        <p className="mt-1 text-sm text-white/40">
          {isLoading ? 'Loading…' : 'Live data from database'}
        </p>
      </div>

      {/* 4-card stats row */}
      {isLoading ? (
        <StatsSkeleton />
      ) : overview ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Clients"
            value={String(overview.totalClients)}
            sub={`${overview.activeProjects} with active projects`}
            delay={0}
          />
          <StatCard
            icon={Building2}
            label="Active Projects"
            value={String(overview.activeProjects)}
            sub={`${overview.totalClients - overview.activeProjects} completed`}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-400"
            delay={0.06}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue Collected"
            value={fmtL(overview.totalRevenueCollected)}
            sub="Sum of paid amounts"
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-400"
            delay={0.12}
          />
          <StatCard
            icon={Wallet}
            label="Pending Payments"
            value={fmtL(overview.pendingPayments)}
            sub="Remaining across all projects"
            iconBg="bg-amber-500/10"
            iconColor="text-amber-400"
            delay={0.18}
          />
        </div>
      ) : (
        <div className="rounded-card border border-white/[0.08] bg-brand-darkCard p-8 text-center">
          <p className="text-sm text-white/30">Could not load overview stats.</p>
        </div>
      )}

      {/* Revenue chart */}
      <RevenueChart />

      {/* Recent activity — no API endpoint, show placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.34 }}
        className="overflow-hidden rounded-card border border-white/[0.08] bg-brand-darkCard"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-6 py-4">
          <Activity className="h-4 w-4 text-brand-gold" strokeWidth={1.75} />
          <p className="text-sm font-semibold text-white">Recent Activity</p>
        </div>
        <div className="flex min-h-[120px] items-center justify-center px-6 py-8">
          <p className="text-sm text-white/30">Activity feed coming in a future update.</p>
        </div>
      </motion.div>
    </div>
  )
}

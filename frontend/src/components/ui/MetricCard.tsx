import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useCountUp } from '../../hooks/useCountUp'

interface MetricCardProps {
  label: string
  value: number
  suffix?: string
  decimals?: number
  icon?: ReactNode
  delay?: number
  accent?: string
  /** Override the displayed value (e.g. "4-3-3" for formation) */
  display?: string
}

export function MetricCard({ label, value, suffix = '', decimals = 0, icon, delay = 0, accent = '#a78bfa', display }: MetricCardProps) {
  const animated = useCountUp(value, 900)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 16 }}
      className="glass-deep rounded-2xl px-5 py-4 min-w-[130px] animate-float"
      style={{ animationDelay: `${delay * 2}s` }}
    >
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mb-1.5">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-black tabular-nums" style={{ color: accent }}>
        {display ?? animated.toFixed(decimals)}
        <span className="text-sm font-bold text-zinc-400 ml-0.5">{suffix}</span>
      </div>
    </motion.div>
  )
}

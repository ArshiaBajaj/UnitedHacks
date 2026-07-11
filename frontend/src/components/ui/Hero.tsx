import { motion } from 'framer-motion'
import { Activity, ArrowRight, Gauge, Percent, Shapes, Sparkles, Trophy } from 'lucide-react'
import { computeMetrics } from '../../lib/metrics'
import { useTactixStore } from '../../store/useTactixStore'
import { MetricCard } from './MetricCard'

export function Hero() {
  const setUiPhase = useTactixStore((s) => s.setUiPhase)
  const play = useTactixStore((s) => s.play)
  const currentTime = useTactixStore((s) => s.currentTime)

  // Metrics update from the live looping simulation behind the hero
  const metrics = computeMetrics(play, Math.floor(currentTime))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9 } }}
      className="absolute inset-0 z-40 flex flex-col pointer-events-none"
    >
      {/* Top gradient scrim for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />

      {/* Nav */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 pointer-events-auto"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <Shapes className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight">
            Tactix<span className="text-gradient">3D</span>
          </span>
        </div>
        <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          Live 3D Engine · UnitedHacks 2026
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 80, damping: 18 }}
          className="text-center pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 glass-violet rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Generated Tactical Simulations
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-6">
            The Future of
            <br />
            <span className="text-gradient">Sports Strategy</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Describe any play in plain English. Watch it come alive as a cinematic
            3D simulation. Collaborate live — like Figma, for the beautiful game.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setUiPhase('entering')}
            className="btn-primary group inline-flex items-center gap-2.5 text-white font-bold px-9 py-4 rounded-2xl text-base"
          >
            Enter the Tactics Board
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Live metric cards */}
      <div className="relative z-10 flex items-end justify-center gap-4 px-8 pb-10 flex-wrap pointer-events-auto">
        <MetricCard label="Possession" value={metrics.possession} suffix="%" icon={<Percent className="w-3 h-3" />} delay={0.7} accent="#a78bfa" />
        <MetricCard label="Expected Goals" value={metrics.xg} decimals={1} icon={<Trophy className="w-3 h-3" />} delay={0.8} accent="#38bdf8" />
        <MetricCard label="Sprint Speed" value={metrics.sprintSpeed} suffix=" km/h" decimals={1} icon={<Gauge className="w-3 h-3" />} delay={0.9} accent="#4ade80" />
        <MetricCard label="Formation" value={433} display="4-3-3" icon={<Shapes className="w-3 h-3" />} delay={1.0} accent="#fbbf24" />
        <MetricCard label="Win Probability" value={metrics.winProb} suffix="%" icon={<Activity className="w-3 h-3" />} delay={1.1} accent="#f472b6" />
      </div>
    </motion.div>
  )
}

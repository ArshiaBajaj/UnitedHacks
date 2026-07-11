import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Star,
  TrendingUp,
} from 'lucide-react'
import type { AnalysisResult, PlayerProfile } from '../types'
import { BADGE_ICONS, SKILL_OPTIONS } from '../types'
import { CategoryChart } from './CategoryChart'
import { ScoreRing } from './ScoreRing'

interface ResultsDashboardProps {
  result: AnalysisResult
  profile: PlayerProfile
  onBack: () => void
  onNewAnalysis: () => void
}

export function ResultsDashboard({
  result,
  profile,
  onBack,
  onNewAnalysis,
}: ResultsDashboardProps) {
  const skillLabel = SKILL_OPTIONS.find((s) => s.id === result.skill_type)?.label ?? result.skill_type

  return (
    <div className="gradient-pitch min-h-screen pb-16">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="glass rounded-xl p-2 hover:bg-white/8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-stone-500">Analysis Complete</p>
          <p className="font-bold">{skillLabel}</p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="glass rounded-xl px-3 py-2 text-sm flex items-center gap-1 hover:bg-white/8"
        >
          <RotateCcw className="w-4 h-4" />
          New
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 space-y-6">
        {/* Hero score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-green rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8"
        >
          <ScoreRing score={result.overall_score} />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black mb-2">{result.headline}</h1>
            <p className="text-stone-300 leading-relaxed mb-4">{result.summary}</p>
            <p className="text-sm text-grass-bright italic">"{result.pro_comparison}"</p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                <span className="font-bold text-gold">+{result.xp_earned} XP</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-grass" />
                <span className="text-sm">Level {profile.level}</span>
              </div>
              {result.badges_unlocked.map((badge) => (
                <div
                  key={badge}
                  className="glass rounded-xl px-4 py-2 flex items-center gap-2 border-gold/30"
                >
                  <span>{BADGE_ICONS[badge] ?? '🏅'}</span>
                  <span className="text-sm font-medium text-gold">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-grass" />
              Technique Breakdown
            </h2>
            <CategoryChart categories={result.categories} />
            <div className="space-y-3 mt-2">
              {result.categories.map((cat) => (
                <div key={cat.name} className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-300">{cat.name}</span>
                      <span className="font-bold text-grass">{cat.score}</span>
                    </div>
                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-grass-dim to-grass-bright rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{cat.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fixes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-gold" />
              Top 3 Fixes
            </h2>
            <div className="space-y-4">
              {result.fixes.map((fix, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/5"
                >
                  <span className="w-8 h-8 rounded-lg bg-gold/20 text-gold font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-stone-300 text-sm leading-relaxed">{fix}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Drills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="font-bold mb-6 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-grass" />
            Your Training Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {result.drills.map((drill, i) => (
              <div
                key={drill.name}
                className="rounded-xl p-5 border border-grass/10 bg-grass/5 hover:border-grass/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-grass">
                    Drill {i + 1}
                  </span>
                  <span className="text-xs text-stone-500">{drill.duration}</span>
                </div>
                <h3 className="font-bold mb-2">{drill.name}</h3>
                <p className="text-sm text-stone-400 mb-3 leading-relaxed">{drill.description}</p>
                <p className="text-xs text-grass-bright font-medium">{drill.reps}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

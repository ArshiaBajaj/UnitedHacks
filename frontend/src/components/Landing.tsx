import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Target, Trophy, Zap } from 'lucide-react'
import type { PlayerProfile } from '../types'
import { BADGE_ICONS } from '../types'

interface LandingProps {
  onStart: () => void
  onDemo: () => void
  profile: PlayerProfile
}

export function Landing({ onStart, onDemo, profile }: LandingProps) {
  return (
    <div className="gradient-pitch min-h-screen">
      {/* Pitch lines decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] border-2 border-grass rounded-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-grass rounded-full" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="WinStrats" className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-500/30" />
          <span className="text-xl font-black tracking-tight text-amber-400">
            Win<span className="text-teal-300">Strats</span>
          </span>
        </div>
        {profile.totalXp > 0 && (
          <div className="glass rounded-full px-4 py-1.5 flex items-center gap-3 text-sm">
            <span className="text-gold font-bold">Lv.{profile.level}</span>
            <span className="text-stone-400">{profile.totalXp} XP</span>
            {profile.badges.length > 0 && (
              <span className="text-stone-500">
                {profile.badges.slice(0, 3).map((b) => BADGE_ICONS[b] ?? '🏅').join('')}
              </span>
            )}
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-green rounded-full px-4 py-1.5 text-sm text-grass-bright mb-6">
            <Trophy className="w-4 h-4" />
            World Cup 2026 · Sport Track
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Your AI Soccer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-grass-bright to-grass">
              Technique Coach
            </span>
          </h1>

          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-10">
            Record a 15-second clip. Get instant biomechanics analysis, personalized drills,
            and XP — like having a UEFA coach in your pocket.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group flex items-center gap-2 bg-grass hover:bg-grass-bright text-stadium font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-grass/25"
            >
              Analyze My Clip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onDemo}
              className="glass hover:bg-white/8 text-stone-300 font-medium px-8 py-4 rounded-2xl transition-all"
            >
              Try Demo Analysis
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              icon: Target,
              title: 'Structured Scoring',
              desc: '5 technique categories scored 0–100 with specific feedback on each.',
            },
            {
              icon: Zap,
              title: 'Instant Drills',
              desc: 'AI-generated 7-day micro-drill plan tailored to your weaknesses.',
            },
            {
              icon: Sparkles,
              title: 'Level Up',
              desc: 'Earn XP, unlock badges, and track progress across every session.',
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-grass/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-grass/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-grass" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-stone-500 text-sm uppercase tracking-widest mb-4">How it works</p>
          <div className="grid md:grid-cols-4 gap-6">
            {['Upload clip', 'Pick skill', 'AI analyzes', 'Train smarter'].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-grass/20 text-grass font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </div>
                <span className="text-sm text-stone-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
